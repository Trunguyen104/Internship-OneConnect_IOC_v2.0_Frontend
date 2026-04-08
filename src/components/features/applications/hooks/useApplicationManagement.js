'use client';

import { useQuery } from '@tanstack/react-query';
import { App } from 'antd';
import { useMemo, useState } from 'react';

import { applicationPhaseService } from '@/components/features/applications/services/application-phase.service';
import {
  ACTIVE_STATUSES,
  APPLICATION_STATUS,
  TERMINAL_STATUSES,
} from '@/constants/applications/application.constants';
import { APPLICATIONS_UI } from '@/constants/applications/uiText';

import { useApplicationActions } from './useApplicationActions';
import { useApplications } from './useApplications';

/**
 * Hook quản lý trạng thái và logic cho tính năng Quản lý hồ sơ ứng tuyển (Application Management).
 * @param {string} internshipPhaseId - ID của giai đoạn thực tập để lọc hồ sơ.
 * @returns {Object} Các trạng thái và hàm xử lý cho component UI.
 */
export const useApplicationManagement = (internshipPhaseId) => {
  const { modal: modalApi } = App.useApp();
  const [activeTab, setActiveTab] = useState('1'); // 1 = Tự ứng tuyển, 2 = Nhà trường phân bổ
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: undefined,
    schoolId: undefined,
    internshipPhaseId: internshipPhaseId || undefined,
    audience: undefined,
    period: undefined,
    includeTerminal: false,
    page: 1,
    size: 10,
  });

  /**
   * Bộ lọc hiệu dụng kết hợp giữa state local và props từ parent.
   */
  const effectiveFilters = useMemo(() => {
    return {
      ...filters,
      internshipPhaseId: internshipPhaseId || filters.internshipPhaseId,
    };
  }, [filters, internshipPhaseId]);

  /**
   * Bộ lọc thực tế để gửi lên API (loại bỏ trường không cần thiết theo tab).
   */
  const requestFilters = useMemo(() => {
    if (activeTab !== '1') {
      return { ...effectiveFilters, audience: undefined };
    }
    return effectiveFilters;
  }, [activeTab, effectiveFilters]);

  /** Lấy danh sách các giai đoạn thực tập */
  const { data: phasesRes, isLoading: isLoadingPhases } = useQuery({
    queryKey: ['internship-phases', 'applications'],
    queryFn: () => applicationPhaseService.getPhases(),
    staleTime: 1000 * 60 * 5,
  });

  /** Fetch dữ liệu danh sách ứng tuyển */
  const {
    applications: rawApplications,
    totalCount: rawTotalCount,
    isLoading,
  } = useApplications(activeTab === '1' ? 'self-apply' : 'uni-assign', requestFilters);

  /** Chuyển đổi dữ liệu giai đoạn thực tập để hiển thị trong select */
  const phases = useMemo(() => {
    const byId = new Map();

    const apiItems = phasesRes?.data?.items || phasesRes?.data || [];
    if (Array.isArray(apiItems)) {
      apiItems.forEach((p) => {
        const id = p.phaseId || p.id;
        if (!id) return;
        byId.set(String(id), {
          id,
          name: p.name || p.phaseName,
          startDate: p.startDate,
          endDate: p.endDate,
        });
      });
    }

    rawApplications.forEach((app) => {
      const id = app.internshipPhaseId || app.phaseId;
      if (!id) return;
      if (byId.has(String(id))) return;
      byId.set(String(id), {
        id,
        name: app.internPhaseName || app.internshipPhaseName || app.phaseName || 'Internship Phase',
        startDate: app.internPhaseStartDate || app.startDate,
        endDate: app.internPhaseEndDate || app.endDate,
      });
    });

    return Array.from(byId.values());
  }, [phasesRes, rawApplications]);

  /** Logic lọc hồ sơ theo trạng thái (Kết thúc hoặc Đang xử lý) */
  const { applications, totalCount } = useMemo(() => {
    const list = rawApplications.filter((app) => {
      if (filters.includeTerminal) {
        return TERMINAL_STATUSES.includes(app.status);
      }
      return ACTIVE_STATUSES.includes(app.status);
    });

    return {
      applications: list,
      totalCount: filters.includeTerminal ? list.length : rawTotalCount,
    };
  }, [rawApplications, rawTotalCount, filters.includeTerminal]);

  /** Danh sách các trường học từ dữ liệu hồ sơ */
  const schools = useMemo(() => {
    const unique = new Map();
    applications.forEach((app) => {
      const name = app.universityName || app.schoolName;
      const id = app.universityId || app.schoolId || name;
      if (name && !unique.has(id)) {
        unique.set(id, { id, name });
      }
    });
    return Array.from(unique.values());
  }, [applications]);

  const [targetId, setTargetId] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectType, setRejectType] = useState('standard');

  const actions = useApplicationActions(targetId);

  /** Xử lý khi thay đổi bộ lọc */
  const handleFilterChange = (newFilters) => {
    setFilters((prev) => {
      const shouldResetStatus =
        newFilters.includeTerminal !== undefined &&
        newFilters.includeTerminal !== prev.includeTerminal;

      const safeNewFilters = internshipPhaseId
        ? { ...newFilters, internshipPhaseId: prev.internshipPhaseId }
        : newFilters;

      return {
        ...prev,
        ...safeNewFilters,
        status: shouldResetStatus ? undefined : (safeNewFilters.status ?? prev.status),
        page: 1,
      };
    });
  };

  /** Xử lý khi chuyển trang */
  const handlePageChange = (page, size) => {
    setFilters((prev) => ({ ...prev, page, size }));
  };

  /**
   * Xử lý thực hiện các hành động trên từng hồ sơ (Phỏng vấn, Offer, Placed, Reject, Details).
   * @param {string} key - Loại hành động.
   * @param {Object} record - Dữ liệu hồ sơ.
   */
  const onAction = (key, record) => {
    const id = record.applicationId || record.id;
    const studentName = record.studentFullName || 'the student';
    setTargetId(id);

    const showConfirm = (title, content, onOk, confirmText = 'Confirm') => {
      modalApi.confirm({
        title: <span className="text-lg font-black tracking-tight text-slate-800">{title}</span>,
        content: <p className="mt-2 font-medium text-slate-500">{content}</p>,
        okText: confirmText,
        cancelText: APPLICATIONS_UI.MODAL.CANCEL || 'Cancel',
        centered: true,
        width: 440,
        className: 'premium-confirm-modal',
        okButtonProps: {
          className:
            'bg-slate-900 hover:bg-slate-800 border-none rounded-xl h-10 px-6 font-bold uppercase tracking-wider text-[11px]',
        },
        cancelButtonProps: {
          className:
            'rounded-xl h-10 px-6 font-bold uppercase tracking-wider text-[11px] border-slate-200 text-slate-500',
        },
        onOk,
      });
    };

    switch (key) {
      case 'interview':
        showConfirm(
          APPLICATIONS_UI.MESSAGES.CONFIRM.INTERVIEW.TITLE,
          APPLICATIONS_UI.MESSAGES.CONFIRM.INTERVIEW.CONTENT.replace(
            'this application',
            studentName
          ),
          () => actions.moveToInterviewing()
        );
        break;
      case 'offer':
        showConfirm(
          APPLICATIONS_UI.MESSAGES.CONFIRM.OFFER.TITLE,
          APPLICATIONS_UI.MESSAGES.CONFIRM.OFFER.CONTENT.replace('the student', studentName),
          () => actions.sendOffer(),
          APPLICATIONS_UI.MODAL.SEND_OFFER
        );
        break;
      case 'placed':
        showConfirm(
          APPLICATIONS_UI.MESSAGES.CONFIRM.PLACED.TITLE,
          APPLICATIONS_UI.MESSAGES.CONFIRM.PLACED.CONTENT.replace('this application', studentName),
          () => actions.markAsPlaced(),
          APPLICATIONS_UI.MODAL.MARK_PLACED
        );
        break;
      case 'approve': {
        const hasDuplicate = record.hasSelfApplyDuplicate;
        const approveContent = hasDuplicate
          ? `${studentName} has active self-apply applications at your company (Status: ${record.selfApplyStatus || 'Processing'}). If you approve this assignment, those applications will be automatically withdrawn. Are you sure you want to proceed?`
          : APPLICATIONS_UI.MESSAGES.CONFIRM.UNI_APPROVE.CONTENT.replace(
              'this university assignment',
              studentName
            );

        showConfirm(
          hasDuplicate
            ? APPLICATIONS_UI.MESSAGES.CONFIRM.APPROVE_DUPLICATE_TITLE
            : APPLICATIONS_UI.MESSAGES.CONFIRM.UNI_APPROVE.TITLE,
          approveContent,
          () => actions.approveUniAssign(),
          APPLICATIONS_UI.MODAL.APPROVE_ASSIGNMENT
        );
        break;
      }
      case 'reject':
        setRejectType('standard');
        setRejectModalOpen(true);
        break;
      case 'reject-uni':
        setRejectType('uni');
        setRejectModalOpen(true);
        break;
      case 'details':
        setDetailModalOpen(true);
        break;
      default:
        break;
    }
  };

  /** Xử lý xác nhận từ chối hồ sơ */
  const handleRejectConfirm = (data) => {
    const payload = { id: targetId, ...data };
    if (rejectType === 'uni') {
      actions.rejectUniAssign(payload);
    } else {
      actions.reject(payload);
    }
    setRejectModalOpen(false);
  };

  /** Thống kê số lượng hồ sơ theo từng trạng thái */
  const statusCounts = useMemo(() => {
    const counts = {
      [APPLICATION_STATUS.APPLIED]: 0,
      [APPLICATION_STATUS.INTERVIEWING]: 0,
      [APPLICATION_STATUS.OFFERED]: 0,
      [APPLICATION_STATUS.PLACED]: 0,
    };

    applications.forEach((app) => {
      if (counts[app.status] !== undefined) {
        counts[app.status]++;
      }
    });

    return counts;
  }, [applications]);

  return {
    activeTab,
    setActiveTab,
    filters,
    effectiveFilters,
    applications,
    totalCount,
    isLoading: isLoading || isLoadingPhases,
    phases,
    schools,
    statusCounts,
    detailModalOpen,
    setDetailModalOpen,
    rejectModalOpen,
    setRejectModalOpen,
    rejectType,
    targetId,
    actions,
    handleFilterChange,
    handlePageChange,
    onAction,
    handleRejectConfirm,
  };
};

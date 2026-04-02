'use client';

import { useQuery } from '@tanstack/react-query';
import { App } from 'antd';
import { CheckCircle2, Clock, LayoutList, UserCheck } from 'lucide-react';
import React, { useMemo, useState } from 'react';

import { EnterprisePhaseService } from '@/components/features/internship-student-management/services/enterprise-phase.service';
import { StatCard } from '@/components/ui/atoms';
import PageLayout from '@/components/ui/pagelayout';
import {
  ACTIVE_STATUSES,
  APPLICATION_STATUS,
  TERMINAL_STATUSES,
} from '@/constants/applications/application.constants';
import { APPLICATIONS_UI } from '@/constants/applications/uiText';

import { useApplicationActions } from '../hooks/useApplicationActions';
import { useApplications } from '../hooks/useApplications';
import ApplicationDetailModal from './ApplicationDetailModal';
import ApplicationFilters from './ApplicationFilters';
import RejectModal from './RejectModal';
import SelfApplyTable from './SelfApplyTable';
import UniAssignTable from './UniAssignTable';

/**
 * Main logical container for HR Application Management.
 */
export default function ApplicationManagement({ internshipPhaseId }) {
  const { modal: modalApi } = App.useApp();
  const [activeTab, setActiveTab] = useState('1'); // 1 = Self-apply, 2 = Uni-assign
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

  const effectiveFilters = useMemo(() => {
    return {
      ...filters,
      internshipPhaseId: internshipPhaseId || filters.internshipPhaseId,
    };
  }, [filters, internshipPhaseId]);

  const requestFilters = useMemo(() => {
    // Audience filter applies to Self-apply only.
    if (activeTab !== '1') {
      return { ...effectiveFilters, audience: undefined };
    }
    return effectiveFilters;
  }, [activeTab, effectiveFilters]);

  const { data: phasesRes, isLoading: isLoadingPhases } = useQuery({
    queryKey: ['internship-phases', 'me'],
    queryFn: () => EnterprisePhaseService.getMyPhases(),
    staleTime: 1000 * 60 * 5,
  });

  // Data fetching
  const {
    applications: rawApplications,
    totalCount: rawTotalCount,
    isLoading,
  } = useApplications(activeTab === '1' ? 'self-apply' : 'uni-assign', requestFilters);

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

    // Fallback/merge: build phase options from returned applications if phases API shape changes.
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

  // Exclusive View Logic based on user feedback
  // IncludeTerminal OFF: Show only Active/Initial statuses
  // IncludeTerminal ON: Show only Terminal/Final statuses
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

  // Mutations
  const [targetId, setTargetId] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectType, setRejectType] = useState('standard'); // 'standard' or 'uni'

  const actions = useApplicationActions(targetId);

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

  const handlePageChange = (page, size) => {
    setFilters((prev) => ({ ...prev, page, size }));
  };

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
          'Move to Interviewing?',
          `Are you sure you want to move ${studentName} to the Interviewing stage? This will notify them of the change.`,
          () => actions.moveToInterviewing()
        );
        break;
      case 'offer':
        showConfirm(
          'Send Offer?',
          `Ready to send an offer to ${studentName}? Ensure all internship details are correct first.`,
          () => actions.sendOffer(),
          'Send Offer'
        );
        break;
      case 'placed':
        showConfirm(
          'Mark as Placed?',
          `Congratulations! Effectively mark ${studentName} as successfully placed for their internship?`,
          () => actions.markAsPlaced(),
          'Confirm Placement'
        );
        break;
      case 'approve': {
        const hasDuplicate = record.hasSelfApplyDuplicate;
        const approveContent = hasDuplicate
          ? `${studentName} has active self-apply applications at your company (Status: ${record.selfApplyStatus || 'Processing'}). If you approve this assignment, those applications will be automatically withdrawn. Are you sure you want to proceed?`
          : `Approve the university assignment for ${studentName}? This will confirm their spot at your company.`;

        showConfirm(
          hasDuplicate ? 'Approve Duplicate Application?' : 'Approve Assignment?',
          approveContent,
          () => actions.approveUniAssign(),
          'Approve'
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

  const handleRejectConfirm = (data) => {
    if (rejectType === 'uni') {
      actions.rejectUniAssign(data);
    } else {
      actions.reject(data);
    }
    setRejectModalOpen(false);
  };

  // Status Summary Badges logic
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

  return (
    <PageLayout>
      <PageLayout.Header title={APPLICATIONS_UI.TITLE} subtitle={APPLICATIONS_UI.SUBTITLE} />

      <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
        <div className="flex gap-2">
          {[
            { key: '1', label: APPLICATIONS_UI.TABS.SELF_APPLY },
            { key: '2', label: APPLICATIONS_UI.TABS.UNI_ASSIGN },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center rounded-2xl border px-6 py-2.5 text-sm font-black tracking-widest uppercase shadow-sm transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 pb-4">
        <StatCard
          label="APPLIED"
          value={statusCounts[APPLICATION_STATUS.APPLIED]}
          icon={<LayoutList className="h-5 w-5" />}
          color="var(--color-info)"
          colorClass="text-info bg-info-surface"
        />
        <StatCard
          label="INTERVIEWING"
          value={statusCounts[APPLICATION_STATUS.INTERVIEWING]}
          icon={<Clock className="h-5 w-5" />}
          color="var(--color-warning)"
          colorClass="text-warning-text bg-warning-surface"
        />
        <StatCard
          label="OFFERED"
          value={statusCounts[APPLICATION_STATUS.OFFERED]}
          icon={<CheckCircle2 className="h-5 w-5" />}
          color="var(--color-primary)"
          colorClass="text-primary bg-primary-surface"
        />
        <StatCard
          label="PLACED"
          value={statusCounts[APPLICATION_STATUS.PLACED]}
          icon={<UserCheck className="h-5 w-5" />}
          color="var(--color-success)"
          colorClass="text-success bg-success-surface"
        />
      </div>

      <div className="flex flex-col gap-6">
        <ApplicationFilters
          filters={effectiveFilters}
          onFilterChange={handleFilterChange}
          schools={schools}
          phases={phases}
          isPhaseLocked={!!internshipPhaseId}
          isLoadingOptions={isLoading || isLoadingPhases}
          showAudience={activeTab === '1'}
        />

        <PageLayout.Card className="flex flex-col overflow-hidden p-0! shadow-sm border border-slate-100">
          <div className="px-8 py-5 border-b border-gray-100 bg-slate-50/50 flex justify-between items-center text-[11px] font-black text-slate-400 tracking-[0.2em] uppercase">
            <span>{APPLICATIONS_UI.CURRENT_LIST || 'Current Applications'}</span>
            <span className="text-[12px] font-bold text-slate-400 normal-case tracking-normal">
              {APPLICATIONS_UI.TOTAL_LABEL || 'Total'}:{' '}
              <span className="text-slate-900">
                {totalCount} {APPLICATIONS_UI.ITEMS_LABEL || 'items'}
              </span>
            </span>
          </div>
          <PageLayout.Content className="px-0">
            {activeTab === '1' ? (
              <SelfApplyTable
                data={applications}
                pagination={{
                  current: filters.page,
                  pageSize: filters.size,
                  total: totalCount,
                  onChange: handlePageChange,
                }}
                loading={isLoading}
                onAction={onAction}
              />
            ) : (
              <UniAssignTable
                data={applications}
                pagination={{
                  current: filters.page,
                  pageSize: filters.size,
                  total: totalCount,
                  onChange: handlePageChange,
                }}
                loading={isLoading}
                onAction={onAction}
              />
            )}
          </PageLayout.Content>
        </PageLayout.Card>
      </div>

      <RejectModal
        open={rejectModalOpen}
        onCancel={() => setRejectModalOpen(false)}
        onConfirm={handleRejectConfirm}
        loading={actions.isRejecting || actions.isRejectingUniAssign}
        title={
          rejectType === 'uni'
            ? APPLICATIONS_UI.MODAL_TITLE.REJECT_UNI
            : APPLICATIONS_UI.MODAL_TITLE.REJECT_STANDARD
        }
      />

      <ApplicationDetailModal
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        applicationId={targetId}
      />
    </PageLayout>
  );
}

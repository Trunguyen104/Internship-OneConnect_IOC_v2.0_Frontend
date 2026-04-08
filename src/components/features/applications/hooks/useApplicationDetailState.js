'use client';

import { App } from 'antd';
import React, { useState } from 'react';

import {
  ACTIVE_STATUSES,
  APPLICATION_SOURCE,
} from '@/constants/applications/application.constants';
import { APPLICATIONS_UI } from '@/constants/applications/uiText';

import { useApplicationActions } from './useApplicationActions';
import { useApplicationDetail } from './useApplications';

/**
 * Hook quản lý trạng thái và dữ liệu cho Modal Chi tiết hồ sơ ứng tuyển.
 * @param {string} applicationId - ID của hồ sơ.
 * @param {Function} onCancel - Hàm gọi khi đóng modal.
 * @returns {Object} Các trạng thái và hàm xử lý chi tiết hồ sơ.
 */
export const useApplicationDetailState = (applicationId, onCancel) => {
  const { modal: modalApi } = App.useApp();
  const { data: app, isLoading } = useApplicationDetail(applicationId);
  const actions = useApplicationActions(applicationId);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  /** Kiểm tra nguồn hồ sơ có phải từ trường học hay không */
  const isUniAssign = app?.source === APPLICATION_SOURCE.UNI_ASSIGN;

  /** Kiểm tra hồ sơ có phải tự ứng tuyển hay không */
  const isSelfApply = app?.source === APPLICATION_SOURCE.SELF_APPLY;

  /** Xác định xem có thể thực hiện hành động trên hồ sơ này hay không */
  const canAct = !isLoading && applicationId && ACTIVE_STATUSES.includes(app?.status);

  /** Lấy URL của CV */
  const cvUrl = app?.cvSnapshotUrl || app?.cvUrl;

  /** Thông tin giai đoạn thực tập */
  const phaseName = app?.internPhaseName || app?.internshipPhaseName || app?.phaseName;
  const phaseStart = app?.internPhaseStartDate || app?.internshipPhaseStartDate || app?.startDate;
  const phaseEnd = app?.internPhaseEndDate || app?.internshipPhaseEndDate || app?.endDate;

  /** Hiển thị đối tượng tiếp cận (Public hoặc Targeted) */
  const audienceDisplay = (() => {
    if (app?.audienceLabel) return app.audienceLabel;
    if (app?.audience === null || app?.audience === undefined) return 'Public';
    if (Array.isArray(app?.audience) && app.audience.length)
      return `Targeted — ${app.audience.join(', ')}`;
    if (typeof app?.audience === 'string') return app.audience;
    return APPLICATIONS_UI.COMMON.EMPTY;
  })();

  /** Lịch sử chuyển đổi trạng thái của hồ sơ */
  const statusHistories = (Array.isArray(app?.statusHistories) ? app.statusHistories : [])
    .slice()
    .sort((a, b) => {
      const aTime = new Date(a.changedAt || a.createdAt || a.at || 0).getTime();
      const bTime = new Date(b.changedAt || b.createdAt || b.at || 0).getTime();
      return aTime - bTime;
    });

  /**
   * Hiển thị hộp thoại xác nhận hành động.
   * @param {string} title - Tiêu đề.
   * @param {string} content - Nội dung.
   * @param {Function} onOk - Hàm xử lý khi nhấn Xác nhận.
   * @param {string} okText - Chữ trên nút Xác nhận.
   */
  const showConfirm = (
    title,
    content,
    onOk,
    okText = APPLICATIONS_UI.MODAL.MOVE_TO_INTERVIEWING
  ) => {
    modalApi.confirm({
      title: <span className="text-lg font-black tracking-tight text-slate-800">{title}</span>,
      content: <p className="mt-2 font-medium text-slate-500">{content}</p>,
      okText,
      cancelText: APPLICATIONS_UI.MESSAGES.REJECT_CANCEL,
      centered: true,
      width: 460,
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

  /** Xử lý xác nhận từ chối */
  const onRejectConfirm = (data) => {
    const payload = { id: applicationId, ...data };
    if (isUniAssign) actions.rejectUniAssign(payload);
    else actions.reject(payload);
    setRejectModalOpen(false);
  };

  /** Mở modal từ chối */
  const onRejectClick = () => setRejectModalOpen(true);

  /** Đóng modal chi tiết */
  const handleClose = () => {
    onCancel();
  };

  return {
    app,
    isLoading,
    actions,
    rejectModalOpen,
    setRejectModalOpen,
    isUniAssign,
    isSelfApply,
    canAct,
    cvUrl,
    phaseName,
    phaseStart,
    phaseEnd,
    audienceDisplay,
    statusHistories,
    showConfirm,
    onRejectConfirm,
    onRejectClick,
    handleClose,
  };
};

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { APPLICATIONS_UI } from '@/constants/applications/uiText';
import { useToast } from '@/providers/ToastProvider';

import { ApplicationService } from '../services/application.service';

/**
 * Hook quản lý các hành động chuyển đổi trạng thái hồ sơ (Hành động của HR).
 * Sử dụng mô hình mutation để xử lý đồng nhất trạng thái loading, thành công và lỗi.
 * @param {string} id - ID của hồ sơ ứng tuyển.
 */
export const useApplicationActions = (id) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  /** Làm mới dữ liệu danh sách và chi tiết sau khi thực hiện hành động */
  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['applications'] });
    if (id) queryClient.invalidateQueries({ queryKey: ['applications', 'detail', id] });
  };

  /** Xử lý hiển thị lỗi, bao gồm cả lỗi validation từ Backend */
  const handleError = (error) => {
    const valErrors = error?.data?.validationErrors;
    if (valErrors) {
      const messages = Object.values(valErrors).flat();
      if (messages.length > 0) {
        messages.forEach((msg) => toast.error(msg));
        return;
      }
    }
    toast.error(error?.message || 'Action failed. Please try again.');
  };

  /** Xử lý khi hành động thành công */
  const handleSuccess = (message) => {
    toast.success(message);
    invalidateQueries();
  };

  // ── Self-apply flow mutations (Luồng tự ứng tuyển) ────────────────────────

  /** Chuyển trạng thái sang Phỏng vấn */
  const interviewingMutation = useMutation({
    mutationFn: () => ApplicationService.moveToInterviewing(id),
    onSuccess: () => handleSuccess(APPLICATIONS_UI.MESSAGES.SUCCESS.INTERVIEWING),
    onError: handleError,
  });

  /** Gửi Offer cho sinh viên */
  const offeredMutation = useMutation({
    mutationFn: () => ApplicationService.sendOffer(id),
    onSuccess: () => handleSuccess(APPLICATIONS_UI.MESSAGES.SUCCESS.OFFER),
    onError: handleError,
  });

  /** Đánh giá đã nhận việc (Placed) */
  const placedMutation = useMutation({
    mutationFn: () => ApplicationService.markAsPlaced(id),
    onSuccess: () => handleSuccess(APPLICATIONS_UI.MESSAGES.SUCCESS.PLACED),
    onError: handleError,
  });

  /** Từ chối hồ sơ ứng tuyển */
  const rejectMutation = useMutation({
    mutationFn: ({ id: varId, ...payload }) => ApplicationService.reject(varId || id, payload),
    onSuccess: () => handleSuccess(APPLICATIONS_UI.MESSAGES.SUCCESS.REJECTED),
    onError: handleError,
  });

  // ── Uni-assign flow mutations (Luồng nhà trường phân bổ) ────────────────────────

  /** Duyệt yêu cầu phân bổ từ trường */
  const approveUniAssignMutation = useMutation({
    mutationFn: () => ApplicationService.approveUniAssign(id),
    onSuccess: () => handleSuccess(APPLICATIONS_UI.MESSAGES.SUCCESS.UNI_APPROVE),
    onError: handleError,
  });

  /** Từ chối yêu cầu phân bổ từ trường */
  const rejectUniAssignMutation = useMutation({
    mutationFn: ({ id: varId, ...payload }) =>
      ApplicationService.rejectUniAssign(varId || id, payload),
    onSuccess: () => handleSuccess(APPLICATIONS_UI.MESSAGES.SUCCESS.UNI_REJECT),
    onError: handleError,
  });

  return {
    moveToInterviewing: interviewingMutation.mutate,
    isInterviewing: interviewingMutation.isPending,

    sendOffer: offeredMutation.mutate,
    isSendingOffer: offeredMutation.isPending,

    markAsPlaced: placedMutation.mutate,
    isMarkingAsPlaced: placedMutation.isPending,

    reject: rejectMutation.mutate,
    isRejecting: rejectMutation.isPending,

    approveUniAssign: approveUniAssignMutation.mutate,
    isApprovingUniAssign: approveUniAssignMutation.isPending,

    rejectUniAssign: rejectUniAssignMutation.mutate,
    isRejectingUniAssign: rejectUniAssignMutation.isPending,
  };
};

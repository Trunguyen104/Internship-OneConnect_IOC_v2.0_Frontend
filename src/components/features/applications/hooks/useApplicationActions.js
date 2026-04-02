'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useToast } from '@/providers/ToastProvider';

import { ApplicationService } from '../services/application.service';

/**
 * Hook for managing application state transitions (HR actions).
 * Follows the mutation pattern to handle loading, success, and error states uniformly.
 */
export const useApplicationActions = (id) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['applications'] });
  };

  const handleError = (error) => {
    toast.error(error?.message || 'Action failed. Please try again.');
  };

  const handleSuccess = (message) => {
    toast.success(message);
    invalidateQueries();
  };

  // ── Self-apply flow mutations ────────────────────────

  const interviewingMutation = useMutation({
    mutationFn: () => ApplicationService.moveToInterviewing(id),
    onSuccess: () => handleSuccess('Application moved to Interviewing.'),
    onError: handleError,
  });

  const offeredMutation = useMutation({
    mutationFn: () => ApplicationService.sendOffer(id),
    onSuccess: () => handleSuccess('Offer successfully sent.'),
    onError: handleError,
  });

  const placedMutation = useMutation({
    mutationFn: () => ApplicationService.markAsPlaced(id),
    onSuccess: () => handleSuccess('Application marked as Placed!'),
    onError: handleError,
  });

  const rejectMutation = useMutation({
    mutationFn: (data) => ApplicationService.reject(id, data),
    onSuccess: () => handleSuccess('Application rejected.'),
    onError: handleError,
  });

  // ── Uni-assign flow mutations ────────────────────────

  const approveUniAssignMutation = useMutation({
    mutationFn: () => ApplicationService.approveUniAssign(id),
    onSuccess: () => handleSuccess('University assignment approved.'),
    onError: handleError,
  });

  const rejectUniAssignMutation = useMutation({
    mutationFn: (data) => ApplicationService.rejectUniAssign(id, data),
    onSuccess: () => handleSuccess('University assignment rejected.'),
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

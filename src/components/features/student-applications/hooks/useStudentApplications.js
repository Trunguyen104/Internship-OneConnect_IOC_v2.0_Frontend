'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useToast } from '@/providers/ToastProvider';

import { studentApplicationService } from '../services/student-application.service';

export const useMyApplications = (params = {}) => {
  return useQuery({
    queryKey: ['student-applications', 'list', params],
    queryFn: () => studentApplicationService.getMyApplications(params),
  });
};

export const useStudentApplicationDetail = (id) => {
  const query = useQuery({
    queryKey: ['student-applications', 'detail', id],
    queryFn: () => studentApplicationService.getById(id),
    enabled: !!id,
  });

  return {
    ...query,
    data: query.data?.data || null,
  };
};

export const useStudentApplicationActions = (id) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['student-applications'] });
  };

  const withdrawMutation = useMutation({
    mutationFn: () => studentApplicationService.withdraw(id),
    onSuccess: () => {
      toast.success(STUDENT_APPLICATIONS_UI.MESSAGES.WITHDRAW_SUCCESS);
      invalidate();
    },
    onError: () => toast.error(STUDENT_APPLICATIONS_UI.MESSAGES.WITHDRAW_ERROR),
  });

  const hideMutation = useMutation({
    mutationFn: () => studentApplicationService.hide(id),
    onSuccess: () => {
      toast.success(STUDENT_APPLICATIONS_UI.MESSAGES.HIDE_SUCCESS);
      invalidate();
    },
    onError: () => toast.error(STUDENT_APPLICATIONS_UI.MESSAGES.HIDE_ERROR),
  });

  return {
    withdraw: withdrawMutation.mutate,
    isWithdrawing: withdrawMutation.isPending,
    hide: hideMutation.mutate,
    isHiding: hideMutation.isPending,
  };
};

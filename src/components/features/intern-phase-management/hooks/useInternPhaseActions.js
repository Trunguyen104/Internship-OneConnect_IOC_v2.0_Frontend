'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';
import dayjs from 'dayjs';

import { INTERN_PHASE_MANAGEMENT } from '@/constants/intern-phase-management/intern-phase';
import { useToast } from '@/providers/ToastProvider';

import { InternPhaseService } from '../services/intern-phase.service';
import { usePhaseEnterprise } from './usePhaseEnterprise';

export const useInternPhaseActions = ({ editingRecord, setModalVisible, onSuccess }) => {
  const toast = useToast();
  const { modal } = App.useApp();
  const queryClient = useQueryClient();
  const { MESSAGES, FORM } = INTERN_PHASE_MANAGEMENT;
  const { enterpriseId } = usePhaseEnterprise();

  const onSuccessAction = () => {
    queryClient.invalidateQueries({ queryKey: ['intern-phases'] });
    queryClient.invalidateQueries({ queryKey: ['intern-phase-detail'] });
    onSuccess?.();
  };

  const validateDates = (startDate, endDate) => {
    if (!startDate || !endDate) return null;

    const start = dayjs(startDate);
    const end = dayjs(endDate);

    if (end.isBefore(start) || end.isSame(start)) {
      return FORM.VALIDATION.END_AFTER_START;
    }

    const diffDays = end.diff(start, 'day');
    if (diffDays < 28) {
      return FORM.VALIDATION.MIN_DURATION;
    }
    if (diffDays > 365) {
      return FORM.VALIDATION.MAX_DURATION;
    }

    return null;
  };

  const saveMutation = useMutation({
    mutationFn: async (values) => {
      const dateError = validateDates(values.startDate, values.endDate);
      if (dateError) {
        throw new Error(dateError);
      }

      if (!enterpriseId && !editingRecord) {
        throw new Error(MESSAGES.ERROR_ENTERPRISE_ID);
      }

      const payload = {
        enterpriseId,
        name: values.name,
        description: values.description,
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: values.endDate.format('YYYY-MM-DD'),
        majorFields: Array.isArray(values.majorFields)
          ? values.majorFields.join(',')
          : values.majorFields,
        capacity: Number(values.capacity),
      };

      if (editingRecord) {
        const phaseId = editingRecord.id || editingRecord.internPhaseId;

        return InternPhaseService.update(phaseId, payload);
      }
      return InternPhaseService.create(payload);
    },
    onSuccess: () => {
      toast.success(editingRecord ? MESSAGES.UPDATE_SUCCESS : MESSAGES.CREATE_SUCCESS);
      setModalVisible?.(false);
      onSuccessAction();
    },
    onError: (err) => {
      toast.error(err.data?.message || err.message || 'An error occurred');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => InternPhaseService.delete(id),
    onSuccess: () => {
      toast.success(MESSAGES.DELETE_SUCCESS);
      onSuccessAction();
    },
    onError: (err) => {
      toast.error(err.data?.message || err.message || MESSAGES.ERROR_DELETE);
    },
  });

  const handleDelete = (record) => {
    const id = record.id || record.internPhaseId;
    const postingCount = record.jobPostingCount || record.jobPostings?.length || 0;
    const placedCount = record.placedCount || 0;
    const groupCount = record.groupCount || 0;

    // Case 3: Block if Students Placed
    if (placedCount > 0) {
      modal.error({
        title: MESSAGES.ERROR_DELETE_TITLE,
        content: MESSAGES.DELETE_BLOCK_PLACED.replace('{count}', placedCount),
      });
      return;
    }

    // Case 2: Block if Job Postings exist
    if (postingCount > 0) {
      modal.error({
        title: MESSAGES.ERROR_DELETE_TITLE,
        content: MESSAGES.DELETE_BLOCK_POSTINGS.replace('{count}', postingCount),
      });
      return;
    }

    // Case 1: Warning if Groups exist
    let content = MESSAGES.DELETE_CONFIRM;
    if (groupCount > 0) {
      content = (
        <div>
          <p>{content}</p>
          <p className="text-orange-500 font-medium whitespace-pre-wrap">
            {MESSAGES.DELETE_WARNING_GROUPS.replace('{count}', groupCount)}
          </p>
        </div>
      );
    }

    modal.confirm({
      title: MESSAGES.DELETE_TITLE,
      content,
      okText: MESSAGES.DELETE_OK,
      okType: 'danger',
      onOk: () => deleteMutation.mutateAsync(id),
    });
  };

  return {
    saveMutation,
    deleteMutation,
    handleDelete,
    isSubmitting: saveMutation.isPending || deleteMutation.isPending,
  };
};

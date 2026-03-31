'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';
import dayjs from 'dayjs';

import { INTERN_PHASE_MANAGEMENT } from '@/constants/intern-phase-management/intern-phase';
import { useToast } from '@/providers/ToastProvider';

import { InternPhaseService } from '../services/intern-phase.service';

export const useInternPhaseActions = ({ editingRecord, setModalVisible, onSuccess }) => {
  const toast = useToast();
  const { modal } = App.useApp();
  const queryClient = useQueryClient();
  const { MESSAGES, FORM } = INTERN_PHASE_MANAGEMENT;

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

      const payload = {
        name: values.name,
        description: values.description,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
        majorFields: Array.isArray(values.majorFields)
          ? values.majorFields.join(',')
          : values.majorFields,
        capacity: Number(values.capacity),
      };

      if (editingRecord) {
        const phaseId = editingRecord.id || editingRecord.internPhaseId;

        // AC-03: Validate Job Posting Deadlines if endDate changed
        const originalEnd = dayjs(editingRecord.endDate).startOf('day');
        const newEnd = dayjs(values.endDate).startOf('day');

        if (!newEnd.isSame(originalEnd)) {
          const postingsRes = await InternPhaseService.getJobPostings(phaseId);
          const postings = postingsRes?.data || postingsRes || [];

          const violatingPostings = postings.filter((p) => {
            if (!p.deadline) return false;
            return dayjs(p.deadline).startOf('day').isAfter(newEnd);
          });

          if (violatingPostings.length > 0) {
            const errorMsg = MESSAGES.DEADLINE_VIOLATION.replace(
              '{count}',
              violatingPostings.length
            );
            throw new Error(errorMsg);
          }

          // AC-03: Simulate updates and notifications
          console.log(
            `[AC-03] Auto-updating internship dates for ${postings.length} job postings...`
          );

          const studentsRes = await InternPhaseService.getStudents(phaseId);
          const students = studentsRes?.data || studentsRes || [];
          const activeStudents = students.filter((s) =>
            ['Applied', 'Interviewing', 'Offered'].includes(s.status)
          );

          if (activeStudents.length > 0) {
            console.log(
              `[AC-03] Notifying ${activeStudents.length} students about date updates...`
            );
            console.log(
              `[AC-03] Log: "Job posting tại Enterprise vừa cập nhật thời gian thực tập: ${values.startDate.format('DD/MM/YYYY')} -> ${values.endDate.format('DD/MM/YYYY')}..."`
            );
          }
        }

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
      toast.success('Đã xóa Intern Phase.');
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
        title: 'Không thể xóa',
        content: MESSAGES.DELETE_BLOCK_PLACED.replace('{count}', placedCount),
      });
      return;
    }

    // Case 2: Block if Job Postings exist
    if (postingCount > 0) {
      modal.error({
        title: 'Không thể xóa',
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
      title: 'Xóa Intern Phase',
      content,
      okText: 'Xóa',
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

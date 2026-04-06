'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useToast } from '@/providers/ToastProvider';
import { universityService } from '@/services/university.service';

import { JOB_POSTING_UI } from '../constants/job-postings.constant';
import { JobPostingsService } from '../services/job-postings.service';

/**
 * Hook to manage fetching and filtering job postings.
 */
export const useJobPostings = (filters = {}) => {
  const queryKey = useMemo(() => ['job-postings', filters], [filters]);

  const query = useQuery({
    queryKey,
    queryFn: () => JobPostingsService.getList(filters),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    ...query,
    jobPostings: query.data?.data?.items || [],
    totalCount: query.data?.data?.totalCount || 0,
    totalPages: query.data?.data?.totalPages || 0,
  };
};

/**
 * Hook to fetch deep details of a single job posting.
 */
export const useJobPostingDetail = (id) => {
  const query = useQuery({
    queryKey: ['job-postings', 'detail', id],
    queryFn: () => JobPostingsService.getById(id),
    enabled: !!id,
  });

  return {
    ...query,
    jobDetail: query.data?.data || null,
  };
};

/**
 * Hook for fetching available internship phases.
 */
export const useInternshipPhases = () => {
  const query = useQuery({
    queryKey: ['internship-phases', 'my-phases'],
    queryFn: () => JobPostingsService.getMyPhases({ IncludeEnded: true }),
  });

  const phases = useMemo(() => {
    return query.data?.data?.items || [];
  }, [query.data]);

  return {
    ...query,
    phases: phases,
  };
};

/**
 * Hook to fetch all universities for school selection.
 */
export const useUniversities = () => {
  const query = useQuery({
    queryKey: ['universities', 'all'],
    queryFn: () => universityService.getAll({ PageNumber: 1, PageSize: 1000 }),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  return {
    ...query,
    universities: query.data?.data?.items || [],
  };
};

/**
 * Hook for job posting mutations (Create, Update, Delete, Publish, Close).
 */
export const useJobPostingActions = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const handleSuccess = (msg) => {
    queryClient.invalidateQueries({ queryKey: ['job-postings'] });
    toast.success('Success', msg);
  };

  const handleError = (err) => {
    const data = err?.data || err?.response?.data || {};

    // 1. Skip standard toast for 409 Conflict (handled manually for Close warnings)
    if (data.status === 409 || err?.status === 409) return;

    // 2. Check for ValidationErrors dictionary (ASP.NET Core default)
    if (data.validationErrors) {
      const messages = Object.values(data.validationErrors).flat();
      if (messages.length > 0) return toast.error('Validation Error', messages[0]);
    }

    // 3. Check for specific backend error structure (Result<T>)
    if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
      return toast.error('Error', data.errors[0]);
    }

    // 4. Check for top-level message (common for 500 errors)
    if (data.message) {
      return toast.error('Server Error', data.message);
    }

    // 5. Fallback to generic message or error object message
    toast.error('Error', err?.message || JOB_POSTING_UI.FORM.MESSAGES.GENERAL_ERROR);
  };

  const publishDraftMutation = useMutation({
    mutationFn: (id) => JobPostingsService.publish(id),
    onSuccess: () => handleSuccess(JOB_POSTING_UI.FORM.MESSAGES.PUBLISH_SUCCESS),
    onError: handleError,
  });

  const closeJobMutation = useMutation({
    mutationFn: ({ id, data }) => JobPostingsService.close(id, data),
    onSuccess: () => handleSuccess(JOB_POSTING_UI.FORM.MESSAGES.CLOSE_SUCCESS),
    onError: handleError,
  });

  const deleteJobMutation = useMutation({
    mutationFn: ({ id, data }) => JobPostingsService.delete(id, data),
    onSuccess: () => handleSuccess(JOB_POSTING_UI.FORM.MESSAGES.DELETE_SUCCESS),
    onError: handleError,
  });

  const createMutation = useMutation({
    mutationFn: (data) => JobPostingsService.create(data),
    onSuccess: () => handleSuccess(JOB_POSTING_UI.FORM.MESSAGES.CREATE_SUCCESS),
    onError: handleError,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => JobPostingsService.update(id, data),
    onSuccess: () => handleSuccess(JOB_POSTING_UI.FORM.MESSAGES.UPDATE_SUCCESS),
    onError: handleError,
  });

  const draftMutation = useMutation({
    mutationFn: (data) => JobPostingsService.saveDraft(data),
    onSuccess: () => handleSuccess(JOB_POSTING_UI.FORM.MESSAGES.SAVE_DRAFT_SUCCESS),
    onError: handleError,
  });

  const getJobDetailMutation = useMutation({
    mutationFn: (id) => JobPostingsService.getById(id),
    onError: handleError,
  });

  return {
    publishDraft: publishDraftMutation,
    closeJob: closeJobMutation,
    deleteJob: deleteJobMutation,
    createJob: createMutation,
    updateJob: updateMutation,
    saveDraft: draftMutation,
    getJobDetail: getJobDetailMutation,
    isMutating:
      publishDraftMutation.isPending ||
      closeJobMutation.isPending ||
      deleteJobMutation.isPending ||
      createMutation.isPending ||
      updateMutation.isPending ||
      draftMutation.isPending,
  };
};

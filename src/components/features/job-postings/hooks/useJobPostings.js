'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';
import { useMemo } from 'react';

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
    queryFn: () => JobPostingsService.getMyPhases(),
  });

  return {
    ...query,
    phases: query.data?.data?.items || [],
  };
};

/**
 * Hook for job posting mutations (Create, Update, Delete, Publish, Close).
 */
export const useJobPostingActions = () => {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  const handleSuccess = (msg) => {
    queryClient.invalidateQueries({ queryKey: ['job-postings'] });
    message.success(msg);
  };

  const handleError = (err) => {
    message.error(err?.message || 'Something went wrong.');
  };

  const publishDraftMutation = useMutation({
    mutationFn: (id) => JobPostingsService.publish(id),
    onSuccess: () => handleSuccess(JOB_POSTING_UI.FORM.MESSAGES.PUBLISH_SUCCESS),
    onError: handleError,
  });

  const closeJobMutation = useMutation({
    mutationFn: (id) => JobPostingsService.close(id),
    onSuccess: () => handleSuccess('Job posting closed successfully.'),
    onError: handleError,
  });

  const deleteJobMutation = useMutation({
    mutationFn: (id) => JobPostingsService.delete(id),
    onSuccess: () => handleSuccess('Job posting deleted successfully.'),
    onError: handleError,
  });

  const createMutation = useMutation({
    mutationFn: (data) => JobPostingsService.create(data),
    onSuccess: () => handleSuccess(JOB_POSTING_UI.FORM.MESSAGES.PUBLISH_SUCCESS),
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

  return {
    publishDraft: publishDraftMutation,
    closeJob: closeJobMutation,
    deleteJob: deleteJobMutation,
    createJob: createMutation,
    updateJob: updateMutation,
    saveDraft: draftMutation,
    isMutating:
      publishDraftMutation.isPending ||
      closeJobMutation.isPending ||
      deleteJobMutation.isPending ||
      createMutation.isPending ||
      updateMutation.isPending ||
      draftMutation.isPending,
  };
};

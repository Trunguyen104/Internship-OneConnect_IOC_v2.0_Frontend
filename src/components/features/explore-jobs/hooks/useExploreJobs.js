'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { studentApplicationService } from '@/components/features/student-applications/services/student-application.service';
import { useProfile } from '@/components/features/user/hooks/useProfile';
import { useToast } from '@/providers/ToastProvider';

import { EXPLORE_JOBS_UI } from '../constants/explore-jobs.constant';
import { ExploreJobsService } from '../services/explore-jobs.service';

/**
 * Maps API job object to Frontend job object
 */
const mapJob = (job) => {
  if (!job) return null;
  const isDefaultDate = (dateStr) => !dateStr || dateStr.startsWith('0001');

  return {
    ...job,
    enterprise: {
      fullName:
        job.companyName ||
        job.enterpriseName ||
        job.enterprise?.fullName ||
        job.enterprise?.name ||
        EXPLORE_JOBS_UI.CARD.ENTERPRISE_FALLBACK,
      logoUrl: job.companyLogoUrl || job.enterpriseLogoUrl || job.enterprise?.logoUrl,
    },
    // Map singular benefit from API to plural expected by UI
    benefits: job.benefit || job.benefits,
    // Audience mapping
    audienceType: job.audience === 1 ? 'Public' : job.audience === 2 ? 'Targeted' : 'Public',
    // Standardize dates and handle default '0001-01-01'
    deadline: job.expireDate
      ? new Date(job.expireDate).toLocaleDateString('en-GB')
      : EXPLORE_JOBS_UI.CARD.NOT_AVAILABLE,
    startDate: isDefaultDate(job.startDate)
      ? EXPLORE_JOBS_UI.CARD.DATE_TBD
      : new Date(job.startDate).toLocaleDateString('en-GB'),
    endDate: isDefaultDate(job.endDate)
      ? EXPLORE_JOBS_UI.CARD.DATE_TBD
      : new Date(job.endDate).toLocaleDateString('en-GB'),
    // Status mapping (AC-01)
    statusLabel:
      job.status === 2
        ? EXPLORE_JOBS_UI.CARD.STATUS_CLOSING_SOON
        : EXPLORE_JOBS_UI.CARD.STATUS_OPEN,
  };
};

export function useExploreJobs() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { userInfo, cvUrl, loadingUser } = useProfile();
  const [errorIsPlaced, setErrorIsPlaced] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [searchTerm, setSearchTerm] = useState('');

  // 0. Fetch student's own applications for eligibility context (AC-03)
  const myAppsQuery = useQuery({
    queryKey: ['my-applications-eligible'],
    queryFn: () => studentApplicationService.getMyApplications().then((res) => res?.data || res),
    enabled: !loadingUser && !!userInfo,
    staleTime: 10000,
  });

  const myAppsData = myAppsQuery.data || [];
  const myApps = Array.isArray(myAppsData)
    ? myAppsData
    : myAppsData?.items || myAppsData?.data || [];

  // 1. Fetch available jobs from real API
  const exploreQuery = useQuery({
    queryKey: ['explore-jobs', searchTerm, currentPage, pageSize],
    queryFn: async () => {
      try {
        const res = await ExploreJobsService.getAvailableJobs({
          search: searchTerm,
          page: currentPage,
          pageSize,
        });
        setErrorIsPlaced(false);
        return res?.data || res;
      } catch (err) {
        // Handle specialized backend errors (AC-01: Placed state)
        const errorCodes = err?.data?.errors || [];
        if (errorCodes.includes('JobPosting.InternshipInProgress')) {
          setErrorIsPlaced(true);
          // Return empty structure but the isPlaced will take precedence in UI
          return { items: [], totalCount: 0 };
        }
        setErrorIsPlaced(false);
        throw err;
      }
    },
    enabled: !loadingUser && !userInfo?.isPlaced,
    placeholderData: (prev) => prev,
    select: (res) => {
      const items = res?.items || res?.data || [];
      const total = res?.totalCount || res?.total || items.length;

      return {
        data: items.map(mapJob),
        total,
      };
    },
    retry: (failureCount, error) => {
      if (error?.data?.errors?.includes('JobPosting.InternshipInProgress')) return false;
      return failureCount < 2;
    },
    staleTime: 5000,
  });

  // 2. Fetch job detail from real API
  const useJobDetail = (id) =>
    useQuery({
      queryKey: ['job-detail', id],
      queryFn: async () => {
        const res = await ExploreJobsService.getJobById(id);
        return res?.data || res;
      },
      enabled: !!id,
      select: (data) => mapJob(data),
    });

  // 4. Apply mutation
  const applyMutation = useMutation({
    mutationFn: ({ jobId, data }) => ExploreJobsService.applyJob(jobId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-applications-eligible'] });
      toast.success(
        EXPLORE_JOBS_UI.APPLY_MODAL.SUCCESS_TITLE,
        EXPLORE_JOBS_UI.APPLY_MODAL.SUCCESS_CONTENT
      );
    },
    onError: (err) => {
      const errorMsg =
        err?.data?.message ||
        err?.message ||
        EXPLORE_JOBS_UI.APPLY_MODAL.ERROR_MESSAGES.SUBMIT_FAILED;
      toast.error(EXPLORE_JOBS_UI.APPLY_MODAL.ERROR_MESSAGES.TITLE, errorMsg);
    },
  });

  const isPlaced = userInfo?.isPlaced || errorIsPlaced;
  const hasCV = !!cvUrl;

  return {
    jobs: exploreQuery.data?.data || [],
    total: exploreQuery.data?.total || 0,
    isLoading: exploreQuery.isLoading || loadingUser,
    isPlaced,
    hasCV,
    cvUrl,
    page: currentPage,
    pageSize: pageSize,
    setPage: setCurrentPage,
    setPageSize,
    searchTerm,
    setSearchTerm,
    useJobDetail,
    applyJob: applyMutation.mutateAsync,
    isApplying: applyMutation.isPending,
    getEligibility: (id) => {
      if (isPlaced) return { eligible: false, reason: EXPLORE_JOBS_UI.ELIGIBILITY.PLACED };
      if (!hasCV) return { eligible: false, reason: EXPLORE_JOBS_UI.ELIGIBILITY.NO_CV };

      // 1. Specific check for THIS job (to show "APPLIED" label)
      const existingAppForThisJob = myApps.find((app) => app.jobSlotId === id || app.jobId === id);
      const isActuallyAppliedToThis =
        existingAppForThisJob && ![4, 5, 6].includes(existingAppForThisJob.status);

      if (isActuallyAppliedToThis) {
        return { eligible: false, reason: EXPLORE_JOBS_UI.ELIGIBILITY.ACTIVE_APP_EXISTS };
      }

      // 2. Global check: Has ANY active application? (AC-03 requirement)
      // If student has an active app anywhere, they cannot apply for another job.
      const hasAnyActiveApp = myApps.some((app) => ![4, 5, 6].includes(app.status));
      if (hasAnyActiveApp) {
        return { eligible: false, reason: EXPLORE_JOBS_UI.ELIGIBILITY.ACTIVE_APP_EXISTS };
      }

      return { eligible: true };
    },
  };
}

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { useProfile } from '@/components/features/user/hooks/useProfile';
import { useToast } from '@/providers/ToastProvider';

import { EXPLORE_JOBS_UI } from '../constants/explore-jobs.constant';
import { ExploreJobsService } from '../services/explore-jobs.service';

const MOCK_JOBS = [
  // ... (keeping MOCK_JOBS as internal reference or dev fallback)
];

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
        'Enterprise',
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
      ? 'TBD'
      : new Date(job.startDate).toLocaleDateString('en-GB'),
    endDate: isDefaultDate(job.endDate) ? 'TBD' : new Date(job.endDate).toLocaleDateString('en-GB'),
    // Status mapping (AC-01)
    statusLabel: job.status === 2 ? 'Closing Soon' : EXPLORE_JOBS_UI.CARD.STATUS_OPEN,
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

  // 3. Check Eligibility Query (AC-03 requirement)
  const useEligibility = (jobId) =>
    useQuery({
      queryKey: ['job-eligibility', jobId],
      queryFn: async () => {
        try {
          const res = await ExploreJobsService.checkEligibility(jobId);
          return res?.data || res;
        } catch (err) {
          return { eligible: true };
        }
      },
      enabled: !!jobId && !loadingUser && !userInfo?.isPlaced && !!cvUrl,
    });

  // 4. Apply mutation
  const applyMutation = useMutation({
    mutationFn: ({ jobId, data }) => ExploreJobsService.applyJob(jobId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-eligibility'] });
      toast.success(
        EXPLORE_JOBS_UI.APPLY_MODAL.SUCCESS_TITLE,
        EXPLORE_JOBS_UI.APPLY_MODAL.SUCCESS_CONTENT
      );
    },
    onError: (err) => {
      const errorMsg = err?.data?.message || err?.message || 'Application failed';
      toast.error('Error', errorMsg);
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
    pageSize,
    setPage: setCurrentPage,
    setPageSize,
    searchTerm,
    setSearchTerm,
    useJobDetail,
    useEligibility,
    applyJob: applyMutation.mutateAsync,
    isApplying: applyMutation.isPending,
    getEligibility: (id, serverEligibility = null) => {
      if (isPlaced) return { eligible: false, reason: EXPLORE_JOBS_UI.ELIGIBILITY.PLACED };
      if (!hasCV) return { eligible: false, reason: EXPLORE_JOBS_UI.ELIGIBILITY.NO_CV };

      if (serverEligibility) {
        if (serverEligibility.eligible === false || serverEligibility.success === false) {
          const errorList = serverEligibility.errors || [];
          const errorMsgStr = errorList.join(' ');

          const reasonKey =
            serverEligibility.errorCode || serverEligibility.reasonCode || 'GENERAL';
          const reasons = {
            'JobPosting.AlreadyHaveActiveApplication':
              EXPLORE_JOBS_UI.ELIGIBILITY.ACTIVE_APP_EXISTS,
            'JobPosting.ApplicationLimitReached': EXPLORE_JOBS_UI.ELIGIBILITY.REAPPLY_LIMIT,
            'JobPosting.ApplicationDeadlinePassed': EXPLORE_JOBS_UI.ELIGIBILITY.EXPIRED,
            'JobPosting.CannotApplyWhenPlaced': EXPLORE_JOBS_UI.ELIGIBILITY.PLACED,
            'JobPosting.UploadCVRequired': EXPLORE_JOBS_UI.ELIGIBILITY.NO_CV,
            'JobPosting.NoActiveInternshipPeriod': EXPLORE_JOBS_UI.ELIGIBILITY.NO_ACTIVE_PHASE,
            // Legacy/Mapping fallbacks
            ACTIVE_APP_EXISTS: EXPLORE_JOBS_UI.ELIGIBILITY.ACTIVE_APP_EXISTS,
            REAPPLY_LIMIT: EXPLORE_JOBS_UI.ELIGIBILITY.REAPPLY_LIMIT,
            EXPIRED: EXPLORE_JOBS_UI.ELIGIBILITY.EXPIRED,
          };

          // Priority 1: Direct key mapping
          if (reasons[reasonKey]) return { eligible: false, reason: reasons[reasonKey] };

          // Priority 2: String matching in errors array (per Swagger feedback)
          if (errorMsgStr.toLowerCase().includes('no active internship period')) {
            return { eligible: false, reason: EXPLORE_JOBS_UI.ELIGIBILITY.NO_ACTIVE_PHASE };
          }

          return {
            eligible: false,
            reason: serverEligibility.message || errorList[0] || 'Not eligible',
          };
        }
      }

      return { eligible: true };
    },
  };
}

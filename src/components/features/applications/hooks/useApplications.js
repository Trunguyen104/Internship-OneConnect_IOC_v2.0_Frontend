'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { ApplicationService } from '../services/application.service';

/**
 * Hook to manage fetching and filtering student applications.
 * No mock data allowed - fetches directly from the server via react-query.
 */
export const useApplications = (type = 'self-apply', filters = {}) => {
  const queryKey = useMemo(() => ['applications', type, filters], [type, filters]);

  const query = useQuery({
    queryKey,
    queryFn: () => {
      const fetcher =
        type === 'self-apply'
          ? ApplicationService.getSelfApplyList
          : ApplicationService.getUniAssignList;
      return fetcher(filters);
    },
    // Keep data fresh but also provide cache for transitions
    staleTime: 1000 * 60 * 5,
  });

  return {
    ...query,
    applications: query.data?.data?.items || [],
    totalCount: query.data?.data?.totalCount || 0,
  };
};

/**
 * Hook to fetch deep details of a single application.
 */
export const useApplicationDetail = (id) => {
  const query = useQuery({
    queryKey: ['applications', 'detail', id],
    queryFn: () => ApplicationService.getById(id),
    enabled: !!id,
  });

  return {
    ...query,
    data: query.data?.data || null,
  };
};

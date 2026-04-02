'use client';

import { useQuery } from '@tanstack/react-query';

import { userService } from '@/components/features/user/services/user.service';

/**
 * usePhaseEnterprise hook provides the current user's enterprise profile for the Intern Phase module.
 * Since we must stay within this folder, we define this "me" query locally to keep code clean.
 */
export const usePhaseEnterprise = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['intern-phase-me'],
    queryFn: async () => {
      const res = await userService.getMe();
      return res?.data || res;
    },
    // Keep profile fresh but avoid constant refetching
    staleTime: 5 * 60 * 1000,
  });

  const enterpriseId = data?.enterpriseId || data?.enterprise_id || data?.enterpriseID;

  return {
    user: data,
    enterpriseId,
    isLoading,
    isError,
    refetch,
  };
};

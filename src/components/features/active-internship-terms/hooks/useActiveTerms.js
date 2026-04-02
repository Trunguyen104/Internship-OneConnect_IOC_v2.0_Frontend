import { useQuery } from '@tanstack/react-query';

import { activeTermService } from '../services/active-term.service';

export const useActiveTerms = () => {
  const {
    data = [],
    isLoading: loading,
    error,
    refetch: refresh,
  } = useQuery({
    queryKey: ['active-internship-terms'],
    queryFn: async () => {
      try {
        const res = await activeTermService.getActiveTerms();
        return res?.data?.terms || [];
      } catch (err) {
        console.error('Failed to fetch active terms:', err);
        throw err;
      }
    },
    staleTime: 10 * 60 * 1000,
  });

  return { data, loading, error, refresh };
};

import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { StudentActivityService } from '../services/student-activity.service';

export const useActivityFilters = (initialTermId = null) => {
  const [termId, setTermId] = useState(initialTermId);
  const [enterpriseId, setEnterpriseId] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [logbookFilter, setLogbookFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 1. Fetch Terms
  const { data: terms = [], isLoading: termsLoading } = useQuery({
    queryKey: ['university-terms'],
    queryFn: async () => {
      const res = await StudentActivityService.getUniversityTerms();
      return res?.data?.items || res?.data || [];
    },
    staleTime: 10 * 60 * 1000,
  });

  // 2. Fetch Enterprises
  const { data: enterprises = [], isLoading: enterprisesLoading } = useQuery({
    queryKey: ['enterprises'],
    queryFn: async () => {
      const res = await StudentActivityService.getEnterprises();
      return res?.data?.items || res?.data || [];
    },
    staleTime: 10 * 60 * 1000,
  });

  // 3. Automatically select term
  const defaultTermId =
    terms.find((t) => t.status === 2 || t.status === 'ACTIVE')?.termId ||
    terms.find((t) => t.status === 2 || t.status === 'ACTIVE')?.id ||
    terms[0]?.termId ||
    terms[0]?.id;

  const effectiveTermId = termId ?? defaultTermId;
  // useEffect(() => {
  //   if (terms && terms.length > 0) {
  //     setTermId((prev) => {
  //       if (prev) return prev;
  //       const activeTerm = terms.find((t) => t.status === 2 || t.status === 'ACTIVE');
  //       return activeTerm?.termId || activeTerm?.id || terms[0]?.termId || terms[0]?.id;
  //     });
  //   }
  // }, [terms]);

  const resetFilters = () => {
    setEnterpriseId('ALL');
    setStatusFilter('ALL');
    setLogbookFilter('ALL');
    setSearchTerm('');
  };

  return {
    termId: effectiveTermId,
    setTermId,
    enterpriseId,
    setEnterpriseId,
    statusFilter,
    setStatusFilter,
    logbookFilter,
    setLogbookFilter,
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    terms,
    enterprises,
    isLoading: termsLoading || enterprisesLoading,
    resetFilters,
  };
};

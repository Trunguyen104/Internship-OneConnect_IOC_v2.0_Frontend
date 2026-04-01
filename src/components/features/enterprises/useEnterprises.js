'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { enterpriseService } from '@/services/enterprise.service';
import { useEnterprisesStore } from '@/store/useEnterprisesStore';

/**
 * useEnterprises - Standardized hook for Enterprise management.
 * Uses TanStack Query for caching and reactivity, synchronized with global store.
 */
export function useEnterprises() {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const { refreshCount } = useEnterprisesStore();

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPageNumber(1);
    }, 500);
    return () => clearTimeout(t);
  }, [search]);

  // Use TanStack Query for data fetching
  const {
    data: resData = { items: [], total: 0 },
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['enterprises', pageNumber, pageSize, debouncedSearch, refreshCount],
    queryFn: async () => {
      try {
        const params = {
          PageNumber: pageNumber,
          PageSize: pageSize,
          SearchTerm: debouncedSearch || undefined,
        };
        const res = await enterpriseService.getAll(params);

        const items = res?.data?.items ?? res?.items ?? [];
        const total = res?.data?.totalCount ?? res?.totalCount ?? items.length;

        // Sync with global store
        useEnterprisesStore.setEnterprises(items, total);

        return { items, total };
      } catch (err) {
        useEnterprisesStore.setEnterprises([], 0);
        throw err;
      }
    },
    staleTime: 0,
  });

  return {
    enterprises: resData.items,
    loading,
    error: error?.message || null,
    total: resData.total,
    pageNumber,
    setPageNumber,
    pageSize,
    setPageSize: (size) => {
      setPageSize(size);
      setPageNumber(1);
    },
    search,
    setSearch,
    refresh: refetch,
  };
}

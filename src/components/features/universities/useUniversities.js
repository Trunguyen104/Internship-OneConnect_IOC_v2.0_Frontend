'use client';

import { useState, useEffect, useCallback } from 'react';
import { universityService } from '@/services/university.service';
import { useUniversitiesStore } from '@/store/useUniversitiesStore';

export function useUniversities() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { universities, totalCount, refreshCount } = useUniversitiesStore();

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPageNumber(1);
    }, 500);
    return () => clearTimeout(t);
  }, [search]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        PageNumber: pageNumber,
        PageSize: pageSize,
        SearchTerm: debouncedSearch || undefined,
      };
      const res = await universityService.getAll(params);

      const items = res?.data?.items ?? res?.items ?? [];
      const total = res?.data?.totalCount ?? res?.totalCount ?? items.length;

      useUniversitiesStore.setUniversities(items, total);
      setError(null);
    } catch (err) {
      setError(err?.message || 'Failed to load universities');
      useUniversitiesStore.setUniversities([], 0);
    } finally {
      setLoading(false);
    }
  }, [pageNumber, pageSize, debouncedSearch]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshCount]);

  return {
    universities,
    loading,
    error,
    total: totalCount,
    pageNumber,
    setPageNumber,
    pageSize,
    setPageSize,
    search,
    setSearch,
    refresh: fetchData,
  };
}

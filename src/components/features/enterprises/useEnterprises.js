'use client';

import { useState, useEffect, useCallback } from 'react';
import { enterpriseService } from '@/services/enterprise.service';
import { useEnterprisesStore } from '@/store/useEnterprisesStore';

export function useEnterprises() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { enterprises, totalCount, refreshCount } = useEnterprisesStore();
  
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
      const res = await enterpriseService.getAll(params);
      
      const items = res?.data?.items ?? res?.items ?? [];
      const total = res?.data?.totalCount ?? res?.totalCount ?? items.length;
      
      useEnterprisesStore.setEnterprises(items, total);
      setError(null);
    } catch (err) {
      setError(err?.message || 'Failed to load enterprises');
      useEnterprisesStore.setEnterprises([], 0);
    } finally {
      setLoading(false);
    }
  }, [pageNumber, pageSize, debouncedSearch]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshCount]);

  return {
    enterprises,
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

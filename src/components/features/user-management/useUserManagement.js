'use client';

import { useCallback, useEffect, useState } from 'react';

import { userManagementService } from '@/components/features/user-management/user-management.service';
import { getErrorMessage } from '@/lib/error';
import { useAdminUsersStore } from '@/store/useAdminUsersStore';

export function useUserManagement() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { refreshCount, totalCount, users } = useAdminUsersStore();

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
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
      const res = await userManagementService.getList(params);
      const data = res?.data ?? res;

      const items = data?.items ?? data?.Items ?? [];
      const total = data?.totalCount ?? data?.TotalCount ?? items.length;

      useAdminUsersStore.setUsers(items, total);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err));
      useAdminUsersStore.setUsers([], 0);
    } finally {
      setLoading(false);
    }
  }, [pageNumber, pageSize, debouncedSearch]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshCount]);

  return {
    users,
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

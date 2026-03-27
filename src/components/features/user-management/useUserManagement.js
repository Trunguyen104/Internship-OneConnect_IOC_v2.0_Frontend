'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { userManagementService } from '@/components/features/user-management/user-management.service';
import { getErrorMessage } from '@/lib/error';
import { useAdminUsersStore } from '@/store/useAdminUsersStore';

export function useUserManagement() {
  const { refreshCount, totalCount, users } = useAdminUsersStore();

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');

  // 1. Fetch User Data with useQuery
  const {
    data: queryResult,
    isLoading: loading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ['users', pageNumber, pageSize, search, refreshCount],
    queryFn: async () => {
      try {
        const params = {
          PageNumber: pageNumber,
          PageSize: pageSize,
          SearchTerm: search || undefined,
        };
        const res = await userManagementService.getList(params);
        const data = res?.data ?? res;

        const items = data?.items ?? data?.Items ?? [];
        const total = data?.totalCount ?? data?.TotalCount ?? items.length;

        // Maintain store update logic (as requested to not change logic)
        useAdminUsersStore.setUsers(items, total);

        return { items, total };
      } catch (err) {
        useAdminUsersStore.setUsers([], 0);
        throw err;
      }
    },
    staleTime: 2 * 60 * 1000,
  });

  return {
    users,
    loading,
    error: queryError ? getErrorMessage(queryError) : null,
    total: totalCount,
    pageNumber,
    setPageNumber,
    pageSize,
    setPageSize,
    search,
    setSearch,
    refresh: refetch,
  };
}

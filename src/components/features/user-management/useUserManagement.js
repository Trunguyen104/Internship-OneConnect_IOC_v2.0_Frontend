'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { getErrorMessage } from '@/lib/error';
import { userManagementService } from '@/services/user-management.service';
import { useAdminUsersStore } from '@/store/useAdminUsersStore';

export function useUserManagement() {
  const refreshCount = useAdminUsersStore((s) => s.refreshCount);

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
    queryKey: ['users', refreshCount, pageNumber, pageSize, search],
    queryFn: async () => {
      const params = {
        PageNumber: pageNumber,
        PageSize: pageSize,
        SearchTerm: search || undefined,
      };
      const res = await userManagementService.getList(params);
      const data = res?.data ?? res;

      const items = data?.items ?? data?.Items ?? [];
      const total = data?.totalCount ?? data?.TotalCount ?? items.length;

      return { items, total };
    },
    staleTime: 0, // Set to 0 to ensure immediate refetch on key change
  });

  return {
    users: queryResult?.items ?? [],
    loading,
    error: queryError ? getErrorMessage(queryError) : null,
    total: queryResult?.total ?? 0,
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

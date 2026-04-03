'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import { InternPhaseService } from '../services/intern-phase.service';
import { usePhaseEnterprise } from './usePhaseEnterprise';

export const useInternPhaseManagement = () => {
  const { enterpriseId, isLoading: isUserLoading } = usePhaseEnterprise();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(null); // All
  const [includeEnded, setIncludeEnded] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      'intern-phases',
      enterpriseId,
      search,
      statusFilter,
      includeEnded,
      pagination.current,
      pagination.pageSize,
    ],
    queryFn: async () => {
      const params = {
        PageNumber: pagination.current,
        PageSize: pagination.pageSize,
        Search: search,
        IncludeEnded: includeEnded,
        Status: statusFilter,
        EnterpriseId: enterpriseId,
      };

      const res = await InternPhaseService.getAll(params);
      const items = (res?.items || []).map((item) => {
        return {
          ...item,
          remainingCapacity: item.remainingCapacity ?? item.capacity - (item.placedCount || 0),
        };
      });

      return {
        items,
        totalCount: res?.totalCount || 0,
      };
    },
    enabled: !!enterpriseId,
  });

  const items = useMemo(() => {
    return data?.items || [];
  }, [data?.items]);

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  return {
    items,
    totalCount: data?.totalCount || 0,
    isLoading: isLoading || isUserLoading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    includeEnded,
    setIncludeEnded,
    pagination,
    handleTableChange,
    refetch,
  };
};

'use client';

import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';

import { INTERN_PHASE_STATUS } from '@/constants/intern-phase-management/intern-phase';

import { InternPhaseService } from '../services/intern-phase.service';

export const calculatePhaseStatus = (start, end) => {
  const today = dayjs().startOf('day');
  const startDate = dayjs(start).startOf('day');
  const endDate = dayjs(end).startOf('day');

  if (startDate.isAfter(today)) return INTERN_PHASE_STATUS.UPCOMING;
  if (endDate.isBefore(today)) return INTERN_PHASE_STATUS.ENDED;
  return INTERN_PHASE_STATUS.ACTIVE;
};

export const useInternPhaseManagement = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(null); // All
  const [includeEnded, setIncludeEnded] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      'intern-phases',
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
      };

      const res = await InternPhaseService.getAll(params);
      const items = (res?.data?.items || res?.items || []).map((item) => {
        const status = calculatePhaseStatus(item.startDate, item.endDate);
        return {
          ...item,
          computedStatus: status,
          // remainingCapacity calculation normally done by backend or derived here if students list available
          remainingCapacity: item.remainingCapacity ?? item.capacity - (item.placedCount || 0),
        };
      });

      return {
        items,
        totalCount: res?.data?.totalCount || res?.totalCount || 0,
      };
    },
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
    isLoading,
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

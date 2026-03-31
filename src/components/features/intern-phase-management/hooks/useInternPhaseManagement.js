'use client';

import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';

import { userService } from '@/components/features/user/services/user.service';
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
      // First, ensure we have user profile for enterpriseId if needed
      const meRes = await userService.getMe();
      const meData = meRes?.data || meRes;
      const enterpriseId = meData?.enterpriseId || meData?.enterprise_id || meData?.enterpriseID;

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
        // Favor backend status (Enum) if available
        let status;
        if (item.status !== undefined) {
          if (item.status === 0) status = INTERN_PHASE_STATUS.UPCOMING;
          else if (item.status === 1) status = INTERN_PHASE_STATUS.ACTIVE;
          else status = INTERN_PHASE_STATUS.ENDED;
        } else {
          status = calculatePhaseStatus(item.startDate, item.endDate);
        }

        return {
          ...item,
          computedStatus: status,
          remainingCapacity: item.remainingCapacity ?? item.capacity - (item.placedCount || 0),
        };
      });

      return {
        items,
        totalCount: res?.totalCount || 0,
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

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import { useToast } from '@/providers/ToastProvider';
import { getErrorDetail } from '@/utils/errorUtils';

import { StudentActivityService } from '../services/student-activity.service';

export const useStudentList = (filters) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const [pagination, setPagination] = useState({ current: 1, pageSize: 20 });
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  const { termId, enterpriseId, statusFilter, logbookFilter, debouncedSearchTerm } = filters;

  // 1. Fetch Student Activity List
  const activitiesQuery = useQuery({
    queryKey: [
      'student-activities',
      termId,
      enterpriseId,
      statusFilter,
      logbookFilter,
      debouncedSearchTerm,
      pagination.current,
      pagination.pageSize,
      sortBy,
      sortOrder,
    ],
    queryFn: async () => {
      if (!termId) return null;
      try {
        const params = {
          TermId: termId === 'ALL' ? undefined : termId,
          SearchTerm: debouncedSearchTerm || undefined,
          EnterpriseId: enterpriseId === 'ALL' ? undefined : enterpriseId,
          Status: statusFilter === 'ALL' ? undefined : statusFilter,
          LogbookStatus: logbookFilter === 'ALL' ? undefined : logbookFilter,
          SortBy: sortBy || undefined,
          SortOrder: sortOrder || undefined,
          PageNumber: pagination.current,
          PageSize: pagination.pageSize,
        };

        const res = await StudentActivityService.getStudentActivities(params);
        return res?.data || {};
      } catch (error) {
        toast.error(getErrorDetail(error, 'Could not load student list'));
        throw error;
      }
    },
    enabled: !!termId,
    staleTime: 2 * 60 * 1000,
  });

  const studentsRoot = activitiesQuery.data?.students?.items || activitiesQuery.data?.items || [];
  const totalCount =
    activitiesQuery.data?.students?.totalCount || activitiesQuery.data?.totalCount || 0;
  const stats = activitiesQuery.data?.summary || {};

  const summary = useMemo(
    () => ({
      total: stats.totalStudents || 0,
      interning: stats.placed || 0,
      unplaced: stats.unplaced || 0,
      noMentor: stats.noMentor || 0,
    }),
    [stats]
  );

  const onSort = (key, order) => {
    setSortBy(key);
    setSortOrder(order);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const sortedStudents = useMemo(() => {
    if (!studentsRoot?.length) return [];
    if (!sortBy || !sortOrder) return studentsRoot;

    // Identify if this is a local sort column (calculated columns)
    const isLocalSortColumn = sortBy === 'LogbookPercent' || sortBy === 'ViolationCount';

    const result = [...studentsRoot];
    if (isLocalSortColumn) {
      result.sort((a, b) => {
        let valA = 0;
        let valB = 0;

        if (sortBy === 'LogbookPercent') {
          const beValA = a.logbook?.percentComplete;
          const beValB = b.logbook?.percentComplete;

          valA =
            beValA ??
            (a.logbook?.total > 0
              ? Math.min(100, Math.round((a.logbook.submitted / a.logbook.total) * 100))
              : 0);
          valB =
            beValB ??
            (b.logbook?.total > 0
              ? Math.min(100, Math.round((b.logbook.submitted / b.logbook.total) * 100))
              : 0);

          valA = Math.min(100, valA);
          valB = Math.min(100, valB);
        } else if (sortBy === 'ViolationCount') {
          valA = a.violationCount || 0;
          valB = b.violationCount || 0;
        }

        return sortOrder === 'Asc' ? valA - valB : valB - valA;
      });
    }

    return result;
  }, [studentsRoot, sortBy, sortOrder]);

  return {
    students: sortedStudents,
    loading: activitiesQuery.isLoading,
    totalCount,
    summary,
    pagination,
    setPagination,
    sortBy,
    sortOrder,
    onSort,
    refresh: () => queryClient.invalidateQueries({ queryKey: ['student-activities'] }),
  };
};

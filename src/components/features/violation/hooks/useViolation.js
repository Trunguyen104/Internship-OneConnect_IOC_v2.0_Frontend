'use client';

import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';

import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

import { violationReportService } from '../services/violation-report.service';

export function useViolation() {
  const { VIOLATION_REPORT } = INTERNSHIP_MANAGEMENT_UI.ENTERPRISE;
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [dateRange, setDateRange] = useState([null, null]);
  const [pageSize, setPageSizeState] = useState(10);

  const setPageSize = useCallback((size) => {
    setPageSizeState(size);
    setPage(1);
  }, []);
  const [sortOrder] = useState('desc');

  // Debounce Search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Main Query
  const {
    data: result = { items: [], totalCount: 0 },
    isLoading: loading,
    refetch: refresh,
  } = useQuery({
    queryKey: ['violation-reports', page, pageSize, debouncedSearch, dateRange, sortOrder],
    queryFn: async () => {
      try {
        const params = {
          PageNumber: page,
          PageSize: pageSize,
          SearchTerm: debouncedSearch || undefined,
          OccurredFrom: dateRange[0]
            ? dateRange[0].format(VIOLATION_REPORT.DATE_FORMATS.API)
            : undefined,
          OccurredTo: dateRange[1]
            ? dateRange[1].format(VIOLATION_REPORT.DATE_FORMATS.API)
            : undefined,
          OrderByCreatedAscending: sortOrder === 'asc',
        };

        const response = await violationReportService.getReports(params);

        if (response?.data) {
          const items = response.data.items || [];
          const mapped = items.map((item) => ({
            id: item.violationReportId || item.id,
            name: item.studentName,
            description: item.description,
            violationTime: item.occurredDate,
            reporter: item.mentorName || VIOLATION_REPORT.COMMON.REPORTER_DEFAULT,
            reporterId: item.createdById,
            createdAt: item.createdAt,
            internshipGroupName: item.internshipGroupName,
            studentCode: item.studentCode,
            universityName: item.universityName,
          }));

          return {
            items: mapped,
            totalCount: response.data.totalCount || 0,
          };
        }
        return { items: [], totalCount: 0 };
      } catch (err) {
        console.error(VIOLATION_REPORT.LOGS.FETCH_ERROR, err);
        throw err;
      }
    },
    staleTime: 5 * 1000 * 60,
  });

  const resetFilters = useCallback(() => {
    setSearch('');
    setDateRange([null, null]);
    setPage(1);
  }, []);

  const totalPages = Math.ceil(result.totalCount / pageSize);

  return {
    search,
    setSearch,
    page,
    setPage,
    dateRange,
    setDateRange,
    handleDateRangeChange: (dates) => {
      setDateRange(dates || [null, null]);
      setPage(1);
    },
    pageSize,
    setPageSize,
    sortOrder,
    resetFilters,
    paginated: result.items,
    loading,
    total: result.totalCount,
    totalPages,
    refresh,
  };
}

'use client';

import { useCallback, useEffect, useState } from 'react';

import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

import { violationReportService } from '../services/violation.services';

export function useViolation() {
  const { VIOLATION_REPORT } = INTERNSHIP_MANAGEMENT_UI.ENTERPRISE;
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [dateRange, setDateRange] = useState([null, null]);
  const [pageSize, setPageSize] = useState(10);
  const [sortOrder] = useState('desc');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchViolations = useCallback(async () => {
    setLoading(true);
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

        setViolations(mapped);
        setTotal(response.data.totalCount || 0);
      }
    } catch (error) {
      console.error(VIOLATION_REPORT.LOGS.FETCH_ERROR, error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, dateRange, sortOrder, VIOLATION_REPORT]);

  useEffect(() => {
    fetchViolations();
  }, [fetchViolations]);

  const resetFilters = useCallback(() => {
    setSearch('');
    setDateRange([null, null]);
    setPage(1);
  }, []);

  const totalPages = Math.ceil(total / pageSize);

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
    paginated: violations,
    loading,
    total,
    totalPages,
    refresh: fetchViolations,
  };
}

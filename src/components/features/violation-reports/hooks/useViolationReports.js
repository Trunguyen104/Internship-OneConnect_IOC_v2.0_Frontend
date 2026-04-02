'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { useToast } from '@/providers/ToastProvider';

import { VIOLATION_REPORT_UI } from '../constants/violationReportUI';
import { violationReportService } from '../services/violation-report.service';

export const useViolationReports = () => {
  const toast = useToast();

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    search: '',
  });

  // 1. Fetch Students & Groups (Initial Data)
  const { data: initialData = { students: [], groups: [] } } = useQuery({
    queryKey: ['violation-report-initial-data'],
    queryFn: async () => {
      try {
        const [students, groups] = await Promise.all([
          violationReportService.getStudentsForMentor(),
          violationReportService.getGroupsForMentor(),
        ]);
        return { students: students || [], groups: groups || [] };
      } catch (err) {
        return { students: [], groups: [] };
      }
    },
    staleTime: 10 * 60 * 1000,
  });

  // 2. Fetch Violation Reports
  const {
    data: reportsResult,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ['violation-reports', params],
    queryFn: async () => {
      try {
        const response = await violationReportService.getReports(params);
        return {
          data: response?.data || [],
          total: response?.total || 0,
        };
      } catch (err) {
        return { data: [], total: 0 };
      }
    },
    staleTime: 2 * 60 * 1000,
  });

  const handleSearch = (value) => {
    setParams((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const handleFilterChange = (newFilters) => {
    setParams((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setParams((prev) => ({
      ...prev,
      page: pagination.current,
      pageSize: pagination.pageSize,
      sortBy: sorter.field || prev.sortBy,
      sortOrder: sorter.order ? (sorter.order === 'ascend' ? 'asc' : 'desc') : prev.sortOrder,
    }));
  };

  const handleCreateReport = async (payload) => {
    try {
      await violationReportService.createReport(payload);
      toast.success(VIOLATION_REPORT_UI.CREATE_SUCCESS);
      refetch();
      return true;
    } catch {
      toast.error(VIOLATION_REPORT_UI.CREATE_FAIL);
      return false;
    }
  };

  const handleUpdateReport = async (id, payload) => {
    try {
      await violationReportService.updateReport(id, payload);
      toast.success(VIOLATION_REPORT_UI.UPDATE_SUCCESS);
      refetch();
      return true;
    } catch {
      toast.error(VIOLATION_REPORT_UI.UPDATE_FAIL);
      return false;
    }
  };

  const handleDeleteReport = async (id) => {
    try {
      await violationReportService.deleteReport(id);
      toast.success(VIOLATION_REPORT_UI.DELETE_SUCCESS);
      refetch();
      return true;
    } catch {
      toast.error(VIOLATION_REPORT_UI.DELETE_FAIL);
      return false;
    }
  };

  return {
    reports: reportsResult?.data || [],
    loading,
    total: reportsResult?.total || 0,
    params,
    students: initialData.students,
    groups: initialData.groups,
    handleSearch,
    handleFilterChange,
    handleTableChange,
    handleCreateReport,
    handleUpdateReport,
    handleDeleteReport,
    refresh: refetch,
  };
};

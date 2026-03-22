'use client';

import { useCallback, useEffect, useState } from 'react';

import { useToast } from '@/providers/ToastProvider';

import { VIOLATION_REPORT_UI } from '../constants/violationReportUI';
import { violationReportService } from '../services/violationReportService';

export const useViolationReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    search: '',
  });

  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);

  const toast = useToast();

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(params.search);
      setParams((prev) => ({ ...prev, page: 1 }));
    }, 300);

    return () => clearTimeout(handler);
  }, [params.search]);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = {
        ...params,
        search: debouncedSearch || undefined,
      };
      const response = await violationReportService.getReports(queryParams);
      setReports(response?.data || []);
      setTotal(response?.total || 0);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, params]);

  const fetchInitialData = useCallback(async () => {
    try {
      const [studentsRes, groupsRes] = await Promise.all([
        violationReportService.getStudentsForMentor(),
        violationReportService.getGroupsForMentor(),
      ]);
      setStudents(studentsRes || []);
      setGroups(groupsRes || []);
    } catch (error) {
      console.error('Failed to fetch initial data:', error);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleSearch = (value) => {
    setParams((prev) => ({ ...prev, search: value }));
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
      fetchReports();
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
      fetchReports();
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
      fetchReports();
      return true;
    } catch {
      toast.error(VIOLATION_REPORT_UI.DELETE_FAIL);
      return false;
    }
  };

  return {
    reports,
    loading,
    total,
    params,
    students,
    groups,
    handleSearch,
    handleFilterChange,
    handleTableChange,
    handleCreateReport,
    handleUpdateReport,
    handleDeleteReport,
    refresh: fetchReports,
  };
};

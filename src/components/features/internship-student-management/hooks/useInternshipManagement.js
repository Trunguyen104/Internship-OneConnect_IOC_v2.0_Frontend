'use client';

import { useEffect } from 'react';

import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

import { useStudentActions } from './useStudentActions';
import { useStudentData } from './useStudentData';
import { useStudentFilters } from './useStudentFilters';

export const useInternshipManagement = () => {
  // 1. Initialize Filters State
  const filters = useStudentFilters();

  // 2. Fetch all Server State Data
  const data = useStudentData(filters);

  // 3. Initialize Modals and Actions
  const actions = useStudentActions({
    refetchStudents: data.refetchStudents,
    phaseId: filters.phaseId,
    enterpriseId: data.enterpriseId,
  });

  // Listen for global group refresh events
  useEffect(() => {
    const handleRefresh = () => {
      data.refetchStudents();
    };
    window.addEventListener(INTERNSHIP_MANAGEMENT_UI.GROUP_MANAGEMENT.REFRESH_EVENT, handleRefresh);
    return () =>
      window.removeEventListener(
        INTERNSHIP_MANAGEMENT_UI.GROUP_MANAGEMENT.REFRESH_EVENT,
        handleRefresh
      );
  }, [data.refetchStudents]);

  // Expose the EXACT same interface as before to avoid breaking UI components
  return {
    search: filters.search,
    groupFilter: filters.groupFilter,
    setGroupFilter: filters.setGroupFilter,
    pagination: filters.pagination,
    filteredData: data.studentResult.students,
    total: data.studentResult.total,
    loading: data.loadingStudents || actions.viewLoading,
    groupModal: actions.groupModal,
    detailModal: actions.detailModal,
    assignModal: actions.assignModal,
    selectedRowKeys: actions.selectedRowKeys,
    setGroupModal: actions.setGroupModal,
    setDetailModal: actions.setDetailModal,
    setAssignModal: actions.setAssignModal,
    setSelectedRowKeys: actions.setSelectedRowKeys,
    handleSearchChange: filters.handleSearchChange,
    handleGroupFilterChange: filters.handleGroupFilterChange,
    handleMentorFilterChange: filters.handleMentorFilterChange,
    handleTableChange: filters.handleTableChange,
    handlePageSizeChange: filters.handlePageSizeChange,
    handleGroupSubmit: actions.handleGroupSubmit,
    handleAssignMentor: actions.handleAssignMentor,
    handleViewStudent: actions.handleViewStudent,
    phaseId: filters.phaseId,
    setPhaseId: filters.setPhaseId,
    phaseOptions: data.phaseOptions,
    fetchingPhases: data.fetchingPhases,
    resetFilters: filters.resetFilters,
    setCreateModal: actions.setCreateModal,
    createModal: actions.createModal,
    unassignedStudents: data.studentResult.unassigned,
    fetchingStudents: data.loadingStudents,
    mentors: data.mentors,
    loadingMentors: data.loadingMentors,
    handleCreateGroup: actions.handleCreateGroup,
    mentorFilter: filters.mentorFilter,
    setMentorFilter: filters.setMentorFilter,
    isPhaseEditable:
      filters.phaseId === 'ALL_VISIBLE' ||
      (filters.phaseId &&
        Array.isArray(data.phaseOptions) &&
        data.phaseOptions.find((p) => p.value === filters.phaseId)?.status === 2),
    hasGroups: data.studentResult.hasGroups,
    existingGroups: data.studentResult.existingGroups,
    sort: filters.sort,
    setSort: filters.setSort,
    fetchData: data.refetchStudents,
  };
};

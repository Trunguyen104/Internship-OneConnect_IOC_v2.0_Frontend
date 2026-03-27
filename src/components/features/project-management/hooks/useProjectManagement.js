'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { useToast } from '@/providers/ToastProvider';

import { ProjectService } from '../services/project.service';
import { useProjectActions } from './useProjectActions';
import { useProjectFilters } from './useProjectFilters';
import { useProjectModals } from './useProjectModals';

export const useProjectManagement = () => {
  const toast = useToast();

  // --- Specialized Hooks ---
  const {
    searchTerm,
    groupIdFilter,
    statusFilter,
    pagination,
    setPagination,
    handleSearchChange,
    handleGroupFilterChange,
    handleStatusFilterChange,
    handleTableChange,
    handlePageSizeChange,
  } = useProjectFilters();

  const {
    modalVisible,
    setModalVisible,
    detailDrawerVisible,
    setDetailDrawerVisible,
    editingRecord,
    viewOnly,
    handleCreateNew,
    handleEdit,
    handleView,
  } = useProjectModals();

  // --- Data Fetching ---

  // 1. Fetch Supporting Data (Groups)
  const { data: groups = [] } = useQuery({
    queryKey: ['groups-for-mentor'],
    queryFn: async () => {
      try {
        const res = await ProjectService.getGroupsForMentor();
        if (res?.data?.items) {
          // AC-02: Only show Active groups (status 1)
          return res.data.items.filter((g) => g.status === 1 || g.groupStatus === 1);
        }
        return [];
      } catch (err) {
        return [];
      }
    },
    staleTime: 10 * 60 * 1000,
  });

  // 2. Fetch Projects
  const {
    data: projectsResult,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: [
      'projects',
      searchTerm,
      groupIdFilter,
      statusFilter,
      pagination.current,
      pagination.pageSize,
    ],
    queryFn: async () => {
      try {
        const params = {
          PageNumber: pagination.current,
          PageSize: pagination.pageSize,
          SearchTerm: searchTerm,
          internshipId: groupIdFilter,
          Status: statusFilter,
        };
        const res = await ProjectService.getAll(params);
        if (res?.data?.items) {
          // Update pagination total outside of render
          setPagination((prev) => ({
            ...prev,
            total: res.data.totalCount || 0,
          }));
          return res.data.items;
        }
        return [];
      } catch (err) {
        console.error('Fetch Projects failed:', err);
        return [];
      }
    },
    staleTime: 2 * 60 * 1000,
  });

  // --- Actions Hook ---
  const {
    submitLoading,
    handleSaveProject,
    handlePublishProject,
    handleCompleteProject,
    handleDeleteProject,
  } = useProjectActions({
    editingRecord,
    fetchData: refetch, // Use refetch from useQuery
    groups,
    setModalVisible,
  });

  const [actionLoading, setActionLoading] = useState(false);

  return {
    data: projectsResult || [],
    loading: loading || actionLoading,
    searchTerm,
    groupIdFilter,
    statusFilter,
    pagination,
    modalVisible,
    detailDrawerVisible,
    editingRecord,
    submitLoading,
    viewOnly,
    groups,
    setModalVisible,
    setDetailDrawerVisible,
    handleSearchChange,
    handleGroupFilterChange,
    handleStatusFilterChange,
    handleTableChange,
    handlePageSizeChange,
    handleCreateNew,
    handleEdit,
    handleView,
    handleSaveProject,
    handlePublishProject,
    handleCompleteProject: (id) => handleCompleteProject(id, setActionLoading),
    handleDeleteProject: (id) => handleDeleteProject(id, setActionLoading),
    fetchData: refetch,
  };
};

'use client';

import { useCallback, useEffect, useState } from 'react';

import { useToast } from '@/providers/ToastProvider';

import { ProjectService } from '../services/project.service';
import { useProjectActions } from './useProjectActions';
import { useProjectFilters } from './useProjectFilters';
import { useProjectModals } from './useProjectModals';

export const useProjectManagement = () => {
  const toast = useToast();
  // --- Core Data State ---
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([]);

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
  const fetchData = useCallback(async () => {
    // AC-01: allow viewing all projects if no group filter is selected
    // if (!groupIdFilter) return; // Removed this restrictor

    try {
      setLoading(true);
      const params = {
        PageNumber: pagination.current,
        PageSize: pagination.pageSize,
        SearchTerm: searchTerm,
        internshipId: groupIdFilter, // Sync with API parameter name
        Status: statusFilter,
      };

      const res = await ProjectService.getAll(params);
      if (res?.data?.items) {
        setData(res.data.items);
        setPagination((prev) => ({
          ...prev,
          total: res.data.totalCount || 0,
        }));
      }
    } catch (err) {
      console.error('Fetch Projects failed:', err);
      // toast.error('Failed to load projects'); // Avoid multiple separate toasts if it fails on load
    } finally {
      setLoading(false);
    }
  }, [
    searchTerm,
    groupIdFilter,
    statusFilter,
    pagination.current,
    pagination.pageSize,
    setPagination,
    toast,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchSupportingData = useCallback(async () => {
    try {
      const res = await ProjectService.getGroupsForMentor();
      if (res?.data?.items) {
        // AC-02: Only show Active groups (status 1)
        const activeGroups = res.data.items.filter((g) => g.status === 1 || g.groupStatus === 1);
        setGroups(activeGroups);
      }
    } catch (err) {
      console.error('Fetch Supporting Data failed:', err);
    }
  }, []);

  useEffect(() => {
    fetchSupportingData();
  }, [fetchSupportingData]);

  // Removed auto-select first group logic to allow "View All" (null filter) state
  /*
  useEffect(() => {
    if (!groupIdFilter && groups.length > 0) {
      handleGroupFilterChange(groups[0].internshipId);
    }
  }, [groupIdFilter, groups, handleGroupFilterChange]);
  */

  // --- Actions Hook ---
  const {
    submitLoading,
    handleSaveProject,
    handlePublishProject,
    handleCompleteProject,
    handleDeleteProject,
  } = useProjectActions({
    editingRecord,
    fetchData,
    groups,
    setModalVisible,
  });

  return {
    data,
    loading,
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
    handleCompleteProject: (id) => handleCompleteProject(id, setLoading),
    handleDeleteProject: (id) => handleDeleteProject(id, setLoading),
    fetchData,
  };
};

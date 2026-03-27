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
    try {
      setLoading(true);
      const params = {
        PageNumber: pagination.current,
        PageSize: pagination.pageSize,
        SearchTerm: searchTerm,
        internshipId: groupIdFilter,
        Status: statusFilter,
      };

      const res = await ProjectService.getAll(params);
      if (res?.data?.items) {
        let items = res.data.items;

        // AC-01: Filter locally to only show projects belonging to mentor's groups
        // or projects that have no group assigned (orphans)
        if (!groupIdFilter && groups.length > 0) {
          const mentorGroupIds = groups.map((g) => (g.internshipId || g.id).toLowerCase());
          items = items.filter((p) => {
            if (!p.internshipId) return true; // Show orphans
            return mentorGroupIds.includes(p.internshipId.toLowerCase());
          });
        }

        // AC-01: Only show Draft (0), Published (1), and Completed (2)
        const finalItems = items.filter((p) => p.status <= 2);

        setData(finalItems);
        setPagination((prev) => ({
          ...prev,
          total: res.data.totalCount || finalItems.length,
        }));
      }
    } catch (err) {
      console.error('Fetch Projects failed:', err);
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
    groups,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchSupportingData = useCallback(async () => {
    try {
      const res = await ProjectService.getGroupsForMentor();
      if (res?.data?.items) {
        // Keep all groups for the name mapping in the table,
        // but the selection in the form will remain restricted if needed
        setGroups(res.data.items);
      }
    } catch (err) {
      console.error('Fetch Supporting Data failed:', err);
    }
  }, []);

  useEffect(() => {
    fetchSupportingData();
  }, [fetchSupportingData]);

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

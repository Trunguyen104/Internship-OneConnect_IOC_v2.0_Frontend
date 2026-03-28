'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useProfile } from '@/components/features/user/hooks/useProfile';

import { mapProjectsToFrontend } from '../services/project.mapper';
import { ProjectService } from '../services/project.service';
import { useProjectActions } from './useProjectActions';
import { useProjectFilters } from './useProjectFilters';
import { useProjectModals } from './useProjectModals';

export const useProjectManagement = () => {
  const { userInfo } = useProfile();

  const r = userInfo?.roleId || userInfo?.RoleId || userInfo?.role || userInfo?.Role;
  const roleName = String(userInfo?.roleName || userInfo?.RoleName || r || '').toLowerCase();
  const numRole = Number(r);

  const isMentor = numRole === 6 || roleName.includes('mentor');
  const isHR =
    (numRole >= 1 && numRole <= 5) ||
    roleName.includes('hr') ||
    roleName.includes('admin') ||
    roleName.includes('enterprise');

  // --- Core Data State ---
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([]);
  const hasNotifiedOrphaned = useRef(false);

  // --- Specialized Hooks ---
  const {
    searchTerm,
    groupIdFilter,
    statusFilter,
    visibilityFilter,
    showArchived,
    pagination,
    setPagination,
    handleSearchChange,
    handleGroupFilterChange,
    handleStatusFilterChange,
    handleVisibilityFilterChange,
    handleShowArchivedChange,
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
        Status: statusFilter !== undefined ? statusFilter : undefined,
        // AC-14: HR and Uni Admin only see Published (1)
        Visibility: !isMentor ? 1 : visibilityFilter !== undefined ? visibilityFilter : undefined,
        showArchived: showArchived,
      };

      const res = await ProjectService.getAll(params);
      let items = res?.data?.items || [];

      if (items) {
        // AC-15 & AC-16: Normalize DTOs via Mapper
        const normalizedItems = mapProjectsToFrontend(items);

        // AC-01 Visibility Logic:
        const finalItems = normalizedItems.filter((p) => {
          const op = p.operationalStatus;
          const vis = p.visibilityStatus;

          // Rule: Hide archived unless toggled
          const isArchived = op === 3;
          if (!showArchived && isArchived) return false;

          // AC-14: Strictly enforce Published for non-mentors on the frontend too
          if (!isMentor && vis !== 1) return false;

          // Rule: Visibility Filter (Manual)
          if (isMentor && visibilityFilter !== undefined) {
            if (vis !== visibilityFilter) return false;
          }

          // Rule: Status Filter (Manual)
          if (statusFilter !== undefined) {
            if (op !== statusFilter) return false;
          }

          return true;
        });

        setData(finalItems);
        setPagination((prev) => ({
          ...prev,
          total: res?.data?.totalCount || finalItems.length,
        }));

        // AC-16: Notify Mentor about orphaned projects (once)
        const orphanedList = finalItems.filter((p) => p.isOrphaned);
        if (orphanedList.length > 0 && !hasNotifiedOrphaned.current && isMentor) {
          const firstName = orphanedList[0].projectName;
          const message =
            orphanedList.length === 1
              ? PROJECT_MANAGEMENT.MESSAGES.ORPHANED_GROUP_NOTIFY.replace(
                  '{projectName}',
                  firstName
                )
              : `Có ${orphanedList.length} dự án đã bị giải thể nhóm và chuyển về trạng thái Unstarted.`;

          toast.warning(message, { duration: 10 });
          hasNotifiedOrphaned.current = true;
        }
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
    visibilityFilter,
    showArchived,
    pagination.current,
    pagination.pageSize,
    setPagination,
    isMentor,
    groups,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchSupportingData = useCallback(async () => {
    try {
      const res = await ProjectService.getGroupsForMentor();
      if (res?.data?.items) {
        // AC-01: Dropdown only shows Active groups managed by the mentor
        setGroups(
          res.data.items.filter(
            (g) =>
              g.status === 1 ||
              g.groupStatus === 1 ||
              g.status === 'Active' ||
              g.groupStatus === 'Active'
          )
        );
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
    handleUnpublishProject,
    handleArchiveProject,
    handleAssignGroup,
    handleCompleteProject,
    handleDeleteProject,
  } = useProjectActions({
    editingRecord,
    fetchData,
    groups,
    setModalVisible,
    userInfo,
  });

  return {
    data,
    loading,
    searchTerm,
    groupIdFilter,
    statusFilter,
    visibilityFilter,
    showArchived,
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
    handleVisibilityFilterChange,
    handleShowArchivedChange,
    handleTableChange,
    handlePageSizeChange,
    handleCreateNew,
    handleEdit,
    handleView,
    handleSaveProject,
    handlePublishProject,
    handleUnpublishProject,
    handleArchiveProject,
    handleAssignGroup,
    handleCompleteProject: (id) => handleCompleteProject(id, setLoading),
    handleDeleteProject: (id) => handleDeleteProject(id, setLoading),
    fetchData,
    userInfo,
    isMentor,
    isHR,
  };
};

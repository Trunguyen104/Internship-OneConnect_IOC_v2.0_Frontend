'use client';

import { useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';

import { useProfile } from '@/components/features/user/hooks/useProfile';
import { useToast } from '@/providers/ToastProvider';

import { ProjectService } from '../services/project.service';
import { useProjectActions } from './useProjectActions';
import { useProjectFilters } from './useProjectFilters';
import { useProjectModals } from './useProjectModals';

export const useProjectManagement = () => {
  const toast = useToast();
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

  // 1. Fetch Supporting Data (Groups)
  const { data: groups = [] } = useQuery({
    queryKey: ['groups-for-mentor'],
    queryFn: async () => {
      try {
        const res = await ProjectService.getGroupsForMentor();
        if (res?.data?.items) {
          // AC-02: Only show Active groups (status 1)
          return res.data.items.filter(
            (g) =>
              g.status === 1 ||
              g.groupStatus === 1 ||
              g.status === 'Active' ||
              g.groupStatus === 'Active'
          );
        }
        return [];
      } catch {
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
      visibilityFilter,
      showArchived,
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
          // AC-14: HR and Uni Admin only see Published (1)
          Visibility: !isMentor ? 1 : visibilityFilter !== undefined ? visibilityFilter : undefined,
          showArchived: showArchived,
        };
        const res = await ProjectService.getAll(params);
        if (res?.data?.items) {
          // Update pagination total outside of render
          setPagination((prev) => ({
            ...prev,
            total: res.data.totalCount || 0,
          }));

          // AC-16: Notify Mentor about orphaned projects (once)
          const items = res.data.items;
          const orphanedList = items.filter((p) => p.isOrphaned || p.isOrphan);
          if (orphanedList.length > 0 && !hasNotifiedOrphaned.current && isMentor) {
            const firstName = orphanedList[0].projectName || orphanedList[0].name;
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

          return items;
        }
        return [];
      } catch (err) {
        console.error('Fetch Projects failed:', err);
        return [];
      }
    },
    staleTime: 2 * 60 * 1000,
  });
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
    fetchData: refetch, // Use refetch from useQuery
    groups,
    setModalVisible,
    userInfo,
  });

  const [actionLoading, setActionLoading] = useState(false);

  return {
    data: projectsResult || [],
    loading: loading || actionLoading,
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
    handleCompleteProject: (id) => handleCompleteProject(id, setActionLoading),
    handleDeleteProject: (id) => handleDeleteProject(id, setActionLoading),
    fetchData: refetch,
    userInfo,
    isMentor,
    isHR,
  };
};

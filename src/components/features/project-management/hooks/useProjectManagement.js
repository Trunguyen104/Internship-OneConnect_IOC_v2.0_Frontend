'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { useProfile } from '@/components/features/user/hooks/useProfile';
import { PROJECT_MANAGEMENT } from '@/constants/project-management/project-management';
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
    data: projectsData,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: [
      'projects',
      userInfo?.id,
      isMentor,
      searchTerm,
      groupIdFilter,
      statusFilter,
      visibilityFilter,
      showArchived,
      pagination.current,
      pagination.pageSize,
    ],
    enabled: !!userInfo,
    queryFn: async () => {
      try {
        const params = {
          PageNumber: pagination.current,
          PageSize: pagination.pageSize,
          SearchTerm: searchTerm,
          InternshipId: groupIdFilter,
          OperationalStatus: statusFilter,
          // AC-14: HR and Uni Admin only see Published (1)
          VisibilityStatus: !isMentor
            ? VISIBILITY_STATUS.PUBLISHED
            : visibilityFilter !== undefined
              ? visibilityFilter
              : undefined,
          showArchived: showArchived,
        };
        const res = await ProjectService.getAll(params);

        // Robust data extraction
        const apiData = res?.data || res || {};
        const items = apiData.items || (Array.isArray(apiData) ? apiData : []);
        const totalCount =
          apiData.totalCount || apiData.total || apiData.total_count || items.length || 0;

        return { items, total: totalCount };
      } catch (err) {
        return { items: [], total: 0 };
      }
    },
    staleTime: 2 * 60 * 1000,
  });

  // AC-16: Notify Mentor about orphaned projects (once per session)
  useEffect(() => {
    if (projectsData?.items?.length > 0 && !hasNotifiedOrphaned.current && isMentor) {
      const orphanedList = projectsData.items.filter((p) => p.isOrphaned || p.isOrphan);
      if (orphanedList.length > 0) {
        let message = '';
        if (orphanedList.length === 1) {
          const p = orphanedList[0];
          message = PROJECT_MANAGEMENT.MESSAGES.ORPHANED_GROUP_NOTIFY.replace(
            '{projectName}',
            p.projectName || p.name || 'Unknown Project'
          ).replace('{groupName}', p.groupName || 'N/A');
        } else {
          message = PROJECT_MANAGEMENT.MESSAGES.ORPHANED_PROJECTS_PLURAL.replace(
            '{count}',
            orphanedList.length
          );
        }

        toast.warning(message, { duration: 10 });
        hasNotifiedOrphaned.current = true;
      }
    }
  }, [projectsData, isMentor, toast]);

  const projectsResult = projectsData?.items || [];
  const totalRecords = projectsData?.total || 0;

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

  return {
    data: projectsResult || [],
    loading,
    searchTerm,
    groupIdFilter,
    statusFilter,
    visibilityFilter,
    showArchived,
    pagination,
    total: totalRecords,
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
    handleCompleteProject,
    handleDeleteProject,
    fetchData: refetch,
    userInfo,
    isMentor,
    isHR,
  };
};

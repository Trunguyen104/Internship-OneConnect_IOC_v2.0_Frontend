'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { showDeleteConfirm } from '@/components/ui/deleteconfirm';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { useToast } from '@/providers/ToastProvider';

import { EnterpriseMentorService } from '../../../internship-student-management/services/enterprise-mentor.service';
import { EnterpriseStudentService } from '../../../internship-student-management/services/enterprise-student.service';
import { userService } from '../../../user/services/user.service';
import { EnterpriseGroupService } from '../services/enterprise-group.service';
import { useEnterpriseGroupActions } from './useEnterpriseGroupActions';
import { useEnterpriseGroupFilters } from './useEnterpriseGroupFilters';
import { useEnterpriseGroups } from './useEnterpriseGroups';

export const useGroupManagement = () => {
  const toast = useToast();
  const searchParams = useSearchParams();
  const urlGroupId = searchParams.get('groupId');
  const groupFilters = useEnterpriseGroupFilters();
  const { GROUP_MANAGEMENT } = INTERNSHIP_MANAGEMENT_UI;
  const { MESSAGES } = GROUP_MANAGEMENT;

  // 1. Fetch Me Info
  const { data: enterpriseId } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      try {
        const res = await userService.getMe();
        const data = res?.data || res;
        return data?.enterpriseId || data?.enterprise_id || data?.enterpriseID;
      } catch {
        return null;
      }
    },
    staleTime: 0, // Always check user identity on mount
  });

  // 2. Main Group Data Fetching
  const { data, total, loading, refetch } = useEnterpriseGroups({
    phaseId: groupFilters.phaseId,
    filters: groupFilters.filters,
    search: groupFilters.debouncedSearch,
    pagination: groupFilters.pagination,
    sort: groupFilters.sort,
    phaseOptions: groupFilters.phaseOptions,
  });

  // 3. Fetch Mentors - Aligned with Backend (Self-identifies enterprise via HR login)
  const { data: mentors = [], isLoading: loadingMentors } = useQuery({
    queryKey: ['enterprise-mentors'],
    queryFn: async () => {
      try {
        const roles = [6]; // Using Role 6 as standard for Mentors
        const results = await Promise.allSettled(
          roles.map((r) =>
            EnterpriseMentorService.getMentors({
              Role: r,
              PageSize: 100,
            })
          )
        );

        const allItems = results
          .filter((r) => r.status === 'fulfilled')
          .flatMap((r) => {
            const res = r.value;
            const data = res?.data || res;
            return data?.items || data?.Items || (Array.isArray(data) ? data : []);
          });

        return Array.from(
          new Map(allItems.map((item) => [item?.userId || item?.UserId || item?.id, item])).values()
        ).filter(Boolean);
      } catch {
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  const [assignModal, setAssignModal] = useState({ open: false, group: null });
  const [createModal, setCreateModal] = useState({ open: false, group: null });
  const [editModal, setEditModal] = useState({ open: false, group: null, isAddingStudents: false });

  // 4. Fetch Unassigned Students
  const { data: unassignedStudents = [], isLoading: fetchingStudents } = useQuery({
    queryKey: ['unassigned-students', groupFilters.phaseId],
    queryFn: async () => {
      let targetPhaseId = groupFilters.phaseId;
      const isAllVisible = targetPhaseId === 'ALL_VISIBLE' || !targetPhaseId;

      try {
        const res = await EnterpriseGroupService.getPlacedStudents({
          PhaseId: isAllVisible ? undefined : targetPhaseId,
          PageIndex: 1,
          PageSize: 1000,
        });

        const items = res?.data?.items || res.items || [];
        const mappedItems = items.map(EnterpriseStudentService.mapApplication);

        const unassigned = mappedItems.filter((s) => {
          if (s.isAssignedToGroup || s.groupId) return false;
          return true;
        });

        return unassigned;
      } catch (err) {
        console.error('Failed to fetch unassigned students:', err);
        return [];
      }
    },
    enabled: createModal.open || editModal.open,
  });

  const {
    createGroup,
    updateGroup,
    archiveGroup,
    removeStudents,
    addStudents: addGroupStudents,
    deleteGroup,
    loading: actionLoading,
  } = useEnterpriseGroupActions();

  const [selectedGroupDetail, setSelectedGroupDetail] = useState(null);
  const [isAutoSelecting, setIsAutoSelecting] = useState(!!urlGroupId);

  // Handle auto-selection from URL
  useEffect(() => {
    if (urlGroupId) {
      const fetchInitialGroup = async () => {
        try {
          setIsAutoSelecting(true);
          const res = await EnterpriseGroupService.getGroupDetail(urlGroupId);
          const rawData = res?.data || res;
          if (rawData) {
            setSelectedGroupDetail({
              ...rawData,
              id: rawData.id || rawData.internshipId || rawData.groupId || urlGroupId,
            });
          }
        } catch (err) {
          console.error('Failed to auto-select group from URL', err);
        } finally {
          setIsAutoSelecting(false);
        }
      };
      fetchInitialGroup();
    }
  }, [urlGroupId]);

  const handleViewGroup = useCallback((group) => {
    setSelectedGroupDetail(group);
  }, []);

  const handleAssignSubmit = useCallback(
    async (values) => {
      const { group } = assignModal;
      if (!group) return;
      await updateGroup(group.id, {
        ...group,
        mentorId: values.mentorId,
        projectName: values.projectName,
      });
      setAssignModal({ open: false, group: null });
    },
    [assignModal, updateGroup]
  );

  const handleDeleteGroup = useCallback(
    async (group) => {
      try {
        const dashRes = await EnterpriseGroupService.getGroupDashboard(group.id);
        const summary = dashRes?.data?.summary || {};
        const hasData = (summary.totalTasks || 0) > 0 || (summary.done || 0) > 0;
        const hasStudents = (group.memberCount || 0) > 0;

        if (hasData) {
          toast.warning(MESSAGES.DELETE_ERROR_HAS_DATA, { duration: 6 });
          return;
        }

        const content = hasStudents
          ? MESSAGES.DELETE_ERROR_HAS_STUDENTS
          : GROUP_MANAGEMENT.MODALS.DELETE?.CONTENT ||
            'Are you sure you want to delete this group?';

        showDeleteConfirm({
          title: GROUP_MANAGEMENT.MODALS.DELETE?.TITLE || 'Delete Group',
          content,
          okText: GROUP_MANAGEMENT.MODALS.DELETE?.SUBMIT || 'Delete',
          onOk: async () => {
            await deleteGroup(group.id);
          },
        });
      } catch {
        toast.error(MESSAGES.ERROR);
      }
    },
    [deleteGroup, toast, MESSAGES, GROUP_MANAGEMENT]
  );

  const handleArchiveGroup = useCallback(
    (group) => {
      showDeleteConfirm({
        title: GROUP_MANAGEMENT.MESSAGES.ARCHIVE_CONFIRM_TITLE || 'Archive Group',
        content:
          GROUP_MANAGEMENT.MESSAGES.ARCHIVE_CONFIRM_TEXT ||
          'Are you sure you want to archive this group?',
        okText: 'Confirm',
        type: 'warning',
        onOk: async () => {
          await archiveGroup(group.id);
        },
      });
    },
    [archiveGroup, GROUP_MANAGEMENT]
  );

  const handleCreateGroup = useCallback(
    async (payload) => {
      let targetPhaseId = groupFilters.phaseId;

      if (targetPhaseId === 'ALL_VISIBLE' || !targetPhaseId) {
        targetPhaseId = payload.phaseId || payload.termId;
      }

      if (!targetPhaseId && payload.students?.[0]?.studentId) {
        const firstStudentId = payload.students[0].studentId;
        const studentInfo = (unassignedStudents || []).find(
          (s) => String(s.studentId || s.id || s.applicationId) === String(firstStudentId)
        );
        targetPhaseId = studentInfo?.phaseId || studentInfo?.termId;
      }

      const safeOptions = Array.isArray(groupFilters.phaseOptions) ? groupFilters.phaseOptions : [];
      const selectedPhase = safeOptions.find(
        (p) => String(p.value).toLowerCase() === String(targetPhaseId).toLowerCase()
      );

      await createGroup({
        ...payload,
        phaseId: targetPhaseId,
        internshipPhaseId: targetPhaseId,
        enterpriseId: enterpriseId || selectedPhase?.enterpriseId,
        startDate: payload.startDate || selectedPhase?.startDate,
        endDate: payload.endDate || selectedPhase?.endDate,
      });
      setCreateModal({ open: false, group: null });
    },
    [createGroup, groupFilters.phaseId, groupFilters.phaseOptions, enterpriseId, unassignedStudents]
  );

  const handleUpdateGroup = useCallback(
    async (values) => {
      const { group } = editModal;
      if (!group) return;

      const groupId = group.internshipId || group.id || group.groupId;

      try {
        if (!editModal.isAddingStudents && values.students !== undefined) {
          const newStudents = values.students || [];
          const oldMembers = group.members || [];

          const newIds = new Set(newStudents.map((s) => String(s.studentId)));
          const oldIds = new Set(
            oldMembers.map((m) => String(m.studentId || m.id || m.applicationId))
          );

          const toAdd = newStudents.filter((s) => !oldIds.has(String(s.studentId)));
          const toRemove = oldMembers
            .filter((m) => !newIds.has(String(m.studentId || m.id || m.applicationId)))
            .map((m) => m.studentId || m.id || m.applicationId);

          if (toRemove.length > 0) {
            await removeStudents(groupId, toRemove);
          }
          if (toAdd.length > 0) {
            await addGroupStudents(groupId, toAdd);
          }
        }

        if (editModal.isAddingStudents) {
          const oldMembers = group.members || [];
          const oldIds = new Set(
            oldMembers.map((m) => String(m.studentId || m.id || m.applicationId))
          );

          const newIds = (values.studentIds || []).filter((id) => !oldIds.has(String(id)));

          if (newIds.length > 0) {
            const studentsToUpdate = newIds.map((id) => ({
              studentId: id,
              role: 1,
            }));
            await addGroupStudents(groupId, studentsToUpdate);
          }
        } else {
          const targetPhaseId = group.phaseId || group.termId || group.internshipPhaseId;
          const safeOptions = Array.isArray(groupFilters.phaseOptions)
            ? groupFilters.phaseOptions
            : [];
          const selectedPhase = safeOptions.find(
            (p) => String(p.value).toLowerCase() === String(targetPhaseId).toLowerCase()
          );

          await updateGroup(groupId, {
            groupName: values.groupName,
            description: values.description,
            mentorId: values.mentorId,
            enterpriseId: enterpriseId || group.enterpriseId || selectedPhase?.enterpriseId,
            startDate: values.startDate || group.startDate || selectedPhase?.startDate,
            endDate: values.endDate || group.endDate || selectedPhase?.endDate,
            phaseId: targetPhaseId,
            internshipPhaseId: targetPhaseId,
          });
        }

        setEditModal({ open: false, group: null, isAddingStudents: false });
      } catch (err) {
        console.error('Failed to update group:', err);
      }
    },
    [
      editModal,
      updateGroup,
      addGroupStudents,
      removeStudents,
      enterpriseId,
      groupFilters.phaseOptions,
    ]
  );

  const handleRemoveStudentFromGroup = useCallback(
    async (groupId, studentId) => {
      try {
        const { ACTIONS } = GROUP_MANAGEMENT;
        showDeleteConfirm({
          title: ACTIONS.REMOVE_STUDENT || 'Remove Student',
          content: 'Are you sure you want to remove this student from the group?',
          okText: 'Remove',
          onOk: async () => {
            await removeStudents(groupId, [studentId]);
            if (selectedGroupDetail?.id === groupId) {
              handleViewGroup(selectedGroupDetail);
            }
          },
        });
      } catch {
        toast.error('Failed to remove student');
      }
    },
    [removeStudents, selectedGroupDetail, handleViewGroup, toast, GROUP_MANAGEMENT]
  );

  return {
    filteredGroups: data,
    activeTab: groupFilters.filters.status !== null ? groupFilters.filters.status : 'ALL',
    setActiveTab: (val) => groupFilters.handleFilterChange('status', val === 'ALL' ? null : val),
    search: groupFilters.searchValue,
    setSearch: groupFilters.handleSearch,
    total,
    loading: loading || actionLoading,
    assignModal,
    setAssignModal,
    handleViewGroup,
    createModal,
    setCreateModal,
    editModal,
    setEditModal,
    unassignedStudents,
    fetchingStudents,
    handleAssignSubmit,
    handleDeleteGroup,
    handleArchiveGroup,
    handleCreateGroup,
    handleUpdateGroup,
    handleRemoveStudentFromGroup,
    mentors,
    loadingMentors,
    phaseId: groupFilters.phaseId,
    setPhaseId: groupFilters.setPhaseId,
    phaseOptions: groupFilters.phaseOptions,
    fetchingPhases: groupFilters.fetchingPhases,
    pagination: groupFilters.pagination,
    handleTableChange: (page, filter, sorter) =>
      groupFilters.handleTableChange(page, filter, sorter),
    handlePageSizeChange: (size) => groupFilters.handleTableChange({ current: 1, pageSize: size }),
    isPhaseEditable:
      groupFilters.phaseId === 'ALL_VISIBLE' ||
      (groupFilters.phaseId &&
        [1, 2].includes(
          (Array.isArray(groupFilters.phaseOptions) ? groupFilters.phaseOptions : []).find(
            (p) => p.value === groupFilters.phaseId
          )?.status
        )),
    filters: groupFilters.filters,
    handleFilterChange: groupFilters.handleFilterChange,
    selectedGroupDetail,
    setSelectedGroupDetail,
    isAutoSelecting,
  };
};

'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { showDeleteConfirm } from '@/components/ui/deleteconfirm';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { useToast } from '@/providers/ToastProvider';

import { EnterpriseMentorService } from '../../internship-student-management/services/enterprise-mentor.service';
import { EnterpriseStudentService } from '../../internship-student-management/services/enterprise-student.service';
import { userService } from '../../user/services/user.service';
import { ENTERPRISE_GROUP_UI } from '../constants/enterprise-group.constants';
import { useEnterpriseGroupActions } from '../hooks/useEnterpriseGroupActions';
import { useEnterpriseGroupFilters } from '../hooks/useEnterpriseGroupFilters';
import { useEnterpriseGroups } from '../hooks/useEnterpriseGroups';
import { EnterpriseGroupService } from '../services/enterprise-group.service';

export const useGroupManagement = () => {
  const toast = useToast();
  const searchParams = useSearchParams();
  const urlGroupId = searchParams.get('groupId');
  const filters = useEnterpriseGroupFilters();
  const { MESSAGES } = ENTERPRISE_GROUP_UI;

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
    staleTime: Infinity, // User info doesn't change often
  });

  // 2. Main Group Data Fetching (Already refactored to React Query internally)
  const { data, total, loading, refetch } = useEnterpriseGroups({
    phaseId: filters.phaseId,
    filters: filters.filters,
    search: filters.debouncedSearch,
    pagination: filters.pagination,
    sort: filters.sort,
    phaseOptions: filters.phaseOptions,
  });

  // 3. Fetch Mentors
  const { data: mentors = [], isLoading: loadingMentors } = useQuery({
    queryKey: ['enterprise-mentors'],
    queryFn: async () => {
      try {
        const roles = [6];
        const results = await Promise.allSettled(
          roles.map((r) => EnterpriseMentorService.getMentors({ Role: r, PageSize: 100 }))
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
    queryKey: ['unassigned-students', filters.phaseId],
    queryFn: async () => {
      let targetPhaseId = filters.phaseId;
      const isAllVisible = targetPhaseId === 'ALL_VISIBLE' || !targetPhaseId;

      try {
        const res = await EnterpriseGroupService.getPlacedStudents({
          PhaseId: isAllVisible ? undefined : targetPhaseId,
          PageIndex: 1,
          PageSize: 1000,
        });
        const items = res?.data?.items || res.items || [];
        const mappedItems = items.map(EnterpriseStudentService.mapApplication);

        return mappedItems.filter((s) => {
          if (s.groupId) return false;
          const phase = filters.phaseOptions.find((p) => p.value === s.phaseId);
          return phase ? phase.status === 1 : false;
        });
      } catch {
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
  } = useEnterpriseGroupActions(refetch);

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
          toast.warning(ENTERPRISE_GROUP_UI.MESSAGES.DELETE_ERROR_HAS_DATA, { duration: 6 });
          return;
        }

        const content = hasStudents
          ? ENTERPRISE_GROUP_UI.MESSAGES.DELETE_CONFIRM_HAS_STUDENTS
          : ENTERPRISE_GROUP_UI.MODALS.DELETE.CONTENT;

        showDeleteConfirm({
          title: ENTERPRISE_GROUP_UI.MODALS.DELETE.TITLE,
          content,
          okText: ENTERPRISE_GROUP_UI.MODALS.DELETE.SUBMIT,
          onOk: async () => {
            await deleteGroup(group.id);
          },
        });
      } catch {
        toast.error(MESSAGES.CHECK_DATA_ERROR);
      }
    },
    [deleteGroup, toast, MESSAGES.CHECK_DATA_ERROR]
  );

  const handleArchiveGroup = useCallback(
    (group) => {
      showDeleteConfirm({
        title: ENTERPRISE_GROUP_UI.MODALS.ARCHIVE.TITLE,
        content: ENTERPRISE_GROUP_UI.MODALS.ARCHIVE.CONTENT,
        okText: ENTERPRISE_GROUP_UI.MODALS.ARCHIVE.SUBMIT,
        type: 'warning',
        onOk: async () => {
          await archiveGroup(group.id);
        },
      });
    },
    [archiveGroup]
  );

  const handleCreateGroup = useCallback(
    async (payload) => {
      let targetPhaseId = filters.phaseId;

      if (targetPhaseId === 'ALL_VISIBLE' || !targetPhaseId) {
        targetPhaseId = payload.phaseId || payload.termId;
      }

      if (!targetPhaseId && payload.students?.[0]?.studentId) {
        const firstStudentId = payload.students[0].studentId;
        const studentInfo = unassignedStudents.find(
          (s) => String(s.studentId || s.id || s.applicationId) === String(firstStudentId)
        );
        targetPhaseId = studentInfo?.phaseId || studentInfo?.termId;
      }

      await createGroup({
        ...payload,
        phaseId: targetPhaseId,
        internshipPhaseId: targetPhaseId,
        enterpriseId: enterpriseId,
      });
      setCreateModal({ open: false, group: null });
    },
    [createGroup, filters.phaseId, enterpriseId, unassignedStudents]
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
            await EnterpriseGroupService.removeStudents(groupId, toRemove);
            toRemove.forEach((sid) => {
              const student = oldMembers.find(
                (m) => String(m.studentId || m.id || m.applicationId) === String(sid)
              );
              if (student) {
                toast.info(
                  `${student.fullName || student.studentFullName} đã bị xóa khỏi nhóm. Sinh viên không còn truy cập được các dự án của nhóm.`,
                  { duration: 5 }
                );
              }
            });
          }
          if (toAdd.length > 0) {
            await EnterpriseGroupService.addStudents(groupId, toAdd);
          }
        }

        if (editModal.isAddingStudents) {
          if (values.studentIds?.length > 0) {
            const studentsToUpdate = values.studentIds.map((id) => ({
              studentId: id,
              role: 1,
            }));
            await addGroupStudents(groupId, studentsToUpdate);
          }
        } else {
          const targetPhaseId = group.phaseId || group.termId || group.internshipPhaseId;

          await updateGroup(groupId, {
            groupName: values.groupName,
            description: values.description,
            mentorId: values.mentorId,
            enterpriseId: enterpriseId || group.enterpriseId,
            startDate: values.startDate || group.startDate,
            endDate: values.endDate || group.endDate,
            phaseId: targetPhaseId,
            internshipPhaseId: targetPhaseId,
          });
        }

        setEditModal({ open: false, group: null, isAddingStudents: false });
      } catch {
        // Handled
      }
    },
    [editModal, updateGroup, addGroupStudents, enterpriseId, toast]
  );

  const handleRemoveStudentFromGroup = useCallback(
    async (groupId, studentId) => {
      try {
        const { MODALS } = INTERNSHIP_MANAGEMENT_UI.INTERNSHIP_LIST;
        showDeleteConfirm({
          title: MODALS.GROUP_ACTION.REMOVE_STUDENT_TITLE || 'Remove Student',
          content:
            MODALS.GROUP_ACTION.REMOVE_STUDENT_CONTENT ||
            'Are you sure you want to remove this student from the group?',
          okText: MODALS.GROUP_ACTION.REMOVE_CONFIRM || 'Remove',
          onOk: async () => {
            const success = await removeStudents(groupId, [studentId]);
            if (success) {
              toast.info(
                'Sinh viên đã bị xóa khỏi nhóm. Sinh viên không còn truy cập được các dự án của nhóm.',
                { duration: 5 }
              );

              if (selectedGroupDetail?.id === groupId) {
                handleViewGroup(selectedGroupDetail);
              }
            }
          },
        });
      } catch {
        toast.error('Failed to remove student');
      }
    },
    [removeStudents, selectedGroupDetail, handleViewGroup, toast]
  );

  return {
    filteredGroups: data,
    activeTab: filters.filters.status !== null ? filters.filters.status : 'ALL',
    setActiveTab: (val) => filters.handleFilterChange('status', val === 'ALL' ? null : val),
    search: filters.searchValue,
    setSearch: filters.handleSearch,
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
    phaseId: filters.phaseId,
    setPhaseId: filters.setPhaseId,
    phaseOptions: filters.phaseOptions,
    fetchingPhases: filters.fetchingPhases,
    pagination: filters.pagination,
    handleTableChange: (page, filter, sorter) => filters.handleTableChange(page, filter, sorter),
    handlePageSizeChange: (size) => filters.handleTableChange({ current: 1, pageSize: size }),
    isPhaseEditable:
      filters.phaseId === 'ALL_VISIBLE' ||
      (filters.phaseId &&
        [1, 2].includes(filters.phaseOptions.find((p) => p.value === filters.phaseId)?.status)),
    filters: filters.filters,
    handleFilterChange: filters.handleFilterChange,
    selectedGroupDetail,
    setSelectedGroupDetail,
    isAutoSelecting,
  };
};

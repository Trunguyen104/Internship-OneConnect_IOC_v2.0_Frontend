'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { showDeleteConfirm } from '@/components/ui/deleteconfirm';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { useToast } from '@/providers/ToastProvider';

import { EnterpriseMentorService } from '../../internship-student-management/services/enterprise-mentor.service';
import { EnterpriseStudentService } from '../../internship-student-management/services/enterprise-student.service';
import { userService } from '../../user/services/userService';
import { ENTERPRISE_GROUP_UI } from '../constants/enterprise-group.constants';
import { useEnterpriseGroupActions } from '../hooks/useEnterpriseGroupActions';
import { useEnterpriseGroupFilters } from '../hooks/useEnterpriseGroupFilters';
import { useEnterpriseGroups } from '../hooks/useEnterpriseGroups';
import { EnterpriseGroupService } from '../services/enterprise-group.service';

export const useGroupManagement = () => {
  const toast = useToast();
  const filters = useEnterpriseGroupFilters();
  const [enterpriseId, setEnterpriseId] = useState(null);
  const { MESSAGES } = ENTERPRISE_GROUP_UI;

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await userService.getMe();
        const data = res?.data || res;
        setEnterpriseId(data?.enterpriseId || data?.enterprise_id || data?.enterpriseID);
      } catch (err) {
        // Silent error
      }
    };
    fetchMe();
  }, []);

  // Real data fetching
  const { data, total, loading, refetch } = useEnterpriseGroups({
    phaseId: filters.phaseId, // Will be undefined initially, API will fetch all/current
    filters: filters.filters,
    search: filters.debouncedSearch,
    pagination: filters.pagination,
    sort: filters.sort,
    phaseOptions: filters.phaseOptions,
  });

  const [mentors, setMentors] = useState([]);
  const [loadingMentors, setLoadingMentors] = useState(false);

  const fetchMentors = useCallback(async () => {
    try {
      setLoadingMentors(true);
      // Fetch multiple roles that can act as mentors (4: Admin, 5: HR, 6: Mentor)
      const roles = [6];
      // Use allSettled so if one role (e.g. role 4) is forbidden, we still get others
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

      // Remove duplicates based on userId/id
      const uniqueItems = Array.from(
        new Map(allItems.map((item) => [item?.userId || item?.UserId || item?.id, item])).values()
      ).filter(Boolean);

      setMentors(uniqueItems);
    } catch (err) {
      setMentors([]);
    } finally {
      setLoadingMentors(false);
    }
  }, []);

  useEffect(() => {
    fetchMentors();
  }, [fetchMentors]);

  // Listen for global group refresh events
  useEffect(() => {
    const handleRefresh = () => {
      refetch();
    };
    window.addEventListener(INTERNSHIP_MANAGEMENT_UI.GROUP_MANAGEMENT.REFRESH_EVENT, handleRefresh);
    return () =>
      window.removeEventListener(
        INTERNSHIP_MANAGEMENT_UI.GROUP_MANAGEMENT.REFRESH_EVENT,
        handleRefresh
      );
  }, [refetch]);

  const {
    createGroup,
    updateGroup,
    archiveGroup,
    removeStudents,
    addStudents: addGroupStudents,
    deleteGroup,
    loading: actionLoading,
  } = useEnterpriseGroupActions(refetch);

  const [assignModal, setAssignModal] = useState({ open: false, group: null });
  const [createModal, setCreateModal] = useState({ open: false, group: null });
  const [editModal, setEditModal] = useState({ open: false, group: null });
  const [unassignedStudents, setUnassignedStudents] = useState([]);
  const [fetchingStudents, setFetchingStudents] = useState(false);
  const [selectedGroupDetail, setSelectedGroupDetail] = useState(null);
  const router = useRouter();

  const handleViewGroup = useCallback((group) => {
    setSelectedGroupDetail(group);
  }, []);

  const fetchUnassignedStudents = useCallback(async () => {
    let targetPhaseId = filters.phaseId;

    // Handle 'ALL_VISIBLE' or empty phaseId
    const isAllVisible = targetPhaseId === 'ALL_VISIBLE' || !targetPhaseId;

    try {
      setFetchingStudents(true);
      const res = await EnterpriseGroupService.getPlacedStudents({
        PhaseId: isAllVisible ? undefined : targetPhaseId,
        PageIndex: 1,
        PageSize: 1000, // Fetch more for 'full list'
      });
      const items = res?.data?.items || res.items || [];
      const mappedItems = items.map(EnterpriseStudentService.mapApplication);

      // Filter: Unassigned AND Phase Status is 1 (Open)
      const unassigned = mappedItems.filter((s) => {
        if (s.groupId) return false;

        // Find phase status from phaseOptions
        const phase = filters.phaseOptions.find((p) => p.value === s.phaseId);
        return phase ? phase.status === 1 : false;
      });

      setUnassignedStudents(unassigned);
    } catch (err) {
      // Silent error
    } finally {
      setFetchingStudents(false);
    }
  }, [filters.phaseId]);

  useEffect(() => {
    if (createModal.open || editModal.open) {
      fetchUnassignedStudents();
    }
  }, [createModal.open, editModal.open, fetchUnassignedStudents]);

  const handleAssignSubmit = useCallback(
    async (values) => {
      const { group } = assignModal;
      if (!group) return;
      // Assign mentor and project name via updateGroup
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
      } catch (err) {
        toast.error(MESSAGES.CHECK_DATA_ERROR);
      }
    },
    [deleteGroup, toast]
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

      // If in "All Phases" view, respect the phaseId from the payload (modal)
      if (targetPhaseId === 'ALL_VISIBLE' || !targetPhaseId) {
        targetPhaseId = payload.phaseId || payload.termId;
      }

      // Secondary fallback: find the phaseId from unassignedStudents list using the first studentId in payload
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
        internshipPhaseId: targetPhaseId, // Extended compatibility
        enterpriseId: enterpriseId,
      });
      setCreateModal({ open: false, group: null });
    },
    [createGroup, filters.phaseId, enterpriseId]
  );

  const handleUpdateGroup = useCallback(
    async (values) => {
      const { group } = editModal;
      if (!group) return;

      const groupId = group.internshipId || group.id || group.groupId;

      try {
        // 1. Sync students ONLY if they were provided AND we are NOT in addingStudents mode
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
            // AC-11 Case 2: Notify about removal
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

        // 2. Branch: Add Students vs. Update Group Info
        if (editModal.isAddingStudents) {
          if (values.studentIds?.length > 0) {
            // Map student IDs to required format { studentId, role }
            const studentsToUpdate = values.studentIds.map((id) => ({
              studentId: id,
              role: 1,
            }));
            await addGroupStudents(groupId, studentsToUpdate);
          }
        } else {
          // Normalize Phase ID compatibility
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
      } catch (err) {
        // Error already handled by useEnterpriseGroupActions toast
      }
    },
    [editModal, updateGroup, addGroupStudents, enterpriseId]
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
              // AC-11 Case 2: Notify about removal
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
      } catch (err) {
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
  };
};

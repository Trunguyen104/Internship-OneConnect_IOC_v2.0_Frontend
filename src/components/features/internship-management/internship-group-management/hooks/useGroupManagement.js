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
  const formatISO = (dateStr) => {
    if (!dateStr) return null;
    try {
      return new Date(dateStr).toISOString();
    } catch {
      return null;
    }
  };

  // 1. Fetch Me Info
  const { data: enterpriseId } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      try {
        const res = await userService.getMe();
        const data = res?.data || res;
        return (
          data?.enterpriseId ||
          data?.enterprise_id ||
          data?.enterpriseID ||
          data?.enterprise?.id ||
          data?.enterprise?.enterpriseId
        );
      } catch {
        return null;
      }
    },
    staleTime: 0, // Always check user identity on mount
  });

  // 2. Main Group Data Fetching
  const { data, total, loading } = useEnterpriseGroups({
    phaseId: groupFilters.phaseId,
    filters: groupFilters.filters,
    search: groupFilters.debouncedSearch,
    pagination: groupFilters.pagination,
    sort: groupFilters.sort,
    phaseOptions: groupFilters.phaseOptions,
  });

  // 3. Fetch Mentors - Aligned with Backend (Self-identifies enterprise via HR login)
  const { data: mentors = [], isLoading: loadingMentors } = useQuery({
    queryKey: ['enterprise-mentors-final-revert', enterpriseId],
    queryFn: async () => {
      try {
        // Pass enterpriseId explicitly to filter by the current company
        console.log('>>> [DEBUG] Fetching mentors for enterpriseId:', enterpriseId);
        if (!enterpriseId) return [];
        // Pass all possible context IDs to help backend identify the enterprise on fresh refresh
        const res = await EnterpriseMentorService.getMentors({
          Role: 6,
          UnitId: String(enterpriseId),
          unitId: String(enterpriseId),
          EnterpriseId: String(enterpriseId),
          enterpriseId: String(enterpriseId),
          PhaseId: groupFilters.phaseId !== 'ALL_VISIBLE' ? groupFilters.phaseId : undefined,
          PageSize: 100,
        });
        const data = res?.data || res;
        const allItems = data?.items || data?.Items || (Array.isArray(data) ? data : []);
        console.log('>>> [DIAGNOSIS] Raw users from server:', allItems.length);

        const identified = allItems.filter((m) => String(m.role || m.Role) === '6');

        return identified.map((m) => ({
          label: `${m.fullName || m.name}`,
          value: m.userId || m.UserId,
          ...m,
        }));
      } catch (_error) {
        return [];
      }
    },
    enabled: enterpriseId !== null && enterpriseId !== undefined && enterpriseId !== '',
    placeholderData: [],
    staleTime: 0,
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
          PageSize: 100,
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
      if (!group || !values.mentorId) return;

      const groupId = group.internshipId || group.id || group.groupId;
      const targetPhaseId = group.phaseId || group.termId || group.internshipPhaseId;
      const safeOptions = Array.isArray(groupFilters.phaseOptions) ? groupFilters.phaseOptions : [];
      const selectedPhase = safeOptions.find(
        (p) => String(p.value).toLowerCase() === String(targetPhaseId).toLowerCase()
      );

      const currentEnterpriseId =
        enterpriseId || group.enterpriseId || group.unitId || selectedPhase?.enterpriseId;

      await updateGroup(groupId, {
        phaseId: targetPhaseId,
        groupName: group.groupName || group.name,
        description: group.description || group.Description || null,
        enterpriseId: currentEnterpriseId,
        mentorId: values.mentorId,
        startDate: formatISO(group.startDate || selectedPhase?.startDate),
        endDate: formatISO(group.endDate || selectedPhase?.endDate),
      });

      setAssignModal({ open: false, group: null });
    },
    [assignModal, updateGroup, enterpriseId, groupFilters.phaseOptions]
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
      const safeOptions = Array.isArray(groupFilters.phaseOptions) ? groupFilters.phaseOptions : [];
      let targetPhaseId = payload.phaseId || groupFilters.phaseId;

      const firstStudentId = payload.students?.[0]?.studentId;
      const studentInfo = (unassignedStudents || []).find(
        (s) =>
          String(s.studentId || s.id || s.applicationId || s.StudentId) === String(firstStudentId)
      );

      // Nếu không chọn phase cụ thể, ưu tiên lấy từ sinh viên
      if (targetPhaseId === 'ALL_VISIBLE' || !targetPhaseId) {
        targetPhaseId =
          studentInfo?.phaseId ||
          studentInfo?.termId ||
          studentInfo?.internshipPhaseId ||
          safeOptions.find((p) => p.status === 1)?.value;
      }

      const selectedPhase = safeOptions.find(
        (p) => String(p.value).toLowerCase() === String(targetPhaseId).toLowerCase()
      );

      const currentEnterpriseId =
        enterpriseId ||
        studentInfo?.enterpriseId ||
        studentInfo?.unitId ||
        selectedPhase?.enterpriseId;

      const finalPayload = {
        phaseId: targetPhaseId,
        groupName: payload.groupName,
        description: payload.description || null,
        enterpriseId: currentEnterpriseId,
        mentorId: payload.mentorId || null,
        startDate: formatISO(
          payload.startDate || studentInfo?.phaseStartDate || selectedPhase?.startDate
        ),
        endDate: formatISO(payload.endDate || studentInfo?.phaseEndDate || selectedPhase?.endDate),
        students: payload.students || [],
      };

      console.log('>>> DEBUG Payload (Post ISO):', JSON.stringify(finalPayload, null, 2));

      await createGroup(finalPayload);
      setCreateModal({ open: false, group: null });
    },
    [createGroup, groupFilters.phaseId, groupFilters.phaseOptions, enterpriseId, toast]
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

          // Extract IDs from objects if necessary, as AddStudentsTable emits full student objects
          const selectedIds = (values.studentIds || []).map((s) =>
            typeof s === 'object' ? s.studentId || s.id || s.applicationId : s
          );

          const newIds = selectedIds.filter((id) => id && !oldIds.has(String(id)));

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

          const currentEnterpriseId =
            enterpriseId || group.enterpriseId || group.unitId || selectedPhase?.enterpriseId;

          await updateGroup(groupId, {
            phaseId: targetPhaseId,
            groupName: values.groupName || group.groupName || group.name,
            description: values.description || group.description || null,
            enterpriseId: currentEnterpriseId,
            mentorId: values.mentorId || null,
            startDate: formatISO(values.startDate || group.startDate || selectedPhase?.startDate),
            endDate: formatISO(values.endDate || group.endDate || selectedPhase?.endDate),
            // For updates, the student list might be handled by separate calls if needed,
            // but matching the schema:
            students: values.students || undefined,
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
      unassignedStudents,
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

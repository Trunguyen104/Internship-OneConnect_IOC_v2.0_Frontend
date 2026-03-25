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
    termId: filters.termId, // Will be undefined initially, API will fetch all/current
    filters: filters.filters,
    search: filters.debouncedSearch,
    pagination: filters.pagination,
    sort: filters.sort,
    termOptions: filters.termOptions,
  });

  const [mentors, setMentors] = useState([]);
  const [loadingMentors, setLoadingMentors] = useState(false);

  const fetchMentors = useCallback(async () => {
    try {
      setLoadingMentors(true);
      const res = await EnterpriseMentorService.getMentors({ PageSize: 100 });
      const items = res?.data?.items || res?.data || res?.items || [];
      console.log('Fetched mentors:', items);
      setMentors(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error('Fetch mentors failed:', err);
      setMentors([]);
    } finally {
      setLoadingMentors(false);
    }
  }, [toast]);

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
    moveStudents,
    removeStudents,
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
    let targetTermId = filters.termId;

    // If 'ALL_ACTIVE', try to find the first real term GUID from options
    if (targetTermId === 'ALL_ACTIVE' && filters.termOptions.length > 1) {
      // Find the first option that isn't 'ALL_ACTIVE'
      const firstRealTerm = filters.termOptions.find((o) => o.value !== 'ALL_ACTIVE');
      if (firstRealTerm) targetTermId = firstRealTerm.value;
    }

    if (!targetTermId || targetTermId === 'ALL_ACTIVE') return;

    try {
      setFetchingStudents(true);
      const res = await EnterpriseGroupService.getPlacedStudents({
        TermId: targetTermId,
        PageIndex: 1,
        PageSize: 100,
      });
      const items = res?.data?.items || res.items || [];
      console.log('Fetched placed students:', items);

      const mappedItems = items.map(EnterpriseStudentService.mapApplication);
      const unassigned = mappedItems.filter((s) => !s.groupId);

      console.log('Unassigned students after filter:', unassigned);
      setUnassignedStudents(unassigned);
    } catch (err) {
      console.error('Fetch unassigned failed:', err);
    } finally {
      setFetchingStudents(false);
    }
  }, [filters.termId, filters.termOptions]);

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
    (group) => {
      showDeleteConfirm({
        title: ENTERPRISE_GROUP_UI.MODALS.DELETE.TITLE,
        content: ENTERPRISE_GROUP_UI.MODALS.DELETE.CONTENT,
        okText: ENTERPRISE_GROUP_UI.MODALS.DELETE.SUBMIT,
        onOk: async () => {
          await deleteGroup(group.id, group.memberCount || 0);
        },
      });
    },
    [deleteGroup]
  );

  const handleArchiveGroup = useCallback(
    (group) => {
      showDeleteConfirm({
        title: ENTERPRISE_GROUP_UI.MODALS.ARCHIVE.TITLE,
        content: ENTERPRISE_GROUP_UI.MODALS.ARCHIVE.CONTENT,
        okText: ENTERPRISE_GROUP_UI.MODALS.ARCHIVE.SUBMIT,
        type: 'warning',
        onOk: async () => {
          await archiveGroup(group.id, group.memberCount || 0);
        },
      });
    },
    [archiveGroup]
  );

  const handleCreateGroup = useCallback(
    async (payload) => {
      let targetTermId = filters.termId;
      if (targetTermId === 'ALL_ACTIVE' && filters.termOptions.length > 1) {
        const firstRealTerm = filters.termOptions.find((o) => o.value !== 'ALL_ACTIVE');
        if (firstRealTerm) targetTermId = firstRealTerm.value;
      }

      await createGroup({
        ...payload,
        termId: targetTermId,
        enterpriseId: enterpriseId,
      });
      setCreateModal({ open: false, group: null });
    },
    [createGroup, filters.termId, filters.termOptions, enterpriseId]
  );

  const handleUpdateGroup = useCallback(
    async (values) => {
      const { group } = editModal;
      if (!group) return;

      const groupId = group.id || group.groupId;

      try {
        // 1. Sync students ONLY if they were provided in the payload (not hidden in UI)
        if (values.students !== undefined) {
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
          }
          if (toAdd.length > 0) {
            await EnterpriseGroupService.addStudents(groupId, toAdd);
          }
        }

        // 2. Update group basic info
        await updateGroup(groupId, {
          name: values.groupName,
          description: values.description,
          mentorId: values.mentorId,
          startDate: values.startDate,
          endDate: values.endDate,
          termId: filters.termId === 'ALL_ACTIVE' ? group.termId : filters.termId,
        });

        setEditModal({ open: false, group: null });
      } catch (err) {
        // Error already handled by useEnterpriseGroupActions toast
      }
    },
    [editModal, updateGroup, filters.termId, filters.termOptions]
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
    termId: filters.termId,
    setTermId: filters.setTermId,
    termOptions: filters.termOptions,
    fetchingTerms: filters.fetchingTerms,
    pagination: filters.pagination,
    handleTableChange: (page, filter, sorter) => filters.handleTableChange(page, filter, sorter),
    handlePageSizeChange: (size) => filters.handleTableChange({ current: 1, pageSize: size }),
    isTermEditable:
      filters.termId === 'ALL_ACTIVE' ||
      (filters.termId && filters.termOptions.find((t) => t.value === filters.termId)?.status === 2),
    filters: filters.filters,
    handleFilterChange: filters.handleFilterChange,
    selectedGroupDetail,
    setSelectedGroupDetail,
  };
};

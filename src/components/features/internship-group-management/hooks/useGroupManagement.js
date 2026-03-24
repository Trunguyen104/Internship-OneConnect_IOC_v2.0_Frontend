'use client';

import { useCallback, useEffect, useState } from 'react';

import { showDeleteConfirm } from '@/components/ui/deleteconfirm';

import { EnterpriseMentorService } from '../../internship-student-management/services/enterprise-mentor.service';
import { EnterpriseStudentService } from '../../internship-student-management/services/enterprise-student.service';
import { userService } from '../../user/services/userService';
import { ENTERPRISE_GROUP_UI } from '../constants/enterprise-group.constants';
import { useEnterpriseGroupActions } from '../hooks/useEnterpriseGroupActions';
import { useEnterpriseGroupFilters } from '../hooks/useEnterpriseGroupFilters';
import { useEnterpriseGroups } from '../hooks/useEnterpriseGroups';
import { EnterpriseGroupService } from '../services/enterprise-group.service';

export const useGroupManagement = () => {
  const filters = useEnterpriseGroupFilters();
  const [enterpriseId, setEnterpriseId] = useState(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await userService.getMe();
        const data = res?.data || res;
        setEnterpriseId(data?.enterpriseId || data?.enterprise_id || data?.enterpriseID);
      } catch (err) {
        console.error('Failed to fetch user info:', err);
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
      setMentors(items);
    } catch (err) {
      console.error('Failed to fetch mentors:', err);
      setMentors([]);
    } finally {
      setLoadingMentors(false);
    }
  }, []);

  useEffect(() => {
    fetchMentors();
  }, [fetchMentors]);

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
  const [viewModal, setViewModal] = useState({ open: false, group: null, loading: false });
  const [createModal, setCreateModal] = useState({ open: false, group: null });
  const [editModal, setEditModal] = useState({ open: false, group: null });
  const [unassignedStudents, setUnassignedStudents] = useState([]);
  const [fetchingStudents, setFetchingStudents] = useState(false);

  const fetchUnassignedStudents = useCallback(async () => {
    if (!filters.termId) return;
    try {
      setFetchingStudents(true);
      const res = await EnterpriseStudentService.getApplications({
        TermId: filters.termId,
        Status: 2, // Approved (Placed)
        PageIndex: 1,
        PageSize: 100,
      });
      const items = res?.data?.items || [];
      // Filter for approved students without a group
      const unassigned = items
        .filter((s) => s.status === 2 && !s.groupId)
        .map(EnterpriseStudentService.mapApplication);
      setUnassignedStudents(unassigned);
    } catch (err) {
      console.error('Failed to fetch unassigned students:', err);
    } finally {
      setFetchingStudents(false);
    }
  }, [filters.termId]);

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
      await createGroup({
        ...payload,
        termId: filters.termId,
        enterpriseId: enterpriseId,
      });
      setCreateModal({ open: false, group: null });
    },
    [createGroup, filters.termId, enterpriseId]
  );

  const handleUpdateGroup = useCallback(
    async (values) => {
      const { group } = editModal;
      if (!group) return;
      await updateGroup(group.id, {
        ...values,
        termId: filters.termId,
      });
      setEditModal({ open: false, group: null });
    },
    [editModal, updateGroup, filters.termId]
  );

  const handleViewGroup = useCallback(async (group) => {
    try {
      setViewModal({ open: true, group, loading: true });
      const res = await EnterpriseGroupService.getGroupDetail(group.id);
      const detailedGroup = res?.data || res;

      // Map members data to ensure it matches ViewGroupModal expectations
      const members = (detailedGroup.members || detailedGroup.students || []).map((s) => ({
        id: s.studentId || s.id || s.applicationId,
        fullName: s.studentFullName || s.fullName || s.name || 'Unknown',
        code: s.studentCode || s.code || '-',
        email: s.email || '-',
        avatar: s.avatar,
        universityName: s.universityName || s.schoolName || s.university || '-',
      }));

      setViewModal({
        open: true,
        group: {
          ...group,
          ...detailedGroup,
          description: detailedGroup.description || detailedGroup.Description || '-',
          mentorEmail: detailedGroup.mentorEmail || detailedGroup.MentorEmail || '',
          members,
        },
        loading: false,
      });
    } catch (err) {
      console.error('Failed to fetch group details:', err);
      setViewModal({ open: true, group, loading: false });
    }
  }, []);

  const handleRemoveStudentFromGroup = useCallback(
    async (groupId, studentId) => {
      try {
        showDeleteConfirm({
          title: 'Delete Student',
          content:
            'Are you sure you want to remove this student from the group? This action will only remove the student from the group, it will not change the Placed status.',
          okText: 'Delete',
          onOk: async () => {
            const success = await removeStudents(groupId, [studentId]);
            if (success) {
              // Refresh group detail if modal is open
              if (viewModal.open && viewModal.group?.id === groupId) {
                handleViewGroup(viewModal.group);
              }
            }
          },
        });
      } catch (err) {
        console.error('Failed to remove student:', err);
      }
    },
    [removeStudents, viewModal.open, viewModal.group, handleViewGroup]
  );

  return {
    filteredGroups: data,
    existingGroups: data,
    activeTab: filters.filters.status !== null ? filters.filters.status : 'ALL',
    setActiveTab: (val) => filters.handleFilterChange('status', val === 'ALL' ? null : val),
    search: filters.searchValue,
    setSearch: filters.handleSearch,
    total,
    loading: loading || actionLoading,
    assignModal,
    setAssignModal,
    viewModal,
    setViewModal: (val) => setViewModal(val),
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
  };
};

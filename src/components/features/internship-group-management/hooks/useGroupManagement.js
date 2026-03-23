'use client';

import { useCallback, useEffect, useState } from 'react';

import { showDeleteConfirm } from '@/components/ui/deleteconfirm';

import { EnterpriseStudentService } from '../../internship-student-management/services/enterprise-student.service';
import { ENTERPRISE_GROUP_UI } from '../constants/enterprise-group.constants';
import { useEnterpriseGroupActions } from '../hooks/useEnterpriseGroupActions';
import { useEnterpriseGroupFilters } from '../hooks/useEnterpriseGroupFilters';
import { useEnterpriseGroups } from '../hooks/useEnterpriseGroups';

export const useGroupManagement = () => {
  const filters = useEnterpriseGroupFilters();

  // Real data fetching
  const { data, total, loading, refetch } = useEnterpriseGroups({
    termId: filters.termId, // Will be undefined initially, API will fetch all/current
    filters: filters.filters,
    search: filters.debouncedSearch,
    pagination: filters.pagination,
    sort: filters.sort,
  });

  const {
    createGroup,
    updateGroup,
    archiveGroup,
    moveStudents,
    deleteGroup,
    loading: actionLoading,
  } = useEnterpriseGroupActions(refetch);

  const [assignModal, setAssignModal] = useState({ open: false, group: null });
  const [viewModal, setViewModal] = useState({ open: false, group: null });
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState({ open: false, group: null });
  const [unassignedStudents, setUnassignedStudents] = useState([]);
  const [fetchingStudents, setFetchingStudents] = useState(false);

  const fetchUnassignedStudents = useCallback(async () => {
    try {
      setFetchingStudents(true);
      const res = await EnterpriseStudentService.getApplications({
        TermId: filters.termId || undefined,
        Status: 1, // Approved (which equals Placed)
        PageIndex: 1,
        PageSize: 100,
      });
      const items = res?.data?.items || [];
      // Filter for approved students without a group
      const unassigned = items
        .filter((s) => s.status === 1 && !s.groupId)
        .map(EnterpriseStudentService.mapApplication);
      setUnassignedStudents(unassigned);
    } catch (err) {
      console.error('Failed to fetch unassigned students:', err);
    } finally {
      setFetchingStudents(false);
    }
  }, [filters.termId]);

  useEffect(() => {
    if (createModal || editModal.open) {
      fetchUnassignedStudents();
    }
  }, [createModal, editModal.open, fetchUnassignedStudents]);

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
          await archiveGroup(group.id);
        },
      });
    },
    [archiveGroup]
  );

  const handleCreateGroup = useCallback(
    async (values) => {
      const studentIds = values.students || [];

      const payload = {
        name: values.name,
        track: values.track,
        description: values.description,
        termId: filters.termId,
        mentorId: values.mentorId,
        students: studentIds.map((id) => ({
          studentId: id,
          role: 1, // Member default
        })),
      };

      await createGroup(payload);
      setCreateModal(false);
    },
    [createGroup, filters.termId]
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
    viewModal,
    setViewModal,
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
    termId: filters.termId,
    setTermId: filters.setTermId,
    termOptions: filters.termOptions,
    fetchingTerms: filters.fetchingTerms,
    pagination: filters.pagination,
    handleTableChange: (page, filter, sorter) => filters.handleTableChange(page, filter, sorter),
    handlePageSizeChange: (size) => filters.handleTableChange({ current: 1, pageSize: size }),
    isTermEditable:
      filters.termId && filters.termOptions.find((t) => t.value === filters.termId)?.status < 3,
  };
};

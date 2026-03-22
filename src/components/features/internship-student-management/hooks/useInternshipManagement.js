import { useCallback, useEffect, useState } from 'react';

import { showDeleteConfirm } from '@/components/ui/deleteconfirm';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { useToast } from '@/providers/ToastProvider';

import { useEnterpriseGroupActions } from '../../internship-group-management/hooks/useEnterpriseGroupActions';
import { useEnterpriseStudentActions } from '../hooks/useEnterpriseStudentActions';
import { useEnterpriseStudentFilters } from '../hooks/useEnterpriseStudentFilters';
import { useEnterpriseStudents } from '../hooks/useEnterpriseStudents';
import { EnterpriseStudentService } from '../services/enterprise-student.service';

export const useInternshipManagement = () => {
  const toast = useToast();
  const { MESSAGES } = INTERNSHIP_MANAGEMENT_UI.INTERNSHIP_LIST;

  const {
    termId,
    setTermId,
    termOptions,
    fetchingTerms,
    searchValue,
    filters: filterState,
    pagination,
    sort,
    handleSearch,
    debouncedSearch,
    handleFilterChange,
    handleTableChange,
    resetFilters,
    universityOptions,
  } = useEnterpriseStudentFilters();

  const { data, total, loading, refetch } = useEnterpriseStudents({
    termId: termId,
    filters: filterState,
    search: debouncedSearch,
    pagination: pagination,
    sort: sort,
  });

  const {
    acceptApplication,
    rejectApplication,
    loading: actionLoading,
  } = useEnterpriseStudentActions(refetch);
  const {
    createGroup,
    addStudents,
    loading: groupActionLoading,
  } = useEnterpriseGroupActions(refetch);

  const [rejectModal, setRejectModal] = useState({ open: false, student: null });
  const [groupModal, setGroupModal] = useState({ open: false, students: [], type: 'ADD' });
  const [detailModal, setDetailModal] = useState({ open: false, student: null });
  const [assignModal, setAssignModal] = useState({ open: false, student: null });
  const [createModal, setCreateModal] = useState({ open: false, students: [] });
  const [unassignedStudents, setUnassignedStudents] = useState([]);
  const [fetchingStudents, setFetchingStudents] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const handleAcceptStudent = useCallback(
    async (student) => {
      if (!student) return;
      showDeleteConfirm({
        title: MESSAGES.ACCEPT_CONFIRM_TITLE,
        content: `${MESSAGES.ACCEPT_CONFIRM_CONTENT} ${student.studentFullName}?`,
        okText: MESSAGES.ACCEPT_CONFIRM_OK,
        type: 'warning',
        onOk: async () => {
          await acceptApplication(student.id);
        },
      });
    },
    [MESSAGES, acceptApplication]
  );

  const handleRejectStudent = useCallback(
    async (reason) => {
      if (!rejectModal.student) return;
      await rejectApplication(rejectModal.student.id, reason);
      setRejectModal({ open: false, student: null });
    },
    [rejectModal.student, rejectApplication]
  );

  const handleGroupSubmit = useCallback(
    async (values) => {
      const studentIds = groupModal.students.map((s) => s.id);
      const success = await addStudents(values.groupId, studentIds);

      if (success) {
        setGroupModal({ open: false, students: [], type: 'ADD' });
      }
    },
    [groupModal.students, addStudents]
  );

  const handleAssignMentor = useCallback(
    async (_values) => {
      if (!assignModal.student) return;
      // TODO: Call API to assign mentor/project
      toast.success(INTERNSHIP_MANAGEMENT_UI.INTERNSHIP_LIST.MESSAGES.ASSIGN_SUCCESS);
      setAssignModal({ open: false, student: null });
      refetch();
    },
    [assignModal.student, toast, refetch]
  );

  const fetchUnassignedStudents = useCallback(async () => {
    if (!termId) return;
    try {
      setFetchingStudents(true);
      const res = await EnterpriseStudentService.getApplications({
        termId, // Working key from useGroupManagement
        TermId: termId, // Fallback
        status: 1, // Working key
        Status: 1, // Fallback
        pageIndex: 1, // Working key
        PageNumber: 1, // Fallback
        pageSize: 100,
        PageSize: 100,
      });
      const items = res?.data?.items || [];
      const unassigned = items
        .filter((s) => s.status === 1 && !s.groupId)
        .map(EnterpriseStudentService.mapApplication);
      setUnassignedStudents(unassigned);
    } catch (err) {
      console.error('Failed to fetch unassigned students:', err);
    } finally {
      setFetchingStudents(false);
    }
  }, [termId]);

  const handleCreateGroup = useCallback(
    async (values) => {
      // Ưu tiên lấy studentId cho việc tạo nhóm (Bắt buộc theo backend Handler)
      const studentIds =
        values.studentIds && values.studentIds.length > 0
          ? values.studentIds
          : createModal.students.map((s) => s.studentId || s.StudentId || s.id || s.applicationId);

      if (!studentIds || studentIds.length === 0) {
        toast.error('Vui lòng chọn ít nhất 1 sinh viên để tạo nhóm.');
        return;
      }

      const payload = {
        GroupName: values.name,
        Track: values.track,
        TermId: termId,
        Students: studentIds.map((id) => ({
          StudentId: id,
          Role: 1, // Member default
        })),
      };

      console.log('DEBUG PAYLOAD (FINAL FIX):', payload);

      const success = await createGroup(payload);
      if (success) {
        setCreateModal({ open: false, students: [] });
      }
    },
    [createGroup, termId, createModal.students, toast]
  );

  useEffect(() => {
    if (createModal.open) fetchUnassignedStudents();
  }, [createModal.open, fetchUnassignedStudents]);

  return {
    students: data,
    search: searchValue,
    statusFilter: filterState.status !== null ? filterState.status : 'ALL',
    pagination: pagination,
    filteredData: data,
    total,
    loading: loading || actionLoading || groupActionLoading,
    rejectModal,
    groupModal,
    detailModal,
    assignModal,
    selectedRowKeys,
    setRejectModal,
    setGroupModal,
    setDetailModal,
    setAssignModal,
    setSelectedRowKeys,
    handleSearchChange: handleSearch,
    handleStatusChange: (val) => handleFilterChange('status', val),
    handleTableChange: (page, pageSize) => handleTableChange({ current: page, pageSize }),
    handlePageSizeChange: (pageSize) => {
      handleTableChange({ current: 1, pageSize });
    },
    handleAcceptStudent,
    handleRejectStudent,
    handleGroupSubmit,
    handleAssignMentor,
    resetFilters,
    groupFilter:
      filterState.hasGroup === null ? 'ALL' : filterState.hasGroup ? 'HAS_GROUP' : 'NO_GROUP',
    assignmentFilter:
      filterState.mentorAssigned === null
        ? 'ALL'
        : filterState.mentorAssigned
          ? 'ASSIGNED'
          : 'UNASSIGNED',
    projectFilter:
      filterState.projectAssigned === null
        ? 'ALL'
        : filterState.projectAssigned
          ? 'PROJECT_ASSIGNED'
          : 'PROJECT_UNASSIGNED',
    universityFilter: filterState.universityId,
    majorFilter: filterState.major,
    setGroupFilter: (val) =>
      handleFilterChange('hasGroup', val === 'ALL' || !val ? null : val === 'HAS_GROUP'),
    setAssignmentFilter: (val) =>
      handleFilterChange('mentorAssigned', val === 'ALL' || !val ? null : val === 'ASSIGNED'),
    setProjectFilter: (val) =>
      handleFilterChange(
        'projectAssigned',
        val === 'ALL' || !val ? null : val === 'PROJECT_ASSIGNED'
      ),
    setUniversityFilter: (val) => handleFilterChange('universityId', val),
    setMajorFilter: (val) => handleFilterChange('major', val),
    termId,
    setTermId,
    termOptions,
    fetchingTerms,
    universityOptions,
    setCreateModal,
    createModal,
    unassignedStudents,
    fetchingStudents,
    handleCreateGroup,
  };
};

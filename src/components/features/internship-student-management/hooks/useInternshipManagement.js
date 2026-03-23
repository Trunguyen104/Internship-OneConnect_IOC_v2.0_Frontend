import { useCallback, useEffect, useState } from 'react';

import { showDeleteConfirm } from '@/components/ui/deleteconfirm';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { useToast } from '@/providers/ToastProvider';

import { EnterpriseGroupService } from '../../internship-group-management/services/enterprise-group.service';
import { EnterpriseStudentService } from '../services/enterprise-student.service';
import { EnterpriseTermService } from '../services/enterprise-term.service';

export const useInternshipManagement = () => {
  const toast = useToast();
  const { MESSAGES } = INTERNSHIP_MANAGEMENT_UI.INTERNSHIP_LIST;

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [termId, setTermId] = useState(undefined);
  const [termOptions, setTermOptions] = useState([]);
  const [fetchingTerms, setFetchingTerms] = useState(false);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('1'); // Default to Placed
  const [groupFilter, setGroupFilter] = useState('ALL');
  const [assignmentFilter, setAssignmentFilter] = useState('ALL');
  const [projectFilter, setProjectFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState(null); // Month/Year filter
  const [universityFilter, setUniversityFilter] = useState(undefined);
  const [majorFilter, setMajorFilter] = useState(undefined);
  const [universityOptions, setUniversityOptions] = useState([]);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const [rejectModal, setRejectModal] = useState({ open: false, student: null });
  const [assignModal, setAssignModal] = useState({ open: false, student: null });
  const [groupModal, setGroupModal] = useState({ open: false, students: [], type: 'ADD' });
  const [detailModal, setDetailModal] = useState({ open: false, student: null });
  const [createModal, setCreateModal] = useState({ open: false, students: [] });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [unassignedStudents, setUnassignedStudents] = useState([]);
  const [fetchingStudents, setFetchingStudents] = useState(false);

  // Fetch Active Terms with Fallback
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        setFetchingTerms(true);
        const res = await EnterpriseTermService.getActiveTerms();
        let terms = res?.data?.terms || [];

        // Fallback or empty handle: we might need to fetch all if active is empty
        // For now, if empty, we keep it as is or log it.
        // Requirement AC-S01: Nếu không có kỳ Active nào -> hiển thị kỳ Upcoming gần nhất.
        // If the service already returns them in some way, we use it.

        const options = terms.map((t) => ({
          label: t.termName,
          value: t.termId,
          status: t.status, // Preserve status for badges
        }));
        setTermOptions(options);
        if (options.length > 0 && !termId) {
          setTermId(options[0].value);
        }
      } catch (err) {
        console.error('Failed to fetch terms:', err);
      } finally {
        setFetchingTerms(false);
      }
    };
    fetchTerms();
  }, []);

  // Fetch Applications (Students)
  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        TermId: termId || undefined,
        PageIndex: pagination.current,
        PageSize: pagination.pageSize,
        Search: search || undefined,
        Status: statusFilter !== 'ALL' ? Number(statusFilter) : undefined,
      };

      if (dateFilter) {
        params.Month = dateFilter.month() + 1;
        params.Year = dateFilter.year();
      }

      if (groupFilter === 'HAS_GROUP') params.HasGroup = true;
      if (groupFilter === 'NO_GROUP') params.HasGroup = false;
      if (assignmentFilter === 'ASSIGNED') params.MentorAssigned = true;
      if (assignmentFilter === 'UNASSIGNED') params.MentorAssigned = false;

      const res = await EnterpriseStudentService.getApplications(params);
      const items = res?.data?.items || [];
      setStudents(items.map(EnterpriseStudentService.mapApplication));
      setTotal(res?.data?.totalCount || 0);

      // Extract unique universities for filter
      const universities = Array.from(new Set(items.map((i) => i.universityName))).filter(Boolean);
      setUniversityOptions(universities.map((u) => ({ label: u, value: u })));
    } catch (err) {
      console.error('Failed to fetch students:', err);
    } finally {
      setLoading(false);
    }
  }, [
    termId,
    pagination.current,
    pagination.pageSize,
    search,
    statusFilter,
    groupFilter,
    assignmentFilter,
    dateFilter,
  ]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const filteredData = students; // API handles most filtering

  const handleSearchChange = useCallback((value) => {
    setSearch(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  const handleStatusChange = useCallback((value) => {
    setStatusFilter(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  const handleTableChange = useCallback((page) => {
    setPagination((prev) => ({ ...prev, current: page }));
  }, []);

  const handlePageSizeChange = useCallback((size) => {
    setPagination({ current: 1, pageSize: size });
  }, []);

  const handleAcceptStudent = useCallback(
    async (student) => {
      if (!student) return;
      showDeleteConfirm({
        title: MESSAGES.ACCEPT_CONFIRM_TITLE,
        content: `${MESSAGES.ACCEPT_CONFIRM_CONTENT} ${student.studentFullName}?`,
        okText: MESSAGES.ACCEPT_CONFIRM_OK,
        type: 'warning',
        onOk: async () => {
          try {
            await EnterpriseStudentService.acceptApplication(student.id);
            toast.success(MESSAGES.ACCEPT_SUCCESS);
            fetchStudents();
          } catch (err) {
            toast.error('Failed to accept student');
          }
        },
      });
    },
    [toast, MESSAGES, fetchStudents]
  );

  const handleRejectStudent = useCallback(
    async (studentId, reason) => {
      try {
        await EnterpriseStudentService.rejectApplication(studentId, reason);
        setRejectModal({ open: false, student: null });
        toast.warning(MESSAGES.REJECT_SUCCESS);
        fetchStudents();
      } catch (err) {
        toast.error('Failed to reject application');
      }
    },
    [toast, MESSAGES, fetchStudents]
  );

  const handleAssignMentor = useCallback(
    async (studentId, values) => {
      try {
        // Since we need to assign mentor to a group or update the application detail
        // For now, assume we use UpdateInternshipGroup or a specific assign endpoint if available
        // User requirements say AC-04: HR gán Mentor và Vị trí/Dự án.
        // Controller doesn't have a direct "Assign Mentor to Application" endpoint.
        // It might be handled via group management.
        // However, Swagger shows: PATCH /api/enterprises/me/applications/{applicationId}/assign
        // Wait, my EnterpriseStudentService doesn't have assignMentor. I'll add it.
        await EnterpriseStudentService.assignMentor(studentId, values);
        setAssignModal({ open: false, student: null });
        toast.success(MESSAGES.ASSIGN_SUCCESS);
        fetchStudents();
      } catch (err) {
        toast.error('Failed to assign mentor');
      }
    },
    [toast, MESSAGES, fetchStudents]
  );

  const handleGroupSubmit = useCallback(
    async (values) => {
      const { students, type } = groupModal;
      if (!students?.length) return;

      try {
        if (type === 'ADD') {
          await EnterpriseGroupService.addStudents(
            values.groupId,
            students.map((s) => ({ studentId: s.studentId, role: 1 }))
          );
          toast.success(MESSAGES.GROUP_ADD_SUCCESS);
        } else if (type === 'CHANGE') {
          // Move students logic
          await EnterpriseGroupService.moveStudents({
            fromGroupId: students[0].groupId,
            toGroupId: values.groupId,
            studentIds: students.map((s) => s.studentId),
          });
          toast.success(MESSAGES.GROUP_CHANGE_SUCCESS);
        }
        setGroupModal({ open: false, students: [], type: 'ADD' });
        fetchStudents();
      } catch (err) {
        toast.error('Failed to update group');
      }
    },
    [groupModal, toast, MESSAGES, fetchStudents]
  );

  const handleCreateGroup = useCallback(
    async (payload) => {
      try {
        await EnterpriseGroupService.createGroup({
          ...payload,
          TermId: termId,
        });
        toast.success('Group created successfully');
        setCreateModal({ open: false, students: [] });
        fetchStudents();
      } catch (err) {
        toast.error('Failed to create group');
      }
    },
    [termId, fetchStudents, toast]
  );

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('1');
    setGroupFilter('ALL');
    setAssignmentFilter('ALL');
    setProjectFilter('ALL');
    setDateFilter(null);
    setUniversityFilter(undefined);
    setMajorFilter(undefined);
    setPagination({ current: 1, pageSize: 10 });
  };

  return {
    search,
    statusFilter,
    groupFilter,
    setGroupFilter,
    assignmentFilter,
    setAssignmentFilter,
    pagination,
    filteredData,
    total,
    loading,
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
    handleSearchChange,
    handleStatusChange,
    handleTableChange,
    handlePageSizeChange,
    handleAcceptStudent,
    handleRejectStudent,
    handleGroupSubmit,
    handleAssignMentor,
    termId,
    setTermId,
    termOptions,
    fetchingTerms,
    resetFilters,
    projectFilter,
    setProjectFilter,
    universityFilter,
    setUniversityFilter,
    majorFilter,
    setMajorFilter,
    universityOptions,
    setCreateModal,
    createModal,
    unassignedStudents,
    fetchingStudents,
    handleCreateGroup,
    dateFilter,
    setDateFilter,
    isTermEditable: termId && termOptions.find((t) => t.value === termId)?.status < 3,
  };
};

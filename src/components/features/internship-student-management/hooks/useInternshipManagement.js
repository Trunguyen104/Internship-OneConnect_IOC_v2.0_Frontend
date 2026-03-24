import { useCallback, useEffect, useState } from 'react';

import { showDeleteConfirm } from '@/components/ui/deleteconfirm';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { useToast } from '@/providers/ToastProvider';

import { EnterpriseGroupService } from '../../internship-group-management/services/enterprise-group.service';
import { userService } from '../../user/services/userService';
import { EnterpriseMentorService } from '../services/enterprise-mentor.service';
import { EnterpriseStudentService } from '../services/enterprise-student.service';
import { EnterpriseTermService } from '../services/enterprise-term.service';

export const useInternshipManagement = () => {
  const toast = useToast();
  const { MESSAGES } = INTERNSHIP_MANAGEMENT_UI.INTERNSHIP_LIST;

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [termId, setTermId] = useState(null);
  const [termOptions, setTermOptions] = useState([]);
  const [fetchingTerms, setFetchingTerms] = useState(false);
  const [hasGroups, setHasGroups] = useState(false);
  const [existingGroups, setExistingGroups] = useState([]);
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

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(2); // Default to Placed (Approved = 2)
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

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        setFetchingTerms(true);
        // Fallback to active terms if all terms endpoint not found
        const res = await EnterpriseTermService.getActiveTerms();
        let terms = res?.data?.terms || res?.data || [];

        terms.sort((a, b) => {
          if (a.status === 2 && b.status !== 2) return -1;
          if (a.status !== 2 && b.status === 2) return 1;
          return new Date(b.startDate) - new Date(a.startDate);
        });

        const { STATUS_LABELS } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT;
        const options = terms.map((t) => ({
          label: t.termName,
          value: t.termId,
          status: t.status,
          termName: t.termName,
          universityName: t.universityName,
        }));

        setTermOptions(options);

        // Auto-select first term if none selected
        if (!termId && options.length > 0) {
          setTermId(options[0].value);
        }
      } catch (err) {
        console.error('Failed to fetch terms:', err);
      } finally {
        setFetchingTerms(false);
      }
    };
    fetchTerms();
  }, [termId]);

  // Fetch Applications (Students)
  const fetchStudents = useCallback(async () => {
    if (!termId) return;

    try {
      setFetchingStudents(true);
      const params = {
        TermId: termId,
        PageIndex: pagination.current,
        PageSize: pagination.pageSize,
        Search: search,
        Status: statusFilter === 'ALL' ? undefined : statusFilter,
        HasGroup: groupFilter === 'ALL' ? undefined : groupFilter === 'HAS_GROUP',
        MentorAssigned: assignmentFilter === 'ALL' ? undefined : assignmentFilter === 'ASSIGNED',
        ProjectAssigned: projectFilter === 'ALL' ? undefined : projectFilter === 'PROJECT_ASSIGNED',
        Major: majorFilter,
        UniversityName: universityFilter,
        Month: dateFilter ? dateFilter.month() + 1 : undefined,
        Year: dateFilter ? dateFilter.year() : undefined,
      };

      const res = await EnterpriseStudentService.getApplications(params);
      const items = res?.data?.items || res?.items || [];
      const total = res?.data?.totalCount || res?.totalCount || 0;
      const currentTermStatus = termOptions.find((t) => t.value === termId)?.status || 0;
      setStudents(
        items.map((item) => {
          const mapped = EnterpriseStudentService.mapApplication(item);
          // Fallback to current term's status if not provided by API
          if (mapped.termStatus === 0 || mapped.termStatus === undefined) {
            mapped.termStatus = currentTermStatus;
          }
          return mapped;
        })
      );
      setTotal(res?.data?.totalCount || 0);

      // Set unassigned students for group creation modal
      setUnassignedStudents(
        items
          .filter((i) => !i.groupName && !i.groupId)
          .map((item) => {
            const mapped = EnterpriseStudentService.mapApplication(item);
            if (mapped.termStatus === 0 || mapped.termStatus === undefined) {
              mapped.termStatus = currentTermStatus;
            }
            return mapped;
          })
      );
      const universities = Array.from(new Set(items.map((i) => i.universityName))).filter(Boolean);
      setUniversityOptions(universities.map((u) => ({ label: u, value: u })));

      try {
        const groupsRes = await EnterpriseGroupService.getGroups({
          termId,
          pageSize: 100,
        });
        const groups = groupsRes?.data?.items || groupsRes?.items || [];
        setExistingGroups(groups);
        setHasGroups(groups.length > 0);
      } catch (err) {
        console.error('Failed to check groups:', err);
      }
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
    universityFilter,
    majorFilter,
  ]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const filteredData = students;
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
          toast.success(`Đã thêm ${students.length} sinh viên vào nhóm.`);
        } else if (type === 'CHANGE') {
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
        const errorMsg = err?.response?.data?.message || err?.message || '';
        // AC-G05: Handle race condition where student already in another group
        if (errorMsg.includes('already in another group') || err?.response?.status === 400) {
          // If possible, extract student name from error or just show the error message
          toast.error(errorMsg || 'Sinh viên đã thuộc một nhóm khác trong kỳ này, không thể thêm.');
        } else {
          toast.error('Failed to update group');
        }
      }
    },
    [groupModal, toast, MESSAGES, fetchStudents]
  );

  const handleCreateGroup = useCallback(
    async (payload) => {
      // payload.students is passed from the modal context
      const selectedStudents = createModal.students || [];
      const termIds = new Set(selectedStudents.map((s) => s.termId).filter(Boolean));

      if (termIds.size > 1) {
        toast.error(
          'Sinh viên được chọn thuộc nhiều kỳ thực tập khác nhau. Vui lòng chỉ chọn sinh viên trong cùng một kỳ thực tập.'
        );
        return;
      }

      const firstStudent = selectedStudents[0];
      const targetTermId = firstStudent?.termId || termId;

      try {
        await EnterpriseGroupService.createGroup({
          ...payload,
          termId: targetTermId,
          enterpriseId: enterpriseId,
        });
        toast.success('Group created successfully');
        setCreateModal({ open: false, students: [] });
        fetchStudents();
      } catch (err) {
        const errorMsg = err?.response?.data?.message || err?.message || 'Failed to create group';
        toast.error(errorMsg);
      }
    },
    [termId, fetchStudents, toast, createModal.students]
  );

  const resetFilters = () => {
    setSearch('');
    setStatusFilter(2);
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
    mentors,
    loadingMentors,
    handleCreateGroup,
    dateFilter,
    setDateFilter,
    isTermEditable: termId && termOptions.find((t) => t.value === termId)?.status === 2,
    hasGroups,
    existingGroups,
  };
};

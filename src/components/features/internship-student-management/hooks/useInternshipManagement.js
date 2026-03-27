import { useCallback, useEffect, useState } from 'react';

import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { useToast } from '@/providers/ToastProvider';

import { EnterpriseGroupService } from '../../internship-group-management/services/enterprise-group.service';
import { userService } from '../../user/services/userService';
import { EnterpriseMentorService } from '../services/enterprise-mentor.service';
import { EnterprisePhaseService } from '../services/enterprise-phase.service';
import { EnterpriseStudentService } from '../services/enterprise-student.service';

export const useInternshipManagement = () => {
  const toast = useToast();
  const { MESSAGES } = INTERNSHIP_MANAGEMENT_UI.INTERNSHIP_LIST;

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [phaseId, setPhaseId] = useState(null);
  const [phaseOptions, setPhaseOptions] = useState([]);
  const [fetchingPhases, setFetchingPhases] = useState(false);
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
        // Error handled silently
      }
    };
    fetchMe();
  }, []);

  const [search, setSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState('ALL');
  const [mentorFilter, setMentorFilter] = useState('ALL');
  const [universityOptions, setUniversityOptions] = useState([]);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const [sort, setSort] = useState({ column: 'FullName', order: 'Asc' });

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

      // Remove duplicates based on userId
      const uniqueItems = Array.from(
        new Map(allItems.map((item) => [item?.userId || item?.UserId || item?.id, item])).values()
      ).filter(Boolean);

      setMentors(uniqueItems);
    } catch (err) {
      toast.error('Không thể tải danh sách Mentor');
      setMentors([]);
    } finally {
      setLoadingMentors(false);
    }
  }, []);

  useEffect(() => {
    fetchMentors();
  }, [fetchMentors]);

  useEffect(() => {
    const fetchPhases = async () => {
      try {
        setFetchingPhases(true);
        const res = await EnterprisePhaseService.getPhases();
        const phases = res?.data?.items || res?.data || [];

        const openPhases = phases
          .filter((p) => p.status === 1 || p.status === 2)
          .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

        let phasesToShow = openPhases;
        let defaultLabel = 'All Active Phases';

        const options = openPhases.map((p) => ({
          label: p.phaseName || p.name || p.termName,
          value: p.phaseId || p.id || p.termId,
          status: p.status,
          phaseName: p.phaseName || p.name || p.termName,
          universityName: p.universityName,
          enterpriseName: p.enterpriseName,
          startDate: p.startDate,
          endDate: p.endDate,
          maxStudents: p.maxStudents,
          description: p.description,
          groupCount: p.groupCount,
        }));

        const allOption = {
          label: defaultLabel,
          value: 'ALL_VISIBLE',
          status: 1,
          phaseIds: options.map((p) => p.value),
        };

        setPhaseOptions([allOption, ...options]);

        const uniqueUniversities = Array.from(
          new Set(phases.map((p) => p.universityName).filter(Boolean))
        );
        setUniversityOptions(uniqueUniversities.map((name) => ({ label: name, value: name })));
        if (!phaseId) {
          setPhaseId('ALL_VISIBLE');
        }
      } catch (err) {
      } finally {
        setFetchingPhases(false);
      }
    };
    fetchPhases();
  }, [phaseId]);

  const fetchStudents = useCallback(async () => {
    if (!phaseId && phaseOptions.length > 0) return;

    try {
      setLoading(true);

      const isAllVisible = phaseId === 'ALL_VISIBLE' || !phaseId;

      const params = {
        PhaseId: isAllVisible ? undefined : phaseId,
        PageIndex: pagination.current,
        PageSize: pagination.pageSize,
        SearchTerm: search || undefined,
        IsAssignedToGroup:
          groupFilter === 'HAS_GROUP' ? true : groupFilter === 'NO_GROUP' ? false : undefined,
        IsAssignedToMentor: ['HAS_MENTOR', 'ASSIGNED'].includes(mentorFilter)
          ? true
          : ['NO_MENTOR', 'UNASSIGNED'].includes(mentorFilter)
            ? false
            : undefined,
        mentorAssigned: ['HAS_MENTOR', 'ASSIGNED'].includes(mentorFilter)
          ? true
          : ['NO_MENTOR', 'UNASSIGNED'].includes(mentorFilter)
            ? false
            : undefined,
        sortBy: sort?.column || 'AppliedAt',
        sortOrder: sort?.order || 'Desc',
      };

      let items = [];
      let totalCount = 0;

      const openPhaseIds = new Set(
        phaseOptions
          .filter((p) => (p.status === 1 || p.status === 2) && p.value !== 'ALL_VISIBLE')
          .map((p) => String(p.value).toLowerCase())
      );

      // DEFAULT: Fetch placed students (equivalent to statusFilter === 2)
      const res = await EnterpriseGroupService.getPlacedStudents(params);
      items = res?.data?.items || res?.items || [];
      totalCount = res?.data?.totalCount || res?.totalCount || items.length;

      // Map items to ensure all required fields are present (using the service's robust mapper)
      items = items.map(EnterpriseStudentService.mapApplication);

      // Filter items to only show those in Open phases if ALL_VISIBLE is selected
      if (isAllVisible) {
        items = items.filter((item) => {
          const itemPid = String(item.phaseId || item.termId || '').toLowerCase();
          return openPhaseIds.has(itemPid);
        });
        totalCount = items.length;
      }

      const mappedStudents = items.map((item) => {
        const mapped = EnterpriseStudentService.mapApplication(item);
        if (mapped.phaseStatus === 0 || mapped.phaseStatus === undefined) {
          const studentPhase = phaseOptions.find((o) => o.value === mapped.phaseId);
          mapped.phaseStatus = studentPhase?.status || 2;
        }
        if (!mapped.startDate || !mapped.endDate) {
          const studentPhase = phaseOptions.find((o) => o.value === mapped.phaseId);
          mapped.startDate = studentPhase?.startDate;
          mapped.endDate = studentPhase?.endDate;
        }
        return mapped;
      });

      // AC-S04: Local Sorting Fallback (ensures sorting works even if API ignores params)
      if (sort?.column) {
        mappedStudents.sort((a, b) => {
          let valA, valB;

          if (sort.column === 'FullName') {
            const getSortableName = (fullName) => {
              const nameParts = (fullName || '').trim().split(' ');
              const firstName = nameParts.pop() || '';
              const restOfName = nameParts.join(' ');
              return { firstName, restOfName };
            };

            const nameA = getSortableName(a.studentFullName);
            const nameB = getSortableName(b.studentFullName);

            // Compare by First Name first
            const firstCompare = nameA.firstName.localeCompare(nameB.firstName, 'vi', {
              sensitivity: 'base',
            });
            if (firstCompare !== 0) return sort.order === 'Asc' ? firstCompare : -firstCompare;

            // If First Names are same, compare by rest of name
            return sort.order === 'Asc'
              ? nameA.restOfName.localeCompare(nameB.restOfName, 'vi', { sensitivity: 'base' })
              : -nameA.restOfName.localeCompare(nameB.restOfName, 'vi', { sensitivity: 'base' });
          } else if (sort.column === 'GroupName') {
            valA = (a.groupName || '').toLowerCase();
            valB = (b.groupName || '').toLowerCase();
          } else {
            // Support any other column keys
            valA = (a[sort.column] || '').toString().toLowerCase();
            valB = (b[sort.column] || '').toString().toLowerCase();
          }

          if (valA < valB) return sort.order === 'Asc' ? -1 : 1;
          if (valA > valB) return sort.order === 'Asc' ? 1 : -1;
          return 0;
        });
      }

      setStudents(mappedStudents);
      setTotal(totalCount);
      setUnassignedStudents(mappedStudents.filter((i) => !i.groupName && !i.groupId));
      // Fetch groups for the selected context
      const groupParams = {
        phaseId: isAllVisible ? undefined : phaseId,
        pageSize: 100,
      };
      const groupRes = await EnterpriseGroupService.getGroups(groupParams).catch(() => ({
        data: { items: [] },
      }));
      const allGroups = groupRes?.data?.items || groupRes?.items || [];
      setExistingGroups(allGroups);
      setHasGroups(allGroups.some((g) => g.status === 1));
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, [
    phaseId,
    phaseOptions,
    search,
    groupFilter,
    pagination.current,
    pagination.pageSize,
    mentorFilter,
    sort?.column,
    sort?.order,
  ]);

  // Listen for global group refresh events
  useEffect(() => {
    const handleRefresh = () => {
      fetchStudents();
    };
    window.addEventListener(INTERNSHIP_MANAGEMENT_UI.GROUP_MANAGEMENT.REFRESH_EVENT, handleRefresh);
    return () =>
      window.removeEventListener(
        INTERNSHIP_MANAGEMENT_UI.GROUP_MANAGEMENT.REFRESH_EVENT,
        handleRefresh
      );
  }, [fetchStudents]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const filteredData = students;
  const handleSearchChange = useCallback((value) => {
    setSearch(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  const handleGroupFilterChange = useCallback((value) => {
    setGroupFilter(value || 'ALL');
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  const handleMentorFilterChange = useCallback((value) => {
    setMentorFilter(value || 'ALL');
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  const handleTableChange = useCallback((page) => {
    setPagination((prev) => ({ ...prev, current: page }));
  }, []);

  const handleViewStudent = useCallback(async (student) => {
    if (!student?.applicationId) {
      setDetailModal({ open: true, student });
      return;
    }

    try {
      setLoading(true);
      const res = await EnterpriseStudentService.getApplicationDetail(student.applicationId);
      const fullData = res?.data || res;
      // Merge full data with existing mapped record
      setDetailModal({
        open: true,
        student: {
          ...student,
          ...fullData,
          // Re-map fields that might have different names in the detail response
          studentEmail: fullData.email || student.studentEmail,
          phone: fullData.phone || student.phone,
          dob: fullData.dob || student.dob,
        },
      });
    } catch (err) {
      // Fallback: show existing data if fetch fails
      setDetailModal({ open: true, student });
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePageSizeChange = useCallback((size) => {
    setPagination({ current: 1, pageSize: size });
  }, []);

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
        // Partition students by their current source group for precise API calls
        const sourceGroups = students.reduce((acc, s) => {
          const gid = s.groupId || 'NO_GROUP';
          if (!acc[gid]) acc[gid] = [];
          acc[gid].push(s); // Store the whole object for reliable ID access
          return acc;
        }, {});

        for (const [sourceGroupId, groupStudents] of Object.entries(sourceGroups)) {
          const isNoGroup = sourceGroupId === 'NO_GROUP';
          const personIds = groupStudents.map((s) => s.studentId);

          // CRITICAL: If type is 'CHANGE', we MUST prefer the Move API for all students who already have a group.
          // Fallback only to Add API if they are truly unassigned.
          if (type === 'ADD' || (isNoGroup && type !== 'CHANGE')) {
            await EnterpriseGroupService.addStudents(
              values.groupId,
              groupStudents.map((s) => ({
                studentId: s.studentId,
                role: 1,
              }))
            );
          } else {
            // "CHANGE" or "MOVE" operation
            // Ensure we don't move to the SAME group
            if (sourceGroupId === values.groupId) {
              continue;
            }

            await EnterpriseGroupService.moveStudents({
              fromGroupId: isNoGroup ? undefined : sourceGroupId, // Use correct ID if coming from a group
              toGroupId: values.groupId,
              studentIds: personIds,
            });

            if (values.mentorId) {
              const assignPromises = personIds.map((stId) =>
                EnterpriseStudentService.assignMentor(stId, {
                  mentorId: values.mentorId,
                })
              );
              await Promise.all(assignPromises);
            }
          }
        }

        toast.success(
          type === 'ADD' ? `Đã thêm ${students.length} sinh viên.` : MESSAGES.GROUP_CHANGE_SUCCESS
        );

        // AC-11 Case 2b: Notify about access changes during transfer
        if (type === 'CHANGE') {
          students.forEach((s) => {
            toast.info(
              `Sinh viên ${s.studentFullName} đã được chuyển nhóm. Quyền truy cập dự án cũ đã bị thu hồi và cấp mới cho nhóm mới.`,
              { duration: 5 }
            );
          });
        }
      } catch (err) {
        // RESILIENCY: Force Refresh on backend errors as data might have partially updated
        if (err.status === 400 || err.status === 500) {
          const errorMsg =
            err?.response?.data?.message ||
            err?.message ||
            'Sinh viên đã có nhóm khác hoặc dữ liệu không đồng bộ.';
          toast.warning(errorMsg);
        } else {
          toast.error('Failed to update group');
          throw err;
        }
      } finally {
        setGroupModal({ open: false, students: [], type: 'ADD' });
        fetchStudents();
        window.dispatchEvent(
          new CustomEvent(INTERNSHIP_MANAGEMENT_UI.GROUP_MANAGEMENT.REFRESH_EVENT)
        );
      }
    },
    [groupModal, toast, MESSAGES, fetchStudents]
  );

  const handleCreateGroup = useCallback(
    async (payload) => {
      // payload.students is passed from the modal context
      const selectedStudents = createModal.students || [];
      const phaseIds = new Set(selectedStudents.map((s) => s.phaseId || s.termId).filter(Boolean));

      if (phaseIds.size > 1) {
        toast.error(
          'Sinh viên được chọn thuộc nhiều giai đoạn khác nhau. Vui lòng chỉ chọn sinh viên trong cùng một giai đoạn.'
        );
        return;
      }

      const firstStudent = selectedStudents[0];
      const targetPhaseId = firstStudent?.phaseId || firstStudent?.termId || phaseId;

      try {
        await EnterpriseGroupService.createGroup({
          ...payload,
          phaseId: targetPhaseId,
          enterpriseId: enterpriseId,
        });
        toast.success('Group created successfully');
        setCreateModal({ open: false, students: [] });
        fetchStudents();
        window.dispatchEvent(
          new CustomEvent(INTERNSHIP_MANAGEMENT_UI.GROUP_MANAGEMENT.REFRESH_EVENT)
        );
      } catch (err) {
        const errorMsg = err?.response?.data?.message || err?.message || 'Failed to create group';
        toast.error(errorMsg);
      }
    },
    [phaseId, fetchStudents, toast, createModal.students, enterpriseId]
  );

  const resetFilters = () => {
    setSearch('');
    setGroupFilter('ALL');
    setMentorFilter('ALL');
    setPagination({ current: 1, pageSize: 10 });
  };

  return {
    search,
    groupFilter,
    setGroupFilter,
    pagination,
    filteredData,
    total,
    loading,
    groupModal,
    detailModal,
    assignModal,
    selectedRowKeys,
    setGroupModal,
    setDetailModal,
    setAssignModal,
    setSelectedRowKeys,
    handleSearchChange,
    handleGroupFilterChange,
    handleMentorFilterChange,
    handleTableChange,
    handlePageSizeChange,
    handleGroupSubmit,
    handleAssignMentor,
    handleViewStudent,
    phaseId,
    setPhaseId,
    phaseOptions,
    fetchingPhases,
    resetFilters,
    setCreateModal,
    createModal,
    unassignedStudents,
    fetchingStudents,
    mentors,
    loadingMentors,
    handleCreateGroup,
    mentorFilter,
    setMentorFilter,
    isPhaseEditable:
      phaseId === 'ALL_VISIBLE' ||
      (phaseId && phaseOptions.find((p) => p.value === phaseId)?.status === 2),
    hasGroups,
    existingGroups,
    sort,
    setSort,
  };
};

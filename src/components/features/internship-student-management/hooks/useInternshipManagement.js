'use client';

import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';

import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { useToast } from '@/providers/ToastProvider';

import { EnterpriseGroupService } from '../../internship-group-management/services/enterprise-group.service';
import { userService } from '../../user/services/user.service';
import { EnterpriseMentorService } from '../services/enterprise-mentor.service';
import { EnterprisePhaseService } from '../services/enterprise-phase.service';
import { EnterpriseStudentService } from '../services/enterprise-student.service';

export const useInternshipManagement = () => {
  const toast = useToast();
  const { MESSAGES } = INTERNSHIP_MANAGEMENT_UI.INTERNSHIP_LIST;

  const [search, setSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState('ALL');
  const [mentorFilter, setMentorFilter] = useState('ALL');
  const [phaseId, setPhaseId] = useState('ALL_VISIBLE');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [sort, setSort] = useState({ column: 'FullName', order: 'Asc' });

  // 1. Fetch User Info
  const { data: enterpriseId } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      try {
        const res = await userService.getMe();
        const data = res?.data || res;
        return data?.enterpriseId || data?.enterprise_id || data?.enterpriseID;
      } catch (err) {
        return null;
      }
    },
    staleTime: Infinity,
  });

  // 2. Fetch Mentors
  const { data: mentors = [], isLoading: loadingMentors } = useQuery({
    queryKey: ['mentors-list'],
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

        const uniqueItems = Array.from(
          new Map(allItems.map((item) => [item?.userId || item?.UserId || item?.id, item])).values()
        ).filter(Boolean);

        return uniqueItems;
      } catch (err) {
        toast.error('Không thể tải danh sách Mentor');
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  // 3. Fetch Phases
  const { data: phaseData = { options: [], universityOptions: [] }, isLoading: fetchingPhases } =
    useQuery({
      queryKey: ['enterprise-phases'],
      queryFn: async () => {
        try {
          const res = await EnterprisePhaseService.getPhases();
          const phases = res?.data?.items || res?.data || [];

          const openPhases = phases
            .filter((p) => p.status === 1)
            .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

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
            label: 'All Open Phases',
            value: 'ALL_VISIBLE',
            status: 1,
            phaseIds: options.map((p) => p.value),
          };

          const uniqueUniversities = Array.from(
            new Set(phases.map((p) => p.universityName).filter(Boolean))
          );

          return {
            options: [allOption, ...options],
            universityOptions: uniqueUniversities.map((name) => ({ label: name, value: name })),
          };
        } catch (err) {
          return { options: [], universityOptions: [] };
        }
      },
      staleTime: 10 * 60 * 1000,
    });

  const phaseOptions = phaseData.options;

  // 4. Fetch Students and Groups
  const {
    data: studentResult = {
      students: [],
      total: 0,
      unassigned: [],
      existingGroups: [],
      hasGroups: false,
    },
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: [
      'internship-students',
      phaseId,
      pagination.current,
      pagination.pageSize,
      search,
      groupFilter,
      mentorFilter,
      sort,
      phaseOptions,
    ],
    queryFn: async () => {
      // Logic from legacy fetchStudents
      try {
        const isAllVisible = phaseId === 'ALL_VISIBLE' || !phaseId;
        const params = {
          PhaseId: isAllVisible ? undefined : phaseId,
          TermId: isAllVisible ? undefined : phaseId,
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
          sortBy: sort?.column || 'AppliedAt',
          sortOrder: sort?.order || 'Desc',
        };

        const res = await EnterpriseGroupService.getPlacedStudents(params);
        let items = res?.data?.items || res?.items || [];
        let totalCount = res?.data?.totalCount || res?.totalCount || items.length;

        const openPhaseIds = new Set(
          (Array.isArray(phaseOptions) ? phaseOptions : [])
            .filter((p) => p.status === 1 && p.value !== 'ALL_VISIBLE')
            .map((p) => String(p.value).toLowerCase())
        );

        if (isAllVisible) {
          items = (items || []).filter((item) => {
            const itemPid = String(item.phaseId || item.termId || '').toLowerCase();
            return openPhaseIds.has(itemPid);
          });
          totalCount = items.length;
        }

        const safePhaseOptions = Array.isArray(phaseOptions) ? phaseOptions : [];
        const mappedStudents = (items || []).map((item) => {
          const mapped = EnterpriseStudentService.mapApplication(item);
          if (mapped.phaseStatus === 0 || mapped.phaseStatus === undefined) {
            const studentPhase = safePhaseOptions.find((o) => o.value === mapped.phaseId);
            mapped.phaseStatus = studentPhase?.status || 2;
          }
          if (!mapped.startDate || !mapped.endDate) {
            const studentPhase = safePhaseOptions.find((o) => o.value === mapped.phaseId);
            mapped.startDate = studentPhase?.startDate;
            mapped.endDate = studentPhase?.endDate;
          }
          return mapped;
        });

        // Local Sorting Fallback
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
              const firstCompare = nameA.firstName.localeCompare(nameB.firstName, 'vi', {
                sensitivity: 'base',
              });
              if (firstCompare !== 0) return sort.order === 'Asc' ? firstCompare : -firstCompare;
              return sort.order === 'Asc'
                ? nameA.restOfName.localeCompare(nameB.restOfName, 'vi', { sensitivity: 'base' })
                : -nameA.restOfName.localeCompare(nameB.restOfName, 'vi', { sensitivity: 'base' });
            } else if (sort.column === 'GroupName') {
              valA = (a.groupName || '').toLowerCase();
              valB = (b.groupName || '').toLowerCase();
            } else {
              valA = (a[sort.column] || '').toString().toLowerCase();
              valB = (b[sort.column] || '').toString().toLowerCase();
            }
            if (valA < valB) return sort.order === 'Asc' ? -1 : 1;
            if (valA > valB) return sort.order === 'Asc' ? 1 : -1;
            return 0;
          });
        }

        // Fetch Groups
        const groupParams = {
          phaseId: isAllVisible ? undefined : phaseId,
          pageSize: 100,
        };
        const groupRes = await EnterpriseGroupService.getGroups(groupParams).catch(() => ({
          data: { items: [] },
        }));
        const allGroups = groupRes?.data?.items || groupRes?.items || [];

        return {
          students: mappedStudents,
          total: totalCount,
          unassigned: mappedStudents.filter((i) => !i.groupName && !i.groupId),
          existingGroups: allGroups,
          hasGroups: allGroups.some((g) => g.status === 1),
        };
      } catch (err) {
        return { students: [], total: 0, unassigned: [], existingGroups: [], hasGroups: false };
      }
    },
    enabled: Array.isArray(phaseOptions) && phaseOptions.length > 0,
    staleTime: 2 * 60 * 1000,
  });

  const [rejectModal, setRejectModal] = useState({ open: false, student: null });
  const [assignModal, setAssignModal] = useState({ open: false, student: null });
  const [groupModal, setGroupModal] = useState({ open: false, students: [], type: 'ADD' });
  const [detailModal, setDetailModal] = useState({ open: false, student: null });
  const [createModal, setCreateModal] = useState({ open: false, students: [] });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

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

  const [viewLoading, setViewLoading] = useState(false);
  const handleViewStudent = useCallback(async (student) => {
    if (!student?.applicationId) {
      setDetailModal({ open: true, student });
      return;
    }

    try {
      setViewLoading(true);
      const res = await EnterpriseStudentService.getApplicationDetail(student.applicationId);
      const fullData = res?.data || res;
      setDetailModal({
        open: true,
        student: {
          ...student,
          ...fullData,
          studentEmail: fullData.email || student.studentEmail,
          phone: fullData.phone || student.phone,
          dob: fullData.dob || student.dob,
        },
      });
    } catch (err) {
      setDetailModal({ open: true, student });
    } finally {
      setViewLoading(false);
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
        refetch();
      } catch (err) {
        toast.error('Failed to assign mentor');
      }
    },
    [toast, MESSAGES, refetch]
  );

  const handleGroupSubmit = useCallback(
    async (values) => {
      const { students, type } = groupModal;
      if (!students?.length) return;

      try {
        const sourceGroups = students.reduce((acc, s) => {
          const gid = s.groupId || 'NO_GROUP';
          if (!acc[gid]) acc[gid] = [];
          acc[gid].push(s);
          return acc;
        }, {});

        for (const [sourceGroupId, groupStudents] of Object.entries(sourceGroups)) {
          const isNoGroup = sourceGroupId === 'NO_GROUP';
          const personIds = groupStudents.map((s) => s.studentId);

          if (type === 'ADD' || (isNoGroup && type !== 'CHANGE')) {
            await EnterpriseGroupService.addStudents(
              values.groupId,
              groupStudents.map((s) => ({
                studentId: s.studentId,
                role: 1,
              }))
            );
          } else {
            if (sourceGroupId === values.groupId) continue;
            await EnterpriseGroupService.moveStudents({
              fromGroupId: isNoGroup ? undefined : sourceGroupId,
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

        if (type === 'CHANGE') {
          students.forEach((s) => {
            toast.info(
              `Sinh viên ${s.studentFullName} đã được chuyển nhóm. Quyền truy cập dự án cũ đã bị thu hồi và cấp mới cho nhóm mới.`,
              { duration: 5 }
            );
          });
        }
      } catch (err) {
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
        refetch();
        window.dispatchEvent(
          new CustomEvent(INTERNSHIP_MANAGEMENT_UI.GROUP_MANAGEMENT.REFRESH_EVENT)
        );
      }
    },
    [groupModal, toast, MESSAGES, refetch]
  );

  const handleCreateGroup = useCallback(
    async (payload) => {
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
          termId: targetPhaseId,
          enterpriseId: enterpriseId,
        });
        toast.success('Group created successfully');
        setCreateModal({ open: false, students: [] });
        refetch();
        window.dispatchEvent(
          new CustomEvent(INTERNSHIP_MANAGEMENT_UI.GROUP_MANAGEMENT.REFRESH_EVENT)
        );
      } catch (err) {
        const errorMsg = err?.response?.data?.message || err?.message || 'Failed to create group';
        toast.error(errorMsg);
      }
    },
    [phaseId, refetch, toast, createModal.students, enterpriseId]
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
    filteredData: studentResult.students,
    total: studentResult.total,
    loading: loading || viewLoading,
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
    unassignedStudents: studentResult.unassigned,
    fetchingStudents: loading,
    mentors,
    loadingMentors,
    handleCreateGroup,
    mentorFilter,
    setMentorFilter,
    isPhaseEditable:
      phaseId === 'ALL_VISIBLE' ||
      (phaseId &&
        Array.isArray(phaseOptions) &&
        phaseOptions.find((p) => p.value === phaseId)?.status === 2),
    hasGroups: studentResult.hasGroups,
    existingGroups: studentResult.existingGroups,
    sort,
    setSort,
    fetchData: refetch,
  };
};

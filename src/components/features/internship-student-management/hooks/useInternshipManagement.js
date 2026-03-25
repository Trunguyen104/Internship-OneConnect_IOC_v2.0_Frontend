import { useCallback, useEffect, useState } from 'react';

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
        // Error handled silently
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

  const [sort, setSort] = useState({ column: undefined, order: undefined });

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
    const fetchTerms = async () => {
      try {
        setFetchingTerms(true);
        const res = await EnterpriseTermService.getAllTerms();
        const terms = res?.data?.items || res?.data || [];

        // AC-S01: Default filter is "All Active Terms"
        // Fallback: If no Active terms, show "Upcoming" terms
        const activeTerms = terms.filter((t) => t.status === 2);
        const upcomingTerms = terms
          .filter((t) => t.status === 1)
          .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

        let termsToShow = activeTerms;
        let defaultLabel = 'All Active Terms';

        if (activeTerms.length === 0 && upcomingTerms.length > 0) {
          const earliestDate = upcomingTerms[0].startDate;
          termsToShow = upcomingTerms.filter((t) => t.startDate === earliestDate);
          defaultLabel = 'All Upcoming Terms';
        }

        const options = terms.map((t) => ({
          label: t.termName || t.name,
          value: t.termId,
          status: t.status,
          termName: t.termName || t.name,
          universityName: t.universityName,
          startDate: t.startDate,
          endDate: t.endDate,
        }));

        const allOption = {
          label: defaultLabel,
          value: 'ALL_VISIBLE',
          status: termsToShow.length > 0 ? termsToShow[0].status : 2,
          termIds: termsToShow.map((t) => t.termId),
        };

        setTermOptions([allOption, ...options]);

        // Populate University Options from terms
        const uniqueUniversities = Array.from(
          new Set(terms.map((t) => t.universityName).filter(Boolean))
        );
        setUniversityOptions(uniqueUniversities.map((name) => ({ label: name, value: name })));
        if (!termId) {
          setTermId('ALL_VISIBLE');
        }
      } catch (err) {
        // Error handled silently
      } finally {
        setFetchingTerms(false);
      }
    };
    fetchTerms();
  }, [termId]);

  const fetchStudents = useCallback(async () => {
    if (!termId || termOptions.length === 0) return;

    try {
      const selectedOption = termOptions.find((o) => o.value === termId);
      const termIdsToFetch = selectedOption?.termIds || (termId === 'ALL_VISIBLE' ? [] : [termId]);

      if (
        termId === 'ALL_VISIBLE' &&
        (!selectedOption?.termIds || selectedOption.termIds.length === 0)
      ) {
        setStudents([]);
        setTotal(0);
        return;
      }

      setLoading(true);

      const fetchPromises = termIdsToFetch.map(async (id) => {
        const term = termOptions.find((t) => t.value === id);
        const params = {
          TermId: id,
          PageIndex: 1,
          PageSize: 100,
          SearchTerm: search || undefined,
          IsAssignedToGroup:
            groupFilter === 'ALL' ? undefined : groupFilter === 'HAS_GROUP' ? true : false,
          Major: majorFilter || undefined,
          UniversityName: universityFilter || undefined,
        };

        try {
          let items = [];
          if (statusFilter === 2) {
            // AC-S01: Use Placed Students endpoint for status 2
            const res = await EnterpriseGroupService.getPlacedStudents(params);
            const placedItems = res?.data?.items || res?.items || [];

            // CRITICAL: Placed Students endpoint lacks ApplicationId.
            // We fetch the full applications for this term to merge the ApplicationIds.
            try {
              const appRes = await EnterpriseStudentService.getApplications({
                TermId: id,
                PageSize: 100,
                Status: 2, // Only Placed
              });
              const appItems = appRes?.data?.items || appRes?.items || [];

              items = placedItems.map((pi) => {
                const app = appItems.find(
                  (a) => String(a.studentId || a.StudentId) === String(pi.studentId || pi.StudentId)
                );
                return {
                  ...pi,
                  applicationId: app?.applicationId || app?.id || app?.StudentTermId,
                };
              });
            } catch (mergeErr) {
              items = placedItems;
            }
          } else {
            const appParams = {
              ...params,
              Search: search || undefined,
              Status: statusFilter === 'ALL' ? undefined : statusFilter,
              campusId: universityFilter || undefined, // Bridge UniversityName to CampusId name used in service
            };
            const res = await EnterpriseStudentService.getApplications(appParams);
            items = res?.data?.items || res?.items || [];
          }

          return items.map((item) => {
            const mapped = EnterpriseStudentService.mapApplication(item);
            if (mapped.termStatus === 0 || mapped.termStatus === undefined) {
              mapped.termStatus = term?.status || selectedOption?.status || 0;
            }
            if (!mapped.startDate || !mapped.endDate) {
              mapped.startDate = term?.startDate || selectedOption?.startDate;
              mapped.endDate = term?.endDate || selectedOption?.endDate;
            }
            // CRITICAL: DO NOT overwrite mapped.studentId here.
            // The mapper (EnterpriseStudentService) decides the correct ID strategy
            // (ApplicationId vs UserId) based on project requirements.
            return mapped;
          });
        } catch (err) {
          return [];
        }
      });

      const results = await Promise.all(fetchPromises);
      const combinedStudents = results.flat();

      // Manual sorting if needed, but for now just use the aggregate
      setStudents(combinedStudents);
      setTotal(combinedStudents.length);

      // Set unassigned students
      setUnassignedStudents(combinedStudents.filter((i) => !i.groupName && !i.groupId));

      // Check for groups across the fetched terms
      const groupPromises = termIdsToFetch.map((id) =>
        EnterpriseGroupService.getGroups({ termId: id, pageSize: 100 }).catch(() => ({
          data: { items: [] },
        }))
      );
      const groupResults = await Promise.all(groupPromises);
      const allGroups = groupResults.flatMap((res) => res?.data?.items || res?.items || []);
      setExistingGroups(allGroups);
      setHasGroups(allGroups.some((g) => g.status === 1)); // Count Active groups
    } catch (err) {
      // Silent
    } finally {
      setLoading(false);
    }
  }, [
    termId,
    termOptions,
    search,
    statusFilter,
    groupFilter,
    majorFilter,
    universityFilter,
    pagination.current,
    pagination.pageSize,
    assignmentFilter,
    dateFilter,
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

  const handleStatusChange = useCallback((value) => {
    setStatusFilter(value);
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
        window.dispatchEvent(
          new CustomEvent(INTERNSHIP_MANAGEMENT_UI.GROUP_MANAGEMENT.REFRESH_EVENT)
        );
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
    groupModal,
    detailModal,
    assignModal,
    selectedRowKeys,
    setGroupModal,
    setDetailModal,
    setAssignModal,
    setSelectedRowKeys,
    handleSearchChange,
    handleStatusChange,
    handleTableChange,
    handlePageSizeChange,
    handleGroupSubmit,
    handleAssignMentor,
    handleViewStudent,
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
    isTermEditable:
      termId === 'ALL_ACTIVE' ||
      (termId && termOptions.find((t) => t.value === termId)?.status === 2),
    hasGroups,
    existingGroups,
    sort,
    setSort,
  };
};

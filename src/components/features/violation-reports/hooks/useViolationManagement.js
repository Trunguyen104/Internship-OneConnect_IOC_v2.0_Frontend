'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { useToast } from '@/providers/ToastProvider';
import { getErrorDetail } from '@/utils/errorUtils';

import { userService } from '../../user/services/userService';
import { ViolationService } from '../services/violation.service';
import { useViolationFilters } from './useViolationFilters';
import { useViolationModals } from './useViolationModals';

export const useViolationManagement = () => {
  const toast = useToast();
  const { VIOLATION_REPORT } = INTERNSHIP_MANAGEMENT_UI.ENTERPRISE;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [me, setMe] = useState(null);

  const {
    searchTerm,
    groupIdFilter,
    createdByIdFilter,
    dateRange,
    sortConfig,
    pagination,
    termId,
    setTermId,
    termOptions,
    setTermOptions,
    fetchingTerms,
    setFetchingTerms,
    setPagination,
    handleSearchChange,
    handleGroupChange,
    handleCreatedByChange,
    handleDateRangeChange,
    handleTableChange,
    resetFilters,
  } = useViolationFilters();

  const {
    modalVisible,
    setModalVisible,
    editingRecord,
    viewOnly,
    deleteModalState,
    setDeleteModalState,
    handleCreateNew,
    openFormModal,
    handleRequestDelete,
  } = useViolationModals();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        termId,
        PageNumber: pagination.current,
        PageSize: pagination.pageSize,
        SearchTerm: searchTerm || undefined,
        GroupId: groupIdFilter || undefined,
        CreatedById: createdByIdFilter || undefined,
        OccurredFrom: dateRange?.[0]?.format(VIOLATION_REPORT.DATE_FORMATS.API),
        OccurredTo: dateRange?.[1]?.format(VIOLATION_REPORT.DATE_FORMATS.API),
        OrderByCreatedAscending: sortConfig.order === 'asc',
      };

      const response = await ViolationService.getAll(params);

      if (response?.data) {
        setData(response.data.items || []);
        setPagination((prev) => ({
          ...prev,
          total: response.data.totalCount || 0,
        }));
      }
    } catch (error) {
      console.error(VIOLATION_REPORT.LOGS.FETCH_ERROR, error);
      toast.error(getErrorDetail(error, VIOLATION_REPORT.LOAD_ERROR));
    } finally {
      setLoading(false);
    }
  }, [
    pagination.current,
    pagination.pageSize,
    searchTerm,
    groupIdFilter,
    createdByIdFilter,
    dateRange,
    sortConfig,
    toast,
    setPagination,
    VIOLATION_REPORT,
    termId,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setFetchingTerms(true);
        // Fetch current user
        const userRes = await userService.getMe();
        const userData = userRes?.data || userRes;
        setMe(userData);

        // Fetch groups first
        const groupsRes = await ViolationService.getGroups({ pageSize: 100 });
        const groupsData = groupsRes?.data?.items || groupsRes?.items || [];
        setGroups(groupsData);

        // Extract unique terms from groups
        const termMap = new Map();
        groupsData.forEach((g) => {
          const tId = g.termId || g.internshipTermId;
          const tName = g.term || g.termName || g.internshipTermName;
          if (tId && !termMap.has(tId)) {
            termMap.set(tId, tName || `${VIOLATION_REPORT.FILTERS.TERM} ${termMap.size + 1}`);
          }
        });

        const extractedTerms = Array.from(termMap.entries())
          .map(([value, label]) => ({
            value,
            label,
          }))
          .sort((a, b) => b.label.localeCompare(a.label));

        setTermOptions(extractedTerms);

        if (extractedTerms.length > 0 && !termId) {
          setTermId(extractedTerms[0].value);
        }
      } catch (error) {
        console.error(VIOLATION_REPORT.LOGS.INITIAL_DATA_ERROR, error);
      } finally {
        setFetchingTerms(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!termId || !me) return;

    const fetchSupportingData = async () => {
      try {
        const groupsRes = await ViolationService.getGroups({ termId, pageSize: 100 });
        const groupsData = groupsRes?.data?.items || groupsRes?.items || [];

        // Use all returned groups (backend should handle scoping)
        const myGroups = groupsData || [];

        setGroups(
          myGroups.map((g) => ({
            ...g,
            internshipGroupId: g.internshipGroupId || g.id,
            id: g.id || g.internshipGroupId,
          }))
        );

        // Parallel fetch details for each group to get members
        const groupDetailPromises = myGroups.map(async (g) => {
          try {
            const res = await ViolationService.getGroupDetail(
              g.internshipGroupId || g.internshipId || g.id
            );
            return res;
          } catch (err) {
            console.error(`${VIOLATION_REPORT.LOGS.GROUP_DETAIL_ERROR} ${g.id}:`, err);
            return null; // Continue with null for this specific group
          }
        });

        const detailsRes = await Promise.all(groupDetailPromises);

        // Extract and flatten all members
        const allMembers = [];
        const memberIds = new Set();

        detailsRes.forEach((res) => {
          const detail = res?.data || res;
          if (detail?.members) {
            detail.members.forEach((m) => {
              if (!memberIds.has(m.studentId)) {
                memberIds.add(m.studentId);
                allMembers.push({
                  ...m,
                  id: m.studentId,
                  studentFullName: m.fullName || m.studentFullName,
                  groupStartDate: detail.startDate,
                  groupEndDate: detail.endDate,
                });
              }
            });
          }
        });

        setStudents(allMembers);
      } catch (error) {
        console.error(VIOLATION_REPORT.LOGS.SUPPORTING_DATA_ERROR, error);
      }
    };
    fetchSupportingData();
  }, [termId, me]);

  const handleEdit = useCallback(
    async (record) => {
      try {
        const response = await ViolationService.getById(record.violationReportId || record.id);
        const detailData = response?.data || response;
        if (detailData) {
          // Normalize and preserve IDs from original record
          const normalizedData = {
            ...detailData,
            studentId: detailData.studentId || record.studentId,
            violationReportId:
              detailData.violationReportId ||
              detailData.id ||
              record.violationReportId ||
              record.id,
          };
          openFormModal(normalizedData, false);
        }
      } catch (error) {
        console.error(VIOLATION_REPORT.LOGS.GET_BY_ID_ERROR, error);
        toast.error(getErrorDetail(error, VIOLATION_REPORT.DETAILS_ERROR));
      }
    },
    [openFormModal, toast, VIOLATION_REPORT]
  );

  const handleView = useCallback(
    async (record) => {
      try {
        const response = await ViolationService.getById(record.violationReportId || record.id);
        const detailData = response?.data || response;
        if (detailData) {
          // Normalize and preserve IDs from original record
          const normalizedData = {
            ...detailData,
            studentId: detailData.studentId || record.studentId,
            violationReportId:
              detailData.violationReportId ||
              detailData.id ||
              record.violationReportId ||
              record.id,
          };
          openFormModal(normalizedData, true);
        }
      } catch (error) {
        console.error('GetViolationById failed:', error);
        toast.error(getErrorDetail(error, VIOLATION_REPORT.DETAILS_ERROR));
      }
    },
    [openFormModal, toast, VIOLATION_REPORT]
  );

  const handleDelete = useCallback(async () => {
    const { record } = deleteModalState;
    if (!record) return;

    setSubmitLoading(true);
    try {
      await ViolationService.delete(record.violationReportId || record.id);
      toast.success(VIOLATION_REPORT.DELETE_SUCCESS);
      setDeleteModalState({ open: false, record: null });
      fetchData();
    } catch (error) {
      toast.error(getErrorDetail(error, VIOLATION_REPORT.DELETE_FAIL));
    } finally {
      setSubmitLoading(false);
    }
  }, [deleteModalState, fetchData, toast, setDeleteModalState, VIOLATION_REPORT]);

  const mentorOptions = useMemo(() => {
    const mentorMap = new Map();

    // Collect from groups
    groups.forEach((g) => {
      if (g.mentorId && (g.mentorName || g.mentorFullName)) {
        mentorMap.set(g.mentorId, g.mentorName || g.mentorFullName);
      }
    });

    // Collect from current data (reports) to ensure all visible reporters are in the filter
    data.forEach((r) => {
      if (r.createdBy && r.mentorName) {
        mentorMap.set(r.createdBy, r.mentorName);
      }
    });

    return Array.from(mentorMap.entries()).map(([value, label]) => ({
      value,
      label,
    }));
  }, [groups, data]);

  const studentOptions = useMemo(() => {
    return students.map((s) => ({
      label: `${s.fullName || s.studentFullName} (${s.studentCode})`,
      value: s.studentId || s.id,
    }));
  }, [students]);

  const handleSaveModal = useCallback(
    async (payload) => {
      setSubmitLoading(true);
      console.log('handleSaveModal payload:', payload);
      console.log('handleSaveModal editingRecord:', editingRecord);
      try {
        const id =
          payload.violationReportId || editingRecord?.violationReportId || editingRecord?.id;
        const isUpdate = !!id;
        console.log('isUpdate:', isUpdate, 'id:', id);

        if (isUpdate) {
          await ViolationService.update(id, {
            ...payload,
            lastUpdate: editingRecord?.updatedAt || editingRecord?.lastUpdate,
            forceUpdate: true,
          });
          toast.success(VIOLATION_REPORT.UPDATE_SUCCESS);
        } else {
          await ViolationService.create(payload);
          toast.success(VIOLATION_REPORT.CREATE_SUCCESS);
        }

        setModalVisible(false);
        fetchData();
      } catch (error) {
        toast.error(getErrorDetail(error, VIOLATION_REPORT.SAVE_ERROR));
      } finally {
        setSubmitLoading(false);
      }
    },
    [editingRecord, fetchData, toast, setModalVisible, VIOLATION_REPORT]
  );

  return {
    data,
    loading,
    searchTerm,
    groupIdFilter,
    createdByIdFilter,
    dateRange,
    pagination,
    modalVisible,
    submitLoading,
    editingRecord,
    viewOnly,
    deleteModalState,
    students,
    groups,

    setModalVisible,
    handleSearchChange,
    handleGroupChange,
    handleCreatedByChange,
    handleDateRangeChange,
    handleTableChange,
    handleCreateNew,
    handleEdit,
    handleView,
    handleRequestDelete,
    handleDelete,
    handleSaveModal,
    resetFilters,
    termId,
    setTermId,
    termOptions,
    fetchingTerms,
    studentOptions,
    mentorOptions,
  };
};

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useCallback, useEffect } from 'react';

import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { USER_ROLE } from '@/constants/user-management/enums';
import { useToast } from '@/providers/ToastProvider';
import { useAuthStore } from '@/store/useAuthStore';
import { getErrorDetail } from '@/utils/errorUtils';

import { ViolationService } from '../services/violation.service';
import { useViolationFilters } from './useViolationFilters';
import { useViolationModals } from './useViolationModals';

export const useViolationManagement = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { phaseId } = useParams();
  const { VIOLATION_REPORT } = INTERNSHIP_MANAGEMENT_UI.ENTERPRISE;

  const {
    searchTerm,
    groupIdFilter,
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
    handleDateRangeChange,
    handleTableChange,
    resetFilters,
  } = useViolationFilters(phaseId);

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

  // 1. Get User Profile from Store (Instant)
  const user = useAuthStore((state) => state.user);

  const { data: initialGroupsData } = useQuery({
    queryKey: ['violation-initial-groups', user?.userId || user?.id],
    queryFn: async () => {
      setFetchingTerms(true);
      try {
        const groupsRes = await ViolationService.getGroups({ pageSize: 100 });
        return groupsRes?.data?.items || groupsRes?.items || groupsRes?.data || [];
      } finally {
        setFetchingTerms(false);
      }
    },
    enabled: !!user,
    staleTime: 30 * 60 * 1000,
  });

  // AC: Robustly initialize terms and the first selected term even if data is from cache
  useEffect(() => {
    if (initialGroupsData && Array.isArray(initialGroupsData) && initialGroupsData.length > 0) {
      const termMap = new Map();
      initialGroupsData.forEach((g) => {
        const tId = g.termId || g.internshipTermId || g.internshipId;
        const tName = g.term || g.termName || g.internshipTermName || g.groupName;
        if (tId && !termMap.has(tId)) {
          termMap.set(tId, tName || `${VIOLATION_REPORT.FILTERS.TERM} ${termMap.size + 1}`);
        }
      });

      const extractedTerms = Array.from(termMap.entries())
        .map(([value, label]) => ({ value, label }))
        .sort((a, b) => b.label.localeCompare(a.label));

      setTermOptions(extractedTerms);

      // Auto-select the first term if none is selected
      if (extractedTerms.length > 0 && !termId) {
        setTermId(extractedTerms[0].value);
      }
    }
  }, [initialGroupsData, termId, setTermId, setTermOptions, VIOLATION_REPORT]);

  // 3. Supporting Data: Fetch Groups and Students for the selected Term
  const { data: supportingData = { groups: [], students: [] }, isLoading: loadingSupporting } =
    useQuery({
      queryKey: ['violation-supporting-data', termId, user?.userId || user?.id],
      queryFn: async () => {
        if (!termId || !user) return { groups: [], students: [] };

        const groupsRes = await ViolationService.getGroups({ termId, pageSize: 100 });
        const groupsData = (
          groupsRes?.data?.items ||
          groupsRes?.items ||
          groupsRes?.data ||
          []
        ).map((g) => ({
          ...g,
          internshipGroupId: g.internshipGroupId || g.id || g.internshipId,
          id: g.id || g.internshipGroupId || g.internshipId,
        }));

        // Fetch members for each group
        const detailsRes = await Promise.all(
          groupsData.map((g) =>
            ViolationService.getGroupDetail(g.internshipGroupId || g.id).catch(() => null)
          )
        );

        const allMembers = [];
        const memberIds = new Set();
        detailsRes.forEach((res) => {
          const detail = res?.data || res;
          // The Swagger shows students inside detail.members (if detail is res.data)
          // or detail.data.members (if detail is the whole response)
          const membersList = detail?.members || detail?.data?.members || [];

          if (Array.isArray(membersList)) {
            membersList.forEach((m) => {
              const sId = m.studentId || m.userId || m.id;
              if (sId && !memberIds.has(sId)) {
                memberIds.add(sId);
                allMembers.push({
                  ...m,
                  id: sId,
                  studentId: sId,
                  studentFullName: m.fullName || m.studentFullName || m.studentName || m.name,
                  studentCode: m.studentCode || m.userCode || m.code,
                  groupStartDate: detail?.startDate || detail?.data?.startDate,
                  groupEndDate: detail?.endDate || detail?.data?.endDate,
                  groupName: detail?.groupName || detail?.data?.groupName,
                });
              }
            });
          }
        });

        return { groups: groupsData, students: allMembers };
      },
      enabled: !!termId && !!user,
      staleTime: 5 * 60 * 1000,
    });

  // 4. Main Query: Fetch Violation Reports
  const {
    data: reportsData = { items: [], totalCount: 0 },
    isLoading: loading,
    refetch: fetchData,
  } = useQuery({
    queryKey: [
      'violation-reports',
      termId,
      pagination.current,
      pagination.pageSize,
      searchTerm,
      groupIdFilter,
      dateRange,
      sortConfig,
    ],
    queryFn: async () => {
      const params = {
        termId,
        PageNumber: pagination.current,
        PageSize: pagination.pageSize,
        SearchTerm: searchTerm || undefined,
        GroupId: groupIdFilter || undefined,
        OccurredFrom: dateRange?.[0]?.format(VIOLATION_REPORT.DATE_FORMATS.API),
        OccurredTo: dateRange?.[1]?.format(VIOLATION_REPORT.DATE_FORMATS.API),
        OrderByCreatedAscending: sortConfig.order === 'asc',
      };

      const res = await ViolationService.getAll(params);
      if (res?.data) {
        setPagination((prev) => ({
          ...prev,
          total: res.data.totalCount || 0,
        }));
      }
      return {
        items: res?.data?.items || [],
        totalCount: res?.data?.totalCount || 0,
      };
    },
    enabled: !!termId,
    staleTime: 2 * 60 * 1000,
  });

  // Mutations
  const updateMutation = useMutation({
    mutationFn: (payload) => {
      const id = payload.violationReportId || editingRecord?.violationReportId || editingRecord?.id;
      if (id) {
        return ViolationService.update(id, {
          ...payload,
          lastUpdate: editingRecord?.updatedAt || editingRecord?.lastUpdate,
          forceUpdate: true,
        });
      }
      return ViolationService.create(payload);
    },
    onSuccess: (_, payload) => {
      const isUpdate = !!(
        payload.violationReportId ||
        editingRecord?.violationReportId ||
        editingRecord?.id
      );
      toast.success(isUpdate ? VIOLATION_REPORT.UPDATE_SUCCESS : VIOLATION_REPORT.CREATE_SUCCESS);
      setModalVisible(false);
      queryClient.invalidateQueries({ queryKey: ['violation-reports'] });
    },
    onError: (error) => {
      toast.error(getErrorDetail(error, VIOLATION_REPORT.SAVE_ERROR));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (record) => ViolationService.delete(record.violationReportId || record.id),
    onSuccess: () => {
      toast.success(VIOLATION_REPORT.DELETE_SUCCESS);
      setDeleteModalState({ open: false, record: null });
      queryClient.invalidateQueries({ queryKey: ['violation-reports'] });
    },
    onError: (error) => {
      toast.error(getErrorDetail(error, VIOLATION_REPORT.DELETE_FAIL));
    },
  });

  const handleEdit = useCallback(
    async (record) => {
      try {
        const res = await ViolationService.getById(record.violationReportId || record.id);
        const detailData = res?.data || res;
        if (detailData) {
          openFormModal(
            {
              ...detailData,
              studentId: detailData.studentId || record.studentId,
              violationReportId:
                detailData.violationReportId || detailData.id || record.violationReportId,
            },
            false
          );
        }
      } catch (err) {
        toast.error(getErrorDetail(err, VIOLATION_REPORT.DETAILS_ERROR));
      }
    },
    [openFormModal, toast, VIOLATION_REPORT]
  );

  const handleView = useCallback(
    async (record) => {
      try {
        const res = await ViolationService.getById(record.violationReportId || record.id);
        const detailData = res?.data || res;
        if (detailData) {
          openFormModal(
            {
              ...detailData,
              studentId: detailData.studentId || record.studentId,
              violationReportId:
                detailData.violationReportId || detailData.id || record.violationReportId,
            },
            true
          );
        }
      } catch (err) {
        toast.error(getErrorDetail(err, VIOLATION_REPORT.DETAILS_ERROR));
      }
    },
    [openFormModal, toast, VIOLATION_REPORT]
  );

  const studentOptions = (supportingData.students || []).map((s) => ({
    label: `${s.fullName || s.studentFullName} (${s.studentCode})`,
    value: s.studentId || s.id,
  }));

  return {
    data: reportsData.items,
    loading: loading || loadingSupporting,
    searchTerm,
    groupIdFilter,
    dateRange,
    pagination,
    modalVisible,
    submitLoading: updateMutation.isPending || deleteMutation.isPending,
    editingRecord,
    viewOnly,
    deleteModalState,
    students: supportingData.students,
    groups: supportingData.groups,

    setModalVisible,
    handleSearchChange,
    handleGroupChange,
    handleDateRangeChange,
    handleTableChange,
    handleCreateNew,
    handleEdit,
    handleView,
    handleRequestDelete,
    handleDelete: () => deleteMutation.mutate(deleteModalState.record),
    handleSaveModal: (payload) => updateMutation.mutate(payload),
    resetFilters,
    termId,
    setTermId,
    termOptions,
    fetchingTerms,
    studentOptions,
    isMentor: (() => {
      const rawRole = user?.roleId || user?.RoleId || user?.role || user?.Role;
      const roleId = rawRole ? Number(rawRole) : null;
      const roleName = String(
        user?.roleName || user?.RoleName || user?.role || user?.Role || ''
      ).toLowerCase();

      // Check numeric IDs
      if (
        roleId === USER_ROLE.MENTOR ||
        roleId === USER_ROLE.HR ||
        roleId === USER_ROLE.ENTERPRISE_ADMIN
      )
        return true;

      // Check string name fallbacks
      if (roleName.includes('mentor') || roleName.includes('hr') || roleName.includes('admin'))
        return true;

      return false;
    })(),
    fetchData,
  };
};

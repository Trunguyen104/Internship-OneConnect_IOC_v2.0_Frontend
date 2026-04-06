'use client';

import { useQuery } from '@tanstack/react-query';
import { useCallback, useRef, useState } from 'react';

import { StudentService } from '@/components/features/internship-enrollment-management/services/student.service';
import { userService } from '@/components/features/user/services/user.service';
import { USER_ROLE } from '@/constants/common/enums';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { useToast } from '@/providers/ToastProvider';
import { universityService } from '@/services/university.service';
import { useTermsStore } from '@/store/useTermsStore';
import { getErrorDetail } from '@/utils/errorUtils';

import { TermService } from '../services/term.service';
import { useTermFilters } from './useTermFilters';
import { useTermModals } from './useTermModals';

export const useTermManagement = () => {
  const toast = useToast();
  const [submitLoading, setSubmitLoading] = useState(false);
  const { refreshCount } = useTermsStore();
  const knownVersions = useRef({});

  const {
    searchTerm,
    statusFilter,
    sortConfig,
    pagination,
    setPagination,
    handleSearchChange,
    handleStatusChange,
    handleTableChange,
    handlePageSizeChange,
    handleSortChange,
  } = useTermFilters();

  const {
    modalVisible,
    setModalVisible,
    editingRecord,
    viewOnly,
    statusModalState,
    setStatusModalState,
    deleteModalState,
    setDeleteModalState,
    handleCreateNew,
    openFormModal,
    handleRequestDelete,
    handleRequestChangeStatus,
  } = useTermModals();

  // 1. Fetch User Role and Universities
  const { data: roleData = { isSuperAdmin: false, universities: [], userUniversity: null } } =
    useQuery({
      queryKey: ['term-management-role-context'],
      queryFn: async () => {
        try {
          const res = await userService.getMe();
          const userData = res?.data || res;
          const role = userData?.role;
          const superAdmin =
            role === USER_ROLE.SUPER_ADMIN || String(role).toLowerCase() === 'superadmin';

          let universities = [];
          let userUniversity = null;

          if (superAdmin) {
            const uniRes = await universityService.getAll({ pageNumber: 1, pageSize: 100 });
            universities = uniRes?.data?.items || [];
          } else {
            const uniId = userData?.universityId || userData?.university?.id;
            const uniName = userData?.universityName || userData?.university?.name;
            userUniversity = { id: uniId, name: uniName };

            if (uniId && !uniName) {
              try {
                const res = await universityService.getById(uniId, { silent: true });
                if (res?.data?.name) userUniversity.name = res.data.name;
              } catch (err) {}
            }
          }
          return { isSuperAdmin: superAdmin, universities, userUniversity };
        } catch (err) {
          return { isSuperAdmin: false, universities: [], userUniversity: null };
        }
      },
      staleTime: Infinity,
    });

  const { isSuperAdmin, universities, userUniversity } = roleData;

  // 2. Fetch Terms List
  const {
    data: termsResult = { items: [], totalCount: 0 },
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: [
      'terms-list',
      pagination.current,
      pagination.pageSize,
      searchTerm,
      statusFilter,
      sortConfig,
      refreshCount,
    ],
    queryFn: async () => {
      try {
        const params = {
          pageNumber: pagination.current,
          pageSize: pagination.pageSize,
          searchTerm: searchTerm || undefined,
          status: statusFilter ?? undefined,
          sortColumn: sortConfig.column,
          sortOrder: sortConfig.order,
        };

        const response = await TermService.getAll(params);
        if (response?.data) {
          const items = (response.data.items || []).map((item) => ({
            ...item,
            version: item.version || knownVersions.current[item.termId] || 1,
          }));

          setPagination((prev) => ({
            ...prev,
            total: response.data.totalCount || 0,
          }));

          return {
            items,
            totalCount: response.data.totalCount || 0,
          };
        }
        return { items: [], totalCount: 0 };
      } catch (error) {
        toast.error(
          getErrorDetail(
            error,
            INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.MESSAGES.LOAD_ERROR
          )
        );
        throw error;
      }
    },
    staleTime: 0,
  });

  const handleEdit = useCallback(
    async (record) => {
      try {
        setSubmitLoading(true);
        const [termRes, enrollmentRes] = await Promise.all([
          TermService.getById(record.termId),
          StudentService.getAll(record.termId, { pageSize: 1 }),
        ]);

        if (termRes?.data) {
          const detailData = {
            ...termRes.data,
            totalEnrolled: enrollmentRes?.data?.totalCount ?? termRes.data.totalEnrolled,
          };
          openFormModal(detailData, false);
        }
      } catch (error) {
        toast.error(
          getErrorDetail(
            error,
            INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.MESSAGES.DETAILS_ERROR
          )
        );
      } finally {
        setSubmitLoading(false);
      }
    },
    [openFormModal, toast]
  );

  const handleView = useCallback(
    async (record) => {
      try {
        setSubmitLoading(true);
        const [termRes, enrollmentRes] = await Promise.all([
          TermService.getById(record.termId),
          StudentService.getAll(record.termId, { pageSize: 1 }),
        ]);

        if (termRes?.data) {
          const detailData = {
            ...termRes.data,
            totalEnrolled: enrollmentRes?.data?.totalCount ?? termRes.data.totalEnrolled,
          };
          openFormModal(detailData, true);
        }
      } catch (error) {
        toast.error(
          getErrorDetail(
            error,
            INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.MESSAGES.DETAILS_ERROR
          )
        );
      } finally {
        setSubmitLoading(false);
      }
    },
    [openFormModal, toast]
  );

  const handleDelete = useCallback(async () => {
    const { record } = deleteModalState;
    if (!record) return;

    setSubmitLoading(true);
    try {
      await TermService.delete(record.termId);
      toast.success(INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.MESSAGES.DELETE_SUCCESS);
      setDeleteModalState({ open: false, record: null });
      useTermsStore.increment();
      refetch();
    } catch (error) {
      toast.error(
        getErrorDetail(
          error,
          INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.MESSAGES.DELETE_ERROR
        )
      );
    } finally {
      setSubmitLoading(false);
    }
  }, [deleteModalState, refetch, toast, setDeleteModalState]);

  const handleChangeStatus = useCallback(
    async (reason) => {
      const { record } = statusModalState;
      if (!record) return;

      setSubmitLoading(true);
      try {
        const response = await TermService.closeTerm(record.termId, {
          Reason:
            reason ||
            INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.MESSAGES.CLOSE_DEFAULT_REASON,
          Version: record.version || knownVersions.current[record.termId] || 1,
        });

        if (response?.data) {
          knownVersions.current[record.termId] = response.data.version;
        }

        toast.success(INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.MESSAGES.STATUS_SUCCESS);
        setStatusModalState({ open: false, record: null, newStatus: null });
        useTermsStore.increment();
        refetch();
      } catch (error) {
        toast.error(
          getErrorDetail(
            error,
            INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.MESSAGES.STATUS_UPDATE_ERROR
          )
        );
      } finally {
        setSubmitLoading(false);
      }
    },
    [statusModalState, refetch, toast, setStatusModalState]
  );

  const handleSaveModal = useCallback(
    async (payload) => {
      setSubmitLoading(true);
      try {
        const termId = editingRecord?.termId || editingRecord?.TermId;
        const isUpdate = !!termId;

        const basePayload = {
          Name: payload.name,
          StartDate: payload.startDate,
          EndDate: payload.endDate,
        };

        if (isSuperAdmin && payload.universityId) {
          basePayload.UniversityId = payload.universityId;
        }

        if (isUpdate) {
          const updatePayload = {
            ...basePayload,
            TermId: termId,
            Version:
              editingRecord.version || editingRecord.Version || knownVersions.current[termId] || 1,
          };
          const response = await TermService.update(termId, updatePayload);

          if (response?.data) {
            knownVersions.current[termId] = response.data.version;
          }
          toast.success(INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.MESSAGES.UPDATE_SUCCESS);
        } else {
          const response = await TermService.create(basePayload);
          if (response?.data?.termId) {
            knownVersions.current[response.data.termId] = response.data.version;
          }
          toast.success(INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.MESSAGES.CREATE_SUCCESS);
        }

        setModalVisible(false);
        useTermsStore.increment();
        refetch();
      } catch (error) {
        toast.error(
          getErrorDetail(
            error,
            INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.MESSAGES.SAVE_ERROR
          )
        );
      } finally {
        setSubmitLoading(false);
      }
    },
    [editingRecord, refetch, toast, setModalVisible, isSuperAdmin]
  );

  return {
    data: termsResult.items,
    loading,
    searchTerm,
    statusFilter,
    sortConfig,
    pagination,
    modalVisible,
    submitLoading,
    editingRecord,
    viewOnly,
    statusModalState,
    deleteModalState,

    setModalVisible,
    setStatusModalState,

    handleSearchChange,
    handleStatusChange,
    handleTableChange,
    handlePageSizeChange,
    handleSortChange,
    handleCreateNew,
    handleEdit,
    handleView,
    handleRequestDelete,
    handleDelete,
    handleRequestChangeStatus,
    handleChangeStatus,
    handleSaveModal,
    isSuperAdmin,
    universities,
    userUniversity,
    fetchData: refetch,
  };
};

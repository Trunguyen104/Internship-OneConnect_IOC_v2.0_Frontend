'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

import { StudentService } from '@/components/features/internship-enrollment-management/services/student.service';
import { userService } from '@/components/features/user/services/userService';
import { USER_ROLE } from '@/constants/common/enums';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { useToast } from '@/providers/ToastProvider';
import { universityService } from '@/services/university.service';
import { getErrorDetail } from '@/utils/errorUtils';

import { TermService } from '../services/term.service';
import { useTermFilters } from './useTermFilters';
import { useTermModals } from './useTermModals';

export const useTermManagement = () => {
  const toast = useToast();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [universities, setUniversities] = useState([]);
  const [userUniversity, setUserUniversity] = useState(null);
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

  const fetchData = useCallback(async () => {
    setLoading(true);
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
        // Apply version syncing if missing in list
        const items = (response.data.items || []).map((item) => ({
          ...item,
          version: item.version || knownVersions.current[item.termId] || 1,
        }));

        setData(items);
        setPagination((prev) => ({
          ...prev,
          total: response.data.totalCount || 0,
        }));
      }
    } catch (error) {
      toast.error(
        getErrorDetail(
          error,
          INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.MESSAGES.LOAD_ERROR
        )
      );
    } finally {
      setLoading(false);
    }
  }, [
    pagination.current,
    pagination.pageSize,
    searchTerm,
    statusFilter,
    sortConfig,
    toast,
    setPagination,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const checkRoleAndFetchUniversities = async () => {
      try {
        const res = await userService.getMe();
        const userData = res?.data || res;
        const role = userData?.role;
        const superAdmin =
          role === USER_ROLE.SUPER_ADMIN || String(role).toLowerCase() === 'superadmin';
        setIsSuperAdmin(superAdmin);

        if (superAdmin) {
          const uniRes = await universityService.getAll({ pageNumber: 1, pageSize: 100 });
          setUniversities(uniRes?.data?.items || []);
        } else {
          // Robust check for universityId and universityName
          const uniId = userData?.universityId || userData?.university?.id;
          const uniName = userData?.universityName || userData?.university?.name;

          setUserUniversity({
            id: uniId,
            name: uniName,
          });

          // If we have an ID but no name, attempt to fetch it for clear UI display
          if (uniId && !uniName) {
            universityService
              .getById(uniId)
              .then((res) => {
                if (res?.data?.name) {
                  setUserUniversity({ id: uniId, name: res.data.name });
                }
              })
              .catch(() => {});
          }
        }
      } catch (error) {
        console.error('Failed to fetch user role or universities:', error);
      }
    };
    checkRoleAndFetchUniversities();
  }, []);

  const handleEdit = useCallback(
    async (record) => {
      try {
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
        console.error('GetTermById failed:', error);
        toast.error(
          getErrorDetail(
            error,
            INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.MESSAGES.DETAILS_ERROR
          )
        );
      }
    },
    [openFormModal, toast]
  );

  const handleView = useCallback(
    async (record) => {
      try {
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
        console.error('GetTermById (View) failed:', error);
        toast.error(
          getErrorDetail(
            error,
            INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.MESSAGES.DETAILS_ERROR
          )
        );
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
      fetchData();
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
  }, [deleteModalState, fetchData, toast, setDeleteModalState]);

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
          setData((prev) =>
            prev.map((item) =>
              item.termId === record.termId ? { ...item, ...response.data } : item
            )
          );
        }

        toast.success(INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.MESSAGES.STATUS_SUCCESS);
        setStatusModalState({ open: false, record: null, newStatus: null });
        fetchData();
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
    [statusModalState, fetchData, toast, setStatusModalState]
  );

  const handleSaveModal = useCallback(
    async (payload) => {
      setSubmitLoading(true);
      try {
        const isUpdate = !!editingRecord?.termId;
        const termId = editingRecord?.termId;

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
            Version: editingRecord.version || knownVersions.current[termId] || 1,
          };
          const response = await TermService.update(termId, updatePayload);

          if (response?.data) {
            knownVersions.current[termId] = response.data.version;
            setData((prev) =>
              prev.map((item) => (item.termId === termId ? { ...item, ...response.data } : item))
            );
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
        fetchData();
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
    [editingRecord, fetchData, toast, setModalVisible, isSuperAdmin]
  );

  return {
    data,
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
  };
};

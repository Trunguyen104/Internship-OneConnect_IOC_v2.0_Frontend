'use client';

import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

import { showDeleteConfirm } from '@/components/ui/deleteconfirm';
import {
  ENROLLMENT_STATUS,
  INTERNSHIP_MANAGEMENT_UI,
  PLACEMENT_STATUS,
} from '@/constants/internship-management/internship-management';
import { useToast } from '@/providers/ToastProvider';
import { getErrorDetail } from '@/utils/errorUtils';

import { StudentService } from '../services/student.service';
import { useStudentFilters } from './useStudentFilters';
import { useStudentModals } from './useStudentModals';

export const useStudentEnrollment = () => {
  const toast = useToast();
  const { ENROLLMENT_MANAGEMENT } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN;
  const { MESSAGES } = ENROLLMENT_MANAGEMENT;

  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const {
    termId,
    searchTerm,
    debouncedSearchTerm,
    statusFilter,
    sortBy,
    sortOrder,
    pagination,
    setPagination,
    handleTermChange,
    handleSearchChange,
    handleStatusChange,
    handlePageChange,
    handlePageSizeChange,
    handleSortChange,
  } = useStudentFilters();

  const {
    addVisible,
    setAddVisible,
    editVisible,
    setEditVisible,
    importVisible,
    setImportVisible,
    detailsVisible,
    setDetailsVisible,
    selectedRecord,
    handleOpenAdd,
    handleOpenEdit,
    handleOpenDetails,
  } = useStudentModals();

  const { current, pageSize } = pagination;

  // 1. Fetch Students with useQuery
  const {
    data: studentData = { items: [], total: 0 },
    isLoading: loading,
    refetch: fetchStudents,
  } = useQuery({
    queryKey: [
      'students-enrollment',
      termId,
      current,
      pageSize,
      debouncedSearchTerm,
      statusFilter,
      sortBy,
      sortOrder,
    ],
    queryFn: async () => {
      if (!termId) return { items: [], total: 0 };
      try {
        const params = {
          pageNumber: current,
          pageSize: pageSize,
          searchTerm: debouncedSearchTerm || undefined,
          enrollmentStatus: statusFilter === 'WITHDRAWN' ? ENROLLMENT_STATUS.WITHDRAWN : undefined,
          placementStatus:
            statusFilter === 'PLACED'
              ? PLACEMENT_STATUS.PLACED
              : statusFilter === 'UNPLACED'
                ? PLACEMENT_STATUS.UNPLACED
                : undefined,
          sortBy: sortBy || undefined,
          sortOrder: sortOrder || undefined,
        };

        const response = await StudentService.getAll(termId, params);
        if (response?.data) {
          const items = (response.data.items || []).map(StudentService.mapStudent);
          const total = response.data.totalCount || 0;

          setPagination((prev) => ({ ...prev, total }));
          return { items, total };
        }
        return { items: [], total: 0 };
      } catch (error) {
        if (error?.silent || error?.status === 401 || error?.status === 403)
          return { items: [], total: 0 };
        toast.error(getErrorDetail(error, MESSAGES.LOAD_ERROR));
        throw error;
      }
    },
    enabled: !!termId,
    staleTime: 2 * 60 * 1000,
  });

  const handleDelete = useCallback(
    (student) => {
      if (student.placementStatus === 'PLACED') {
        toast.error(MESSAGES.WITHDRAW_PLACED_ERROR);
        return;
      }
      showDeleteConfirm({
        title: MESSAGES.DELETE_CONFIRM_TITLE,
        content: MESSAGES.DELETE_CONFIRM_TEXT.replace('{name}', student.name),
        onOk: async () => {
          setSubmitLoading(true);
          try {
            await StudentService.withdraw(student.studentTermId);
            toast.success(MESSAGES.DELETE_SUCCESS);
            fetchStudents();
          } catch (error) {
            toast.error(getErrorDetail(error, MESSAGES.DELETE_ERROR));
          } finally {
            setSubmitLoading(false);
          }
        },
      });
    },
    [toast, MESSAGES, fetchStudents]
  );

  const handleUpdateStudent = useCallback(
    async (values) => {
      if (!selectedRecord) return;
      setSubmitLoading(true);
      try {
        const payload = StudentService.mapStudentForUpdate({
          ...values,
          studentTermId: selectedRecord.studentTermId,
        });
        await StudentService.update(selectedRecord.studentTermId, payload);
        toast.success(MESSAGES.UPDATE_SUCCESS);
        setEditVisible(false);
        fetchStudents();
      } catch (error) {
        toast.error(getErrorDetail(error, MESSAGES.UPDATE_ERROR));
      } finally {
        setSubmitLoading(false);
      }
    },
    [selectedRecord, setEditVisible, toast, MESSAGES, fetchStudents]
  );

  const handleAddStudent = useCallback(
    async (values) => {
      if (!termId) return;
      setSubmitLoading(true);
      try {
        const payload = StudentService.mapStudentForCreate({
          ...values,
          termId: termId,
        });
        await StudentService.create(termId, payload);
        toast.success(MESSAGES.ADD_SUCCESS);
        setAddVisible(false);
        fetchStudents();
      } catch (error) {
        toast.error(getErrorDetail(error, MESSAGES.ADD_ERROR));
      } finally {
        setSubmitLoading(false);
      }
    },
    [termId, setAddVisible, toast, MESSAGES, fetchStudents]
  );

  const handleImportPreview = useCallback(
    async (file) => {
      if (!termId) return null;
      setSubmitLoading(true);
      try {
        const response = await StudentService.importPreview(termId, file);
        return response?.data;
      } catch (error) {
        toast.error(getErrorDetail(error, MESSAGES.IMPORT_ERROR));
        return null;
      } finally {
        setSubmitLoading(false);
      }
    },
    [termId, toast, MESSAGES]
  );

  const handleImportConfirm = useCallback(
    async (validRecords) => {
      if (!termId) return;
      setSubmitLoading(true);
      try {
        const response = await StudentService.importConfirm(termId, validRecords);
        toast.success(
          MESSAGES.IMPORT_BULK_SUCCESS.replace('{count}', response?.data?.importedCount || 0)
        );
        setImportVisible(false);
        fetchStudents();
      } catch (error) {
        toast.error(getErrorDetail(error, MESSAGES.IMPORT_ERROR));
      } finally {
        setSubmitLoading(false);
      }
    },
    [termId, setImportVisible, toast, MESSAGES, fetchStudents]
  );

  const handleBulkWithdraw = useCallback(async () => {
    if (!termId || selectedIds.length === 0) return;

    const { BULK_WITHDRAW } = MESSAGES;
    const students = studentData.items;

    const selectedStudents = students.filter((s) => selectedIds.includes(s.studentTermId));
    const placedStudents = selectedStudents.filter((s) => s.placementStatus === 'PLACED');
    const unplacedStudents = selectedStudents.filter((s) => s.placementStatus === 'UNPLACED');

    const X = unplacedStudents.length;
    const Y = placedStudents.length;

    if (X === 0 && Y > 0) {
      toast.error(BULK_WITHDRAW.ERROR_ALL_PLACED);
      return;
    }

    const confirmText =
      Y === 0
        ? BULK_WITHDRAW.CONFIRM_ALL_UNPLACED.replace('{count}', X)
        : BULK_WITHDRAW.CONFIRM_MIXED.replace('{placedCount}', Y).replace('{unplacedCount}', X);

    showDeleteConfirm({
      title: BULK_WITHDRAW.ACTION_LABEL,
      content: confirmText,
      onOk: async () => {
        setSubmitLoading(true);
        try {
          await StudentService.bulkWithdraw(
            termId,
            unplacedStudents.map((s) => s.studentTermId)
          );

          if (Y === 0) {
            toast.success(BULK_WITHDRAW.SUCCESS_ALL_UNPLACED.replace('{count}', X));
          } else {
            toast.success(
              BULK_WITHDRAW.SUCCESS_MIXED.replace('{unplacedCount}', X).replace('{placedCount}', Y)
            );
          }

          setSelectedIds([]);
          fetchStudents();
        } catch (error) {
          toast.error(BULK_WITHDRAW.ERROR_GENERIC);
        } finally {
          setSubmitLoading(false);
        }
      },
    });
  }, [termId, selectedIds, studentData.items, toast, fetchStudents, MESSAGES]);

  const handleRestore = useCallback(
    async (student) => {
      setSubmitLoading(true);
      try {
        await StudentService.restore(student.studentTermId);
        toast.success(MESSAGES.RESTORE_SUCCESS);
        fetchStudents();
      } catch (error) {
        toast.error(getErrorDetail(error, MESSAGES.RESTORE_ERROR));
      } finally {
        setSubmitLoading(false);
      }
    },
    [toast, MESSAGES, fetchStudents]
  );

  const handleDownloadTemplate = useCallback(async () => {
    if (!termId) return;
    try {
      const response = await StudentService.getTemplate(termId);
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', ENROLLMENT_MANAGEMENT.MODALS.IMPORT.TEMPLATE_FILENAME);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error(getErrorDetail(error, MESSAGES.DOWNLOAD_TEMPLATE_ERROR));
    }
  }, [termId, toast, MESSAGES]);

  const [viewLoading, setViewLoading] = useState(false);
  const handleView = useCallback(
    async (student) => {
      setViewLoading(true);
      try {
        const response = await StudentService.getById(student.studentTermId);
        if (response?.data) {
          handleOpenDetails(StudentService.mapStudent(response.data));
        }
      } catch (error) {
        toast.error(getErrorDetail(error, MESSAGES.DETAIL_LOAD_ERROR));
      } finally {
        setViewLoading(false);
      }
    },
    [handleOpenDetails, toast, MESSAGES]
  );

  return {
    termId,
    searchTerm,
    statusFilter,
    pagination,
    importVisible,
    addVisible,
    editVisible,
    detailsVisible,
    loading: loading || viewLoading,
    submitLoading,
    selectedStudent: selectedRecord,
    students: studentData.items,
    selectedIds,

    onTermChange: handleTermChange,
    onSearchChange: handleSearchChange,
    onStatusChange: handleStatusChange,
    onPageChange: handlePageChange,
    onPageSizeChange: handlePageSizeChange,
    setImportVisible,
    setAddVisible,
    onAdd: handleOpenAdd,
    setEditVisible,
    setDetailsVisible,
    setSelectedIds,

    handleView,
    handleEdit: handleOpenEdit,
    handleDelete,
    handleRestore,
    handleUpdateStudent,
    handleAddStudent,
    handleImportPreview,
    handleImportConfirm,
    handleBulkWithdraw,
    handleDownloadTemplate,
    sortBy,
    sortOrder,
    handleSortChange,
  };
};

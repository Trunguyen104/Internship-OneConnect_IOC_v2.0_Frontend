'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';

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
  const queryClient = useQueryClient();
  const toast = useToast();
  const { ENROLLMENT_MANAGEMENT } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN;
  const { MESSAGES } = ENROLLMENT_MANAGEMENT;

  const [selectedIds, setSelectedIds] = useState([]);
  const [viewId, setViewId] = useState(null);

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

  const queryKey = [
    'students-enrollment',
    termId,
    current,
    pageSize,
    debouncedSearchTerm,
    statusFilter,
    sortBy,
    sortOrder,
  ];

  // 1. Fetch Students
  const { data: studentData = { items: [], total: 0 }, isLoading: loading } = useQuery({
    queryKey,
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

  // 2. Fetch Student Detail
  const studentDetailQuery = useQuery({
    queryKey: ['student-detail', viewId],
    queryFn: async () => {
      try {
        const response = await StudentService.getById(viewId);
        return response?.data ? StudentService.mapStudent(response.data) : null;
      } catch (error) {
        toast.error(getErrorDetail(error, MESSAGES.DETAIL_LOAD_ERROR));
        setViewId(null);
        throw error;
      }
    },
    enabled: !!viewId,
    staleTime: 5 * 60 * 1000,
  });

  const {
    isFetching: viewLoading,
    data: viewedStudent,
    isSuccess: viewSuccess,
  } = studentDetailQuery;

  // Handle successful view
  useEffect(() => {
    if (viewSuccess && viewedStudent && viewId) {
      handleOpenDetails(viewedStudent);
      // Reset viewId on the next tick to avoid cascading render warning
      setTimeout(() => setViewId(null), 0);
    }
  }, [viewSuccess, viewedStudent, viewId, handleOpenDetails]);

  // Mutations
  const { mutate: addStudent, isPending: addLoading } = useMutation({
    mutationFn: (values) => {
      if (!termId) throw new Error(MESSAGES.TERM_ID_REQUIRED);
      const payload = StudentService.mapStudentForCreate({ ...values, termId });
      return StudentService.create(termId, payload);
    },
    onSuccess: () => {
      toast.success(MESSAGES.ADD_SUCCESS);
      setAddVisible(false);
      queryClient.invalidateQueries({ queryKey: ['students-enrollment'] });
    },
    onError: (error) => toast.error(getErrorDetail(error, MESSAGES.ADD_ERROR)),
  });

  const { mutate: updateStudent, isPending: updateLoading } = useMutation({
    mutationFn: (values) => {
      if (!selectedRecord?.studentTermId) throw new Error(MESSAGES.STUDENT_TERM_ID_REQUIRED);
      const payload = StudentService.mapStudentForUpdate({
        ...values,
        studentTermId: selectedRecord.studentTermId,
      });
      return StudentService.update(selectedRecord.studentTermId, payload);
    },
    onSuccess: () => {
      toast.success(MESSAGES.UPDATE_SUCCESS);
      setEditVisible(false);
      queryClient.invalidateQueries({ queryKey: ['students-enrollment'] });
    },
    onError: (error) => toast.error(getErrorDetail(error, MESSAGES.UPDATE_ERROR)),
  });

  const { mutate: withdrawStudent, isPending: withdrawLoading } = useMutation({
    mutationFn: (studentTermId) => StudentService.withdraw(studentTermId),
    onSuccess: () => {
      toast.success(MESSAGES.DELETE_SUCCESS);
      queryClient.invalidateQueries({ queryKey: ['students-enrollment'] });
    },
    onError: (error) => toast.error(getErrorDetail(error, MESSAGES.DELETE_ERROR)),
  });

  const { mutate: restoreStudent, isPending: restoreLoading } = useMutation({
    mutationFn: (studentTermId) => StudentService.restore(studentTermId),
    onSuccess: () => {
      toast.success(MESSAGES.RESTORE_SUCCESS);
      queryClient.invalidateQueries({ queryKey: ['students-enrollment'] });
    },
    onError: (error) => toast.error(getErrorDetail(error, MESSAGES.RESTORE_ERROR)),
  });

  const { mutate: importConfirm, isPending: importLoading } = useMutation({
    mutationFn: (validRecords) => StudentService.importConfirm(termId, validRecords),
    onSuccess: (response) => {
      toast.success(
        MESSAGES.IMPORT_BULK_SUCCESS.replace('{count}', response?.data?.importedCount || 0)
      );
      setImportVisible(false);
      queryClient.invalidateQueries({ queryKey: ['students-enrollment'] });
    },
    onError: (error) => toast.error(getErrorDetail(error, MESSAGES.IMPORT_ERROR)),
  });

  const { mutate: bulkWithdraw, isPending: bulkWithdrawLoading } = useMutation({
    mutationFn: ({ studentTermIds }) => StudentService.bulkWithdraw(termId, studentTermIds),
    onSuccess: (_, variables) => {
      const { unplacedCount, placedCount } = variables;
      const { BULK_WITHDRAW } = MESSAGES;

      if (placedCount === 0) {
        toast.success(BULK_WITHDRAW.SUCCESS_ALL_UNPLACED.replace('{count}', unplacedCount));
      } else {
        toast.success(
          BULK_WITHDRAW.SUCCESS_MIXED.replace('{unplacedCount}', unplacedCount).replace(
            '{placedCount}',
            placedCount
          )
        );
      }
      setSelectedIds([]);
      queryClient.invalidateQueries({ queryKey: ['students-enrollment'] });
    },
    onError: () => toast.error(MESSAGES.BULK_WITHDRAW.ERROR_GENERIC),
  });

  const { mutateAsync: importPreview, isPending: previewLoading } = useMutation({
    mutationFn: (file) => StudentService.importPreview(termId, file),
    onError: (error) => toast.error(getErrorDetail(error, MESSAGES.IMPORT_ERROR)),
  });

  // Handlers
  const handleDelete = useCallback(
    (student) => {
      if (student.placementStatus === 'PLACED') {
        toast.error(MESSAGES.WITHDRAW_PLACED_ERROR);
        return;
      }
      showDeleteConfirm({
        title: MESSAGES.DELETE_CONFIRM_TITLE,
        content: MESSAGES.DELETE_CONFIRM_TEXT.replace('{name}', student.name),
        onOk: () => withdrawStudent(student.studentTermId),
      });
    },
    [withdrawStudent, MESSAGES, toast]
  );

  const handleBulkWithdraw = useCallback(() => {
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
      onOk: () =>
        bulkWithdraw({
          studentTermIds: unplacedStudents.map((s) => s.studentTermId),
          unplacedCount: X,
          placedCount: Y,
        }),
    });
  }, [termId, selectedIds, studentData.items, bulkWithdraw, MESSAGES, toast]);

  const handleView = useCallback((student) => {
    setViewId(student.studentTermId);
  }, []);

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
  }, [termId, toast, MESSAGES, ENROLLMENT_MANAGEMENT.MODALS.IMPORT.TEMPLATE_FILENAME]);

  const submitLoading =
    addLoading ||
    updateLoading ||
    withdrawLoading ||
    restoreLoading ||
    importLoading ||
    bulkWithdrawLoading ||
    previewLoading;

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
    setImportVisible,
    setAddVisible,
    onAdd: handleOpenAdd,
    setEditVisible,
    setDetailsVisible,
    setSelectedIds,

    handleView,
    handleEdit: handleOpenEdit,
    handleDelete,
    handleRestore: useCallback(
      (student) => restoreStudent(student.studentTermId),
      [restoreStudent]
    ),
    handleUpdateStudent: useCallback((values) => updateStudent(values), [updateStudent]),
    handleAddStudent: useCallback((values) => addStudent(values), [addStudent]),
    handleImportPreview: useCallback(
      async (file) => {
        const response = await importPreview(file);
        return response?.data;
      },
      [importPreview]
    ),
    handleImportConfirm: useCallback(
      (validRecords) => importConfirm(validRecords),
      [importConfirm]
    ),
    handleBulkWithdraw,
    handleDownloadTemplate,
    sortBy,
    sortOrder,
    handleSortChange,
  };
};

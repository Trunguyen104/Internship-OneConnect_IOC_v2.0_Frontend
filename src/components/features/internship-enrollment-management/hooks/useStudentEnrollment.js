'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';

import { showDeleteConfirm } from '@/components/ui/deleteconfirm';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { useToast } from '@/providers/ToastProvider';
import { getErrorDetail } from '@/utils/errorUtils';

import { PlacementService } from '../../internship-placement/services/placement.service';
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
  const [bulkAssignVisible, setBulkAssignVisible] = useState(false);

  const {
    termId,
    searchTerm,
    debouncedSearchTerm,
    sortBy,
    sortOrder,
    pagination,
    setPagination,
    handleTermChange,
    handleSearchChange,
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

  const queryKey = [
    'students-enrollment',
    termId,
    current,
    pageSize,
    debouncedSearchTerm,
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
          placementStatus: undefined,
          sortBy: sortBy || undefined,
          sortOrder: sortOrder || undefined,
        };

        const response = await StudentService.getAll(termId, params);
        if (response?.data) {
          // New nested structure: data.items = [ { termId, students: [...] } ]
          const termItem = response.data.items?.[0] || {};
          const studentsRaw = termItem.students || [];
          const items = studentsRaw.map(StudentService.mapStudent);
          const total = response.data.totalCount || items.length;

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
    mutationFn: ({ termId, studentTermId }) => StudentService.withdraw(termId, studentTermId),
    onSuccess: () => {
      toast.success(MESSAGES.DELETE_SUCCESS);
      queryClient.invalidateQueries({ queryKey: ['students-enrollment'] });
    },
    onError: (error) => toast.error(getErrorDetail(error, MESSAGES.DELETE_ERROR)),
  });

  const { mutate: unassignStudent, isPending: unassignLoading } = useMutation({
    mutationFn: (command) => PlacementService.unassignSingle(command),
    onSuccess: () => {
      toast.success(MESSAGES.UNASSIGN_SUCCESS);
      queryClient.invalidateQueries({ queryKey: ['students-enrollment'] });
      queryClient.invalidateQueries({ queryKey: ['semester-students'] });
    },
    onError: (error) => toast.error(getErrorDetail(error, MESSAGES.UNASSIGN_ERROR)),
  });

  const { mutate: bulkUnassignStudent, isPending: bulkUnassignLoading } = useMutation({
    mutationFn: (command) => PlacementService.unassignStudents(command),
    onSuccess: () => {
      toast.success(MESSAGES.BULK_UNASSIGN_SUCCESS);
      setSelectedIds([]);
      queryClient.invalidateQueries({ queryKey: ['students-enrollment'] });
      queryClient.invalidateQueries({ queryKey: ['semester-students'] });
    },
    onError: (error) => toast.error(getErrorDetail(error, 'Bulk unassign failed.')),
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
    onSuccess: () => {
      toast.success(MESSAGES.BULK_WITHDRAW_SUCCESS);
      setSelectedIds([]);
      queryClient.invalidateQueries({ queryKey: ['students-enrollment'] });
    },
    onError: () => toast.error(MESSAGES.BULK_WITHDRAW.ERROR_GENERIC),
  });

  const { mutate: bulkAssign, isPending: bulkAssignLoading } = useMutation({
    mutationFn: (command) => PlacementService.bulkAssign(command),
    onSuccess: (res) => {
      if (res?.success === false) {
        toast.error(res?.message || MESSAGES.BULK_ASSIGN.ERROR_GENERIC);
      } else {
        toast.success(
          MESSAGES.BULK_ASSIGN_SUCCESS.replace('{count}', selectedIds.length).replace(
            '{enterprise}',
            res?.data?.enterpriseName || 'Enterprise'
          )
        );
        setBulkAssignVisible(false);
        setSelectedIds([]);
        queryClient.invalidateQueries({ queryKey: ['students-enrollment'] });
        queryClient.invalidateQueries({ queryKey: ['semester-students'] });
      }
    },
    onError: (error) => toast.error(getErrorDetail(error, MESSAGES.BULK_ASSIGN.ERROR_GENERIC)),
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
        onOk: () => withdrawStudent({ termId, studentTermId: student.studentTermId }),
      });
    },
    [withdrawStudent, termId, MESSAGES, toast]
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

  const handleUnassign = useCallback(
    (student) => {
      showDeleteConfirm({
        title: 'Cancel Placement',
        content: `Are you sure you want to cancel the placement for ${student.name}? This will return the student to Unplaced status.`,
        okText: 'Confirm Cancellation',
        okType: 'danger',
        onOk: () =>
          unassignStudent({
            studentId: student.studentId,
            termId: termId,
          }),
      });
    },
    [unassignStudent, termId]
  );

  const handleBulkUnassign = useCallback(() => {
    const eligibleIds = studentData.items
      .filter((s) => selectedIds.includes(s.studentTermId))
      .filter((s) => s.placementStatus === 'PLACED' || s.placementStatus === 'PENDING_ASSIGNMENT')
      .map((s) => s.studentId);

    if (eligibleIds.length === 0) return;

    showDeleteConfirm({
      title: MESSAGES.BULK_UNASSIGN.ACTION_LABEL,
      content: MESSAGES.BULK_UNASSIGN.CONFIRM_TEXT.replace('{count}', eligibleIds.length),
      okType: 'danger',
      onOk: () =>
        bulkUnassignStudent({
          studentIds: eligibleIds,
          termId: termId,
        }),
    });
  }, [selectedIds, studentData.items, bulkUnassignStudent, termId, MESSAGES.BULK_UNASSIGN]);

  const handleBulkAssign = useCallback(
    (values) => {
      const studentIds = studentData.items
        .filter((s) => selectedIds.includes(s.studentTermId))
        .map((s) => s.studentId);

      if (studentIds.length === 0) return;

      bulkAssign({
        studentIds,
        enterpriseId: values.enterpriseId,
        internPhaseId: values.internPhaseId,
        force: values.force ?? true,
      });
    },
    [selectedIds, studentData.items, bulkAssign]
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
  }, [termId, toast, MESSAGES, ENROLLMENT_MANAGEMENT.MODALS.IMPORT.TEMPLATE_FILENAME]);

  const submitLoading =
    addLoading ||
    updateLoading ||
    withdrawLoading ||
    unassignLoading ||
    bulkUnassignLoading ||
    importLoading ||
    bulkWithdrawLoading ||
    previewLoading ||
    bulkAssignLoading;
  const handleUpdateStudent = useCallback((values) => updateStudent(values), [updateStudent]);

  const handleAddStudent = useCallback((values) => addStudent(values), [addStudent]);

  const handleImportPreview = useCallback(
    async (file) => {
      const response = await importPreview(file);
      return response?.data;
    },
    [importPreview]
  );

  const handleImportConfirm = useCallback(
    (validRecords) => importConfirm(validRecords),
    [importConfirm]
  );
  return {
    termId,
    searchTerm,
    pagination: { ...pagination, total: studentData.total },
    importVisible,
    addVisible,
    editVisible,
    detailsVisible,
    loading: loading || viewLoading,
    submitLoading,
    selectedStudent: selectedRecord,
    students: studentData.items,
    selectedIds,
    bulkAssignVisible,

    onTermChange: handleTermChange,
    onSearchChange: handleSearchChange,
    onPageChange: handlePageChange,
    onPageSizeChange: handlePageSizeChange,
    setImportVisible,
    setAddVisible,
    onAdd: handleOpenAdd,
    setEditVisible,
    setDetailsVisible,
    setSelectedIds,
    setBulkAssignVisible,

    handleView,
    handleEdit: handleOpenEdit,
    handleDelete,
    handleUnassign,
    handleBulkUnassign: handleBulkUnassign,
    handleUpdateStudent,
    handleAddStudent,
    handleImportPreview,
    handleImportConfirm,
    handleBulkWithdraw,
    handleBulkAssign,
    handleDownloadTemplate,
    sortBy,
    sortOrder,
    handleSortChange,
  };
};

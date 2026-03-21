import { useCallback, useEffect, useMemo, useState } from 'react';

import { showDeleteConfirm } from '@/components/ui/deleteconfirm';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { useToast } from '@/providers/ToastProvider';

import { StudentService } from '../services/student.service';
import { useStudentFilters } from './useStudentFilters';
import { useStudentModals } from './useStudentModals';

export const useStudentEnrollment = (initialStudents) => {
  const toast = useToast();
  const { STUDENT_ENROLLMENT } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN;
  const { MESSAGES } = STUDENT_ENROLLMENT;

  const [students, setStudents] = useState(() =>
    (initialStudents || []).map(StudentService.mapStudent)
  );
  const [submitLoading, setSubmitLoading] = useState(false);

  const {
    searchTerm,
    statusFilter,
    majorFilter,
    pagination,
    setPagination,
    handleSearchChange,
    handleStatusChange,
    handleMajorChange,
    handlePageChange,
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
    handleOpenEdit,
    handleOpenDetails,
  } = useStudentModals();

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter ? s.status === statusFilter : true;
      const matchMajor = majorFilter ? s.major === majorFilter : true;
      return matchSearch && matchStatus && matchMajor;
    });
  }, [students, searchTerm, statusFilter, majorFilter]);

  // Sync pagination total when filtered list changes
  useEffect(() => {
    setPagination((prev) => ({ ...prev, total: filteredStudents.length }));
  }, [filteredStudents.length, setPagination]);

  const handleDelete = useCallback(
    (student) => {
      showDeleteConfirm({
        title: MESSAGES.DELETE_CONFIRM_TITLE,
        content: MESSAGES.DELETE_CONFIRM_TEXT.replace('{name}', student.name),
        onOk: async () => {
          setSubmitLoading(true);
          try {
            await StudentService.delete(student.id);
            setStudents((prev) => prev.filter((s) => s.id !== student.id));
            toast.success(MESSAGES.DELETE_SUCCESS);
          } catch (_error) {
            toast.error(MESSAGES.DELETE_ERROR);
          } finally {
            setSubmitLoading(false);
          }
        },
      });
    },
    [toast, MESSAGES]
  );

  const handleUpdateStudent = useCallback(
    async (values) => {
      setSubmitLoading(true);
      try {
        const updated = StudentService.mapStudent({ ...selectedRecord, ...values });
        await StudentService.update(selectedRecord.id, updated);
        setStudents((prev) => prev.map((s) => (s.id === selectedRecord.id ? updated : s)));
        setEditVisible(false);
        setDetailsVisible(false);
        toast.success(MESSAGES.UPDATE_SUCCESS);
      } catch (_error) {
        toast.error(MESSAGES.UPDATE_ERROR);
      } finally {
        setSubmitLoading(false);
      }
    },
    [selectedRecord, setEditVisible, setDetailsVisible, toast, MESSAGES]
  );

  const handleAddStudent = useCallback(
    async (values) => {
      setSubmitLoading(true);
      try {
        const newStudent = StudentService.mapStudent({
          ...values,
          id: values.studentCode, // mapStudent will handle normalization
          status: 'INTERNSHIP',
        });
        await StudentService.create(newStudent);
        setStudents((prev) => [newStudent, ...prev]);
        setAddVisible(false);
        toast.success(MESSAGES.ADD_SUCCESS);
      } catch (_error) {
        toast.error(MESSAGES.ADD_ERROR);
      } finally {
        setSubmitLoading(false);
      }
    },
    [setAddVisible, toast, MESSAGES]
  );

  const handleImportStudents = useCallback(
    async (importedStudents) => {
      setSubmitLoading(true);
      try {
        const validStudents = importedStudents
          .filter((s) => s.valid)
          .map(StudentService.mapStudent);
        await StudentService.importStudents(validStudents);
        setStudents((prev) => [...validStudents, ...prev]);
        setImportVisible(false);
        toast.success(MESSAGES.IMPORT_BULK_SUCCESS.replace('{count}', validStudents.length));
      } catch (_error) {
        toast.error(MESSAGES.IMPORT_ERROR);
      } finally {
        setSubmitLoading(false);
      }
    },
    [setImportVisible, toast, MESSAGES]
  );

  return {
    searchTerm,
    statusFilter,
    majorFilter,
    pagination,
    importVisible,
    addVisible,
    editVisible,
    detailsVisible,
    submitLoading,
    selectedStudent: selectedRecord,
    filteredStudents,

    setSearchTerm: handleSearchChange, // maintain old naming for internal consistency if needed
    setStatusFilter: handleStatusChange,
    setMajorFilter: handleMajorChange,
    setCurrentPage: handlePageChange,
    setImportVisible,
    setAddVisible,
    setEditVisible,
    setDetailsVisible,

    handleView: handleOpenDetails,
    handleEdit: handleOpenEdit,
    handleDelete,
    handleUpdateStudent,
    handleAddStudent,
    handleImportStudents,
  };
};

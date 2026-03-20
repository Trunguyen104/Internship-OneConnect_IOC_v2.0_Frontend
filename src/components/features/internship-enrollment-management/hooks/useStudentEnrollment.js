import { useCallback, useEffect, useMemo, useState } from 'react';

import { showDeleteConfirm } from '@/components/ui/deleteconfirm';
import { useToast } from '@/providers/ToastProvider';

import { StudentService } from '../services/student.service';
import { useStudentFilters } from './useStudentFilters';
import { useStudentModals } from './useStudentModals';

export const useStudentEnrollment = (initialStudents) => {
  const toast = useToast();
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
        title: 'Delete Student',
        content: `Are you sure you want to delete student "${student.name}"? This action cannot be undone.`,
        onOk: async () => {
          setSubmitLoading(true);
          try {
            await StudentService.delete(student.id);
            setStudents((prev) => prev.filter((s) => s.id !== student.id));
            toast.success('Student deleted successfully');
          } catch (_error) {
            toast.error('Failed to delete student');
          } finally {
            setSubmitLoading(false);
          }
        },
      });
    },
    [toast]
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
        toast.success('Student updated successfully');
      } catch (_error) {
        toast.error('Update failed');
      } finally {
        setSubmitLoading(false);
      }
    },
    [selectedRecord, setEditVisible, setDetailsVisible, toast]
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
        toast.success('Student added successfully');
      } catch (_error) {
        toast.error('Failed to add student');
      } finally {
        setSubmitLoading(false);
      }
    },
    [setAddVisible, toast]
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
        toast.success(`Successfully imported ${validStudents.length} students`);
      } catch (_error) {
        toast.error('Data import failed');
      } finally {
        setSubmitLoading(false);
      }
    },
    [setImportVisible, toast]
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

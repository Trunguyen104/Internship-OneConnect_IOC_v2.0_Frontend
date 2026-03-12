'use client';
import { useState, useMemo, useCallback } from 'react';

export const useStudentEnrollment = (initialStudents) => {
  const [students, setStudents] = useState(initialStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [majorFilter, setMajorFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [importVisible, setImportVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

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

  const handleView = useCallback((student) => {
    setSelectedStudent(student);
    setDetailsVisible(true);
  }, []);

  const handleEdit = useCallback((student) => {
    setSelectedStudent(student);
    setEditVisible(true);
  }, []);

  const handleDelete = useCallback((student) => {
    console.log('Delete student', student);
    // Implementation for delete logic could go here
    // setStudents(prev => prev.filter(s => s.id !== student.id));
  }, []);

  const handleUpdateStudent = useCallback((updatedStudent) => {
    setStudents((prev) => prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)));
    setEditVisible(false);
    setDetailsVisible(false);
  }, []);

  const handleAddStudent = useCallback((newStudent) => {
    setStudents((prev) => [newStudent, ...prev]);
    setAddVisible(false);
  }, []);

  const handleImportStudents = useCallback((importedStudents) => {
    const validStudents = importedStudents.filter((s) => s.valid);
    setStudents((prev) => [...validStudents, ...prev]);
    setImportVisible(false);
  }, []);

  return {
    // State
    searchTerm,
    statusFilter,
    majorFilter,
    currentPage,
    importVisible,
    addVisible,
    editVisible,
    detailsVisible,
    selectedStudent,
    filteredStudents,

    // Setters
    setSearchTerm,
    setStatusFilter,
    setMajorFilter,
    setCurrentPage,
    setImportVisible,
    setAddVisible,
    setEditVisible,
    setDetailsVisible,

    // Actions
    handleView,
    handleEdit,
    handleDelete,
    handleUpdateStudent,
    handleAddStudent,
    handleImportStudents,
  };
};

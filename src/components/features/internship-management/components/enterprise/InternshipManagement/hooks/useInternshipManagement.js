'use client';

import { useState, useMemo, useCallback } from 'react';
import { useToast } from '@/providers/ToastProvider';
import { showDeleteConfirm } from '@/components/ui/DeleteConfirm';
import { MOCK_MENTORS, MOCK_GROUPS } from '../constants/internshipData';

export const useInternshipManagement = (initialStudents) => {
  const toast = useToast();
  const [students, setStudents] = useState(initialStudents);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [mentorFilter, setMentorFilter] = useState(undefined);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const [rejectModal, setRejectModal] = useState({ open: false, student: null });
  const [assignModal, setAssignModal] = useState({ open: false, student: null });
  const [groupModal, setGroupModal] = useState({ open: false, student: null, type: 'ADD' });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredData = useMemo(() => {
    let data = [...students];
    if (search) {
      const s = search.toLowerCase();
      data = data.filter(
        (item) =>
          item.fullName.toLowerCase().includes(s) ||
          item.email.toLowerCase().includes(s) ||
          item.major.toLowerCase().includes(s),
      );
    }
    if (statusFilter !== 'ALL') data = data.filter((item) => item.status === statusFilter);
    if (mentorFilter) data = data.filter((item) => item.mentorId === mentorFilter);
    return data;
  }, [students, search, statusFilter, mentorFilter]);

  const paginatedData = useMemo(() => {
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, pagination]);

  const handleSearchChange = useCallback((value) => {
    setSearch(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  const handleStatusChange = useCallback((value) => {
    setStatusFilter(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  const handleMentorChange = useCallback((value) => {
    setMentorFilter(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  const handleTableChange = useCallback((page) => {
    setPagination((prev) => ({ ...prev, current: page }));
  }, []);

  const handleAcceptStudent = useCallback(
    (student) => {
      showDeleteConfirm({
        title: 'Accept Student',
        content: `Are you sure you want to accept student ${student.fullName}?`,
        okText: 'Accept',
        type: 'warning',
        onOk: () => {
          setStudents((prev) =>
            prev.map((s) => (s.id === student.id ? { ...s, status: 'ACCEPTED' } : s)),
          );
          toast.success('Student accepted successfully');
        },
      });
    },
    [toast],
  );

  const handleAddStudent = useCallback(
    (values) => {
      const newStudent = {
        key: Date.now().toString(),
        id: Date.now(),
        fullName: values.fullName,
        studentId: values.studentId,
        email: values.email,
        major: values.major,
        status: 'PENDING',
        mentorId: null,
        avatar: values.fullName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase(),
      };
      setStudents((prev) => [newStudent, ...prev]);
      setIsAddModalOpen(false);
      toast.success('Student added successfully');
    },
    [toast],
  );

  const handleRejectStudent = useCallback(
    (studentId) => {
      setStudents((prev) =>
        prev.map((s) => (s.id === studentId ? { ...s, status: 'REJECTED' } : s)),
      );
      setRejectModal({ open: false, student: null });
      toast.warning('Internship request rejected');
    },
    [toast],
  );

  const handleAssignMentor = useCallback(
    (studentId, mentorId) => {
      setStudents((prev) => prev.map((s) => (s.id === studentId ? { ...s, mentorId } : s)));
      setAssignModal({ open: false, student: null });
      toast.success('Mentor & Project assigned successfully');
    },
    [toast],
  );

  const handleGroupSubmit = useCallback(
    (values) => {
      const { student, type } = groupModal;
      const selectedGroup = MOCK_GROUPS.find((g) => g.id === values.groupId);

      setStudents((prev) =>
        prev.map((s) =>
          s.id === student.id
            ? {
                ...s,
                groupId: values.groupId,
                mentorId: MOCK_MENTORS.find((m) => m.name === selectedGroup.mentor)?.id || null,
              }
            : s,
        ),
      );

      if (type === 'ADD') {
        toast.success('Added to group successfully');
      } else {
        toast.success('Group changed successfully');
      }

      setGroupModal({ open: false, student: null, type: 'ADD' });
    },
    [groupModal, toast],
  );

  return {
    students,
    search,
    statusFilter,
    mentorFilter,
    pagination,
    filteredData,
    paginatedData,
    rejectModal,
    assignModal,
    groupModal,
    isAddModalOpen,
    setRejectModal,
    setAssignModal,
    setGroupModal,
    setIsAddModalOpen,
    handleSearchChange,
    handleStatusChange,
    handleMentorChange,
    handleTableChange,
    handleAcceptStudent,
    handleAddStudent,
    handleRejectStudent,
    handleAssignMentor,
    handleGroupSubmit,
    setStatusFilter,
  };
};

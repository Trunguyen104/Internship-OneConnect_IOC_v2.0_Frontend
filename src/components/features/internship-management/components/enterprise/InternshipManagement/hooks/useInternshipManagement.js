'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Modal, notification } from 'antd';
import { MOCK_MENTORS, MOCK_GROUPS } from '../constants/internshipData';

export const useInternshipManagement = (initialStudents) => {
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

  const handleAcceptStudent = useCallback((student) => {
    Modal.confirm({
      title: <span className='text-lg font-bold'>Tiếp nhận sinh viên</span>,
      content: `Bạn có chắc muốn tiếp nhận sinh viên ${student.fullName} không?`,
      okText: 'Tiếp nhận',
      cancelText: 'Hủy',
      okButtonProps: {
        className: 'bg-primary hover:bg-red-700 border-none rounded-full px-6 font-bold',
      },
      cancelButtonProps: { className: 'rounded-full px-6 font-bold' },
      onOk: () => {
        setStudents((prev) =>
          prev.map((s) => (s.id === student.id ? { ...s, status: 'ACCEPTED' } : s)),
        );
        notification.success({
          message: 'Thành công',
          description: 'Đã tiếp nhận sinh viên thành công',
        });
      },
    });
  }, []);

  const handleAddStudent = useCallback((values) => {
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
    notification.success({ message: 'Đã thêm sinh viên thành công' });
  }, []);

  const handleRejectStudent = useCallback((studentId) => {
    setStudents((prev) => prev.map((s) => (s.id === studentId ? { ...s, status: 'REJECTED' } : s)));
    setRejectModal({ open: false, student: null });
    notification.warning({ message: 'Đã từ chối tiếp nhận sinh viên' });
  }, []);

  const handleAssignMentor = useCallback((studentId, mentorId) => {
    setStudents((prev) => prev.map((s) => (s.id === studentId ? { ...s, mentorId } : s)));
    setAssignModal({ open: false, student: null });
    notification.success({ message: 'Đã gán Mentor & Dự án thành công' });
  }, []);

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
        notification.success({ message: 'Đã thêm vào nhóm thành công' });
      } else {
        notification.success({
          message: 'Đã đổi nhóm thành công',
          // description: `Lý do: ${values.reason}`,
        });
      }

      setGroupModal({ open: false, student: null, type: 'ADD' });
    },
    [groupModal],
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

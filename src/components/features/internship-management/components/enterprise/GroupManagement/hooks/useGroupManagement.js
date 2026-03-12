'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { App } from 'antd';
import { MOCK_GROUPS } from '../constants/groupData';

export const useGroupManagement = (initialGroups = MOCK_GROUPS) => {
  const { notification, modal } = App.useApp();
  const [groups, setGroups] = useState(initialGroups);
  const [activeTab, setActiveTab] = useState('ALL');
  const [search, setSearch] = useState('');

  const [assignModal, setAssignModal] = useState({ open: false, group: null });
  const [viewModal, setViewModal] = useState({ open: false, group: null });
  const [createModal, setCreateModal] = useState(false);

  const filteredGroups = useMemo(() => {
    let data = [...groups];
    if (activeTab === 'ACTIVE') data = data.filter((g) => g.status === 'ACTIVE');
    if (activeTab === 'ARCHIVED') data = data.filter((g) => g.status === 'ARCHIVED');
    if (search) {
      data = data.filter((g) => g.name.toLowerCase().includes(search.toLowerCase()));
    }
    return data;
  }, [groups, activeTab, search]);

  const handleAssignSubmit = useCallback(
    (values) => {
      const { group } = assignModal;
      const isChangingMentor = group.mentorId && group.mentorId !== values.mentorId;

      setGroups((prev) =>
        prev.map((g) =>
          g.id === group.id
            ? {
                ...g,
                mentorId: values.mentorId,
                project: values.projectId,
              }
            : g,
        ),
      );

      setAssignModal({ open: false, group: null });

      if (isChangingMentor) {
        notification.success({
          message: 'Đã đổi Mentor thành công',
          description: `Lý do: ${values.reason}`,
        });
      } else {
        notification.success({ message: 'Đã gán Mentor & Dự án thành công' });
      }
    },
    [assignModal, notification],
  );

  const handleDeleteGroup = useCallback(
    (group) => {
      if (group.memberCount > 0) {
        notification.error({
          message: 'Thao tác thất bại',
          description:
            'Không thể xóa nhóm còn sinh viên. Vui lòng chuyển toàn bộ sinh viên sang nhóm khác trước.',
          placement: 'top',
        });
        return;
      }

      modal.confirm({
        title: <span className='text-lg font-bold'>Xóa nhóm</span>,
        content: `Bạn có chắc muốn xóa [${group.name}] không?`,
        okText: 'Xóa',
        okType: 'danger',
        cancelText: 'Hủy',
        centered: true,
        onOk() {
          setGroups((prev) => prev.filter((g) => g.id !== group.id));
          notification.success({ message: 'Đã giải thể nhóm thành công' });
        },
      });
    },
    [notification, modal],
  );

  const handleCreateGroup = useCallback(
    (values) => {
      const newGroup = {
        id: `g${Date.now()}`,
        name: values.name,
        track: values.track || 'FRONTEND',
        status: 'ACTIVE',
        mentorId: null,
        memberCount: 0,
        avatars: [],
      };
      setGroups((prev) => [newGroup, ...prev]);
      setCreateModal(false);
      notification.success({ message: 'Đã tạo nhóm thành công' });
    },
    [notification],
  );

  return {
    groups,
    activeTab,
    setActiveTab,
    search,
    setSearch,
    filteredGroups,
    assignModal,
    setAssignModal,
    viewModal,
    setViewModal,
    createModal,
    setCreateModal,
    handleAssignSubmit,
    handleDeleteGroup,
    handleCreateGroup,
  };
};

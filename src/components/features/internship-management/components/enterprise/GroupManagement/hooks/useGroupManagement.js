'use client';

import { useState, useMemo, useCallback } from 'react';
import { useToast } from '@/providers/ToastProvider';
import { showDeleteConfirm } from '@/components/ui/DeleteConfirm';
import { MOCK_GROUPS } from '../constants/groupData';

export const useGroupManagement = (initialGroups = MOCK_GROUPS) => {
  const toast = useToast();
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
        toast.success(`Mentor changed successfully. Reason: ${values.reason}`);
      } else {
        toast.success('Mentor & Project assigned successfully');
      }
    },
    [assignModal, toast],
  );

  const handleDeleteGroup = useCallback(
    (group) => {
      if (group.memberCount > 0) {
        toast.error('Cannot delete group with active students. Please reassign students first.');
        return;
      }

      showDeleteConfirm({
        title: 'Delete Group',
        content: `Are you sure you want to delete [${group.name}]?`,
        okText: 'Delete',
        onOk() {
          setGroups((prev) => prev.filter((g) => g.id !== group.id));
          toast.success('Group disbanded successfully');
        },
      });
    },
    [toast],
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
      toast.success('Group created successfully');
    },
    [toast],
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

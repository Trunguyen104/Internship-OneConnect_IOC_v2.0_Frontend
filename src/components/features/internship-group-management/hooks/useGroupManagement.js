'use client';

import { useState, useMemo, useCallback } from 'react';
import { useToast } from '@/providers/ToastProvider';
import { showDeleteConfirm } from '@/components/ui/deleteconfirm';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { MOCK_GROUPS } from '../constants/groupData';

export const useGroupManagement = (initialGroups = MOCK_GROUPS) => {
  const toast = useToast();
  const { MESSAGES } = INTERNSHIP_MANAGEMENT_UI.GROUP_MANAGEMENT;
  const [groups, setGroups] = useState(initialGroups);
  const [activeTab, setActiveTab] = useState('ALL');
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const [assignModal, setAssignModal] = useState({ open: false, group: null });
  const [viewModal, setViewModal] = useState({ open: false, group: null });
  const [createModal, setCreateModal] = useState(false);

  const filteredGroups = useMemo(() => {
    let data = [...groups];
    if (activeTab === 'ACTIVE') data = data.filter((g) => g.status === 'ACTIVE');
    if (activeTab === 'FINISHED') data = data.filter((g) => g.status === 'FINISHED');
    if (activeTab === 'ARCHIVED') data = data.filter((g) => g.status === 'ARCHIVED');
    if (search) {
      data = data.filter((g) => g.name.toLowerCase().includes(search.toLowerCase()));
    }
    return data;
  }, [groups, activeTab, search]);

  const handleTableChange = useCallback((page) => {
    setPagination((prev) => ({ ...prev, current: page }));
  }, []);

  const handlePageSizeChange = useCallback((size) => {
    setPagination((prev) => ({ ...prev, pageSize: size, current: 1 }));
  }, []);

  const paginatedGroups = useMemo(() => {
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredGroups.slice(start, end);
  }, [filteredGroups, pagination]);

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
        toast.success(`${MESSAGES.MENTOR_CHANGED} ${values.reason}`);
      } else {
        toast.success(MESSAGES.ASSIGN_SUCCESS);
      }
    },
    [assignModal, toast, MESSAGES],
  );

  const handleDeleteGroup = useCallback(
    (group) => {
      if (group.memberCount > 0) {
        toast.error(MESSAGES.DELETE_ERROR_STU);
        return;
      }

      showDeleteConfirm({
        title: MESSAGES.DELETE_CONFIRM_TITLE,
        content: `${MESSAGES.DELETE_CONFIRM_TEXT} [${group.name}]?`,
        okText: MESSAGES.DELETE_CONFIRM_TITLE,
        onOk() {
          setGroups((prev) => prev.filter((g) => g.id !== group.id));
          toast.success(MESSAGES.DELETE_SUCCESS);
        },
      });
    },
    [toast, MESSAGES],
  );

  const handleArchiveGroup = useCallback(
    (group) => {
      showDeleteConfirm({
        title: MESSAGES.ARCHIVE_CONFIRM_TITLE,
        content: `${MESSAGES.ARCHIVE_CONFIRM_TEXT} [${group.name}]?`,
        okText: MESSAGES.ARCHIVE_CONFIRM_TITLE,
        type: 'warning',
        onOk() {
          setGroups((prev) =>
            prev.map((g) => (g.id === group.id ? { ...g, status: 'ARCHIVED' } : g)),
          );
          toast.success(MESSAGES.ARCHIVE_SUCCESS);
        },
      });
    },
    [toast, MESSAGES],
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
      toast.success(MESSAGES.CREATE_SUCCESS);
    },
    [toast, MESSAGES],
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
    handleArchiveGroup,
    handleCreateGroup,
    pagination,
    handleTableChange,
    handlePageSizeChange,
    paginatedGroups,
  };
};

'use client';
import { useState, useCallback, useMemo } from 'react';
import { useToast } from '@/providers/ToastProvider';
import { showDeleteConfirm } from '@/components/ui/DeleteConfirm';

export const useTermManagement = (initialData) => {
  const toast = useToast();
  const [data, setData] = useState(initialData);
  const [loading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(undefined);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const [deleteModalState, setDeleteModalState] = useState({ open: false, record: null });
  const [statusModalState, setStatusModalState] = useState({
    open: false,
    record: null,
    newStatus: null,
  });

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  const handleStatusChange = useCallback((value) => {
    setStatusFilter(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter !== undefined ? item.status === statusFilter : true;
      return matchSearch && matchStatus;
    });
  }, [data, searchTerm, statusFilter]);

  const paginatedData = useMemo(() => {
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, pagination]);

  const handleTableChange = useCallback((newPagination) => {
    setPagination((prev) => ({ ...prev, current: newPagination.current }));
  }, []);

  const handleCreateNew = useCallback(() => {
    setEditingRecord(null);
    setModalVisible(true);
  }, []);

  const handleEdit = useCallback((record) => {
    setEditingRecord(record);
    setModalVisible(true);
  }, []);

  const handleRequestDelete = useCallback(
    (record) => {
      showDeleteConfirm({
        title: 'Delete Internship Term',
        content: `Are you sure you want to delete the term "${record.name}"? This action cannot be undone.`,
        onOk: () => {
          setData((prev) => prev.filter((item) => item.termId !== record.termId));
          toast.success('Term deleted successfully');
        },
      });
    },
    [toast],
  );

  const { record, newStatus } = statusModalState;

  const handleChangeStatus = useCallback(() => {
    if (!record || newStatus === null) return;

    setData((prev) =>
      prev.map((item) => (item.termId === record.termId ? { ...item, status: newStatus } : item)),
    );

    toast.success('Status updated successfully');
    setStatusModalState({ open: false, record: null, newStatus: null });
  }, [record, newStatus, toast]);
  const handleSaveModal = useCallback(
    (payload, termId) => {
      setSubmitLoading(true);

      setTimeout(() => {
        if (termId) {
          setData((prev) =>
            prev.map((item) => (item.termId === termId ? { ...item, ...payload } : item)),
          );
          toast.success('Term updated successfully!');
        } else {
          const newTerm = {
            termId: Date.now().toString(),
            ...payload,
          };
          setData((prev) => [newTerm, ...prev]);
          toast.success('New term created successfully!');
        }

        setSubmitLoading(false);
        setModalVisible(false);
        setPagination((prev) => ({ ...prev, current: 1 }));
      }, 500);
    },
    [toast],
  );

  return {
    // State
    data,
    loading,
    searchTerm,
    statusFilter,
    pagination,
    modalVisible,
    submitLoading,
    editingRecord,
    deleteModalState,
    statusModalState,
    filteredData,
    paginatedData,

    // Setters (if needed directly)
    setModalVisible,
    setDeleteModalState,
    setStatusModalState,

    // Actions
    handleSearchChange,
    handleStatusChange,
    handleTableChange,
    handleCreateNew,
    handleEdit,
    handleRequestDelete,
    handleRequestChangeStatus,
    handleChangeStatus,
    handleSaveModal,
  };
};

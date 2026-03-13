'use client';
import { useState, useCallback, useMemo } from 'react';
import { message } from 'antd';

export const useTermManagement = (initialData) => {
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

  const handleRequestDelete = useCallback((record) => {
    setDeleteModalState({ open: true, record });
  }, []);

  const handleRequestChangeStatus = useCallback((record, newStatus) => {
    setStatusModalState({ open: true, record, newStatus });
  }, []);

  const handleDelete = useCallback(() => {
    if (!deleteModalState.record) return;
    setData((prev) => prev.filter((item) => item.termId !== deleteModalState.record.termId));
    message.success('Xóa kỳ thực tập thành công');
    setDeleteModalState({ open: false, record: null });
  }, [deleteModalState.record]);

  const handleChangeStatus = useCallback(() => {
    if (!statusModalState.record || statusModalState.newStatus === null) return;
    setData((prev) =>
      prev.map((item) =>
        item.termId === statusModalState.record.termId
          ? { ...item, status: statusModalState.newStatus }
          : item,
      ),
    );
    message.success('Cập nhật trạng thái thành công');
    setStatusModalState({ open: false, record: null, newStatus: null });
  }, [statusModalState.record, statusModalState.newStatus]);

  const handleSaveModal = useCallback((payload, termId) => {
    setSubmitLoading(true);

    setTimeout(() => {
      if (termId) {
        setData((prev) =>
          prev.map((item) => (item.termId === termId ? { ...item, ...payload } : item)),
        );
        message.success('Cập nhật kỳ thực tập thành công!');
      } else {
        const newTerm = {
          termId: Date.now().toString(),
          ...payload,
        };
        setData((prev) => [newTerm, ...prev]);
        message.success('Tạo kỳ thực tập mới thành công!');
      }

      setSubmitLoading(false);
      setModalVisible(false);
      setPagination((prev) => ({ ...prev, current: 1 }));
    }, 500);
  }, []);

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
    handleDelete,
    handleChangeStatus,
    handleSaveModal,
  };
};

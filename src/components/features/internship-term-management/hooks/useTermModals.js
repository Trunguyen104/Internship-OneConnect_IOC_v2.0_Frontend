'use client';
import { useCallback, useState } from 'react';

export const useTermModals = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [viewOnly, setViewOnly] = useState(false);
  const [statusModalState, setStatusModalState] = useState({
    open: false,
    record: null,
    newStatus: null,
  });
  const [deleteModalState, setDeleteModalState] = useState({
    open: false,
    record: null,
  });

  const handleCreateNew = useCallback(() => {
    setEditingRecord(null);
    setViewOnly(false);
    setModalVisible(true);
  }, []);

  const openFormModal = useCallback((record, isViewOnly = false) => {
    setEditingRecord(record);
    setViewOnly(isViewOnly);
    setModalVisible(true);
  }, []);

  const handleRequestDelete = useCallback((record) => {
    setDeleteModalState({
      open: !!record,
      record,
    });
  }, []);

  const handleRequestChangeStatus = useCallback((record, newStatus) => {
    setStatusModalState({
      open: !!record,
      record,
      newStatus,
    });
  }, []);

  return {
    modalVisible,
    setModalVisible,
    editingRecord,
    viewOnly,
    statusModalState,
    setStatusModalState,
    deleteModalState,
    setDeleteModalState,
    handleCreateNew,
    openFormModal,
    handleRequestDelete,
    handleRequestChangeStatus,
  };
};

'use client';
import { useCallback, useState } from 'react';

export const useViolationModals = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [viewOnly, setViewOnly] = useState(false);
  const [deleteModalState, setDeleteModalState] = useState({
    open: false,
    record: null,
  });

  const handleCreateNew = useCallback(() => {
    setEditingRecord(null);
    setViewOnly(false);
    setModalVisible(true);
  }, []);

  const openFormModal = useCallback((record, view = false) => {
    setEditingRecord(record);
    setViewOnly(view);
    setModalVisible(true);
  }, []);

  const handleRequestDelete = useCallback((record) => {
    setDeleteModalState({
      open: !!record,
      record: record || null,
    });
  }, []);

  return {
    modalVisible,
    setModalVisible,
    editingRecord,
    viewOnly,
    deleteModalState,
    setDeleteModalState,
    handleCreateNew,
    openFormModal,
    handleRequestDelete,
  };
};

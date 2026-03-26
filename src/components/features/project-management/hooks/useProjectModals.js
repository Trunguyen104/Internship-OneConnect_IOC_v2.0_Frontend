'use client';

import { useState } from 'react';

export const useProjectModals = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [viewOnly, setViewOnly] = useState(false);

  const handleCreateNew = () => {
    setEditingRecord(null);
    setViewOnly(false);
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setViewOnly(false);
    setModalVisible(true);
  };

  const handleView = (record) => {
    setEditingRecord(record);
    setViewOnly(true);
    setDetailDrawerVisible(true);
  };

  return {
    modalVisible,
    setModalVisible,
    detailDrawerVisible,
    setDetailDrawerVisible,
    editingRecord,
    setEditingRecord,
    viewOnly,
    setViewOnly,
    handleCreateNew,
    handleEdit,
    handleView,
  };
};

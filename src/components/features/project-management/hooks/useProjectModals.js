'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const useProjectModals = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [viewOnly, setViewOnly] = useState(false);

  const router = useRouter();

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
    const id = record.projectId || record.id;
    router.push(`/company/projects/${id}`);
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

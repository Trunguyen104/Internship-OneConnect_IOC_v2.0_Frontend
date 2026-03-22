'use client';
import { useCallback, useState } from 'react';

export const useStudentModals = () => {
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [importVisible, setImportVisible] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleOpenAdd = useCallback(() => {
    setSelectedRecord(null);
    setAddVisible(true);
  }, []);

  const handleOpenEdit = useCallback((record) => {
    setSelectedRecord(record);
    setEditVisible(true);
  }, []);

  const handleOpenImport = useCallback(() => {
    setSelectedRecord(null);
    setImportVisible(true);
  }, []);

  const handleOpenDetails = useCallback((record) => {
    setSelectedRecord(record);
    setDetailsVisible(true);
  }, []);

  return {
    addVisible,
    setAddVisible,
    editVisible,
    setEditVisible,
    importVisible,
    setImportVisible,
    detailsVisible,
    setDetailsVisible,
    selectedRecord,
    setSelectedRecord,
    handleOpenAdd,
    handleOpenEdit,
    handleOpenImport,
    handleOpenDetails,
  };
};

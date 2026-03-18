'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useToast } from '@/providers/ToastProvider';
import { TermService } from '../services/term.service';

export const useTermManagement = () => {
  const toast = useToast();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [yearFilter, setYearFilter] = useState(undefined);
  const [sortConfig, setSortConfig] = useState({ column: 'createdat', order: 'desc' });
  const knownVersions = useRef({}); // Track versions to avoid losing them on refetch

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const [statusModalState, setStatusModalState] = useState({
    open: false,
    record: null,
    newStatus: null,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        pageNumber: pagination.current,
        pageSize: pagination.pageSize,
        searchTerm: searchTerm || undefined,
        status: statusFilter ?? undefined,
        year: yearFilter || undefined,
        sortColumn: sortConfig.column,
        sortOrder: sortConfig.order,
      };
      const response = await TermService.getAll(params);
      if (response?.data) {
        // Merge known versions into fetched data because the list API lacks 'version'
        const mergedItems = (response.data.items || []).map((item) => ({
          ...item,
          version: item.version || knownVersions.current[item.termId] || 1,
        }));
        setData(mergedItems);
        setPagination((prev) => ({
          ...prev,
          total: response.data.totalCount || 0,
        }));
      }
    } catch (error) {
      console.error('Failed to fetch terms:', error);
      toast.error('Failed to load internship terms');
    } finally {
      setLoading(false);
    }
  }, [
    pagination,
    searchTerm,
    statusFilter,
    yearFilter,
    sortConfig.column,
    sortConfig.order,
    toast,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  const handleStatusChange = useCallback((value) => {
    setStatusFilter(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  const handleTableChange = useCallback((newPagination, filters, sorter) => {
    if (sorter && sorter.field) {
      setSortConfig({
        column: sorter.field.toLowerCase(),
        order: sorter.order === 'ascend' ? 'asc' : 'desc',
      });
    }
    setPagination((prev) => ({ ...prev, current: newPagination.current }));
  }, []);

  const handleYearChange = useCallback((value) => {
    setYearFilter(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  const handleCreateNew = useCallback(() => {
    setEditingRecord(null);
    setModalVisible(true);
  }, []);

  const handleEdit = useCallback(
    async (record) => {
      try {
        const id = record.termId || record.termID || record.id;
        if (!id) {
          toast.error('Could not identify term ID');
          return;
        }

        const response = await TermService.getById(id);
        if (response?.data) {
          // Normalize ID to termId for internal consistency and preserve version
          const normalizedData = {
            ...response.data,
            termId: response.data.termId || response.data.termID || response.data.id || id,
          };
          setEditingRecord(normalizedData);
          setModalVisible(true);
        }
      } catch (error) {
        console.error('GetTermById failed:', error);
        toast.error('Failed to load term details');
      }
    },
    [toast],
  );

  const [deleteModalState, setDeleteModalState] = useState({
    open: false,
    record: null,
  });

  const handleRequestDelete = useCallback((record) => {
    setDeleteModalState({
      open: true,
      record,
    });
  }, []);

  const handleDelete = useCallback(
    async (reason) => {
      const { record } = deleteModalState;
      if (!record || !reason) return;

      setSubmitLoading(true);
      try {
        await TermService.delete(record.termId, reason);
        toast.success('Term deleted successfully');
        setDeleteModalState({ open: false, record: null });
        fetchData();
      } catch (error) {
        toast.error(error.message || 'Failed to delete term');
      } finally {
        setSubmitLoading(false);
      }
    },
    [deleteModalState, fetchData, toast],
  );

  const handleChangeStatus = useCallback(
    async (reason) => {
      const { record, newStatus } = statusModalState;
      if (!record || newStatus === null) return;

      setSubmitLoading(true);
      try {
        // Backend expects CloseTermCommand (generic status update): { Status: int, Reason: string, Version: number }
        const response = await TermService.updateStatus(record.termId, {
          Status: newStatus,
          Reason: reason || 'Status updated by Admin',
          Version: record.version || record.Version || knownVersions.current[record.termId] || 1,
        });

        // Proactively update local state and known versions
        if (response?.data) {
          knownVersions.current[record.termId] = response.data.version;
          setData((prev) =>
            prev.map((item) =>
              item.termId === record.termId ? { ...item, ...response.data } : item,
            ),
          );
        }
        toast.success('Status updated successfully');
        setStatusModalState({ open: false, record: null, newStatus: null });
        fetchData();
      } catch (error) {
        toast.error(error.message || 'Failed to update status');
      } finally {
        setSubmitLoading(false);
      }
    },
    [statusModalState, fetchData, toast],
  );

  const handleRequestChangeStatus = useCallback((record, newStatus) => {
    setStatusModalState({
      open: true,
      record,
      newStatus,
    });
  }, []);

  const handleSaveModal = useCallback(
    async (payload) => {
      setSubmitLoading(true);
      try {
        const id = editingRecord?.termId || editingRecord?.termID || editingRecord?.id;
        if (id) {
          // Strictly follow PUT schema: TermId, Name, StartDate, EndDate, Version
          const updatePayload = {
            TermId: id,
            Name: payload.name,
            StartDate: payload.startDate,
            EndDate: payload.endDate,
            Version:
              editingRecord.version || editingRecord.Version || knownVersions.current[id] || 1,
          };

          const response = await TermService.update(id, updatePayload);

          // Proactively update local state and known versions
          if (response?.data) {
            const newVersion = response.data.version || response.data.Version;
            knownVersions.current[id] = newVersion;
            setData((prev) =>
              prev.map((item) =>
                item.termId === id || item.TermId === id ? { ...item, ...response.data } : item,
              ),
            );
          }

          toast.success('Term updated successfully!');
        } else {
          // Strictly follow POST schema: Name, StartDate, EndDate, UniversityId (if any)
          const createPayload = {
            Name: payload.name,
            StartDate: payload.startDate,
            EndDate: payload.endDate,
          };
          const response = await TermService.create(createPayload);

          if (response?.data) {
            const newId = response.data.termId || response.data.TermId;
            const newVersion = response.data.version || response.data.Version;
            if (newId) knownVersions.current[newId] = newVersion;
          }
          toast.success('New term created successfully!');
        }
        setModalVisible(false);
        fetchData();
      } catch (error) {
        toast.error(error.message || 'Failed to save term information');
      } finally {
        setSubmitLoading(false);
      }
    },
    [editingRecord, fetchData, toast],
  );

  return {
    // State
    data,
    loading,
    searchTerm,
    statusFilter,
    yearFilter,
    sortConfig,
    pagination,
    modalVisible,
    submitLoading,
    editingRecord,
    statusModalState,
    deleteModalState,

    // Setters
    setModalVisible,
    setStatusModalState,
    setYearFilter,

    // Actions
    handleSearchChange,
    handleStatusChange,
    handleTableChange,
    handleYearChange,
    handleCreateNew,
    handleEdit,
    handleRequestDelete,
    handleDelete,
    handleRequestChangeStatus,
    handleChangeStatus,
    handleSaveModal,
  };
};

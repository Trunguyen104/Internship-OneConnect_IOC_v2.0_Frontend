'use client';
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/providers/ToastProvider';
import { showDeleteConfirm } from '@/components/ui/DeleteConfirm';
import { TermService } from '../services/term.service';

export const useTermManagement = () => {
  const toast = useToast();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(undefined);

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
      };
      const response = await TermService.getAll(params);
      if (response?.data) {
        setData(response.data.items || []);
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
  }, [pagination, searchTerm, statusFilter, toast]);

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

  const handleTableChange = useCallback((newPagination) => {
    setPagination((prev) => ({ ...prev, current: newPagination.current }));
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
        console.error(
          'Failed to fetch term details. This is likely a 403 Forbidden on GetTermById. Error:',
          error,
        );
        toast.error('Failed to fetch term details');
      }
    },
    [toast],
  );

  const handleRequestDelete = useCallback(
    (record) => {
      showDeleteConfirm({
        title: 'Delete Internship Term',
        content: `Are you sure you want to delete the term "${record.name}"? This action cannot be undone.`,
        onOk: async () => {
          try {
            await TermService.delete(record.termId);
            toast.success('Term deleted successfully');
            fetchData();
          } catch (error) {
            toast.error(error.message || 'Failed to delete term');
          }
        },
      });
    },
    [fetchData, toast],
  );

  const handleChangeStatus = useCallback(async () => {
    const { record, newStatus } = statusModalState;
    if (!record || newStatus === null) return;

    setSubmitLoading(true);
    try {
      if (newStatus === 2) {
        // Closing term
        await TermService.close(record.termId, {
          reason: 'Closed by Admin',
          version: record.version,
        });
      } else {
        // Potentially other status changes if the backend supports it via update
        // Current backend seems to only have explicit 'close' patch
        // For now, assume other changes are not standard or handled by Update
      }
      toast.success('Status updated successfully');
      setStatusModalState({ open: false, record: null, newStatus: null });
      fetchData();
    } catch (error) {
      toast.error(error.message || 'Failed to update status');
    } finally {
      setSubmitLoading(false);
    }
  }, [statusModalState, fetchData, toast]);

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
          // Strictly follow PUT schema: termId, name, startDate, endDate, version
          const updatePayload = {
            termId: id,
            name: payload.name,
            startDate: payload.startDate,
            endDate: payload.endDate,
            version: editingRecord.version ?? 0,
          };

          await TermService.update(id, updatePayload);
          toast.success('Term updated successfully!');
        } else {
          // POST /create payload can include status
          await TermService.create(payload);
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
    pagination,
    modalVisible,
    submitLoading,
    editingRecord,
    statusModalState,

    // Setters
    setModalVisible,
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

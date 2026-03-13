'use client';

import { useState, useEffect, useCallback } from 'react';
import { LogBookService } from '@/components/features/logbook/services/logBook.service';
import { InternshipGroupService } from '@/components/features/internship/services/internshipGroup.service';
import { userService } from '@/components/features/user/services/userService';
import { useToast } from '@/providers/ToastProvider';

export function useLogbook() {
  const toast = useToast();

  const [internshipId, setInternshipId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState();
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const res = await InternshipGroupService.getAll();
        const items = res?.data?.items || res?.data || [];

        if (items.length > 0) {
          setInternshipId(items[0].internshipId || items[0].id);
        }
      } catch (err) {
        console.error('Fetch internshipgroups failed', err);
      }
    };

    fetchInternship();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userService.getMe();
        if (res?.data) {
          setUserProfile(res.data);
        }
      } catch (err) {
        console.error('Fetch user profile failed', err);
      }
    };
    fetchProfile();
  }, []);

  const fetchLogbooks = useCallback(async () => {
    if (!internshipId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const params = {
        PageNumber: pageNumber,
        PageSize: pageSize,
        SortColumn: 'dateReport',
        SortOrder: sortOrder,
      };

      if (statusFilter !== undefined && statusFilter !== null) {
        params.Status = statusFilter;
      }

      const res = await LogBookService.getAll(internshipId, params);

      const items = res?.data?.items || [];
      const totalCount = res?.data?.totalCount || 0;

      console.log('items:', items);

      setData(items);
      setTotal(totalCount);
    } catch (err) {
      console.error('Fetch logbooks failed', err);
    } finally {
      setLoading(false);
    }
  }, [internshipId, pageNumber, pageSize, sortOrder, statusFilter]);
  useEffect(() => {
    fetchLogbooks();
  }, [fetchLogbooks]);

  const handleDelete = async (id) => {
    try {
      const res = await LogBookService.delete(id);
      if (res && (res.isSuccess !== false || res.success !== false)) {
        toast.success('Logbook deleted successfully!');

        if (data.length === 1 && pageNumber > 1) {
          setPageNumber((prev) => prev - 1);
        } else {
          fetchLogbooks();
        }
        return true;
      } else {
        toast.error(res?.message || 'Failed to delete logbook');
        return false;
      }
    } catch (error) {
      console.error('Delete logbook error', error);
      toast.error('An unexpected error occurred during deletion');
      return false;
    }
  };

  return {
    data,
    loading,
    total,
    pageNumber,
    setPageNumber,
    pageSize,
    setPageSize,
    statusFilter,
    setStatusFilter,
    sortOrder,
    setSortOrder,
    fetchLogbooks,
    handleDelete,
    internshipId,
    userProfile,
  };
}

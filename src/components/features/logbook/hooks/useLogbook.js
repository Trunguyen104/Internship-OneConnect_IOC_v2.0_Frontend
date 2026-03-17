'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { LogBookService } from '@/components/features/logbook/services/logBook.service';
import { InternshipGroupService } from '@/components/features/internship/services/internshipGroup.service';
import { userService } from '@/components/features/user/services/userService';
import { useToast } from '@/providers/ToastProvider';

export function useLogbook() {
  const toast = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const urlInternshipId = searchParams.get('internshipId');
  const [internshipId, setInternshipIdState] = useState(urlInternshipId);
  const [userProfile, setUserProfile] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState();
  const [sortOrder, setSortOrder] = useState('desc');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPageNumber(1);
    }, 500);
    return () => clearTimeout(t);
  }, [search]);

  const filteredData = useMemo(() => {
    if (!debouncedSearch?.trim()) return data;
    const term = debouncedSearch.toLowerCase().trim();
    return data.filter((item) => {
      const studentName = (item.studentName || '').toLowerCase();
      const summary = (item.summary || '').toLowerCase();
      return studentName.includes(term) || summary.includes(term);
    });
  }, [data, debouncedSearch]);

  useEffect(() => {
    if (urlInternshipId && urlInternshipId !== internshipId) {
      setInternshipIdState(urlInternshipId);
    }
  }, [urlInternshipId]);

  const setInternshipId = useCallback(
    (id) => {
      setInternshipIdState(id);
      const params = new URLSearchParams(searchParams);
      if (id) {
        params.set('internshipId', id);
      } else {
        params.delete('internshipId');
      }
      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname],
  );

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const res = await InternshipGroupService.getAll();
        const items = res?.data?.items || res?.data || [];

        if (items.length > 0 && !urlInternshipId) {
          const firstId = items[0].internshipId || items[0].id;
          setInternshipId(firstId);
        }
      } catch (err) {
        console.error('Fetch internshipgroups failed', err);
      }
    };

    fetchInternship();
  }, [urlInternshipId, setInternshipId]);

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

      if (debouncedSearch?.trim()) {
        params.SearchTerm = debouncedSearch.trim();
      }

      const res = await LogBookService.getAll(internshipId, params);

      const items = res?.data?.items || [];
      const totalCount = res?.data?.totalCount || 0;

      setData(items);
      setTotal(totalCount);
    } catch (err) {
      console.error('Fetch logbooks failed', err);
    } finally {
      setLoading(false);
    }
  }, [internshipId, pageNumber, pageSize, sortOrder, statusFilter, debouncedSearch]);

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
    data: filteredData,
    rawItems: data,
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
    search,
    setSearch,
    fetchLogbooks,
    handleDelete,
    internshipId,
    userProfile,
  };
}

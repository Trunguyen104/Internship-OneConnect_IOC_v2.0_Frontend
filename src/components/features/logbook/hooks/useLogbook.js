'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { InternshipGroupService } from '@/components/features/internship/services/internship-group.service';
import { LogBookService } from '@/components/features/logbook/services/log-book.service';
import { userService } from '@/components/features/user/services/user.service';
import { DAILY_REPORT_MESSAGES } from '@/constants/dailyReport/messages';
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

  useEffect(() => {
    if (urlInternshipId && urlInternshipId !== internshipId) {
      setInternshipIdState(urlInternshipId);
    }
  }, [urlInternshipId, internshipId]);

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
    [searchParams, router, pathname]
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
      } catch (err) {}
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
        // Silently fail
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
      // Silently fail
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
        toast.success(DAILY_REPORT_MESSAGES.SUCCESS.DELETE);
        if (data.length === 1 && pageNumber > 1) {
          setPageNumber((prev) => prev - 1);
        } else {
          fetchLogbooks();
        }
        return true;
      } else {
        toast.error(res?.message || DAILY_REPORT_MESSAGES.ERROR.DELETE_FAILED);
        return false;
      }
    } catch (error) {
      toast.error(DAILY_REPORT_MESSAGES.ERROR.DELETE_ERROR);
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
    search,
    setSearch,
    fetchLogbooks,
    handleDelete,
    internshipId,
    userProfile,
  };
}

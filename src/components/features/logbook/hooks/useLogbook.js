'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
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
  const queryClient = useQueryClient();

  // Route Synchronization
  const urlInternshipId = searchParams.get('internshipId');
  const [internshipId, setInternshipIdState] = useState(urlInternshipId);

  // Filter & Pagination States
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSizeState] = useState(10);

  const setPageSize = useCallback((size) => {
    setPageSizeState(size);
    setPageNumber(1);
  }, []);
  const [statusFilter, setStatusFilter] = useState();
  const [sortOrder, setSortOrder] = useState('desc');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // 1. Fetch User Profile
  const { data: userProfile = null } = useQuery({
    queryKey: ['user-profile-me'],
    queryFn: async () => {
      try {
        const res = await userService.getMe();
        return res?.data || null;
      } catch {
        return null;
      }
    },
    staleTime: Infinity,
  });

  // 2. Fetch Available Internships
  const { data: internships = [] } = useQuery({
    queryKey: ['available-internships-logbook'],
    queryFn: async () => {
      try {
        const res = await InternshipGroupService.getAll();
        return res?.data?.items || res?.data || [];
      } catch {
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
  });

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

  // 3. Sync Internship Selection
  useEffect(() => {
    if (urlInternshipId && urlInternshipId !== internshipId) {
      setTimeout(() => setInternshipIdState(urlInternshipId), 0);
    } else if (!urlInternshipId && internships.length > 0) {
      const firstId = internships[0].internshipId || internships[0].id;
      setTimeout(() => setInternshipId(firstId), 0);
    }
  }, [urlInternshipId, internshipId, internships, setInternshipId]);

  // Debounce Search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPageNumber(1);
    }, 500);
    return () => clearTimeout(t);
  }, [search]);

  // 4. Fetch Logbook Entries
  const {
    data: logbookResult = { items: [], totalCount: 0 },
    isLoading: loading,
    refetch: fetchLogbooks,
  } = useQuery({
    queryKey: [
      'logbook-entries',
      internshipId,
      pageNumber,
      pageSize,
      sortOrder,
      statusFilter,
      debouncedSearch,
    ],
    queryFn: async () => {
      if (!internshipId) return { items: [], totalCount: 0 };
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
        const weeks = res?.data?.weeks || [];
        const allItems = weeks.flatMap((w) => w.items || []);

        return {
          items: allItems,
          totalCount: res?.data?.totalCount || 0,
        };
      } catch {
        return { items: [], totalCount: 0 };
      }
    },
    enabled: !!internshipId,
    staleTime: 2 * 60 * 1000,
  });

  // 5. Fetch Missing Logbook Dates (Student only)
  const {
    data: missingDatesData = { missingDates: [] },
    isLoading: missingLoading,
    refetch: refetchMissingDates,
  } = useQuery({
    queryKey: ['missing-logbook-dates', userProfile?.studentId],
    queryFn: async () => {
      // Only students have missing dates calculated this way
      if (!userProfile) return { missingDates: [] };
      try {
        console.log('Diagnostic: User Profile for Missing Dates:', userProfile);
        const targetId = userProfile.studentId || userProfile.id;
        const res = await LogBookService.getMissingDates(targetId);
        console.log('Missing Logbook Dates API Response:', res);
        return res?.data || { missingDates: [] };
      } catch (error) {
        console.error('Error fetching missing logbook dates:', error);
        // Only show toast if it's a real error (not 401/403 handled elsewhere)
        if (error.status && error.status !== 401 && error.status !== 403) {
          toast.error(`Could not check missing dates: ${error.message || 'Server Error'}`);
        }
        return { missingDates: [] };
      }
    },
    enabled: !!userProfile,
    staleTime: 10 * 60 * 1000,
  });

  const handleDelete = async (id) => {
    try {
      const res = await LogBookService.delete(id);
      if (res && (res.isSuccess !== false || res.success !== false)) {
        toast.success(DAILY_REPORT_MESSAGES.SUCCESS.DELETE);

        // Correctively handle page decrement if empty after delete
        if (logbookResult.items.length === 1 && pageNumber > 1) {
          setPageNumber((prev) => prev - 1);
        }

        queryClient.invalidateQueries({ queryKey: ['logbook-entries'] });
        return true;
      } else {
        toast.error(res?.message || DAILY_REPORT_MESSAGES.ERROR.DELETE_FAILED);
        return false;
      }
    } catch {
      toast.error(DAILY_REPORT_MESSAGES.ERROR.DELETE_ERROR);
      return false;
    }
  };

  return {
    data: logbookResult.items,
    loading,
    total: logbookResult.totalCount,
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
    missingDatesData,
    missingLoading,
    refetchMissingDates,
  };
}

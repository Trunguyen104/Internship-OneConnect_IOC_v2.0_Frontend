'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

import { InternshipGroupService } from '@/components/features/internship/services/internship-group.service';
import { useDebounce } from '@/components/features/internship-group-management/hooks/useDebounce';
import { STUDENT_LIST_MESSAGES } from '@/constants/studentList/messages';
import { useToast } from '@/providers/ToastProvider';

export function useStudentList() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const internshipIdFromUrl = searchParams.get('id');

  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(10);

  const setPageSize = useCallback((size) => {
    setPageSizeState(size);
    setPage(1);
  }, []);

  const debouncedSearch = useDebounce(searchText, 500);

  // 1. Logic to handle "Auto-select first group"
  const { data: autoSelectedId = null } = useQuery({
    queryKey: ['available-groups-for-student-list'],
    queryFn: async () => {
      if (internshipIdFromUrl) return null;
      try {
        const res = await InternshipGroupService.getAll();
        const items = res?.data?.items || res?.items || [];
        return items.length > 0 ? items[0].internshipId : null;
      } catch {
        return null;
      }
    },
    enabled: !internshipIdFromUrl,
    staleTime: 10 * 60 * 1000,
  });

  const effectiveId = useMemo(
    () => internshipIdFromUrl || autoSelectedId,
    [internshipIdFromUrl, autoSelectedId]
  );

  const handleSearchChange = useCallback((value) => {
    setSearchText(value);
    setPage(1);
  }, []);

  // 2. Main Query for Group Detail
  const { data: groupDetail = null, isLoading: loading } = useQuery({
    queryKey: ['group-detail-student-list', effectiveId, page, pageSize, debouncedSearch],
    queryFn: async () => {
      if (!effectiveId) return null;
      try {
        const params = {
          SearchTerm: debouncedSearch || undefined,
          PageIndex: page,
          PageSize: pageSize,
        };
        const res = await InternshipGroupService.getById(effectiveId, params);
        if (res && res.isSuccess !== false) {
          return res.data || res;
        } else {
          toast.error(
            res?.message || res?.data?.message || STUDENT_LIST_MESSAGES.ERROR.FETCH_GROUP_FAILED
          );
          return null;
        }
      } catch {
        toast.error(STUDENT_LIST_MESSAGES.ERROR.FETCH_GROUP_EXCEPTION);
        return null;
      }
    },
    enabled: !!effectiveId,
    staleTime: 5 * 60 * 1000,
  });

  const totalCount = useMemo(() => {
    const membersData = groupDetail?.members;
    if (membersData?.totalCount !== undefined) return membersData.totalCount;
    if (membersData?.items) return membersData.items.length;
    if (Array.isArray(membersData)) return membersData.length;
    return 0;
  }, [groupDetail]);

  const handleDeleteStudent = useCallback(
    async (studentId) => {
      if (!effectiveId) return;
      try {
        const payload = {
          studentIds: [studentId],
        };
        const res = await InternshipGroupService.removeStudents(effectiveId, payload);
        if (res && res.isSuccess !== false) {
          toast.success(STUDENT_LIST_MESSAGES.SUCCESS.REMOVE_STUDENT);
          queryClient.invalidateQueries({ queryKey: ['group-detail-student-list'] });
        } else {
          toast.error(
            res?.message || res?.data?.message || STUDENT_LIST_MESSAGES.ERROR.REMOVE_FAILED
          );
        }
      } catch {
        toast.error(STUDENT_LIST_MESSAGES.ERROR.REMOVE_EXCEPTION);
      }
    },
    [effectiveId, queryClient, toast]
  );

  const paginatedMembers = useMemo(() => {
    const membersData = groupDetail?.members;
    if (!membersData) return [];
    return membersData?.items || (Array.isArray(membersData) ? membersData : []);
  }, [groupDetail]);

  const totalPages = useMemo(() => Math.ceil(totalCount / pageSize), [totalCount, pageSize]);

  return {
    groupDetail,
    loading,
    searchText,
    setSearchText: handleSearchChange,
    handleDeleteStudent,
    internshipId: internshipIdFromUrl,
    currentId: effectiveId,
    page,
    setPage,
    pageSize,
    setPageSize,
    total: totalCount,
    totalPages,
    paginatedMembers,
  };
}

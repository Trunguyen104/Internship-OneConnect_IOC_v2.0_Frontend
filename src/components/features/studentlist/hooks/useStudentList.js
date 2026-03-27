'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { InternshipGroupService } from '@/components/features/internship/services/internship-group.service';
import { useDebounce } from '@/components/features/internship-group-management/hooks/useDebounce';
import { STUDENT_LIST_MESSAGES } from '@/constants/studentList/messages';
import { useToast } from '@/providers/ToastProvider';

export function useStudentList() {
  const toast = useToast();
  const searchParams = useSearchParams();
  const internshipId = searchParams.get('id');

  const [groupDetail, setGroupDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentId, setCurrentId] = useState(internshipId);
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const debouncedSearch = useDebounce(searchText, 500);

  const fetchGroupDetail = useCallback(async () => {
    let idToFetch = currentId || internshipId;
    setLoading(true);

    try {
      if (!idToFetch) {
        const groupsRes = await InternshipGroupService.getAll();
        if (groupsRes && groupsRes.isSuccess !== false && groupsRes.data) {
          const items = groupsRes.data.items || groupsRes.items || [];
          if (items.length > 0) {
            idToFetch = items[0].internshipId;
            setCurrentId(idToFetch);
          }
        }
      }

      if (!idToFetch) {
        setLoading(false);
        return;
      }

      const params = {
        SearchTerm: debouncedSearch || undefined,
        PageIndex: page,
        PageSize: pageSize,
      };

      const res = await InternshipGroupService.getById(idToFetch, params);
      if (res && res.isSuccess !== false) {
        const data = res.data || res;
        setGroupDetail(data);

        // Extract members and total count robustly
        const membersData = data?.members;
        if (membersData?.items) {
          setTotalCount(membersData.totalCount || membersData.items.length);
        } else if (Array.isArray(membersData)) {
          setTotalCount(membersData.length);
        } else {
          setTotalCount(0);
        }
      } else {
        toast.error(
          res?.message || res?.data?.message || STUDENT_LIST_MESSAGES.ERROR.FETCH_GROUP_FAILED
        );
      }
    } catch (error) {
      toast.error(STUDENT_LIST_MESSAGES.ERROR.FETCH_GROUP_EXCEPTION);
    } finally {
      setLoading(false);
    }
  }, [internshipId, currentId, debouncedSearch, page, pageSize, toast]);

  useEffect(() => {
    fetchGroupDetail();
  }, [fetchGroupDetail]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleDeleteStudent = useCallback(
    async (studentId) => {
      const targetId = currentId || internshipId;
      if (!targetId) return;
      try {
        const payload = {
          studentIds: [studentId],
        };
        const res = await InternshipGroupService.removeStudents(targetId, payload);
        if (res && res.isSuccess !== false) {
          toast.success(STUDENT_LIST_MESSAGES.SUCCESS.REMOVE_STUDENT);
          fetchGroupDetail();
        } else {
          toast.error(
            res?.message || res?.data?.message || STUDENT_LIST_MESSAGES.ERROR.REMOVE_FAILED
          );
        }
      } catch (error) {
        toast.error(STUDENT_LIST_MESSAGES.ERROR.REMOVE_EXCEPTION);
      }
    },
    [currentId, internshipId, fetchGroupDetail, toast]
  );

  const paginatedMembers = useMemo(() => {
    const membersData = groupDetail?.members;
    if (!membersData) return [];
    return membersData?.items || (Array.isArray(membersData) ? membersData : []);
  }, [groupDetail]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    groupDetail,
    loading,
    searchText,
    setSearchText,
    handleDeleteStudent,
    internshipId,
    currentId,
    page,
    setPage,
    pageSize,
    setPageSize,
    total: totalCount,
    totalPages,
    paginatedMembers,
  };
}

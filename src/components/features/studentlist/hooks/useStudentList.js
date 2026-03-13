'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { InternshipGroupService } from '@/components/features/internship/services/internshipGroup.service';
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

      const res = await InternshipGroupService.getById(idToFetch);
      if (res && res.isSuccess !== false) {
        setGroupDetail(res.data);
      } else {
        toast.error(
          res?.message || res?.data?.message || STUDENT_LIST_MESSAGES.ERROR.FETCH_GROUP_FAILED,
        );
      }
    } catch (error) {
      console.error('Error fetching group detail:', error);
      toast.error(STUDENT_LIST_MESSAGES.ERROR.FETCH_GROUP_EXCEPTION);
    } finally {
      setLoading(false);
    }
  }, [internshipId, currentId, toast]);

  useEffect(() => {
    fetchGroupDetail();
  }, [fetchGroupDetail]);
  useEffect(() => {
    setPage(1);
  }, [searchText]);
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
            res?.message || res?.data?.message || STUDENT_LIST_MESSAGES.ERROR.REMOVE_FAILED,
          );
        }
      } catch (error) {
        console.error('Error removing student:', error);
        toast.error(STUDENT_LIST_MESSAGES.ERROR.REMOVE_EXCEPTION);
      }
    },
    [currentId, internshipId, fetchGroupDetail, toast],
  );

  const filteredMembers = useMemo(() => {
    if (!groupDetail?.members) return [];
    return groupDetail.members.filter(
      (m) =>
        m.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
        m.email?.toLowerCase().includes(searchText.toLowerCase()) ||
        m.studentCode?.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [groupDetail, searchText]);
  const paginatedMembers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredMembers.slice(start, start + pageSize);
  }, [filteredMembers, page, pageSize]);
  const total = filteredMembers.length;
  const totalPages = Math.ceil(total / pageSize);
  return {
    groupDetail,
    loading,
    searchText,
    setSearchText,
    filteredMembers,
    handleDeleteStudent,
    internshipId,
    currentId,
    page,
    setPage,
    pageSize,
    setPageSize,
    total,
    totalPages,
    paginatedMembers,
  };
}

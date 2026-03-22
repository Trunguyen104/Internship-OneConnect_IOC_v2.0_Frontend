import { useCallback, useEffect, useState } from 'react';

import { useToast } from '@/providers/ToastProvider';

import { ENTERPRISE_STUDENT_UI } from '../constants/enterprise-student.constants';
import { EnterpriseStudentService } from '../services/enterprise-student.service';

export const useEnterpriseStudents = ({ termId, filters, search, pagination, sort }) => {
  const toast = useToast();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchStudents = useCallback(async () => {
    if (!termId) return;

    try {
      setLoading(true);
      const params = {
        TermId: termId,
        PageNumber: pagination.current,
        PageSize: pagination.pageSize,
        SearchTerm: search || undefined,
        Search: search || undefined,
        Status:
          filters.status !== undefined ? (filters.status === 'ALL' ? null : filters.status) : null,
        // camelCase just in case
        termId,
        pageIndex: pagination.current,
        pageSize: pagination.pageSize,
        searchTerm: search || undefined,
        status:
          filters.status !== undefined ? (filters.status === 'ALL' ? null : filters.status) : null,
        mentorAssigned: filters.mentorAssigned,
        SortColumn: sort?.column,
        SortOrder: sort?.order,
      };

      const response = await EnterpriseStudentService.getApplications(params);

      if (response?.data?.items) {
        setData(response.data.items.map(EnterpriseStudentService.mapApplication));
        setTotal(response.data.totalCount || 0);
      } else {
        setData([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('Fetch Enterprise Students Error:', error);
      toast.error(ENTERPRISE_STUDENT_UI.MESSAGES.LOAD_ERROR);
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [
    termId,
    pagination,
    search,
    filters?.status,
    filters?.mentorAssigned,
    filters?.hasGroup,
    sort?.column,
    sort?.order,
    toast,
  ]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return {
    data,
    total,
    loading,
    refetch: fetchStudents,
  };
};

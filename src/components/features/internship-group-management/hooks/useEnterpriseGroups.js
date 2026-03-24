import { useCallback, useEffect, useState } from 'react';

import { useToast } from '@/providers/ToastProvider';

import { ENTERPRISE_GROUP_UI } from '../constants/enterprise-group.constants';
import { EnterpriseGroupService } from '../services/enterprise-group.service';

export const useEnterpriseGroups = ({
  termId,
  filters,
  search,
  pagination,
  sort,
  termOptions = [],
}) => {
  const toast = useToast();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchGroups = useCallback(async () => {
    if (!termId) return;

    try {
      setLoading(true);
      const params = {
        TermId: termId,
        PageIndex: pagination.current,
        PageSize: pagination.pageSize,
        Search: search,
        Status: filters.status, // 0 = InProgress, 1 = Finished, 2 = Archived
        IncludeArchived: filters.includeArchived,
        Month: filters.dateFilter ? filters.dateFilter.month() + 1 : undefined,
        Year: filters.dateFilter ? filters.dateFilter.year() : undefined,
        SortColumn: sort?.column,
        SortOrder: sort?.order,
      };

      const response = await EnterpriseGroupService.getGroups(params);

      if (response?.data?.items) {
        setData(
          response.data.items.map((item) => {
            const term = termOptions.find(
              (t) => t.value?.toLowerCase() === item.termId?.toLowerCase()
            );
            return {
              ...item,
              id: item.internshipId || item.id || item.groupId,
              name: item.groupName || item.GroupName || item.name,
              termName: item.termName || item.TermName || term?.label || '-',
              memberCount: item.numberOfMembers ?? item.NumberOfMembers ?? item.memberCount ?? 0,
              mentorName: item.mentorName || item.MentorName || '-',
            };
          })
        );
        setTotal(response.data.totalCount || 0);
      } else {
        setData([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('Fetch Enterprise Groups Error:', error);
      toast.error(ENTERPRISE_GROUP_UI.MESSAGES.ERROR);
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
    filters?.includeArchived,
    filters?.dateFilter,
    sort?.column,
    sort?.order,
    termOptions,
    toast,
  ]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  return {
    data,
    total,
    loading,
    refetch: fetchGroups,
  };
};

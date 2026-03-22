import { useCallback, useEffect, useState } from 'react';

import { useToast } from '@/providers/ToastProvider';

import { ENTERPRISE_GROUP_UI } from '../constants/enterprise-group.constants';
import { EnterpriseGroupService } from '../services/enterprise-group.service';

export const useEnterpriseGroups = ({ termId, filters, search, pagination, sort }) => {
  const toast = useToast();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchGroups = useCallback(async () => {
    if (!termId) return;

    try {
      setLoading(true);
      const params = {
        termId,
        pageIndex: pagination.current,
        pageSize: pagination.pageSize,
        searchTerm: search,
        status: filters.status, // 0 = InProgress, 1 = Finished, 2 = Archived
        SortColumn: sort?.column,
        SortOrder: sort?.order,
      };

      const response = await EnterpriseGroupService.getGroups(params);

      if (response?.data?.items) {
        setData(
          response.data.items.map((item) => ({
            ...item,
            id: item.id || item.groupId, // Mapping the ID consistently
          }))
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
  }, [termId, pagination, search, filters?.status, sort?.column, sort?.order, toast]);

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

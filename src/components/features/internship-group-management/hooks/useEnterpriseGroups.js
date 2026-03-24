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

      const allTerms = termOptions.filter((t) => t.value !== 'ALL_ACTIVE');
      if (allTerms.length === 0) {
        setData([]);
        setTotal(0);
        return;
      }

      // If a specific term is selected (not 'ALL_ACTIVE'), we could use just that.
      // But based on user request "get hết", we usually are in ALL_ACTIVE mode.
      const targetTerms = termId === 'ALL_ACTIVE' ? allTerms : [{ value: termId }];

      const fetchPromises = targetTerms.map(async (term) => {
        const params = {
          TermId: term.value,
          PageIndex: 1, // Aggregating everything for now
          PageSize: 100,
          Search: search,
          Status: filters.status,
          IncludeArchived: filters.includeArchived,
          Month: filters.dateFilter ? filters.dateFilter.month() + 1 : undefined,
          Year: filters.dateFilter ? filters.dateFilter.year() : undefined,
          SortColumn: sort?.column,
          SortOrder: sort?.order,
        };
        try {
          const response = await EnterpriseGroupService.getGroups(params);
          const items = response?.data?.items || response?.items || [];
          return items.map((item) => {
            const t = termOptions.find(
              (opt) => opt.value?.toLowerCase() === item.termId?.toLowerCase()
            );
            return {
              ...item,
              id: item.internshipId || item.id || item.groupId,
              name: item.groupName || item.GroupName || item.name,
              termName: item.termName || item.TermName || t?.label || term.label || '-',
              memberCount: item.numberOfMembers ?? item.NumberOfMembers ?? item.memberCount ?? 0,
              mentorName: item.mentorName || item.MentorName || '-',
            };
          });
        } catch (err) {
          console.error(`Failed to fetch groups for term ${term.value}:`, err);
          return [];
        }
      });

      const results = await Promise.all(fetchPromises);
      const combinedGroups = results.flat();

      setData(combinedGroups);
      setTotal(combinedGroups.length);
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

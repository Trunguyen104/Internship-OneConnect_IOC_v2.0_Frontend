import { useCallback, useEffect, useState } from 'react';

import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { useToast } from '@/providers/ToastProvider';

import { ENTERPRISE_GROUP_UI } from '../constants/enterprise-group.constants';
import { EnterpriseGroupService } from '../services/enterprise-group.service';

const DEFAULT_TERMS = [];

export const useEnterpriseGroups = ({
  termId,
  filters,
  search,
  pagination,
  sort,
  termOptions = DEFAULT_TERMS,
}) => {
  const toast = useToast();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchGroups = useCallback(async () => {
    if (!termId) return;

    try {
      setLoading(true);

      const isBulkTerm = termId === 'ALL_ACTIVE' || termId === 'ALL_VISIBLE';
      const allTerms = termOptions.filter(
        (t) => t.value !== 'ALL_ACTIVE' && t.value !== 'ALL_VISIBLE'
      );

      if (isBulkTerm && allTerms.length === 0) {
        setData([]);
        setTotal(0);
        return;
      }

      const targetTerms = isBulkTerm
        ? allTerms
        : [
            {
              value: termId,
              label: termOptions.find((t) => t.value === termId)?.label || 'Selected Term',
            },
          ];

      const fetchPromises = targetTerms.map(async (term) => {
        const params = {
          TermId: term.value,
          PageIndex: 1,
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
            const itemTermId =
              item.termId ||
              item.internshipTermId ||
              item.TermId ||
              item.term?.termId ||
              item.term?.id;
            const t = termOptions.find(
              (opt) => opt.value?.toLowerCase() === itemTermId?.toLowerCase()
            );
            return {
              ...item,
              id: item.internshipId || item.id || item.groupId || item.internshipGroupId,
              name: item.groupName || item.GroupName || item.name || item.Name,
              termName:
                item.termName ||
                item.internshipTermName ||
                item.term?.name ||
                item.term?.Name ||
                item.TermName ||
                t?.label ||
                term.label ||
                '-',
              memberCount: item.numberOfMembers ?? item.NumberOfMembers ?? item.memberCount ?? 0,
              mentorName: item.mentorName || item.MentorName || item.mentor?.fullName || '-',
            };
          });
        } catch (err) {
          // Silent error
          return [];
        }
      });

      const results = await Promise.all(fetchPromises);
      const combinedGroups = results.flat();

      setData(combinedGroups);
      setTotal(combinedGroups.length);
    } catch (error) {
      // Silent error
      toast.error(ENTERPRISE_GROUP_UI.MESSAGES.ERROR);
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [
    termId,
    pagination?.current,
    pagination?.pageSize,
    search,
    filters?.status,
    filters?.includeArchived,
    JSON.stringify(filters?.dateFilter), // Use stringified date to avoid object reference issues
    sort?.column,
    sort?.order,
    termOptions,
    toast,
  ]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  useEffect(() => {
    const handleRefresh = () => {
      fetchGroups();
    };
    window.addEventListener(INTERNSHIP_MANAGEMENT_UI.GROUP_MANAGEMENT.REFRESH_EVENT, handleRefresh);
    return () =>
      window.removeEventListener(
        INTERNSHIP_MANAGEMENT_UI.GROUP_MANAGEMENT.REFRESH_EVENT,
        handleRefresh
      );
  }, [fetchGroups]);

  return {
    data,
    total,
    loading,
    refetch: fetchGroups,
  };
};

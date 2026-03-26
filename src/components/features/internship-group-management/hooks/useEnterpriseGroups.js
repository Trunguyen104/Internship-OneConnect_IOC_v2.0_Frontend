import { useCallback, useEffect, useState } from 'react';

import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { useToast } from '@/providers/ToastProvider';

import { ENTERPRISE_GROUP_UI } from '../constants/enterprise-group.constants';
import { EnterpriseGroupService } from '../services/enterprise-group.service';

const DEFAULT_PHASE_OPTIONS = [];

export const useEnterpriseGroups = ({
  phaseId,
  filters,
  search,
  pagination,
  sort,
  phaseOptions = DEFAULT_PHASE_OPTIONS,
}) => {
  const toast = useToast();

  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  /**
   * Fetch Groups
   */
  const fetchGroups = useCallback(async () => {
    if (phaseId === undefined || phaseId === null) return;

    try {
      setLoading(true);

      const isBulkPhase = phaseId === 'ALL_VISIBLE';

      const params = {
        PhaseId: isBulkPhase ? undefined : phaseId,
        TermId: isBulkPhase ? undefined : phaseId,
        PageIndex: isBulkPhase ? 1 : pagination?.current || 1,
        PageSize: isBulkPhase ? 1000 : pagination?.pageSize || 10,
        Search: search || undefined,
        Status: filters?.status,
        IncludeArchived: filters?.includeArchived,
        SortColumn: sort?.column,
        SortOrder: sort?.order,
      };

      const response = await EnterpriseGroupService.getGroups(params);

      const items = response?.data?.items || response?.items || [];

      const mapped = items.map((item) => {
        const itemPhaseId = item.phaseId || item.termId || item.internshipPhaseId;
        const phaseMatch = phaseOptions.find(
          (opt) => String(opt.value).toLowerCase() === String(itemPhaseId).toLowerCase()
        );

        return {
          ...item,
          id: item.internshipId || item.groupId || item.internshipGroupId || item.id,
          name: item.groupName || item.GroupName || item.name || item.Name,
          memberCount: item.numberOfMembers ?? item.numberOfMembers ?? item.memberCount ?? 0,
          mentorName: item.mentorName || item.MentorName || item.mentor?.fullName || '-',
          phaseName:
            item.phaseName ||
            item.phase?.name ||
            item.termName ||
            phaseMatch?.label ||
            phaseMatch?.name ||
            '-',
        };
      });

      setData(mapped);
      setTotal(isBulkPhase ? mapped.length : response?.data?.total || mapped.length);
    } catch (error) {
      console.error(error);
      toast.error(ENTERPRISE_GROUP_UI.MESSAGES.ERROR);
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [
    phaseId,
    pagination?.current,
    pagination?.pageSize,
    search,
    filters?.status,
    filters?.includeArchived,
    sort?.column,
    sort?.order,
    phaseOptions,
    toast,
  ]);

  /**
   * Auto fetch when dependency changes
   */
  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  /**
   * Refresh event (after create/update/delete group)
   */
  useEffect(() => {
    const handleRefresh = () => {
      fetchGroups();
    };

    window.addEventListener(INTERNSHIP_MANAGEMENT_UI.GROUP_MANAGEMENT.REFRESH_EVENT, handleRefresh);

    return () => {
      window.removeEventListener(
        INTERNSHIP_MANAGEMENT_UI.GROUP_MANAGEMENT.REFRESH_EVENT,
        handleRefresh
      );
    };
  }, [fetchGroups]);

  return {
    data,
    total,
    loading,
    refetch: fetchGroups,
  };
};

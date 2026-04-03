'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { useToast } from '@/providers/ToastProvider';

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
  const { GROUP_MANAGEMENT } = INTERNSHIP_MANAGEMENT_UI;

  const queryKey = [
    'enterprise-groups',
    phaseId,
    pagination?.current,
    pagination?.pageSize,
    search,
    filters?.status,
    filters?.includeArchived,
    sort?.column,
    sort?.order,
  ];

  const {
    data: queryResult,
    isLoading,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      if (phaseId === undefined || phaseId === null) return { items: [], total: 0 };

      try {
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
        const safePhaseOptions = Array.isArray(phaseOptions) ? phaseOptions : [];

        const mapped = Array.isArray(items)
          ? items.map((item) => {
              const itemPhaseId = item.phaseId || item.termId || item.internshipPhaseId;
              const phaseMatch = safePhaseOptions.find(
                (opt) => String(opt.value).toLowerCase() === String(itemPhaseId).toLowerCase()
              );

              return {
                ...item,
                id: item.internshipId || item.groupId || item.internshipGroupId || item.id,
                name: item.groupName || item.GroupName || item.name || item.Name,
                memberCount: item.numberOfMembers ?? item.memberCount ?? 0,
                mentorName: item.mentorName || item.MentorName || item.mentor?.fullName || '-',
                phaseName:
                  item.phaseName ||
                  item.phase?.name ||
                  item.termName ||
                  phaseMatch?.label ||
                  phaseMatch?.name ||
                  '-',
                startDate: item.startDate || item.phaseStartDate || phaseMatch?.startDate,
                endDate: item.endDate || item.phaseEndDate || phaseMatch?.endDate,
              };
            })
          : [];

        return {
          items: mapped,
          total: isBulkPhase ? mapped.length : response?.data?.total || mapped.length,
        };
      } catch (error) {
        toast.error(GROUP_MANAGEMENT.MESSAGES.ERROR);
        return { items: [], total: 0 };
      }
    },
    enabled: phaseId !== undefined && phaseId !== null,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    const handleRefresh = () => {
      refetch();
    };

    window.addEventListener(GROUP_MANAGEMENT.REFRESH_EVENT, handleRefresh);

    return () => {
      window.removeEventListener(GROUP_MANAGEMENT.REFRESH_EVENT, handleRefresh);
    };
  }, [refetch, GROUP_MANAGEMENT.REFRESH_EVENT]);

  return {
    data: queryResult?.items || [],
    total: queryResult?.total || 0,
    loading: isLoading,
    refetch,
  };
};

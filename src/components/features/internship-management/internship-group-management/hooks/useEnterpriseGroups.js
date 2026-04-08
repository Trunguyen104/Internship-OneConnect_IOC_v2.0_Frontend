'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';

import { ProjectService } from '@/components/features/project-management/services/project.service';
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
      if (phaseId === undefined || phaseId === null)
        return { items: [], total: 0, projectItems: [] };

      try {
        const isBulkPhase = phaseId === 'ALL_VISIBLE';

        const params = {
          PhaseId: isBulkPhase ? undefined : phaseId,
          TermId: isBulkPhase ? undefined : phaseId,
          PageIndex: isBulkPhase ? 1 : Math.max(1, pagination?.current || 1),
          PageSize: isBulkPhase ? 100 : Math.max(1, pagination?.pageSize || 10),
          SearchTerm: search || undefined,
          Status: filters?.status,
          IncludeArchived: filters?.includeArchived,
          SortColumn: sort?.column,
          SortOrder: sort?.order,
        };

        const [response, projectsRes] = await Promise.all([
          EnterpriseGroupService.getGroups(params),
          ProjectService.getAll({ pageSize: 100 }).catch(() => null),
        ]);

        const items = response?.data?.items || response?.items || [];
        const projectItems = projectsRes?.data?.items || projectsRes?.items || [];

        return {
          items,
          total: isBulkPhase ? items.length : response?.data?.total || items.length,
          projectItems,
        };
      } catch (error) {
        toast.error(GROUP_MANAGEMENT.MESSAGES.ERROR);
        return { items: [], total: 0, projectItems: [] };
      }
    },
    enabled: phaseId !== undefined && phaseId !== null,
    staleTime: 5 * 60 * 1000,
  });

  const mappedData = useMemo(() => {
    const { items = [], projectItems = [] } = queryResult || {};
    const safePhaseOptions = Array.isArray(phaseOptions) ? phaseOptions : [];

    // Create a map for quick lookup: { normalizedGroupId: [projectName1, projectName2, ...] }
    const projectMap = (Array.isArray(projectItems) ? projectItems : []).reduce((acc, p) => {
      const gid =
        p.internshipId ||
        p.InternshipId ||
        p.internshipGroupId ||
        p.groupId ||
        p.InternshipGroupId ||
        p.GroupId ||
        p.projectId ||
        p.ProjectId;

      if (gid) {
        const key = String(gid).toLowerCase();
        if (!acc[key]) acc[key] = [];
        acc[key].push(p.projectName || p.ProjectName || p.name || p.Name);
      }
      return acc;
    }, {});

    return items.map((item) => {
      const itemPhaseId = item.phaseId || item.termId || item.internshipPhaseId;
      const phaseMatch = safePhaseOptions.find(
        (opt) => String(opt.value).toLowerCase() === String(itemPhaseId).toLowerCase()
      );

      const finalGroupId =
        item.internshipGroupId ||
        item.InternshipGroupId ||
        item.groupId ||
        item.GroupId ||
        item.id ||
        item.internshipId ||
        item.InternshipId;

      const normalizedKey = String(finalGroupId || '').toLowerCase();

      return {
        ...item,
        id: finalGroupId,
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
        projectName: projectMap[normalizedKey]?.[0] || 'N/A',
        projectCount: projectMap[normalizedKey]?.length || 0,
      };
    });
  }, [queryResult, phaseOptions]);

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
    data: mappedData,
    total: queryResult?.total || 0,
    loading: isLoading,
    refetch,
  };
};

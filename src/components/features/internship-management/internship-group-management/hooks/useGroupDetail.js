'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { ProjectService } from '@/components/features/project-management/services/project.service';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { useToast } from '@/providers/ToastProvider';

import { EnterpriseGroupService } from '../services/enterprise-group.service';

export function useGroupDetail(groupId) {
  const toast = useToast();
  const { GROUP_MANAGEMENT } = INTERNSHIP_MANAGEMENT_UI;

  const {
    data: info,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['enterprise-group-detail', groupId],
    queryFn: async () => {
      if (!groupId) return null;
      try {
        const [res, projectsRes] = await Promise.all([
          EnterpriseGroupService.getGroupDetail(groupId),
          ProjectService.getAll({ internshipId: groupId }).catch(() => null),
        ]);

        const rawData = res?.data || res;
        const projectItems = projectsRes?.data?.items || projectsRes?.items || [];
        const firstProject = projectItems[0];

        if (rawData) {
          // Map data to the format expected by GroupGeneralInfo
          return {
            ...rawData,
            id: rawData.internshipId || rawData.id || rawData.groupId,
            groupName: rawData.groupName || rawData.name,
            status: (() => {
              let s = rawData.status;
              if (typeof s === 'string') {
                const sMap = { active: 1, finished: 2, archived: 3 };
                s = sMap[s.toLowerCase()] || s;
              }
              return s || 1;
            })(),
            mentorName: rawData.mentorName || rawData.mentor?.fullName || '-',
            mentorEmail: rawData.mentorEmail || rawData.mentor?.email || '',
            internshipTermName:
              rawData.termName || rawData.internshipTermName || rawData.term?.name || '-',
            enterpriseName: rawData.enterpriseName || rawData.enterprise?.name || '-',
            project:
              rawData.project ||
              (rawData.projectName || rawData.ProjectName || firstProject?.projectName
                ? { name: rawData.projectName || rawData.ProjectName || firstProject?.projectName }
                : null),
            projectName: rawData.projectName || rawData.ProjectName || firstProject?.projectName,
            projectCount: projectItems.length,
            projects: projectItems,
            startDate: rawData.startDate,
            endDate: rawData.endDate,
            members: (rawData.members || rawData.students || []).map((s) => ({
              id: s.studentId || s.id || s.applicationId,
              fullName: s.studentFullName || s.fullName || s.name || 'Unknown',
              code: s.studentCode || s.code || '-',
              email: s.email || '-',
              universityName: s.universityName || s.schoolName || '-',
            })),
            displayCreatedAt: rawData.createdAt
              ? new Date(rawData.createdAt).toLocaleDateString('en-GB')
              : 'N/A',
            displayUpdatedAt: rawData.updatedAt
              ? `Updated on ${new Date(rawData.updatedAt).toLocaleDateString('en-GB')}`
              : '',
          };
        }
        return null;
      } catch (err) {
        toast.error(GROUP_MANAGEMENT.MESSAGES.LOAD_ERROR || 'Failed to load group details');
        console.error(err);
        return null;
      }
    },
    enabled: !!groupId,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    const handleRefresh = () => {
      refetch();
    };

    window.addEventListener(GROUP_MANAGEMENT.REFRESH_EVENT, handleRefresh);
    return () => window.removeEventListener(GROUP_MANAGEMENT.REFRESH_EVENT, handleRefresh);
  }, [refetch, GROUP_MANAGEMENT.REFRESH_EVENT]);

  return {
    info,
    loading: isLoading,
    refetch,
  };
}

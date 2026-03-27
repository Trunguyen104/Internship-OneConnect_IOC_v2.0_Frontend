'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useToast } from '@/providers/ToastProvider';

import { EnterpriseGroupService } from '../services/enterprise-group.service';

export function useGroupDetail(groupId) {
  const toast = useToast();

  const {
    data: info,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['enterprise-group-detail', groupId],
    queryFn: async () => {
      if (!groupId) return null;
      try {
        const res = await EnterpriseGroupService.getGroupDetail(groupId);
        const rawData = res?.data || res;

        if (rawData) {
          // Map data to the format expected by GroupGeneralInfo
          return {
            ...rawData,
            id: rawData.internshipId || rawData.id || rawData.groupId,
            groupName: rawData.groupName || rawData.name,
            status: rawData.status || 1,
            mentorName: rawData.mentorName || rawData.mentor?.fullName || '-',
            mentorEmail: rawData.mentorEmail || rawData.mentor?.email || '',
            internshipTermName:
              rawData.termName || rawData.internshipTermName || rawData.term?.name || '-',
            enterpriseName: rawData.enterpriseName || rawData.enterprise?.name || '-',
            project:
              rawData.project || (rawData.projectName ? { name: rawData.projectName } : null),
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
        toast.error('Failed to load group details');
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
    const REFRESH_EVENT = 'internship-group-refresh';
    window.addEventListener(REFRESH_EVENT, handleRefresh);
    return () => window.removeEventListener(REFRESH_EVENT, handleRefresh);
  }, [refetch]);

  return {
    info,
    loading: isLoading,
    refetch,
  };
}

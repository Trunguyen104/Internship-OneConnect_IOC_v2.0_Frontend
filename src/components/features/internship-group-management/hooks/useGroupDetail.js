'use client';

import { useCallback, useEffect, useState } from 'react';

import { useToast } from '@/providers/ToastProvider';

import { EnterpriseGroupService } from '../services/enterprise-group.service';

export function useGroupDetail(groupId) {
  const toast = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = useCallback(async () => {
    if (!groupId) return;
    try {
      setLoading(true);
      const res = await EnterpriseGroupService.getGroupDetail(groupId);
      const rawData = res?.data || res;

      if (rawData) {
        // Map data to the format expected by GroupGeneralInfo
        setData({
          ...rawData,
          id: rawData.internshipId || rawData.id || rawData.groupId,
          groupName: rawData.groupName || rawData.name,
          status: rawData.status || 1,
          mentorName: rawData.mentorName || rawData.mentor?.fullName || '-',
          mentorEmail: rawData.mentorEmail || rawData.mentor?.email || '',
          internshipTermName:
            rawData.termName || rawData.internshipTermName || rawData.term?.name || '-',
          enterpriseName: rawData.enterpriseName || rawData.enterprise?.name || '-',
          project: rawData.project || (rawData.projectName ? { name: rawData.projectName } : null),
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
        });
      }
    } catch (err) {
      toast.error('Failed to load group details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [groupId, toast]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  useEffect(() => {
    const handleRefresh = () => {
      fetchDetail();
    };
    const REFRESH_EVENT = 'internship-group-refresh';
    window.addEventListener(REFRESH_EVENT, handleRefresh);
    return () => window.removeEventListener(REFRESH_EVENT, handleRefresh);
  }, [fetchDetail]);

  return {
    info: data,
    loading,
    refetch: fetchDetail,
  };
}

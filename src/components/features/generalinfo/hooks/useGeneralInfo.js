'use client';

import { useState, useEffect } from 'react';
import { InternshipGroupService } from '@/components/features/internship/services/internshipGroup.service';
import { ProjectService } from '@/components/features/project/services/projectService';
import { useToast } from '@/providers/ToastProvider';

export function useGeneralInfo() {
  const toast = useToast();
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const GROUP_STATUS_MAP = {
    1: { label: 'Registered', style: 'bg-slate-100 text-slate-700 border-slate-200' },
    2: { label: 'Onboarded', style: 'bg-purple-100 text-purple-700 border-purple-200' },
    3: { label: 'In Progress', style: 'bg-blue-100 text-blue-700 border-blue-200' },
    4: { label: 'Completed', style: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    5: { label: 'Failed', style: 'bg-rose-100 text-rose-700 border-rose-200' },
    ACTIVE: { label: 'In Progress', style: 'bg-blue-100 text-blue-700 border-blue-200' },
    INPROGRESS: { label: 'In Progress', style: 'bg-blue-100 text-blue-700 border-blue-200' },
    IN_PROGRESS: { label: 'In Progress', style: 'bg-blue-100 text-blue-700 border-blue-200' },
    COMPLETED: { label: 'Completed', style: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    REGISTERED: { label: 'Registered', style: 'bg-slate-100 text-slate-700 border-slate-200' },
    ONBOARDED: { label: 'Onboarded', style: 'bg-purple-100 text-purple-700 border-purple-200' },
  };

  useEffect(() => {
    const fetchGeneralData = async () => {
      try {
        setLoading(true);
        const groupsRes = await InternshipGroupService.getAll();
        const groups = groupsRes?.data?.items || groupsRes?.items || [];

        if (groups.length === 0) {
          setLoading(false);
          return;
        }

        const groupId = groups[0].internshipId || groups[0].id;

        const groupDetailRes = await InternshipGroupService.getById(groupId);
        const groupDetail = groupDetailRes?.data || groupDetailRes;

        let projectInfo = null;
        try {
          const projectRes = await ProjectService.getByInternshipGroup(groupId);
          projectInfo = projectRes?.data?.items?.[0] || projectRes?.data || projectRes;
        } catch (err) {
          console.warn('Could not fetch project info:', err);
        }

        setInfo({
          ...groupDetail,
          projectDescription:
            projectInfo?.description ||
            groupDetail?.description ||
            'No project description available.',
          displayCreatedAt: groupDetail?.createdAt
            ? new Date(groupDetail.createdAt).toLocaleDateString('en-GB')
            : 'N/A',
          displayUpdatedAt: groupDetail?.updatedAt
            ? `Updated on ${new Date(groupDetail.updatedAt).toLocaleDateString('en-GB')}`
            : groupDetail?.updatedText || '',
        });
      } catch (error) {
        console.error('Error fetching general info:', error);
        toast.error('Failed to load general information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGeneralData();
  }, []);

  const getStatusConfig = (status) => {
    const normalizedStatus = status ? String(status).toUpperCase().replace(/_/g, '') : '';
    return (
      GROUP_STATUS_MAP[status] ||
      GROUP_STATUS_MAP[normalizedStatus] || {
        label: status || 'Unknown',
        style: 'bg-slate-100 text-slate-500 border-slate-200',
      }
    );
  };

  return {
    info,
    loading,
    getStatusConfig,
  };
}

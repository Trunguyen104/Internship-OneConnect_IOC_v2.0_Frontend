'use client';

import { useState, useEffect } from 'react';
import { InternshipGroupService } from '@/components/features/internship/services/internshipGroup.service';
import { ProjectService } from '@/components/features/project/services/projectService';
import { GENERAL_INFO_UI } from '@/constants/general-info/general-info';
import { useToast } from '@/providers/ToastProvider';

export function useGeneralInfo() {
  const toast = useToast();
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const GROUP_STATUS_MAP = {
    1: {
      label: GENERAL_INFO_UI.STATUS.REGISTERED,
      style: 'bg-muted text-muted-foreground border-border',
    },
    2: {
      label: GENERAL_INFO_UI.STATUS.ONBOARDED,
      style: 'bg-info-surface text-info border-info/20',
    },
    3: {
      label: GENERAL_INFO_UI.STATUS.IN_PROGRESS,
      style: 'bg-primary-surface text-primary border-primary/20',
    },
    4: {
      label: GENERAL_INFO_UI.STATUS.COMPLETED,
      style: 'bg-success-surface text-success border-success/20',
    },
    5: {
      label: GENERAL_INFO_UI.STATUS.FAILED,
      style: 'bg-danger-surface text-danger border-danger/20',
    },
    ACTIVE: {
      label: GENERAL_INFO_UI.STATUS.IN_PROGRESS,
      style: 'bg-primary-surface text-primary border-primary/20',
    },
    INPROGRESS: {
      label: GENERAL_INFO_UI.STATUS.IN_PROGRESS,
      style: 'bg-primary-surface text-primary border-primary/20',
    },
    IN_PROGRESS: {
      label: GENERAL_INFO_UI.STATUS.IN_PROGRESS,
      style: 'bg-primary-surface text-primary border-primary/20',
    },
    COMPLETED: {
      label: GENERAL_INFO_UI.STATUS.COMPLETED,
      style: 'bg-success-surface text-success border-success/20',
    },
    REGISTERED: {
      label: GENERAL_INFO_UI.STATUS.REGISTERED,
      style: 'bg-muted text-muted-foreground border-border',
    },
    ONBOARDED: {
      label: GENERAL_INFO_UI.STATUS.ONBOARDED,
      style: 'bg-info-surface text-info border-info/20',
    },
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
            GENERAL_INFO_UI.VALUES.NO_PROJECT_DESC,
          displayCreatedAt: groupDetail?.createdAt
            ? new Date(groupDetail.createdAt).toLocaleDateString('vi-VN')
            : GENERAL_INFO_UI.VALUES.NA,
          displayUpdatedAt: groupDetail?.updatedAt
            ? `${GENERAL_INFO_UI.VALUES.UPDATED_ON} ${new Date(groupDetail.updatedAt).toLocaleDateString('vi-VN')}`
            : groupDetail?.updatedText || '',
        });
      } catch (error) {
        console.error('Error fetching general info:', error);
        toast.error(GENERAL_INFO_UI.MESSAGES.FETCH_ERROR);
      } finally {
        setLoading(false);
      }
    };

    fetchGeneralData();
  }, [toast]);

  const getStatusConfig = (status) => {
    const normalizedStatus = status ? String(status).toUpperCase().replace(/_/g, '') : '';
    return (
      GROUP_STATUS_MAP[status] ||
      GROUP_STATUS_MAP[normalizedStatus] || {
        label: status || GENERAL_INFO_UI.STATUS.UNKNOWN,
        style: 'bg-muted text-muted-foreground border-border',
      }
    );
  };

  return {
    info,
    loading,
    getStatusConfig,
  };
}

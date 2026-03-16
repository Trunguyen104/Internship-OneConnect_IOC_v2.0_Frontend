'use client';

import { useState, useEffect } from 'react';
import { InternshipGroupService } from '@/components/features/internship/services/internshipGroup.service';
import { GENERAL_INFO_UI } from '@/constants/general-info/general-info';
import { ProjectService } from '@/components/features/project/services/projectService';
import { useToast } from '@/providers/ToastProvider';

export function useGeneralInfo(initialId = null) {
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

        let data = null;
        if (initialId) {
          const res = await InternshipGroupService.getById(initialId);
          data = res?.data || res;
        } else {
          const res = await InternshipGroupService.getAll({ PageSize: 1 });
          // Get the first item from paginated items OR if the API returns a direct array
          data = res?.data?.items?.[0] || res?.data?.[0] || res?.[0] || null;
        }

        if (!data) {
          setLoading(false);
          return;
        }

        const internshipId = data.internshipId || data.id;
        const termId = data.termId || data.term?.termId;

        // Supplemental fetches for missing DTO info
        const [termRes, projectRes] = await Promise.all([
          termId ? InternshipGroupService.getTermById(termId) : Promise.resolve(null),
          internshipId ? ProjectService.getByInternshipGroup(internshipId) : Promise.resolve(null),
        ]);

        const termData = termRes?.data || termRes;
        const projectData =
          projectRes?.data?.items?.[0] || projectRes?.data?.[0] || projectRes?.data || null;

        setInfo({
          ...data,
          groupName: data.groupName || data.name,
          internshipTermName: termData?.name || data.internshipTermName || data.term?.name,
          enterpriseName: data.enterpriseName || data.enterprise?.name || data.company,
          schoolName: data.schoolName || data.school?.name || data.school,
          mentorName: data.mentorName || data.mentors?.[0]?.fullName || data.mentor,
          totalStudents: data.numberOfMembers || data.studentCount || data.members?.length,
          totalMentors:
            data.totalMentors || data.mentors?.length || (data.mentorName || data.mentor ? 1 : 0),
          project: projectData
            ? {
                id: projectData.projectId || projectData.id,
                name: projectData.projectName || projectData.name,
              }
            : data.project,
          projectDescription:
            projectData?.description ||
            data.project?.description ||
            data.description ||
            GENERAL_INFO_UI.VALUES.NO_PROJECT_DESC,
          displayCreatedAt: data.createdAt
            ? new Date(data.createdAt).toLocaleDateString('vi-VN')
            : GENERAL_INFO_UI.VALUES.NA,
          displayUpdatedAt: data.updatedAt
            ? `${GENERAL_INFO_UI.VALUES.UPDATED_ON} ${new Date(data.updatedAt).toLocaleDateString('vi-VN')}`
            : data.updatedText || '',
        });
      } catch (error) {
        console.error('Error fetching general info:', error);
        toast.error(GENERAL_INFO_UI.MESSAGES.FETCH_ERROR);
      } finally {
        setLoading(false);
      }
    };

    fetchGeneralData();
  }, [initialId, toast]);

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

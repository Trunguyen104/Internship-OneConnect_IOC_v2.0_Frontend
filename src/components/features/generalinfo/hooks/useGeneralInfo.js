'use client';

import { useEffect, useState } from 'react';

import { InternshipGroupService } from '@/components/features/internship/services/internshipGroup.service';
import { ProjectService } from '@/components/features/project/services/projectService';
import { GENERAL_INFO_UI } from '@/constants/general-info/general-info';
import { useToast } from '@/providers/ToastProvider';

export function useGeneralInfo(initialId = null) {
  const toast = useToast();
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const GROUP_STATUS_COLORS = {
    1: 'info',
    2: 'info',
    3: 'warning',
    4: 'success',
    5: 'danger',
    ACTIVE: 'warning',
    INPROGRESS: 'warning',
    IN_PROGRESS: 'warning',
    COMPLETED: 'success',
    REGISTERED: 'info',
    ONBOARDED: 'info',
    FAILED: 'danger',
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
          data = res?.data?.items?.[0] || res?.data?.[0] || res?.[0] || null;
        }

        if (!data) {
          setLoading(false);
          return;
        }

        const internshipId = data.internshipId || data.id;
        const termId = data.termId || data.term?.termId;

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
            ? new Date(data.createdAt).toLocaleDateString('en-GB')
            : GENERAL_INFO_UI.VALUES.NA,
          displayUpdatedAt: data.updatedAt
            ? `${GENERAL_INFO_UI.VALUES.UPDATED_ON} ${new Date(data.updatedAt).toLocaleDateString('en-GB')}`
            : data.updatedText || '',
        });
      } catch (error) {
        toast.error(GENERAL_INFO_UI.MESSAGES.FETCH_ERROR);
      } finally {
        setLoading(false);
      }
    };

    fetchGeneralData();
  }, [initialId, toast]);

  const getStatusConfig = (status) => {
    const normalizedStatus = status ? String(status).toUpperCase().replace(/_/g, '') : '';
    const color = GROUP_STATUS_COLORS[status] || GROUP_STATUS_COLORS[normalizedStatus] || 'default';

    // Map label
    let label = status || GENERAL_INFO_UI.STATUS.UNKNOWN;
    if (color === 'muted') label = GENERAL_INFO_UI.STATUS.REGISTERED;
    if (color === 'info') label = GENERAL_INFO_UI.STATUS.ONBOARDED;
    if (color === 'primary') label = GENERAL_INFO_UI.STATUS.IN_PROGRESS;
    if (color === 'warning') label = GENERAL_INFO_UI.STATUS.IN_PROGRESS;
    if (color === 'success') label = GENERAL_INFO_UI.STATUS.COMPLETED;
    if (color === 'danger') label = GENERAL_INFO_UI.STATUS.FAILED;

    return { label, color };
  };

  return {
    info,
    loading,
    getStatusConfig,
  };
}

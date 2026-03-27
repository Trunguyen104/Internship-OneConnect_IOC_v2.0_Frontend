'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { InternshipGroupService } from '@/components/features/internship/services/internship-group.service';
import { TermService } from '@/components/features/internship-term-management/services/term.service';
import { ProjectService } from '@/components/features/project/services/project.service';
import { GENERAL_INFO_UI } from '@/constants/general-info/general-info';
import { useToast } from '@/providers/ToastProvider';

export function useGeneralInfo(initialId = null) {
  const toast = useToast();
  const params = useParams();
  const effectiveId = initialId || params?.internshipGroupId;

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

        if (!effectiveId) {
          setLoading(false);
          return;
        }

        const res = await InternshipGroupService.getById(effectiveId);
        const data = res?.data || res;

        if (!data) {
          setLoading(false);
          return;
        }

        const baseInfo = {
          ...data,
          groupName: data.groupName || data.name,
          internshipTermName:
            data.internshipTermName || data.term?.name || GENERAL_INFO_UI.VALUES.NA,
          enterpriseName:
            data.enterpriseName ||
            data.enterprise?.name ||
            data.company ||
            GENERAL_INFO_UI.VALUES.NA,
          schoolName:
            data.schoolName || data.school?.name || data.school || GENERAL_INFO_UI.VALUES.NA,
          mentorName: data.mentorName || data.mentors?.[0]?.fullName || data.mentor,
          mentorEmail: data.mentorEmail || data.mentors?.[0]?.email || '',
          totalStudents: data.numberOfMembers || data.studentCount || data.members?.length || 0,
          totalMentors:
            data.totalMentors || data.mentors?.length || (data.mentorName || data.mentor ? 1 : 0),
          members: (data.members || data.students || data.items || []).map((s) => ({
            id: s.studentId || s.id || s.applicationId,
            fullName: s.studentFullName || s.fullName || s.name || 'Unknown',
            code: s.studentCode || s.code || '-',
            email: s.email || '-',
            avatar: s.avatar,
            universityName: s.universityName || s.schoolName || s.university || '-',
          })),
          displayCreatedAt: data.createdAt
            ? new Date(data.createdAt).toLocaleDateString('en-GB')
            : GENERAL_INFO_UI.VALUES.NA,
          displayUpdatedAt: data.updatedAt
            ? `${GENERAL_INFO_UI.VALUES.UPDATED_ON} ${new Date(data.updatedAt).toLocaleDateString('en-GB')}`
            : data.updatedText || '',
        };

        setInfo(baseInfo);

        try {
          const internshipId = data.internshipId || data.id;
          const termId = data.termId || data.term?.termId || data.term?.id;

          const [termRes, projectRes] = await Promise.all([
            termId ? TermService.getById(termId) : Promise.resolve(null),
            internshipId
              ? ProjectService.getByInternshipGroup(internshipId)
              : Promise.resolve(null),
          ]);

          const termData = termRes?.data || termRes;
          const projectData =
            projectRes?.data?.items?.[0] || projectRes?.data?.[0] || projectRes?.data || null;

          setInfo((prev) => ({
            ...prev,
            internshipTermName: termData?.name || prev.internshipTermName,
            project: projectData
              ? {
                  id: projectData.projectId || projectData.id,
                  name: projectData.projectName || projectData.name,
                }
              : prev.project,
            projectDescription:
              projectData?.description ||
              data.project?.description ||
              data.description ||
              GENERAL_INFO_UI.VALUES.NO_PROJECT_DESC,
          }));
        } catch (enrichErr) {
          console.warn('Enrichment failed:', enrichErr);
        }
      } catch (err) {
        console.error('Fetch general data failed:', err);
        toast.error(GENERAL_INFO_UI.MESSAGES.FETCH_ERROR);
      } finally {
        setLoading(false);
      }
    };

    fetchGeneralData();
  }, [effectiveId, toast]);

  const getStatusConfig = (status) => {
    const normalizedStatus = status ? String(status).toUpperCase().replace(/_/g, '') : '';
    const color = GROUP_STATUS_COLORS[status] || GROUP_STATUS_COLORS[normalizedStatus] || 'default';

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

import { useQuery } from '@tanstack/react-query';

import { useToast } from '@/providers/ToastProvider';

import { EnterpriseGroupService } from '../../internship-management/internship-group-management/services/enterprise-group.service';
import { userService } from '../../user/services/user.service';
import { EnterpriseMentorService } from '../services/enterprise-mentor.service';
import { EnterprisePhaseService } from '../services/enterprise-phase.service';
import { EnterpriseStudentService } from '../services/enterprise-student.service';

export const useStudentData = (filters) => {
  const toast = useToast();
  const { search, groupFilter, mentorFilter, phaseId, pagination, sort } = filters;

  // 1. Fetch User Info
  const { data: enterpriseId } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      try {
        const res = await userService.getMe();
        const data = res?.data || res;
        return data?.enterpriseId || data?.enterprise_id || data?.enterpriseID;
      } catch {
        return null;
      }
    },
    staleTime: 0, // Always check user identity on mount
  });

  // 2. Fetch Mentors
  const { data: mentors = [], isLoading: loadingMentors } = useQuery({
    queryKey: ['mentors-list'],
    queryFn: async () => {
      try {
        const roles = [6];
        const results = await Promise.allSettled(
          roles.map((r) => EnterpriseMentorService.getMentors({ Role: r, PageSize: 100 }))
        );

        const allItems = results
          .filter((r) => r.status === 'fulfilled')
          .flatMap((r) => {
            const res = r.value;
            const data = res?.data || res;
            return data?.items || data?.Items || (Array.isArray(data) ? data : []);
          });

        const uniqueItems = Array.from(
          new Map(allItems.map((item) => [item?.userId || item?.UserId || item?.id, item])).values()
        ).filter(Boolean);

        return uniqueItems;
      } catch {
        toast.error('Không thể tải danh sách Mentor');
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  // 3. Fetch Phases
  const { data: phaseData = { options: [], universityOptions: [] }, isLoading: fetchingPhases } =
    useQuery({
      queryKey: ['enterprise-phases'],
      queryFn: async () => {
        try {
          const res = await EnterprisePhaseService.getPhases();
          const phases = res?.data?.items || res?.data || [];

          const openPhases = phases
            .filter((p) => p.status === 1 || p.status === 0)
            .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

          const options = openPhases.map((p) => ({
            label: p.phaseName || p.name || p.termName,
            value: p.phaseId || p.id || p.termId,
            status: p.status,
            phaseName: p.phaseName || p.name || p.termName,
            universityName: p.universityName,
            enterpriseName: p.enterpriseName,
            startDate: p.startDate,
            endDate: p.endDate,
            maxStudents: p.maxStudents,
            description: p.description,
            groupCount: p.groupCount,
          }));

          const allOption = {
            label: 'All Open Phases',
            value: 'ALL_VISIBLE',
            status: 1,
            phaseIds: options.map((p) => p.value),
          };

          const uniqueUniversities = Array.from(
            new Set(phases.map((p) => p.universityName).filter(Boolean))
          );

          return {
            options: [allOption, ...options],
            universityOptions: uniqueUniversities.map((name) => ({ label: name, value: name })),
          };
        } catch {
          return { options: [], universityOptions: [] };
        }
      },
      staleTime: 10 * 60 * 1000,
    });

  const phaseOptions = phaseData.options;

  // 4. Fetch Students and Groups
  const {
    data: studentResult = {
      students: [],
      total: 0,
      unassigned: [],
      existingGroups: [],
      hasGroups: false,
    },
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: [
      'internship-students',
      phaseId,
      pagination.current,
      pagination.pageSize,
      search,
      groupFilter,
      mentorFilter,
      sort,
      phaseOptions,
    ],
    queryFn: async () => {
      try {
        const isAllVisible = phaseId === 'ALL_VISIBLE' || !phaseId;
        const params = {
          PhaseId: isAllVisible ? undefined : phaseId,
          TermId: isAllVisible ? undefined : phaseId,
          PageNumber: pagination.current,
          PageSize: pagination.pageSize,
          SearchTerm: search || undefined,
          IsAssignedToGroup:
            groupFilter === 'HAS_GROUP' ? true : groupFilter === 'NO_GROUP' ? false : undefined,
          IsAssignedToMentor: ['HAS_MENTOR', 'ASSIGNED'].includes(mentorFilter)
            ? true
            : ['NO_MENTOR', 'UNASSIGNED'].includes(mentorFilter)
              ? false
              : undefined,
          sortBy: sort?.column || 'AppliedAt',
          sortOrder: sort?.order || 'Desc',
        };

        const openPhaseIds = Array.isArray(phaseOptions)
          ? phaseOptions
              .filter((p) => p.status === 1 && p.value !== 'ALL_VISIBLE')
              .map((p) => String(p.value))
          : [];

        const res = await EnterpriseGroupService.getPlacedStudents(params);
        const items = res?.data?.items || res?.items || [];
        const totalCount = res?.data?.totalCount || res?.totalCount || items.length;

        const safePhaseOptions = Array.isArray(phaseOptions) ? phaseOptions : [];
        const mappedStudents = (items || []).map((item) => {
          const mapped = EnterpriseStudentService.mapApplication(item);
          if (mapped.phaseStatus === 0 || mapped.phaseStatus === undefined) {
            const studentPhase = safePhaseOptions.find((o) => o.value === mapped.phaseId);
            mapped.phaseStatus = studentPhase?.status || 2;
          }
          if (!mapped.startDate || !mapped.endDate) {
            const studentPhase = safePhaseOptions.find((o) => o.value === mapped.phaseId);
            mapped.startDate = studentPhase?.startDate;
            mapped.endDate = studentPhase?.endDate;
          }
          return mapped;
        });

        const groupParams = {
          phaseId: isAllVisible ? undefined : phaseId,
          pageSize: 100,
        };
        const groupRes = await EnterpriseGroupService.getGroups(groupParams).catch(() => ({
          data: { items: [] },
        }));
        const allGroups = groupRes?.data?.items || groupRes?.items || [];

        return {
          students: mappedStudents,
          total: totalCount,
          unassigned: mappedStudents.filter((i) => !i.groupName && !i.groupId),
          existingGroups: allGroups,
          hasGroups: allGroups.some((g) => g.status === 1),
        };
      } catch {
        return { students: [], total: 0, unassigned: [], existingGroups: [], hasGroups: false };
      }
    },
    enabled: Array.isArray(phaseOptions) && phaseOptions.length > 0,
    staleTime: 2 * 60 * 1000,
  });

  return {
    enterpriseId,
    mentors,
    loadingMentors,
    phaseData,
    fetchingPhases,
    phaseOptions,
    studentResult,
    loadingStudents: loading,
    refetchStudents: refetch,
  };
};

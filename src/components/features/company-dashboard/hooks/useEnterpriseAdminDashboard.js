import { useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useCallback, useState } from 'react';

import { USER_ROLE } from '@/constants/common/enums';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { useToast } from '@/providers/ToastProvider';
import { useAuthStore } from '@/store/useAuthStore';

import { EnterpriseGroupService } from '../../internship-management/internship-group-management/services/enterprise-group.service';
import { EnterpriseMentorService } from '../../internship-student-management/services/enterprise-mentor.service';
import { DashboardService } from '../services/dashboard.service';

const formatISO = (dateStr) => {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toISOString();
  } catch {
    return null;
  }
};

export const useEnterpriseAdminDashboard = () => {
  const user = useAuthStore((s) => s.user);
  const toast = useToast();
  const queryClient = useQueryClient();
  const isEnabled = !!user?.role && Number(user.role) === USER_ROLE.ENTERPRISE_ADMIN;

  const [assignModal, setAssignModal] = useState({ open: false, group: null });
  const [isAssigning, setIsAssigning] = useState(false);

  const {
    data: dashboardData,
    isLoading: loadingDash,
    refetch,
  } = useQuery({
    queryKey: ['enterprise-admin-dashboard'],
    queryFn: () => DashboardService.getAdminDashboard(),
    enabled: isEnabled,
  });

  const { data: phasesListData, isLoading: loadingPhases } = useQuery({
    queryKey: ['enterprise-admin-all-phases'], // Đổi key để buộc refetch dữ liệu mới
    queryFn: () => DashboardService.getInternshipPhases({ PageSize: 50 }), // Giới hạn tối đa 50 theo yêu cầu API
    enabled: isEnabled,
  });

  const { data: pendingSelfAppsData, isLoading: loadingSelf } = useQuery({
    queryKey: ['enterprise-admin-pending-self'],
    queryFn: () => DashboardService.getSelfApplyApplications({ Status: 1 }), // 1: Applied
    enabled: isEnabled,
  });

  const { data: pendingUniAppsData, isLoading: loadingUni } = useQuery({
    queryKey: ['enterprise-admin-pending-uni'],
    queryFn: () => DashboardService.getUniAssignApplications({ Status: 1 }), // 1: Applied
    enabled: isEnabled,
  });

  const { data: placedStudentsData, isLoading: loadingPlaced } = useQuery({
    queryKey: ['enterprise-admin-placed-students'],
    queryFn: () => DashboardService.getPlacedStudents(),
    enabled: isEnabled,
  });

  const { data: activeGroupsData, isLoading: loadingGroups } = useQuery({
    queryKey: ['enterprise-admin-active-groups'],
    queryFn: () => DashboardService.getInternshipGroups({ Status: 1 }),
    enabled: isEnabled,
  });

  const enterpriseId = user?.enterpriseId || user?.unitId;

  // Fetch Mentors for the modal
  const { data: mentors = [], isLoading: loadingMentors } = useQuery({
    queryKey: ['enterprise-mentors-dashboard', enterpriseId],
    queryFn: async () => {
      if (!enterpriseId) return [];
      try {
        const res = await EnterpriseMentorService.getMentors({
          Role: 6,
          UnitId: String(enterpriseId),
          PageSize: 500,
        });
        const data = res?.data || res;
        const allItems = data?.items || (Array.isArray(data) ? data : []);
        return allItems.filter((m) => String(m.role || m.Role) === '6');
      } catch {
        return [];
      }
    },
    enabled: isEnabled && !!enterpriseId,
  });

  const raw = dashboardData?.data || {
    summary_cards: {},
    groups_without_mentor: [],
    recent_violations: [],
    intern_phase_overview: [],
  };

  const activePhases = phasesListData?.data?.items || [];
  const totalRemaining = activePhases
    .filter((p) => [1, 2].includes(p.status))
    .reduce((acc, p) => acc + (p.remainingCapacity || 0), 0);

  const now = dayjs();
  const nearEndPhasesCount = activePhases.filter((p) => {
    if (!p.endDate) return false;
    const end = dayjs(p.endDate);
    const diff = end.diff(now, 'day');
    return diff >= 0 && diff <= 14;
  }).length;

  const stats = {
    internPhasesActive:
      activePhases.filter((p) => p.status === 2).length ||
      raw.summary_cards?.active_phases_count ||
      0,
    remainingCapacity: totalRemaining,
    pendingApps:
      (pendingSelfAppsData?.data?.totalCount || 0) + (pendingUniAppsData?.data?.totalCount || 0),
    placedStudents:
      placedStudentsData?.data?.totalCount || raw.summary_cards?.placed_students_count || 0,
    activeGroups:
      activeGroupsData?.data?.totalCount || raw.summary_cards?.active_internship_groups_count || 0,
    nearEndPhases: nearEndPhasesCount || raw.summary_cards?.near_end_phases_count || 0,
    unresolvedViolations: raw.summary_cards?.unresolved_violations_count || 0,
  };

  const activeGroupsList = activeGroupsData?.data?.items || [];
  const groupsWithoutMentor = activeGroupsList
    .filter((g) => g.hasNoMentorWarning || !g.mentorName)
    .sort((a, b) => (b.numberOfMembers || 0) - (a.numberOfMembers || 0))
    .map((g) => {
      const phase = activePhases.find((p) => p.phaseId === g.phaseId);
      return {
        ...g, // Preserve all original fields
        internshipGroupId: g.internshipId,
        phaseId: g.phaseId,
        name: g.groupName,
        internshipPhaseName: phase?.name || 'Unknown Phase',
        phaseStatus: phase?.status,
        studentCount: g.numberOfMembers,
        phaseStartDate: g.phaseStartDate,
        // Ensure these are available for AssignMentorModal payload
        startDate: g.phaseStartDate,
        endDate: g.phaseEndDate,
        enterpriseId: g.enterpriseId || enterpriseId,
      };
    });

  const handleAssignMentorSubmit = useCallback(
    async (values) => {
      const { group } = assignModal;
      if (!group || !values.mentorId) return;

      setIsAssigning(true);
      try {
        const groupId = group.internshipId || group.id || group.groupId || group.internshipGroupId;

        const payload = {
          phaseId: group.phaseId,
          groupName: group.groupName || group.name,
          description: group.description || null,
          enterpriseId: group.enterpriseId || enterpriseId,
          mentorId: values.mentorId,
          startDate: formatISO(group.startDate),
          endDate: formatISO(group.endDate),
        };

        await EnterpriseGroupService.updateGroup(groupId, payload);

        toast.success(INTERNSHIP_MANAGEMENT_UI.GROUP_MANAGEMENT.MESSAGES.ASSIGN_SUCCESS);

        // Refresh data
        queryClient.invalidateQueries({ queryKey: ['enterprise-admin-active-groups'] });
        queryClient.invalidateQueries({ queryKey: ['enterprise-admin-dashboard'] });

        setAssignModal({ open: false, group: null });
      } catch (error) {
        console.error('Failed to assign mentor:', error);
        toast.error(INTERNSHIP_MANAGEMENT_UI.GROUP_MANAGEMENT.MESSAGES.ERROR);
      } finally {
        setIsAssigning(false);
      }
    },
    [assignModal, enterpriseId, queryClient, toast]
  );

  const recentViolations = raw.recent_violations || [];

  // Sử dụng dữ liệu từ phasesListData (API internship-phases) thay vì raw.intern_phase_overview (đang bị 404)
  const phaseOverview = (phasesListData?.data?.items || [])
    .filter((p) => [1, 2].includes(p.status))
    .map((p) => ({
      ...p,
      internshipPhaseId: p.phaseId, // Map lại ID để khớp với component
      placedCount: p.capacity - (p.remainingCapacity ?? p.capacity), // Tính toán số lượng đã nhận
    }))
    .sort((a, b) => b.status - a.status);

  return {
    stats,
    groupsWithoutMentor,
    recentViolations,
    phaseOverview,
    assignModal,
    setAssignModal,
    mentors,
    loadingMentors: loadingMentors || isAssigning,
    handleAssignMentorSubmit,
    loading:
      loadingDash || loadingPhases || loadingSelf || loadingUni || loadingPlaced || loadingGroups,
    role: user?.role,
  };
};

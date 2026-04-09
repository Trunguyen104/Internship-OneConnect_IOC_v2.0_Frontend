'use client';

import { useQuery } from '@tanstack/react-query';

import { ENTERPRISE_DASHBOARD_UI } from '@/constants/enterprise-dashboard/uiText';
import { useAuthStore } from '@/store/useAuthStore';

import { DashboardService } from '../services/dashboard.service';

export const useEnterpriseDashboard = () => {
  const user = useAuthStore((s) => s.user);
  const isEnabled = !!user?.role;

  // Query Projects
  const { data: projectsData, isLoading: loadingProjects } = useQuery({
    queryKey: ['dashboard-projects'],
    queryFn: () => DashboardService.getProjects(),
    enabled: isEnabled,
  });

  // Query Self-Apply
  const { data: selfApplyData, isLoading: loadingSelf } = useQuery({
    queryKey: ['dashboard-self-apply'],
    queryFn: () => DashboardService.getSelfApplyApplications(),
    enabled: isEnabled,
  });

  // Query Uni-Assign
  const { data: uniAssignData, isLoading: loadingUni } = useQuery({
    queryKey: ['dashboard-uni-assign'],
    queryFn: () => DashboardService.getUniAssignApplications(),
    enabled: isEnabled,
  });

  // Query Placed Students (Real Interns count)
  const { data: internsData, isLoading: loadingInterns } = useQuery({
    queryKey: ['dashboard-interns'],
    queryFn: () => DashboardService.getPlacedStudents(),
    enabled: isEnabled,
  });

  // Query Phases Status
  const { data: phasesData, isLoading: loadingPhases } = useQuery({
    queryKey: ['dashboard-phases'],
    queryFn: () => DashboardService.getInternshipPhases(),
    enabled: isEnabled,
  });

  // Query Notifications for Activities
  const { data: notificationsData, isLoading: loadingNotifications } = useQuery({
    queryKey: ['dashboard-activities'],
    queryFn: () => DashboardService.getNotifications(),
    enabled: isEnabled,
  });

  const stats = {
    totalInterns: internsData?.data?.totalCount || 0,
    activeProjects: projectsData?.data?.totalCount || 0,
    pendingApplications:
      (selfApplyData?.data?.totalCount || 0) + (uniAssignData?.data?.totalCount || 0),
    upcomingInterviews: 0,
  };

  const phasesStatus = (phasesData?.data?.items || []).map((p) => {
    // 1: Active/Open, 2: Ended/Closed, others (0, 3): Upcoming
    const statusLabel = p.status === 1 ? 'Active' : p.status === 2 ? 'Ended' : 'Upcoming';

    const color = p.status === 1 ? 'emerald' : p.status === 2 ? 'neutral' : 'blue';

    return {
      label: p.name,
      current: p.capacity - (p.remainingCapacity || 0),
      total: p.capacity,
      startDate: p.startDate ? new Date(p.startDate).toLocaleDateString('vi-VN') : '',
      endDate: p.endDate ? new Date(p.endDate).toLocaleDateString('vi-VN') : '',
      status: p.status,
      statusLabel,
      color,
    };
  });

  const activities = (notificationsData?.data?.items || []).map((notif) => ({
    title: notif.title,
    content: notif.content,
    createdAt: notif.createdAt,
    id: notif.notificationId,
  }));

  const applicationLists = {
    selfApply: (selfApplyData?.data?.items || []).map((item) => ({
      id: item.applicationId,
      name: item.studentFullName || item.studentName || 'Unknown Student',
      job: item.jobPostingTitle || 'No Title',
      time: item.createdAt,
      avatarColor: 'bg-blue-100 text-blue-600',
    })),
    uniAssign: (uniAssignData?.data?.items || []).map((item) => ({
      id: item.applicationId,
      name: item.studentFullName || item.studentName || 'Unknown Student',
      job: item.jobPostingTitle || 'No Title',
      time: item.createdAt,
      avatarColor: 'bg-emerald-100 text-emerald-600',
    })),
  };

  // Real application breakdown for the chart
  const applicationStats = [
    {
      label: ENTERPRISE_DASHBOARD_UI.APPLICATIONS.SELF_APPLY,
      count: selfApplyData?.data?.totalCount || 0,
      color: 'bg-blue-500',
    },
    {
      label: ENTERPRISE_DASHBOARD_UI.APPLICATIONS.UNI_ASSIGN,
      count: uniAssignData?.data?.totalCount || 0,
      color: 'bg-emerald-500',
    },
  ];

  const totalApps = (selfApplyData?.data?.totalCount || 0) + (uniAssignData?.data?.totalCount || 0);

  return {
    stats,
    phasesStatus,
    activities,
    applicationLists,
    applicationStats,
    totalApps,
    loading:
      loadingProjects ||
      loadingSelf ||
      loadingUni ||
      loadingInterns ||
      loadingNotifications ||
      loadingPhases,
  };
};

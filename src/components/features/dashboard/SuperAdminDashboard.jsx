'use client';

import { useQuery } from '@tanstack/react-query';
import { Activity, BookOpen, Briefcase, Building2, GraduationCap, Users } from 'lucide-react';
import React, { useEffect } from 'react';

import PageLayout from '@/components/ui/pagelayout';
import { UI_TEXT } from '@/lib/UI_Text';
import { useToast } from '@/providers/ToastProvider';
import { adminDashboardService } from '@/services/admin-dashboard.service';

import QuickActions from './components/super-admin/QuickActions';
import RecentActivity from './components/super-admin/RecentActivity';
import StatCard from './components/super-admin/StatCard';
import SystemHealth from './components/super-admin/SystemHealth';

/**
 * SuperAdminDashboard - Overview page for platform administrators.
 */
export default function SuperAdminDashboard() {
  const toast = useToast();
  const { DASHBOARD } = UI_TEXT;

  const {
    data: statsRaw,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      const res = await adminDashboardService.getStats();
      return res?.data ?? res;
    },
    staleTime: 0,
    retry: 2,
  });

  // Display error toast if API fails
  useEffect(() => {
    if (isError) {
      toast.error(DASHBOARD.ERR_STATS_LOAD || 'Failed to load dashboard statistics.');
      console.error('Dashboard Stats Error:', error);
    }
  }, [isError, error, toast, DASHBOARD.ERR_STATS_LOAD]);

  const stats = [
    {
      title: DASHBOARD.STAT_USERS,
      value: isLoading ? '—' : (statsRaw?.totalUsers ?? 0).toLocaleString(),
      icon: Users,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
    },
    {
      title: DASHBOARD.STAT_UNIVERSITIES,
      value: isLoading ? '—' : (statsRaw?.totalUniversities ?? 0).toLocaleString(),
      icon: GraduationCap,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
    },
    {
      title: DASHBOARD.STAT_ENTERPRISES,
      value: isLoading ? '—' : (statsRaw?.totalEnterprises ?? 0).toLocaleString(),
      icon: Building2,
      iconColor: 'text-violet-600',
      bgColor: 'bg-violet-50',
      borderColor: 'border-violet-100',
    },
    {
      title: DASHBOARD.STAT_JOBS,
      value: isLoading ? '—' : (statsRaw?.totalJobs ?? 0).toLocaleString(),
      icon: Briefcase,
      iconColor: 'text-fuchsia-600',
      bgColor: 'bg-fuchsia-50',
      borderColor: 'border-fuchsia-100',
    },
    {
      title: DASHBOARD.STAT_INTERNSHIPS,
      value: isLoading ? '—' : (statsRaw?.activeInternships ?? 0).toLocaleString(),
      icon: Activity,
      iconColor: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-100',
    },
    {
      title: DASHBOARD.STAT_STUDENTS,
      value: isLoading ? '—' : (statsRaw?.totalStudents ?? 0).toLocaleString(),
      icon: BookOpen,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100',
    },
  ];

  const recentActivities = statsRaw?.recentActivities ?? [];
  const systemHealthData = statsRaw?.systemHealth ?? [];

  return (
    <PageLayout>
      <PageLayout.Header title={DASHBOARD.OVERVIEW_TITLE} subtitle={DASHBOARD.OVERVIEW_SUBTITLE} />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {isLoading
          ? Array.from({ length: stats.length }).map((_, i) => <StatCard key={i} loading />)
          : stats.map((stat, i) => <StatCard key={i} {...stat} />)}
      </div>

      {/* Main Content Layout */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3 lg:items-start">
        {/* Left/Middle Column: Activity */}
        <RecentActivity activities={recentActivities} loading={isLoading} />

        {/* Right Column: Health & Actions */}
        <div className="flex flex-col gap-5 lg:col-span-1">
          <SystemHealth healthData={systemHealthData} loading={isLoading} />
          <QuickActions />
        </div>
      </div>
    </PageLayout>
  );
}

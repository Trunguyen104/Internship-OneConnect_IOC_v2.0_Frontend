'use client';

import {
  AppstoreOutlined,
  CalendarOutlined,
  RocketOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import React from 'react';

import StudentPageHeader from '@/components/layout/StudentPageHeader';
import { Progress } from '@/components/ui/progress';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

import { useUniAdminDashboard } from '../services/useUniAdminDashboard.service';
import MetricCard from './MetricCard';
import RecentTerms from './RecentTerms';

// const { DASHBOARD } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN;
const DASHBOARD = INTERNSHIP_MANAGEMENT_UI?.UNI_ADMIN?.DASHBOARD || {};

export default function UniAdminDashboard() {
  const { loading, stats, recentTerms } = useUniAdminDashboard();

  const endedPercent =
    stats?.totalTerms > 0 ? Math.round((stats?.statusCounts?.ended / stats.totalTerms) * 100) : 0;
  const upcomingPercent =
    stats?.totalTerms > 0
      ? Math.round((stats?.statusCounts?.upcoming / stats.totalTerms) * 100)
      : 0;

  return (
    <div className="no-scrollbar animate-in fade-in flex h-full flex-col space-y-8 overflow-x-hidden overflow-y-auto pb-10 duration-700">
      <StudentPageHeader title={DASHBOARD.TITLE} />

      {/* Metrics Row - Modern Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* <MetricCard
          // title={DASHBOARD.METRICS.TOTAL_STUDENTS}
          title={DASHBOARD?.METRICS?.TOTAL_STUDENTS}
          value={stats.totalStudents}
          icon={<TeamOutlined />}
          color="var(--color-info)"
          loading={loading}
          // suffix={DASHBOARD.METRICS.ENROLLED}
          suffix={DASHBOARD?.METRICS?.ENROLLED}
        />
        <MetricCard
          // title={DASHBOARD.METRICS.TOTAL_TERMS}
          title={DASHBOARD?.METRICS?.TOTAL_TERMS}
          value={stats.totalTerms}
          icon={<CalendarOutlined />}
          color="var(--color-success)"
          loading={loading}
          suffix={DASHBOARD?.METRICS?.TOTAL}
        />
        <MetricCard
          // title={DASHBOARD.METRICS.INTERNSHIP_GROUPS}
          title={DASHBOARD?.METRICS?.INTERNSHIP_GROUPS}
          value={stats.totalGroups}
          icon={<AppstoreOutlined />}
          color="var(--color-warning)"
          loading={loading}
          suffix={DASHBOARD.METRICS.COORDINATED}
        /> */}
        <MetricCard
          title={DASHBOARD?.METRICS?.TOTAL_STUDENTS}
          value={stats?.totalStudents}
          icon={<TeamOutlined />}
          color="var(--color-info)"
          loading={loading}
          suffix={DASHBOARD?.METRICS?.ENROLLED}
        />

        <MetricCard
          title={DASHBOARD?.METRICS?.TOTAL_TERMS}
          value={stats?.totalTerms}
          icon={<CalendarOutlined />}
          color="var(--color-success)"
          loading={loading}
          suffix={DASHBOARD?.METRICS?.TOTAL}
        />

        <MetricCard
          title={DASHBOARD?.METRICS?.INTERNSHIP_GROUPS}
          value={stats?.totalGroups}
          icon={<AppstoreOutlined />}
          color="var(--color-warning)"
          loading={loading}
          suffix={DASHBOARD?.METRICS?.COORDINATED}
        />
      </div>

      {/* Activity Header */}
      <div className="flex items-center justify-between px-2">
        <h3 className="text-gray-900 text-2xl font-black tracking-tighter">
          {DASHBOARD.RECENT_TERMS.TITLE}
        </h3>
      </div>

      {/* Main Content Area - Split Layout */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Left Column: Recent Terms Cards */}
        <div className="lg:col-span-2">
          <RecentTerms data={recentTerms} loading={loading} />
        </div>

        {/* Right Column: Analytics & Quick Actions */}
        <div className="space-y-8">
          {/* Placement Analytics Widget */}
          <div className="bg-white border-gray-100 rounded-[32px] p-8 shadow-sm border transition-all duration-700 hover:shadow-xl">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary-surface flex h-10 w-10 items-center justify-center rounded-2xl">
                  <RocketOutlined className="text-primary text-lg" />
                </div>
                <h4 className="text-gray-900 text-sm font-black tracking-wider uppercase">
                  {DASHBOARD.ANALYTICS.TITLE}
                </h4>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex flex-col items-center justify-center space-y-4">
                <Progress
                  percent={endedPercent}
                  size={140}
                  strokeWidth={10}
                  strokeColor="var(--color-success)"
                  trailColor="var(--color-success-surface)"
                  format={(percent) => (
                    <div className="flex flex-col">
                      <span className="text-success text-3xl font-black">{percent}%</span>
                    </div>
                  )}
                />
                <div className="text-center">
                  <div className="text-gray-900 text-lg font-black leading-tight">
                    {stats?.statusCounts?.ended || 0}
                  </div>
                  <div className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                    {DASHBOARD.ANALYTICS.ENDED}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center space-y-4">
                <Progress
                  percent={upcomingPercent}
                  size={140}
                  strokeWidth={10}
                  strokeColor="var(--color-info)"
                  trailColor="var(--color-info-surface)"
                  format={(percent) => (
                    <div className="flex flex-col">
                      <span className="text-info text-3xl font-black">{percent}%</span>
                    </div>
                  )}
                />
                <div className="text-center">
                  <div className="text-gray-900 text-lg font-black leading-tight">
                    {stats?.statusCounts?.upcoming || 0}
                  </div>
                  <div className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                    {DASHBOARD.ANALYTICS.UPCOMING}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

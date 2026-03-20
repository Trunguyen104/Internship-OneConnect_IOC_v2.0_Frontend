'use client';

import {
  AppstoreOutlined,
  CalendarOutlined,
  RocketOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Progress } from 'antd';
import React from 'react';

import StudentPageHeader from '@/components/layout/StudentPageHeader';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

import { useUniAdminDashboard } from '../services/useUniAdminDashboard.service';
import MetricCard from './MetricCard';
import RecentTerms from './RecentTerms';

const { DASHBOARD } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN;

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
        <MetricCard
          title={DASHBOARD.METRICS.TOTAL_STUDENTS}
          value={stats.totalStudents}
          icon={<TeamOutlined />}
          color="var(--color-info)"
          loading={loading}
          suffix={DASHBOARD.METRICS.ENROLLED}
        />
        <MetricCard
          title={DASHBOARD.METRICS.TOTAL_TERMS}
          value={stats.totalTerms}
          icon={<CalendarOutlined />}
          color="var(--color-success)"
          loading={loading}
          suffix={DASHBOARD.METRICS.TOTAL}
        />
        <MetricCard
          title={DASHBOARD.METRICS.INTERNSHIP_GROUPS}
          value={stats.totalGroups}
          icon={<AppstoreOutlined />}
          color="var(--color-warning)"
          loading={loading}
          suffix={DASHBOARD.METRICS.COORDINATED}
        />
      </div>

      {/* Activity Header */}
      <div className="flex items-center justify-between px-2">
        <h3 className="text-text text-2xl font-black tracking-tighter">
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
          <div className="bg-surface ring-border/50 rounded-3xl p-6 shadow-sm ring-1 transition-all duration-700 hover:shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-xl">
                  <RocketOutlined className="text-primary" />
                </div>
                <h4 className="text-text text-sm font-black tracking-wider uppercase">
                  {DASHBOARD.ANALYTICS.TITLE}
                </h4>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pb-4">
              <div className="flex flex-col items-center justify-center space-y-4">
                <Progress
                  type="circle"
                  percent={endedPercent}
                  size={120}
                  strokeWidth={10}
                  strokeColor="var(--color-success)"
                  railColor="var(--color-success-surface)"
                  format={(percent) => (
                    <div className="flex flex-col">
                      <span className="text-success text-2xl font-black">{percent}%</span>
                    </div>
                  )}
                />
                <div className="text-center">
                  <div className="text-text text-sm font-black">
                    {stats?.statusCounts?.ended || 0}
                  </div>
                  <div className="text-muted text-[10px] font-bold uppercase">
                    {DASHBOARD.ANALYTICS.ENDED}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center space-y-4">
                <Progress
                  type="circle"
                  percent={upcomingPercent}
                  size={120}
                  strokeWidth={10}
                  strokeColor="var(--color-info)"
                  railColor="var(--color-info-surface)"
                  format={(percent) => (
                    <div className="flex flex-col">
                      <span className="text-info text-2xl font-black">{percent}%</span>
                    </div>
                  )}
                />
                <div className="text-center">
                  <div className="text-text text-sm font-black">
                    {stats?.statusCounts?.upcoming || 0}
                  </div>
                  <div className="text-muted text-[10px] font-bold uppercase">
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

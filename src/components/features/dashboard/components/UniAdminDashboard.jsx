'use client';

import {
  AppstoreOutlined,
  CalendarOutlined,
  RocketOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';

import StudentPageHeader from '@/components/layout/StudentPageHeader';
import { Progress } from '@/components/ui/progress';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { cn } from '@/lib/cn';

import { useUniAdminDashboard } from '../services/use-uni-admin-dashboard.service';
import MetricCard from './MetricCard';
import RecentTerms from './RecentTerms';

// const { DASHBOARD } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN;
const DASHBOARD = INTERNSHIP_MANAGEMENT_UI?.UNI_ADMIN?.DASHBOARD || {};

export default function UniAdminDashboard({ termId: propTermId = null }) {
  const routeParams = useParams();
  const termId = propTermId || routeParams?.termId;
  const { loading, stats, recentTerms } = useUniAdminDashboard(termId);

  // When viewing a specific term, recentTerms[0] contains our term details
  const currentTerm = termId ? recentTerms?.[0] : null;

  const endedPercent =
    stats?.totalTerms > 0 ? Math.round((stats?.statusCounts?.ended / stats.totalTerms) * 100) : 0;
  const upcomingPercent =
    stats?.totalTerms > 0
      ? Math.round((stats?.statusCounts?.upcoming / stats.totalTerms) * 100)
      : 0;

  // Context: Single Term Metrics (Placement/Progress)
  const placementPercent =
    stats?.totalStudents > 0 ? Math.round((stats?.totalPlaced / stats.totalStudents) * 100) : 0;

  return (
    <div className="no-scrollbar animate-in fade-in flex h-full flex-col space-y-8 overflow-x-hidden overflow-y-auto pb-10 duration-700">
      <StudentPageHeader title={termId ? 'Term Workshop' : DASHBOARD.TITLE} />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
          suffix={termId ? 'Current Term' : DASHBOARD?.METRICS?.TOTAL}
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

      {!termId && (
        <div className="flex items-center justify-between px-2">
          <h3 className="text-gray-900 text-2xl font-black tracking-tighter">
            {DASHBOARD.RECENT_TERMS.TITLE}
          </h3>
        </div>
      )}

      {/* Main Content Area - Split Layout */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Left Column: Recent Terms Cards (Only in Global View) or Placeholder in Term View */}
        <div className="lg:col-span-2 space-y-8">
          {!termId ? (
            <RecentTerms data={recentTerms} loading={loading} />
          ) : (
            <div className="space-y-8">
              {/* Term Information Card - Specific View */}
              <div className="bg-white border-gray-100 rounded-[32px] p-8 shadow-sm border transition-all duration-700 hover:shadow-xl">
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <h3 className="text-gray-900 text-2xl font-black tracking-tighter mb-1">
                      {DASHBOARD.TERM_WORKSPACE.ROADMAP_TITLE}
                    </h3>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                      {DASHBOARD.TERM_WORKSPACE.ROADMAP_SUBTITLE}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                    <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-2 block">
                      {DASHBOARD.TERM_WORKSPACE.PROGRAM_CATEGORY}
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-100 p-2 rounded-lg">
                        <RocketOutlined className="text-indigo-600" />
                      </div>
                      <span className="text-gray-800 font-black">
                        {currentTerm?.programName || 'Professional Internship'}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                    <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-2 block">
                      {DASHBOARD.TERM_WORKSPACE.PLACEMENT_STATUS}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-800 font-black">
                        {dayjs(currentTerm?.startDate).format('DD/MM/YYYY')} -{' '}
                        {dayjs(currentTerm?.endDate).format('DD/MM/YYYY')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-50">
                  <Link
                    href={`/school/terms/${termId}/enrollments`}
                    className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-600 transition-all shadow-lg hover:shadow-indigo-100 active:scale-95 text-sm"
                  >
                    <TeamOutlined />
                    {DASHBOARD.TERM_WORKSPACE.IMPORT_STUDENTS}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Analytics & Quick Actions */}
        <div className="space-y-8">
          {/* Dashboard Analytics Widget */}
          <div className="bg-white border-gray-100 rounded-[32px] p-8 shadow-sm border transition-all duration-700 hover:shadow-xl">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary-surface flex h-10 w-10 items-center justify-center rounded-2xl">
                  <RocketOutlined className="text-primary text-lg" />
                </div>
                <h4 className="text-gray-900 text-sm font-black tracking-wider uppercase">
                  {termId ? DASHBOARD.TERM_WORKSPACE.PROGRESS_TITLE : DASHBOARD.ANALYTICS.TITLE}
                </h4>
              </div>
            </div>

            <div className="space-y-8">
              {/* Chart 1: If Term View, show Placement Progress. Else show Ended count. */}
              <div className="flex flex-col items-center justify-center space-y-4">
                <Progress
                  percent={termId ? placementPercent : endedPercent}
                  size={140}
                  strokeWidth={10}
                  strokeColor={termId ? 'var(--color-indigo)' : 'var(--color-success)'}
                  trailColor={termId ? '#EEF2FF' : 'var(--color-success-surface)'}
                  format={(percent) => (
                    <div className="flex flex-col">
                      <span
                        className={cn(
                          'text-3xl font-black',
                          termId ? 'text-indigo-600' : 'text-success'
                        )}
                      >
                        {percent}%
                      </span>
                    </div>
                  )}
                />
                <div className="text-center">
                  <div className="text-gray-900 text-lg font-black leading-tight">
                    {termId ? stats.totalPlaced : stats?.statusCounts?.ended || 0}
                  </div>
                  <div className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                    {termId ? 'STUDENTS PLACED' : DASHBOARD.ANALYTICS.ENDED}
                  </div>
                </div>
              </div>

              {/* Chart 2: If Term View, show Grouping progress (or just count). Else show Upcoming. */}
              <div className="flex flex-col items-center justify-center space-y-4">
                <Progress
                  percent={termId ? 100 : upcomingPercent} // For single term, we can show groups card as finished status icon
                  size={140}
                  strokeWidth={10}
                  strokeColor={termId ? 'var(--color-warning)' : 'var(--color-info)'}
                  trailColor={termId ? 'var(--color-warning-surface)' : 'var(--color-info-surface)'}
                  format={() => (
                    <div className="flex flex-col">
                      {termId ? (
                        <TeamOutlined className="text-warning text-3xl" />
                      ) : (
                        <span className="text-info text-3xl font-black">{upcomingPercent}%</span>
                      )}
                    </div>
                  )}
                />
                <div className="text-center">
                  <div className="text-gray-900 text-lg font-black leading-tight">
                    {termId ? stats.totalGroups : stats?.statusCounts?.upcoming || 0}
                  </div>
                  <div className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                    {termId ? 'GROUPS COORDINATED' : DASHBOARD.ANALYTICS.UPCOMING}
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

'use client';

import { Progress as AntdProgress } from 'antd';
import { Calendar, FileText, Layers, Search, Users } from 'lucide-react';
import React, { useState } from 'react';

import Card from '@/components/ui/card';
import { EnrollmentProgress } from '@/components/ui/enrollment-progress';
import { PageLayout } from '@/components/ui/pagelayout';
import { PremiumTabs } from '@/components/ui/premium-tabs';
import { Spinner } from '@/components/ui/spinner';
import { ENTERPRISE_DASHBOARD_UI } from '@/constants/enterprise-dashboard/uiText';
import { formatRelativeTime } from '@/utils/date-utils';

import { useEnterpriseDashboard } from '../hooks/useEnterpriseDashboard';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <Card className="flex flex-row items-center gap-4 border-none shadow-sm transition-all hover:shadow-md">
    <div className={`flex h-12 w-12 items-center justify-center rounded-xl shrink-0 ${colorClass}`}>
      <Icon className="h-6 w-6" />
    </div>
    <div className="flex flex-col min-w-0">
      <span className="text-sm font-medium text-slate-500 truncate">{title}</span>
      <span className="text-2xl font-bold text-slate-900">{value}</span>
    </div>
  </Card>
);

const CandidateItem = ({ item }) => (
  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all group">
    <div
      className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-sm ${item.avatarColor || 'bg-slate-200 text-slate-600'}`}
    >
      {item.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()}
    </div>
    <div className="flex-1 min-w-0">
      <h5 className="text-sm font-bold text-slate-800 truncate">{item.name}</h5>
      <p className="text-xs text-slate-500 truncate font-medium">
        {item.job}
        <span className="mx-1 text-slate-300">
          {ENTERPRISE_DASHBOARD_UI.APPLICATIONS.SEPARATOR}
        </span>
        <span className="text-slate-400">{formatRelativeTime(item.time)}</span>
      </p>
    </div>
  </div>
);

export default function EnterpriseDashboardContainer() {
  const { stats, phasesStatus, applicationLists, applicationStats, totalApps, loading } =
    useEnterpriseDashboard();
  const [activeTab, setActiveTab] = useState('selfApply');

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Spinner size="large" description={ENTERPRISE_DASHBOARD_UI.LOADING_ANALYZING} />
      </div>
    );
  }

  const tabItems = [
    { key: 'selfApply', label: ENTERPRISE_DASHBOARD_UI.APPLICATIONS.SELF_APPLY },
    { key: 'uniAssign', label: ENTERPRISE_DASHBOARD_UI.APPLICATIONS.UNI_ASSIGN },
  ];

  return (
    <PageLayout className="gap-6 animate-in fade-in duration-700">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title={ENTERPRISE_DASHBOARD_UI.STATS.TOTAL_INTERNS}
          value={stats.totalInterns}
          icon={Users}
          colorClass="bg-blue-50 text-blue-600"
        />
        <StatCard
          title={ENTERPRISE_DASHBOARD_UI.STATS.PENDING_APPLICATIONS}
          value={stats.pendingApplications}
          icon={FileText}
          colorClass="bg-orange-50 text-orange-600"
        />
        <StatCard
          title={ENTERPRISE_DASHBOARD_UI.STATS.UPCOMING_INTERVIEWS}
          value={stats.upcomingInterviews}
          icon={Calendar}
          colorClass="bg-emerald-50 text-emerald-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content Area - Status by Phase */}
        <div className="lg:col-span-2">
          <Card className="h-full border-none shadow-sm overflow-hidden">
            <Card.Header className="bg-slate-50/50 border-b border-slate-100">
              <Card.Title className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-600">
                <Layers className="h-4 w-4 text-slate-400" />
                {ENTERPRISE_DASHBOARD_UI.PHASES_STATUS.TITLE}
              </Card.Title>
            </Card.Header>
            <Card.Content className="p-0">
              <div className="flex flex-col">
                {phasesStatus.length > 0 ? (
                  phasesStatus.map((phase, idx) => (
                    <EnrollmentProgress
                      key={idx}
                      label={phase.label}
                      current={phase.current}
                      total={phase.total}
                      startDate={phase.startDate}
                      endDate={phase.endDate}
                      status={phase.status}
                      statusLabel={phase.statusLabel}
                      color={phase.color}
                      statusText={ENTERPRISE_DASHBOARD_UI.PHASES_STATUS.SLOTS}
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <p className="text-sm italic font-medium">
                      {ENTERPRISE_DASHBOARD_UI.PHASES_STATUS.EMPTY}
                    </p>
                  </div>
                )}
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Sidebar Area - Modern Application Insights */}
        <div className="flex flex-col gap-6">
          <Card className="h-full overflow-hidden flex flex-col border-none shadow-sm">
            <div className="px-6 pt-6">
              <PremiumTabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
            </div>

            <Card.Content className="flex-1 flex flex-col gap-6 pt-2 px-6 pb-6">
              {/* Pie Chart Section */}
              <div className="flex items-center gap-6 py-4 border-b border-slate-50">
                <div className="relative h-28 w-28 shrink-0 flex items-center justify-center">
                  <AntdProgress
                    type="circle"
                    percent={totalApps > 0 ? 100 : 0}
                    size={110}
                    strokeWidth={12}
                    format={() => (
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-xl font-black text-slate-800 tracking-tighter">
                          {totalApps}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                          {ENTERPRISE_DASHBOARD_UI.TOTAL}
                        </span>
                      </div>
                    )}
                    strokeColor={totalApps > 0 ? '#3b82f6' : '#f1f5f9'}
                    railColor="#f1f5f9"
                  />
                </div>
                <div className="flex flex-col gap-4 flex-1">
                  {applicationStats.map((stat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between group cursor-default"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`h-2.5 w-2.5 rounded-full shadow-sm ${stat.color}`} />
                        <span className="text-[11px] font-extrabold text-slate-600 truncate uppercase tracking-tight">
                          {stat.label}
                        </span>
                      </div>
                      <span className="text-sm font-black text-slate-800 transition-colors tabular-nums">
                        {stat.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Candidate List Section */}
              <div className="flex flex-col gap-3 flex-1 overflow-y-auto max-h-[400px] pr-1">
                {applicationLists[activeTab]?.length > 0 ? (
                  applicationLists[activeTab]
                    .slice(0, 5)
                    .map((item) => <CandidateItem key={item.id} item={item} />)
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                    <Search className="h-10 w-10 mb-3 opacity-20" />
                    <p className="text-xs font-bold uppercase tracking-widest">
                      {ENTERPRISE_DASHBOARD_UI.APPLICATIONS.NO_CANDIDATES}
                    </p>
                  </div>
                )}
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}

'use client';
import { Download, LayoutList, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import StudentTabs from '@/components/layout/StudentTabs';
import PageShell from '@/components/layout/PageShell';

import { useDashboard } from '../hooks/useDashboard';
import { StatCard, Loading, ErrorBox } from './atoms';
import {
  BurndownChart,
  TaskStatusDistributionChart,
  WorkloadDistributionChart,
  CompletionPieChart,
} from './DashboardCharts';
import { ViolationsList } from './ViolationsList';
import StudentPageHeader from '@/components/layout/StudentPageHeader';

import { DASHBOARD_UI } from '@/constants/dashboard/uiText';

export default function DashboardPage() {
  const { data, err, completionPie } = useDashboard();

  if (err)
    return (
      <PageShell>
        <ErrorBox message={err} />
      </PageShell>
    );

  if (!data)
    return (
      <PageShell>
        <Loading />
      </PageShell>
    );

  return (
    <PageShell>
      <StudentPageHeader hidden />
      {/* Top actions */}
      <div className='mb-6 flex flex-wrap items-center justify-between gap-3'>
        <StudentTabs />
        <button className='border-primary/20 bg-primary-surface text-primary hover:bg-primary-surface/80 flex shrink-0 items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium shadow-sm transition-colors'>
          <Download className='h-4 w-4' />
          {DASHBOARD_UI.EXPORT_CSV}
        </button>
      </div>

      {/* Summary cards */}
      <div className='mb-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4'>
        <StatCard
          label={DASHBOARD_UI.TOTAL_TASKS}
          value={data.summary.totalTasks}
          icon={<LayoutList className='h-5 w-5' />}
          color='var(--color-info)'
          colorClass='text-info bg-info-surface'
        />
        <StatCard
          label={DASHBOARD_UI.IN_PROGRESS}
          value={data.summary.inProgress}
          icon={<Clock className='h-5 w-5' />}
          color='var(--color-primary)'
          colorClass='text-primary bg-primary-surface'
        />
        <StatCard
          label={DASHBOARD_UI.COMPLETED}
          value={data.summary.done}
          icon={<CheckCircle2 className='h-5 w-5' />}
          color='var(--color-success)'
          colorClass='text-success bg-success-surface'
        />
        <StatCard
          label={DASHBOARD_UI.OVERDUE}
          value={data.summary.overdue}
          icon={<AlertCircle className='h-5 w-5' />}
          color='var(--color-danger)'
          colorClass='text-danger bg-danger-surface'
        />
      </div>

      {/* Burndown */}
      <div className='mb-6'>
        <BurndownChart burndown={data.burndown} />
      </div>

      {/* Bar charts */}
      <div className='mb-6 grid grid-cols-1 gap-5 lg:grid-cols-2'>
        <TaskStatusDistributionChart taskStatusDistribution={data.taskStatusDistribution} />
        <WorkloadDistributionChart workloadByPerson={data.workloadByPerson} />
      </div>

      {/* Completion pie & Violations */}
      <div className='grid grid-cols-1 gap-5 lg:grid-cols-2'>
        <CompletionPieChart completionPie={completionPie} />
        <ViolationsList studentViolations={data.studentViolations} />
      </div>
    </PageShell>
  );
}

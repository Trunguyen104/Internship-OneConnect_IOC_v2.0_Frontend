'use client';
import { Download, LayoutList, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import StudentTabs from '@/shared/components/StudentTabs';
import PageShell from '@/shared/components/PageShell';

import { useDashboard } from './hooks/useDashboard';
import { StatCard, Loading, ErrorBox } from './components/atoms';
import { 
  BurndownChart, 
  TaskStatusDistributionChart, 
  WorkloadDistributionChart, 
  CompletionPieChart 
} from './components/DashboardCharts';
import { ViolationsList } from './components/ViolationsList';

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
      {/* Top actions */}
      <div className='flex flex-wrap items-center justify-between gap-3 mb-6'>
        <StudentTabs />
        <button className='flex items-center gap-2 shrink-0 text-sm font-medium px-5 py-2.5 rounded-full border border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 transition-colors shadow-sm'>
          <Download className='w-4 h-4' />
          Export CSV
        </button>
      </div>

      {/* Summary cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6'>
        <StatCard
          label='Total Tasks'
          value={data.summary.totalTasks}
          icon={<LayoutList className='w-5 h-5' />}
          color='var(--color-info)'
          colorClass='text-info bg-info/10'
        />
        <StatCard
          label='In Progress'
          value={data.summary.inProgress}
          icon={<Clock className='w-5 h-5' />}
          color='var(--color-primary)'
          colorClass='text-primary bg-primary/10'
        />
        <StatCard
          label='Completed'
          value={data.summary.done}
          icon={<CheckCircle2 className='w-5 h-5' />}
          color='var(--color-success)'
          colorClass='text-success bg-success/10'
        />
        <StatCard
          label='Overdue'
          value={data.summary.overdue}
          icon={<AlertCircle className='w-5 h-5' />}
          color='var(--color-danger)'
          colorClass='text-danger bg-danger/10'
        />
      </div>

      {/* Burndown */}
      <div className='mb-6'>
        <BurndownChart burndown={data.burndown} />
      </div>

      {/* Bar charts */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6'>
        <TaskStatusDistributionChart taskStatusDistribution={data.taskStatusDistribution} />
        <WorkloadDistributionChart workloadByPerson={data.workloadByPerson} />
      </div>

      {/* Completion pie & Violations */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
        <CompletionPieChart completionPie={completionPie} />
        <ViolationsList studentViolations={data.studentViolations} />
      </div>
    </PageShell>
  );
}

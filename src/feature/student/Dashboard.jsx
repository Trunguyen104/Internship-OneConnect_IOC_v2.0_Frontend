'use client';
import StudentTabs from '@/shared/components/StudentTabs';
import PageShell from '@/shared/components/PageShell';
import { useEffect, useMemo, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { CheckCircle2, AlertCircle, Clock, LayoutList, Download } from 'lucide-react';
import { getDashboardData } from '@/services/dashboard.service';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    getDashboardData()
      .then(setData)
      .catch((e) => setErr(e?.message || 'Load failed'));
  }, []);

  const completionPie = useMemo(() => {
    if (!data) return [];
    return [
      { name: 'Completed', value: data.completionRatio.onTime },
      { name: 'Overdue', value: data.completionRatio.overdue },
    ];
  }, [data]);

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
        <Card>
          <CardHeader title='Burndown Chart' />
          <div className='h-80 p-4'>
            <ResponsiveContainer width='100%' height='100%'>
              <AreaChart data={data.burndown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id='burndownGrad' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='5%' stopColor='var(--color-primary)' stopOpacity={0.25} />
                    <stop offset='95%' stopColor='var(--color-primary)' stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke='var(--color-border)'
                  strokeDasharray='4 4'
                  vertical={false}
                />
                <XAxis
                  dataKey='date'
                  tickFormatter={formatShortDate}
                  minTickGap={20}
                  stroke='var(--color-muted)'
                  tick={{ fill: 'var(--color-muted)', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke='var(--color-muted)'
                  tick={{ fill: 'var(--color-muted)', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  labelFormatter={formatFullDate}
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    color: 'var(--color-text)',
                  }}
                  itemStyle={{ color: 'var(--color-text)', fontWeight: 600 }}
                />
                <Area
                  type='monotone'
                  dataKey='remaining'
                  name='Remaining'
                  stroke='var(--color-primary)'
                  fill='url(#burndownGrad)'
                  strokeWidth={3}
                  activeDot={{
                    r: 6,
                    fill: 'var(--color-surface)',
                    stroke: 'var(--color-primary)',
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Bar charts */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6'>
        <Card>
          <CardHeader title='Task Status Distribution' />
          <div className='h-80 p-4'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart
                data={data.taskStatusDistribution}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  stroke='var(--color-border)'
                  strokeDasharray='4 4'
                  vertical={false}
                />
                <XAxis
                  dataKey='status'
                  stroke='var(--color-border)'
                  tick={{ fill: 'var(--color-muted)', fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: 'var(--color-border)' }}
                />
                <YAxis
                  stroke='var(--color-border)'
                  tick={{ fill: 'var(--color-muted)', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'var(--color-border)', opacity: 0.4 }}
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  itemStyle={{ color: 'var(--color-text)', fontWeight: 600 }}
                />
                <Bar dataKey='count' name='Tasks' fill='var(--color-info)' radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title='Workload Distribution' />
          <div className='h-80 p-4'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart
                data={data.workloadByPerson}
                margin={{ top: 10, right: 10, left: -20, bottom: 40 }}
              >
                <CartesianGrid
                  stroke='var(--color-border)'
                  strokeDasharray='4 4'
                  vertical={false}
                />
                <XAxis
                  dataKey='name'
                  angle={-30}
                  textAnchor='end'
                  stroke='var(--color-border)'
                  tick={{ fill: 'var(--color-muted)', fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: 'var(--color-border)' }}
                />
                <YAxis
                  stroke='var(--color-border)'
                  tick={{ fill: 'var(--color-muted)', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'var(--color-border)', opacity: 0.4 }}
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  itemStyle={{ color: 'var(--color-text)', fontWeight: 600 }}
                />
                <Bar
                  dataKey='count'
                  name='Tasks'
                  fill='var(--color-primary)'
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Completion pie & Violations */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
        <Card>
          <CardHeader title='Completed / Overdue' />
          <div className='h-[340px] flex items-center justify-center p-4'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  itemStyle={{ color: 'var(--color-text)', fontWeight: 600 }}
                />
                <Legend verticalAlign='bottom' height={36} iconType='circle' />
                <Pie
                  data={completionPie}
                  dataKey='value'
                  nameKey='name'
                  innerRadius={60}
                  outerRadius={95}
                  stroke='var(--color-surface)'
                  strokeWidth={3}
                  paddingAngle={2}
                >
                  {completionPie.map((_, idx) => (
                    <Cell
                      key={idx}
                      fill={idx === 0 ? 'var(--color-success)' : 'var(--color-danger)'}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title='Warnings & Violations' />
          {data.studentViolations?.length ? (
            <div className='p-5 h-[340px] overflow-y-auto'>
              <ul className='space-y-3'>
                {data.studentViolations.map((v) => (
                  <li
                    key={v.type}
                    className='group flex items-center justify-between p-3.5 rounded-2xl bg-bg border border-border/50 hover:border-danger/30 hover:bg-danger/5 transition-all'
                  >
                    <div className='flex items-center gap-3.5'>
                      <div className='p-2 rounded-xl bg-danger/10 text-danger shadow-sm group-hover:scale-110 transition-transform'>
                        <AlertCircle className='w-4 h-4' />
                      </div>
                      <span className='text-sm font-medium text-text'>{v.type}</span>
                    </div>
                    <span className='text-sm font-bold text-danger bg-danger/10 px-3 py-1.5 rounded-lg shadow-sm'>
                      {v.count}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <EmptyState text='No violation data' />
          )}
        </Card>
      </div>
    </PageShell>
  );
}

/* ---------------- UI atoms ---------------- */

function StatCard({ label, value, icon, color, colorClass }) {
  return (
    <div className='group relative overflow-hidden rounded-3xl bg-surface border border-border/60 shadow-sm p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1'>
      <div className='flex items-center justify-between mb-4'>
        <div className='text-sm font-medium text-muted'>{label}</div>
        <div className={`p-2.5 rounded-xl ${colorClass}`}>{icon}</div>
      </div>
      <div className='text-3xl font-bold text-text'>{value}</div>
      <div
        className='absolute bottom-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300'
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

function Card({ children, className = '' }) {
  return (
    <div
      className={[
        'rounded-3xl bg-surface border border-border/60 shadow-sm transition-shadow hover:shadow-md flex flex-col',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}

function CardHeader({ title, right }) {
  return (
    <div className='px-6 py-5 border-b border-border/60 flex items-center justify-between bg-surface/50 rounded-t-3xl'>
      <div className='text-base font-semibold text-text'>{title}</div>
      {right ? <div>{right}</div> : null}
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className='flex-1 min-h-[200px] flex flex-col items-center justify-center text-sm text-muted gap-3 p-6'>
      <div className='w-12 h-12 rounded-full bg-bg flex items-center justify-center'>
        <AlertCircle className='w-6 h-6 text-muted/50' />
      </div>
      {text}
    </div>
  );
}

function Loading() {
  return (
    <div className='rounded-3xl border border-border bg-surface p-12 flex flex-col items-center justify-center gap-4 text-sm text-muted shadow-sm'>
      <div className='w-8 h-8 rounded-full border-4 border-muted/20 border-t-primary animate-spin' />
      Loading dashboard data...
    </div>
  );
}

function ErrorBox({ message }) {
  return (
    <div className='rounded-3xl border border-danger/20 bg-danger/5 p-6 shadow-sm'>
      <div className='flex items-center gap-2 text-danger font-semibold mb-2'>
        <AlertCircle className='w-5 h-5' />
        Error
      </div>
      <div className='text-sm text-danger/80'>{message}</div>
    </div>
  );
}

/* ---------------- helpers ---------------- */

function formatShortDate(iso) {
  if (!iso) return '';
  const parts = iso.split('-');
  if (parts.length < 3) return iso;
  return `${parts[2]}/${parts[1]}`;
}

function formatFullDate(iso) {
  if (!iso) return '';
  const parts = iso.split('-');
  if (parts.length < 3) return iso;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

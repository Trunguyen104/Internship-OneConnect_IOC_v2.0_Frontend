'use client';

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
      { name: 'Đúng hạn', value: data.completionRatio.onTime },
      { name: 'Quá hạn', value: data.completionRatio.overdue },
    ];
  }, [data]);

  const studentDonut = useMemo(() => {
    if (!data) return [];
    return data.studentStatus.map((x) => ({ name: x.status, value: x.count }));
  }, [data]);

  const CHART_COLORS = [
    'var(--primary-500)',
    'var(--blue-600)',
    'var(--green-500)',
    'var(--gray-400)',
  ];

  const GRID_STROKE = 'var(--gray-200)';
  const AXIS_STROKE = 'var(--gray-400)';
  const TEXT_MUTED = 'var(--gray-500)';
  const PRIMARY = 'var(--primary-500)';
  const PRIMARY_FADE = 'rgba(239, 68, 68, 0.12)';

  if (err)
    return (
      <PageShell title='Tổng quan'>
        <ErrorBox message={err} />
      </PageShell>
    );

  if (!data)
    return (
      <PageShell title='Tổng quan'>
        <Loading />
      </PageShell>
    );

  return (
    <PageShell title='Tổng quan'>
      {/* Top actions */}
      <div className='flex items-center justify-between mb-4'>
        <Tabs
          items={[
            { key: 'overview', label: 'Tóm tắt' },
            { key: 'board', label: 'Bảng công việc' },
            { key: 'backlog', label: 'Backlog' },
            { key: 'list', label: 'Danh sách công việc' },
          ]}
          activeKey='overview'
        />
        <button className='text-sm px-4 py-2 rounded-full border border-primary/20 bg-primary/10 text-primary hover:bg-primary/15'>
          Xuất CSV
        </button>
      </div>

      {/* Summary cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-4'>
        <StatCard label='Tổng công việc' value={data.summary.totalTasks} />
        <StatCard label='Đang thực hiện' value={data.summary.inProgress} />
        <StatCard label='Hoàn thành' value={data.summary.done} />
        <StatCard label='Quá hạn' value={data.summary.overdue} />
      </div>

      {/* Burndown + Pie */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4'>
        <Card className='lg:col-span-2'>
          <CardHeader title='Burndown' />
          <div className='h-72'>
            <ResponsiveContainer width='100%' height='100%'>
              <AreaChart data={data.burndown}>
                <CartesianGrid stroke={GRID_STROKE} strokeDasharray='3 3' />
                <XAxis
                  dataKey='date'
                  tickFormatter={(d) => formatShortDate(d)}
                  minTickGap={16}
                  stroke={AXIS_STROKE}
                  tick={{ fill: TEXT_MUTED, fontSize: 12 }}
                />
                <YAxis stroke={AXIS_STROKE} tick={{ fill: TEXT_MUTED, fontSize: 12 }} />
                <Tooltip labelFormatter={(d) => formatFullDate(d)} />
                <Area
                  type='monotone'
                  dataKey='remaining'
                  stroke={PRIMARY}
                  fill={PRIMARY_FADE}
                  strokeWidth={2}
                  fillOpacity={1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title='Tỷ lệ Hoàn thành/Quá hạn' />
          <div className='h-72 flex items-center justify-center'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Tooltip />
                <Legend verticalAlign='middle' align='right' layout='vertical' />
                <Pie
                  data={completionPie}
                  dataKey='value'
                  nameKey='name'
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={2}
                >
                  {completionPie.map((_, idx) => (
                    <Cell key={idx} fill={idx === 0 ? 'var(--green-500)' : 'var(--primary-500)'} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Bar charts */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4'>
        <Card>
          <CardHeader title='Phân bố Trạng thái' />
          <div className='h-72'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={data.taskStatusDistribution}>
                <CartesianGrid stroke={GRID_STROKE} strokeDasharray='3 3' />
                <XAxis
                  dataKey='status'
                  stroke={AXIS_STROKE}
                  tick={{ fill: TEXT_MUTED, fontSize: 12 }}
                />
                <YAxis stroke={AXIS_STROKE} tick={{ fill: TEXT_MUTED, fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey='count' fill='var(--blue-600)' radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title='Phân bổ Nhân sự' />
          <div className='h-72'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={data.workloadByPerson}>
                <CartesianGrid stroke={GRID_STROKE} strokeDasharray='3 3' />
                <XAxis
                  dataKey='name'
                  angle={-20}
                  textAnchor='end'
                  height={60}
                  stroke={AXIS_STROKE}
                  tick={{ fill: TEXT_MUTED, fontSize: 11 }}
                />
                <YAxis stroke={AXIS_STROKE} tick={{ fill: TEXT_MUTED, fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey='count' fill='var(--primary-500)' radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Student donut + Violations */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        <Card>
          <CardHeader title='Trạng thái sinh viên' />
          <div className='h-80 flex items-center justify-center'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Tooltip />
                <Legend verticalAlign='middle' align='right' layout='vertical' />
                <Pie
                  data={studentDonut}
                  dataKey='value'
                  nameKey='name'
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={2}
                >
                  {studentDonut.map((_, idx) => (
                    <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title='Vi phạm của sinh viên' />
          {data.studentViolations?.length ? (
            <div className='p-2'>
              <ul className='divide-y divide-border'>
                {data.studentViolations.map((v) => (
                  <li key={v.type} className='py-3 flex items-center justify-between'>
                    <div className='text-sm'>{v.type}</div>
                    <span className='text-sm font-semibold'>{v.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <EmptyState text='Không có dữ liệu' />
          )}
        </Card>
      </div>
    </PageShell>
  );
}

/* ---------------- UI atoms ---------------- */

function PageShell({ title, children }) {
  return (
    <div className='min-h-screen bg-bg text-text'>
      <div className='p-4 md:p-6'>
        <div className='mb-4'>
          <div className='text-xs text-muted'>Space</div>
          <h1 className='text-xl font-semibold'>{title}</h1>
        </div>
        {children}
      </div>
    </div>
  );
}
function Tabs({ items, activeKey }) {
  return (
    <div className='flex flex-wrap gap-2'>
      {items.map((t) => (
        <button
          key={t.key}
          className={[
            'text-sm px-4 py-2 rounded-full border',
            'border-border/60 bg-surface shadow-sm',
            t.key === activeKey ? 'bg-primary/10 text-primary border-primary/20' : 'hover:bg-bg',
          ].join(' ')}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className='rounded-2xl bg-surface border border-border/60 shadow-sm px-6 py-5'>
      <div className='text-sm text-muted'>{label}</div>
      <div className='text-3xl font-semibold mt-2 leading-none'>{value}</div>
    </div>
  );
}

function Card({ children, className = '' }) {
  return (
    <div
      className={['rounded-2xl bg-surface', 'border border-border/60', 'shadow-sm', className].join(
        ' ',
      )}
    >
      {children}
    </div>
  );
}

function CardHeader({ title, right }) {
  return (
    <div className='px-5 py-4 border-b border-border/60 flex items-center justify-between'>
      <div className='text-sm font-semibold'>{title}</div>
      {right ? <div>{right}</div> : null}
    </div>
  );
}

function EmptyState({ text }) {
  return <div className='h-80 flex items-center justify-center text-sm text-muted'>{text}</div>;
}

function Loading() {
  return (
    <div className='rounded-xl border border-border bg-surface p-6 text-sm text-muted'>
      Đang tải dữ liệu dashboard...
    </div>
  );
}

function ErrorBox({ message }) {
  return (
    <div className='rounded-xl border border-border bg-surface p-6'>
      <div className='text-sm font-semibold text-danger'>Lỗi</div>
      <div className='text-sm text-muted mt-1'>{message}</div>
    </div>
  );
}

/* ---------------- helpers ---------------- */

function formatShortDate(iso) {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}`;
}

function formatFullDate(iso) {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

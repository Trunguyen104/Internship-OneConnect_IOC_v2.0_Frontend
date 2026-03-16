import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Card, CardHeader } from './atoms';
import { DASHBOARD_UI } from '@/constants/dashboard/uiText';

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

export function BurndownChart({ burndown }) {
  return (
    <Card>
      <CardHeader title={DASHBOARD_UI.BURNDOWN_CHART} />
      <div className='h-80 p-4'>
        <ResponsiveContainer width='100%' height='100%'>
          <AreaChart data={burndown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id='burndownGrad' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='var(--color-primary)' stopOpacity={0.25} />
                <stop offset='95%' stopColor='var(--color-primary)' stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke='var(--color-border)' strokeDasharray='4 4' vertical={false} />
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
              name={DASHBOARD_UI.REMAINING}
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
  );
}

export function TaskStatusDistributionChart({ taskStatusDistribution }) {
  return (
    <Card>
      <CardHeader title={DASHBOARD_UI.TASK_STATUS_DISTRIBUTION} />
      <div className='h-80 p-4'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart
            data={taskStatusDistribution}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid stroke='var(--color-border)' strokeDasharray='4 4' vertical={false} />
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
            <Bar
              dataKey='count'
              name={DASHBOARD_UI.TASKS}
              fill='var(--color-info)'
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function WorkloadDistributionChart({ workloadByPerson }) {
  return (
    <Card>
      <CardHeader title={DASHBOARD_UI.WORKLOAD_DISTRIBUTION} />
      <div className='h-80 p-4'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart data={workloadByPerson} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
            <CartesianGrid stroke='var(--color-border)' strokeDasharray='4 4' vertical={false} />
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
              name={DASHBOARD_UI.TASKS}
              fill='var(--color-primary)'
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function CompletionPieChart({ completionPie }) {
  return (
    <Card>
      <CardHeader title={DASHBOARD_UI.COMPLETED_OVERDUE} />
      <div className='flex h-[340px] items-center justify-center p-4'>
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
                <Cell key={idx} fill={idx === 0 ? 'var(--color-success)' : 'var(--color-danger)'} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

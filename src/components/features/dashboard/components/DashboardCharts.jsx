'use client';

import React from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Card, CardHeader } from '@/components/ui/atoms';
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

const TOOLTIP_STYLE = {
  backgroundColor: '#fff',
  border: '1px solid #f3f4f6',
  borderRadius: '16px',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  padding: '12px 16px',
};

export function BurndownChart({ burndown }) {
  return (
    <Card className="rounded-[32px] border-gray-100 shadow-sm overflow-hidden">
      <CardHeader
        title={
          <span className="text-gray-900 font-bold text-lg">{DASHBOARD_UI.BURNDOWN_CHART}</span>
        }
      />
      <div className="h-80 p-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={burndown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="burndownGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#b91c1c" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#b91c1c" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#f3f4f6" strokeDasharray="4 4" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={formatShortDate}
              minTickGap={20}
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              labelFormatter={formatFullDate}
              contentStyle={TOOLTIP_STYLE}
              itemStyle={{ color: '#111827', fontWeight: 700, fontSize: '14px' }}
              labelStyle={{
                color: '#6b7280',
                marginBottom: '4px',
                fontSize: '12px',
                fontWeight: 600,
              }}
            />
            <Area
              type="monotone"
              dataKey="remaining"
              name={DASHBOARD_UI.REMAINING}
              stroke="#b91c1c"
              fill="url(#burndownGrad)"
              strokeWidth={3}
              activeDot={{
                r: 6,
                fill: '#fff',
                stroke: '#b91c1c',
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
    <Card className="rounded-[32px] border-gray-100 shadow-sm overflow-hidden">
      <CardHeader
        title={
          <span className="text-gray-900 font-bold text-lg">
            {DASHBOARD_UI.TASK_STATUS_DISTRIBUTION}
          </span>
        }
      />
      <div className="h-80 p-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={taskStatusDistribution}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid stroke="#f3f4f6" strokeDasharray="4 4" vertical={false} />
            <XAxis
              dataKey="status"
              stroke="#e5e7eb"
              tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis
              stroke="#e5e7eb"
              tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: '#f9fafb', opacity: 0.8 }}
              contentStyle={TOOLTIP_STYLE}
              itemStyle={{ color: '#111827', fontWeight: 700 }}
              labelStyle={{
                color: '#6b7280',
                marginBottom: '4px',
                fontSize: '12px',
                fontWeight: 600,
              }}
            />
            <Bar
              dataKey="count"
              name={DASHBOARD_UI.TASKS}
              fill="#0ea5e9"
              radius={[8, 8, 0, 0]}
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function WorkloadDistributionChart({ workloadByPerson }) {
  return (
    <Card className="rounded-[32px] border-gray-100 shadow-sm overflow-hidden">
      <CardHeader
        title={
          <span className="text-gray-900 font-bold text-lg">
            {DASHBOARD_UI.WORKLOAD_DISTRIBUTION}
          </span>
        }
      />
      <div className="h-80 p-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={workloadByPerson} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
            <CartesianGrid stroke="#f3f4f6" strokeDasharray="4 4" vertical={false} />
            <XAxis
              dataKey="name"
              angle={-30}
              textAnchor="end"
              stroke="#e5e7eb"
              tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 500 }}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis
              stroke="#e5e7eb"
              tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: '#f9fafb', opacity: 0.8 }}
              contentStyle={TOOLTIP_STYLE}
              itemStyle={{ color: '#111827', fontWeight: 700 }}
              labelStyle={{
                color: '#6b7280',
                marginBottom: '4px',
                fontSize: '12px',
                fontWeight: 600,
              }}
            />
            <Bar
              dataKey="count"
              name={DASHBOARD_UI.TASKS}
              fill="#b91c1c"
              radius={[8, 8, 0, 0]}
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function CompletionPieChart({ completionPie }) {
  const COLORS = ['#22c55e', '#ef4444'];
  return (
    <Card className="rounded-[32px] border-gray-100 shadow-sm overflow-hidden">
      <CardHeader
        title={
          <span className="text-gray-900 font-bold text-lg">{DASHBOARD_UI.COMPLETED_OVERDUE}</span>
        }
      />
      <div className="flex h-[340px] items-center justify-center p-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              itemStyle={{ color: '#111827', fontWeight: 700 }}
              labelStyle={{ display: 'none' }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{ paddingTop: '20px', fontSize: '13px', fontWeight: 600 }}
            />
            <Pie
              data={completionPie}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={105}
              stroke="#fff"
              strokeWidth={4}
              paddingAngle={4}
            >
              {completionPie.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

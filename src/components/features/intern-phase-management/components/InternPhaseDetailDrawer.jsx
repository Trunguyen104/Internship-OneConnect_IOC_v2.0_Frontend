'use client';

import {
  CalendarOutlined,
  ExportOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  ProjectOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button, Drawer, Progress, Space, Tabs, Tag } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';

import Badge from '@/components/ui/badge';
import {
  INTERN_PHASE_MANAGEMENT,
  INTERN_PHASE_STATUS_LABELS,
  INTERN_PHASE_STATUS_VARIANTS,
} from '@/constants/intern-phase-management/intern-phase';

import { InternPhaseService } from '../services/intern-phase.service';
import InternPhaseJobPostingTab from './InternPhaseJobPostingTab';
import InternPhaseStudentTab from './InternPhaseStudentTab';

export default function InternPhaseDetailDrawer({ visible, onClose, phase, onAddPosting }) {
  const { FORM, DETAILS } = INTERN_PHASE_MANAGEMENT;
  const { METADATA, TABS } = DETAILS;
  const [activeKey, setActiveKey] = useState('1');

  const { data: jobPostings, isLoading: loadingPostings } = useQuery({
    queryKey: ['intern-phase-postings', phase?.id || phase?.internPhaseId],
    queryFn: () => InternPhaseService.getJobPostings(phase?.id || phase?.internPhaseId),
    enabled: !!visible && !!(phase?.id || phase?.internPhaseId),
  });

  const { data: students, isLoading: loadingStudents } = useQuery({
    queryKey: ['intern-phase-students', phase?.id || phase?.internPhaseId],
    queryFn: () => InternPhaseService.getStudents(phase?.id || phase?.internPhaseId),
    enabled: !!visible && !!(phase?.id || phase?.internPhaseId),
  });

  if (!visible) return null;

  const total = phase?.capacity || 0;
  const remaining = phase?.remainingCapacity ?? total;
  const used = total - remaining;
  const occupancyRate = total > 0 ? Math.round((used / total) * 100) : 0;

  // Determine progress color based on rate using Global CSS values
  const getProgressColor = (rate) => {
    if (rate >= 90) return '#dc2626'; // --color-danger (varies)
    if (rate >= 70) return '#eab308'; // --color-warning
    return '#b91c1c'; // --color-primary
  };

  return (
    <Drawer
      title={null}
      open={visible}
      onClose={onClose}
      width={720}
      size="large"
      className="intern-phase-detail-drawer"
      styles={{
        body: { padding: 0 },
      }}
    >
      {/* Premium Header Container - Compact Version */}
      <div className="relative overflow-hidden bg-slate-900 px-8 py-6 text-white">
        {/* Subtle Background Pattern */}
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-10">
          <ProjectOutlined
            style={{ fontSize: '140px', transform: 'rotate(-20deg) translate(30px, -30px)' }}
          />
        </div>

        <div className="relative flex flex-col gap-2">
          <div className="flex items-start justify-between">
            <Space direction="vertical" size={0}>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400">
                {METADATA.TITLE}
              </span>
              <h2 className="m-0 text-2xl font-extrabold tracking-tight text-white">
                {phase?.name || FORM.TITLE_VIEW}
              </h2>
            </Space>
            <Badge
              variant={INTERN_PHASE_STATUS_VARIANTS[phase?.computedStatus]}
              size="sm"
              className="shadow-md"
            >
              {INTERN_PHASE_STATUS_LABELS[phase?.computedStatus]}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <InfoCircleOutlined className="text-indigo-400 text-[10px]" />
              <span className="font-medium opacity-80">{phase?.id || phase?.internPhaseId}</span>
            </div>
            <div className="h-3 w-px bg-slate-700" />
            <div className="flex items-center gap-1.5">
              <CalendarOutlined className="text-indigo-400 text-[10px]" />
              <span className="font-medium opacity-80">
                {dayjs(phase?.startDate).format('MMM D, YYYY')}
                <span className="mx-1">{METADATA.DATE_SEPARATOR}</span>
                {dayjs(phase?.endDate).format('MMM D, YYYY')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        <div className="space-y-6">
          {/* Metrics Grid - Compact Version */}
          <div className="grid grid-cols-2 gap-4">
            {/* Time Metrics Card */}
            <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <CalendarOutlined className="text-base" />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                  {METADATA.TIMELINE}
                </span>
              </div>

              <div className="relative flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                    {METADATA.START}
                  </span>
                  <span className="text-base font-black text-slate-800">
                    {dayjs(phase?.startDate).format('DD MMM')}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {dayjs(phase?.startDate).format('YYYY')}
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="h-0.5 w-8 rounded-full bg-slate-100" />
                  <ExportOutlined className="mt-0.5 text-slate-200 text-[10px]" />
                </div>

                <div className="flex flex-col items-end gap-0.5 text-right">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                    {METADATA.END}
                  </span>
                  <span className="text-base font-black text-slate-800">
                    {dayjs(phase?.endDate).format('DD MMM')}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {dayjs(phase?.endDate).format('YYYY')}
                  </span>
                </div>
              </div>
            </div>

            {/* Capacity Metrics Card */}
            <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:shadow-md">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <TeamOutlined className="text-base" />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                  {METADATA.OCCUPANCY}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative flex items-center justify-center">
                  <Progress
                    type="circle"
                    percent={occupancyRate}
                    size={56}
                    strokeWidth={10}
                    strokeColor={getProgressColor(occupancyRate)}
                    format={(percent) => (
                      <span className="text-[10px] font-black text-slate-700">{percent}%</span>
                    )}
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-800">{used}</span>
                    <span className="text-xs font-bold text-slate-400">/ {total}</span>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600">
                    {remaining} {METADATA.LEFT}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description & Majors Section - Compact Version */}
          <div className="rounded-2xl bg-slate-50/50 p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="md:col-span-2">
                <h4 className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                  <InfoCircleOutlined className="text-indigo-500" />
                  {METADATA.DESCRIPTION}
                </h4>
                <p className="text-xs leading-relaxed text-slate-600">
                  {phase?.description || 'No description provided.'}
                </p>
              </div>
              <div>
                <h4 className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                  <ProjectOutlined className="text-indigo-500" />
                  {METADATA.MAJORS}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {(typeof phase?.majorFields === 'string'
                    ? phase?.majorFields.split(',')
                    : Array.isArray(phase?.majorFields)
                      ? phase?.majorFields
                      : []
                  ).map((m, i) => (
                    <Tag
                      key={i}
                      className="m-0 border-none bg-white px-2 py-0.5 text-[10px] font-bold text-slate-600 shadow-sm transition-all hover:bg-slate-100"
                    >
                      {m.trim()}
                    </Tag>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Content Tabs */}
          <div className="pt-2">
            <Tabs
              activeKey={activeKey}
              onChange={setActiveKey}
              className="modern-drawer-tabs"
              tabBarExtraContent={
                activeKey === '1' ? (
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={onAddPosting}
                    className="bg-primary hover:bg-primary/90 shadow-sm rounded-lg h-9 px-4 flex items-center"
                  >
                    {DETAILS.CREATE_POSTING}
                  </Button>
                ) : null
              }
              items={[
                {
                  key: '1',
                  label: (
                    <div className="flex items-center gap-2 px-2 py-1">
                      <ProjectOutlined />
                      <span className="font-bold uppercase tracking-widest text-[11px]">
                        {DETAILS.TABS.POSTINGS}
                      </span>
                    </div>
                  ),
                  children: (
                    <div className="mt-4">
                      <InternPhaseJobPostingTab
                        data={jobPostings?.data || jobPostings}
                        loading={loadingPostings}
                        DETAILS={DETAILS}
                      />
                    </div>
                  ),
                },
                {
                  key: '2',
                  label: (
                    <div className="flex items-center gap-2 px-2 py-1">
                      <TeamOutlined />
                      <span className="font-bold uppercase tracking-widest text-[11px]">
                        {DETAILS.TABS.STUDENTS}
                      </span>
                    </div>
                  ),
                  children: (
                    <div className="mt-4">
                      <InternPhaseStudentTab
                        data={students?.data || students}
                        loading={loadingStudents}
                        DETAILS={DETAILS}
                      />
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </div>
    </Drawer>
  );
}

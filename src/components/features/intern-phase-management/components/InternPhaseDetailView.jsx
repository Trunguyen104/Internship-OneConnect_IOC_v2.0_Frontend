'use client';

import {
  ArrowLeftOutlined,
  CalendarOutlined,
  ExportOutlined,
  PlusOutlined,
  ProjectOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button, Progress, Tabs } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';

import Badge from '@/components/ui/badge';
import StatusBadge from '@/components/ui/status-badge';
import {
  INTERN_PHASE_MANAGEMENT,
  INTERN_PHASE_STATUS,
  INTERN_PHASE_STATUS_LABELS,
} from '@/constants/intern-phase-management/intern-phase';

import { InternPhaseService } from '../services/intern-phase.service';
import InternPhaseJobPostingTab from './InternPhaseJobPostingTab';
import InternPhaseStudentTab from './InternPhaseStudentTab';

export default function InternPhaseDetailView({ phase, onBack, onAddPosting }) {
  const { FORM, DETAILS } = INTERN_PHASE_MANAGEMENT;
  const { METADATA } = DETAILS;
  const [activeKey, setActiveKey] = useState('1');

  const phaseId = phase?.id || phase?.internPhaseId;

  const { data: jobPostings, isLoading: loadingPostings } = useQuery({
    queryKey: ['intern-phase-postings', phaseId],
    queryFn: () => InternPhaseService.getJobPostings(phaseId),
    enabled: !!phaseId,
  });

  const { data: students, isLoading: loadingStudents } = useQuery({
    queryKey: ['intern-phase-students', phaseId],
    queryFn: () => InternPhaseService.getStudents(phaseId),
    enabled: !!phaseId,
  });

  if (!phase) return null;

  const total = phase?.capacity || 0;
  const remaining = phase?.remainingCapacity ?? total;
  const used = total - remaining;
  const occupancyRate = total > 0 ? Math.round((used / total) * 100) : 0;

  const getProgressColor = (rate) => {
    if (rate >= 90) return '#dc2626';
    if (rate >= 70) return '#eab308';
    return '#b91c1c';
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-[32px] bg-slate-900 px-8 py-6 text-white shadow-lg">
        {/* Subtle Background Pattern */}
        <div className="absolute right-0 top-0 h-full w-1/4 opacity-10">
          <ProjectOutlined
            style={{ fontSize: '150px', transform: 'rotate(-20deg) translate(20px, -20px)' }}
          />
        </div>

        <div className="relative flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                ghost
                size="small"
                icon={<ArrowLeftOutlined />}
                onClick={onBack}
                className="border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white h-7 px-2"
              >
                {METADATA.BACK}
              </Button>
              <div className="h-3 w-px bg-slate-800" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">
                {METADATA.TITLE}
              </span>
            </div>
            <StatusBadge
              variant={
                phase?.computedStatus === INTERN_PHASE_STATUS.ACTIVE
                  ? 'success'
                  : phase?.computedStatus === INTERN_PHASE_STATUS.UPCOMING
                    ? 'warning'
                    : 'neutral'
              }
              label={INTERN_PHASE_STATUS_LABELS[phase?.computedStatus]}
              pulseDot={phase?.computedStatus === INTERN_PHASE_STATUS.ACTIVE}
            />
          </div>

          <div className="space-y-1">
            <h1 className="m-0 text-2xl md:text-3xl font-black tracking-tight text-white leading-tight">
              {phase?.name || phase?.internPhaseName || FORM.TITLE_VIEW}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-300">
              <div className="h-3 w-px bg-slate-700 hidden sm:block" />
              <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-default">
                <CalendarOutlined className="text-indigo-300 text-[10px]" />
                <span className="font-medium">
                  {dayjs(phase?.startDate).format('MMM D, YYYY')}
                  <span className="mx-2 text-slate-500 font-bold">{METADATA.TO}</span>
                  {dayjs(phase?.endDate).format('MMM D, YYYY')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Time Metrics Card */}
            <div className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <CalendarOutlined className="text-xl" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {METADATA.TIMELINE}
                </span>
              </div>

              <div className="relative flex items-center justify-between px-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {METADATA.START}
                  </span>
                  <span className="text-2xl font-black text-slate-800">
                    {dayjs(phase?.startDate).format('DD MMM')}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    {dayjs(phase?.startDate).format('YYYY')}
                  </span>
                </div>

                <div className="flex flex-col items-center flex-1 mx-8 relative">
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 rounded-full" />
                  <div className="relative z-10 bg-white p-2">
                    <ExportOutlined className="text-indigo-300 text-lg" />
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 text-right">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {METADATA.END}
                  </span>
                  <span className="text-2xl font-black text-slate-800">
                    {dayjs(phase?.endDate).format('DD MMM')}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    {dayjs(phase?.endDate).format('YYYY')}
                  </span>
                </div>
              </div>
            </div>

            {/* Capacity Metrics Card */}
            <div className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <TeamOutlined className="text-xl" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {METADATA.OCCUPANCY}
                </span>
              </div>

              <div className="flex items-center gap-8 px-4">
                <div className="relative flex items-center justify-center">
                  <Progress
                    type="circle"
                    percent={occupancyRate}
                    size={80}
                    strokeWidth={12}
                    strokeColor={getProgressColor(occupancyRate)}
                    format={(percent) => (
                      <span className="text-xs font-black text-slate-700">{percent}%</span>
                    )}
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-slate-800">{used}</span>
                    <span className="text-lg font-bold text-slate-300">/ {total}</span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 mt-1">
                    {remaining} {METADATA.LEFT} {METADATA.APPLICATIONS_REMAINING}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description & Majors Section */}
          <div className="rounded-3xl bg-slate-50/50 p-8 border border-slate-100/50">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <h4 className="mb-4 flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  {METADATA.DESCRIPTION}
                </h4>
                <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-wrap">
                  {phase?.description || DETAILS.NO_DESCRIPTION}
                </p>
              </div>
              <div className="border-l border-slate-200 pl-4 lg:pl-12">
                <h4 className="mb-4 flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  {METADATA.MAJORS}
                </h4>
                <div className="flex flex-wrap gap-3">
                  {(typeof phase?.majorFields === 'string'
                    ? phase?.majorFields.split(',')
                    : Array.isArray(phase?.majorFields)
                      ? phase?.majorFields
                      : []
                  ).map((m, i) => {
                    const majorName = m.trim();
                    const colors = [
                      'primary-soft',
                      'success-soft',
                      'warning-soft',
                      'info-soft',
                      'indigo-soft',
                    ];
                    const colorIndex =
                      Math.abs(
                        majorName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
                      ) % colors.length;
                    const variant = colors[colorIndex];

                    return (
                      <Badge
                        key={i}
                        variant={variant}
                        size="md"
                        className="px-4 py-1.5 font-black tracking-tight shadow-sm transition-all hover:scale-105"
                      >
                        {majorName}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Content Tabs */}
          <div className="pt-4 pb-12">
            <Tabs
              activeKey={activeKey}
              onChange={setActiveKey}
              className="modern-page-tabs"
              size="large"
              tabBarExtraContent={
                activeKey === '1' ? (
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={onAddPosting}
                    className="bg-primary hover:opacity-90 shadow-sm rounded-lg h-9 px-4 flex items-center font-semibold text-xs uppercase tracking-wider"
                  >
                    {DETAILS.CREATE_POSTING}
                  </Button>
                ) : null
              }
              items={[
                {
                  key: '1',
                  label: (
                    <div className="flex items-center gap-3 px-4">
                      <ProjectOutlined className="text-lg" />
                      <span className="font-black uppercase tracking-[0.1em] text-xs">
                        {DETAILS.TABS.POSTINGS}
                      </span>
                    </div>
                  ),
                  children: (
                    <div className="mt-8 bg-white rounded-3xl border border-slate-100 p-2 shadow-sm">
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
                    <div className="flex items-center gap-3 px-4">
                      <TeamOutlined className="text-lg" />
                      <span className="font-black uppercase tracking-[0.1em] text-xs">
                        {DETAILS.TABS.STUDENTS}
                      </span>
                    </div>
                  ),
                  children: (
                    <div className="mt-8 bg-white rounded-3xl border border-slate-100 p-2 shadow-sm">
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
    </div>
  );
}

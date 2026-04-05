'use client';

import dayjs from 'dayjs';
import React from 'react';

import { EmptyState } from '@/components/ui/atoms';
import StatusBadge from '@/components/ui/status-badge';
import { PROJECT_UI } from '@/constants/project/uiText';

const STATUS_PROJECT_CONFIG = {
  1: { label: PROJECT_UI.STATUS_LABELS.PLANNING, variant: 'primary' },
  2: { label: PROJECT_UI.STATUS_LABELS.IN_PROGRESS, variant: 'warning' },
  3: { label: PROJECT_UI.STATUS_LABELS.DONE, variant: 'success' },
  4: { label: PROJECT_UI.STATUS_LABELS.CANCELLED, variant: 'danger' },
};

export default function ProjectOverview({ project }) {
  if (!project) {
    return (
      <div className="flex min-h-[400px] flex-1 items-center justify-center rounded-[32px] border border-dashed border-gray-200 bg-gray-50/50 py-20 transition-all duration-700">
        <EmptyState description={PROJECT_UI.EMPTY.NO_PROJECT} />
      </div>
    );
  }

  const statusValue = project.operationalStatus || project.status;
  const statusInfo = STATUS_PROJECT_CONFIG[statusValue] || {
    label: statusValue || 'N/A',
    variant: 'default',
  };

  return (
    <div className="animate-in fade-in space-y-12 duration-700">
      <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
        <div className="grid min-w-[600px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Main Info */}
          <div className="col-span-1 border-gray-100 bg-white p-8 rounded-[32px] sm:col-span-2 shadow-sm border transition-all duration-500 hover:shadow-lg">
            <span className="mb-3 block text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
              {PROJECT_UI.LABELS.NAME}
            </span>
            <h2
              className="text-gray-900 m-0 block truncate text-2xl font-black tracking-tighter"
              title={project?.projectName}
            >
              {project?.projectName}
            </h2>
          </div>

          <div className="border-gray-100 bg-white p-8 rounded-[32px] shadow-sm border transition-all duration-500 hover:shadow-lg">
            <span className="mb-4 block text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
              {PROJECT_UI.LABELS.STATUS}
            </span>
            <StatusBadge
              variant={statusInfo.variant}
              label={statusInfo.label}
              variantType="boxed"
              className="w-full justify-center py-2"
            />
          </div>

          <div className="border-gray-100 bg-white p-8 rounded-[32px] shadow-sm border transition-all duration-500 hover:shadow-lg">
            <span className="mb-3 block text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
              {PROJECT_UI.LABELS.TIMELINE}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-gray-900 text-sm font-black tracking-tight">
                {project?.startDate ? dayjs(project.startDate).format('DD/MM/YYYY') : '—'}
              </span>
              <span className="text-gray-300 text-[10px] font-black uppercase">
                {PROJECT_UI.LABELS.TO}
              </span>
              <span className="text-gray-900 text-sm font-black tracking-tight">
                {project?.endDate ? dayjs(project.endDate).format('DD/MM/YYYY') : '—'}
              </span>
            </div>
          </div>

          {/* Metadata Row */}
          <div className="border-gray-50 bg-gray-50/20 p-6 rounded-[28px] border transition-all duration-500 hover:bg-white hover:shadow-md">
            <span className="mb-2 block text-[9px] font-bold tracking-[0.15em] text-gray-400 uppercase">
              {PROJECT_UI.LABELS.CODE}
            </span>
            <span className="text-gray-700 block truncate text-sm font-bold tracking-tight">
              {project?.projectCode || '—'}
            </span>
          </div>

          <div className="border-gray-50 bg-gray-50/20 p-6 rounded-[28px] border transition-all duration-500 hover:bg-white hover:shadow-md">
            <span className="mb-2 block text-[9px] font-bold tracking-[0.15em] text-gray-400 uppercase">
              {PROJECT_UI.LABELS.FIELD}
            </span>
            <span className="text-gray-700 block truncate text-sm font-bold tracking-tight">
              {project?.field || '—'}
            </span>
          </div>

          <div className="col-span-1 border-gray-50 bg-gray-50/20 p-6 rounded-[28px] border sm:col-span-2 transition-all duration-500 hover:bg-white hover:shadow-md">
            <span className="mb-2 block text-[9px] font-bold tracking-[0.15em] text-gray-400 uppercase">
              {PROJECT_UI.LABELS.GROUP}
            </span>
            <span className="text-gray-700 block truncate text-sm font-bold tracking-tight">
              {project?.groupName || '—'}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <section className="border-gray-50 bg-gray-50/30 p-8 rounded-[32px] border transition-all duration-700 hover:bg-white hover:shadow-xl hover:border-gray-100">
          <div className="mb-6 flex items-center gap-4">
            <h3 className="text-gray-900 m-0 text-xl font-black tracking-tight">
              {PROJECT_UI.LABELS.DESCRIPTION}
            </h3>
          </div>
          <p className="text-gray-600 m-0 text-[15px] leading-relaxed font-medium">
            {project?.description || PROJECT_UI.EMPTY.NO_DESCRIPTION}
          </p>
        </section>
      </div>
    </div>
  );
}

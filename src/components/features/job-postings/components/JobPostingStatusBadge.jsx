'use client';

import React from 'react';

import Badge from '@/components/ui/badge';

import { JOB_POSTING_UI, JOB_STATUS } from '../constants/job-postings.constant';

export default function JobPostingStatusBadge({ status }) {
  const getStatusConfig = (status) => {
    switch (status) {
      case JOB_STATUS.DRAFT:
        return {
          variant: 'warning',
          label: JOB_POSTING_UI.STATUS_LABELS[1],
          className: 'bg-amber-50 text-amber-600 border-amber-200/50',
        };
      case JOB_STATUS.PUBLISHED:
        return {
          variant: 'success',
          label: JOB_POSTING_UI.STATUS_LABELS[2],
          className: 'bg-emerald-50 text-emerald-600 border-emerald-200/50',
        };
      case JOB_STATUS.CLOSED:
        return {
          variant: 'error',
          label: JOB_POSTING_UI.STATUS_LABELS[3],
          className: 'bg-rose-50 text-rose-600 border-rose-200/50',
        };
      case JOB_STATUS.DELETED:
        return {
          variant: 'secondary',
          label: JOB_POSTING_UI.STATUS_LABELS[4],
          className: 'bg-slate-100 text-slate-500 border-slate-200',
        };
      default:
        return {
          variant: 'secondary',
          label: 'Unknown',
          className: 'bg-slate-50 text-slate-400',
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge
      variant={config.variant}
      className={`rounded-xl px-3 py-1 font-bold uppercase tracking-wider text-[10px] shadow-sm transition-all duration-300 hover:scale-105 ${config.className}`}
    >
      {config.label}
    </Badge>
  );
}

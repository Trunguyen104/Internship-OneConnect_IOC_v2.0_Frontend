'use client';

import React, { memo } from 'react';

import Badge from '@/components/ui/badge';
import { DAILY_REPORT_UI } from '@/constants/dailyReport/uiText';

const LogbookStatusTag = memo(function LogbookStatusTag({ status }) {
  const { STATUS, LOGBOOK_STATUS } = DAILY_REPORT_UI;

  const config = {
    [LOGBOOK_STATUS.SUBMITTED]: {
      label: STATUS.SUBMITTED,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
      variant: 'secondary',
    },
    SUBMITTED: {
      label: STATUS.SUBMITTED,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
      variant: 'secondary',
    },
    [LOGBOOK_STATUS.APPROVED]: {
      label: STATUS.APPROVED,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      variant: 'success',
    },
    APPROVED: {
      label: STATUS.APPROVED,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      variant: 'success',
    },
    [LOGBOOK_STATUS.NEEDS_REVISION]: {
      label: STATUS.NEEDS_REVISION,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
      variant: 'warning',
    },
    NEEDS_REVISION: {
      label: STATUS.NEEDS_REVISION,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
      variant: 'warning',
    },
    [LOGBOOK_STATUS.PUNCTUAL]: {
      label: STATUS.PUNCTUAL,
      color: 'bg-rose-50 text-rose-600 border-rose-100',
      variant: 'primary',
    },
    PUNCTUAL: {
      label: STATUS.PUNCTUAL,
      color: 'bg-rose-50 text-rose-600 border-rose-100',
      variant: 'primary',
    },
    [LOGBOOK_STATUS.LATE]: {
      label: STATUS.LATE,
      color: 'bg-gray-100 text-gray-500 border-gray-200',
      variant: 'muted',
    },
    LATE: {
      label: STATUS.LATE,
      color: 'bg-gray-100 text-gray-500 border-gray-200',
      variant: 'muted',
    },
    UNKNOWN: {
      label: STATUS.UNKNOWN,
      color: 'bg-gray-50 text-gray-400 border-gray-100',
      variant: 'muted',
    },
  };

  const c = config[status] || config.UNKNOWN;

  return (
    <Badge
      variant={c.variant}
      className={`inline-flex min-w-[110px] items-center justify-center rounded-full px-4 h-6 text-[10px] font-black uppercase tracking-[0.15em] border ${c.color}`}
    >
      {c.label}
    </Badge>
  );
});

export default LogbookStatusTag;

'use client';

import React, { memo } from 'react';
import { DAILY_REPORT_UI } from '@/constants/dailyReport/uiText';

const LogbookStatusTag = memo(function LogbookStatusTag({ status }) {
  const config = {
    0: {
      label: DAILY_REPORT_UI.STATUS.SUBMITTED,
      color: 'text-info',
    },
    SUBMITTED: {
      label: DAILY_REPORT_UI.STATUS.SUBMITTED,
      color: 'text-info',
    },
    1: {
      label: DAILY_REPORT_UI.STATUS.APPROVED,
      color: 'text-success',
    },
    APPROVED: {
      label: DAILY_REPORT_UI.STATUS.APPROVED,
      color: 'text-success',
    },
    2: {
      label: DAILY_REPORT_UI.STATUS.NEEDS_REVISION,
      color: 'text-warning',
    },
    NEEDS_REVISION: {
      label: DAILY_REPORT_UI.STATUS.NEEDS_REVISION,
      color: 'text-warning',
    },
    3: {
      label: DAILY_REPORT_UI.STATUS.PUNCTUAL,
      color: 'text-success',
    },
    PUNCTUAL: {
      label: DAILY_REPORT_UI.STATUS.PUNCTUAL,
      color: 'text-success',
    },
    4: {
      label: DAILY_REPORT_UI.STATUS.LATE,
      color: 'text-danger',
    },
    LATE: {
      label: DAILY_REPORT_UI.STATUS.LATE,
      color: 'text-danger',
    },
    UNKNOWN: {
      label: DAILY_REPORT_UI.STATUS.UNKNOWN,
      color: 'text-muted',
    },
  };

  const c = config[status] || config.UNKNOWN;

  return (
    <span className={`${c.color} text-xs font-semibold tracking-wide uppercase`}>{c.label}</span>
  );
});

export default LogbookStatusTag;

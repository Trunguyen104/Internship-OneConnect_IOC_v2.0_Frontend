'use client';

import React, { memo } from 'react';

import { DAILY_REPORT_UI } from '@/constants/dailyReport/uiText';

const LogbookStatusTag = memo(function LogbookStatusTag({ status }) {
  const { STATUS, LOGBOOK_STATUS } = DAILY_REPORT_UI;

  const config = {
    [LOGBOOK_STATUS.SUBMITTED]: {
      label: STATUS.SUBMITTED,
      color: 'text-info',
    },
    SUBMITTED: {
      label: STATUS.SUBMITTED,
      color: 'text-info',
    },
    [LOGBOOK_STATUS.APPROVED]: {
      label: STATUS.APPROVED,
      color: 'text-success',
    },
    APPROVED: {
      label: STATUS.APPROVED,
      color: 'text-success',
    },
    [LOGBOOK_STATUS.NEEDS_REVISION]: {
      label: STATUS.NEEDS_REVISION,
      color: 'text-warning',
    },
    NEEDS_REVISION: {
      label: STATUS.NEEDS_REVISION,
      color: 'text-warning',
    },
    [LOGBOOK_STATUS.PUNCTUAL]: {
      label: STATUS.PUNCTUAL,
      color: 'text-success',
    },
    PUNCTUAL: {
      label: STATUS.PUNCTUAL,
      color: 'text-success',
    },
    [LOGBOOK_STATUS.LATE]: {
      label: STATUS.LATE,
      color: 'text-danger',
    },
    LATE: {
      label: STATUS.LATE,
      color: 'text-danger',
    },
    UNKNOWN: {
      label: STATUS.UNKNOWN,
      color: 'text-muted',
    },
  };

  const c = config[status] || config.UNKNOWN;

  return <span className={`${c.color} text-xs font-semibold`}>{c.label}</span>;
});

export default LogbookStatusTag;

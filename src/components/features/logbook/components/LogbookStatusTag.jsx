'use client';

import React, { memo } from 'react';
import { DAILY_REPORT_UI } from '@/constants/dailyReport/uiText';

const LOGBOOK_STATUS = {
  SUBMITTED: 0,
  APPROVED: 1,
  NEEDS_REVISION: 2,
  PUNCTUAL: 3,
  LATE: 4,
};

const LogbookStatusTag = memo(function LogbookStatusTag({ status }) {
  const config = {
    [LOGBOOK_STATUS.SUBMITTED]: {
      label: DAILY_REPORT_UI.STATUS.SUBMITTED,
      color: 'text-info',
    },
    SUBMITTED: {
      label: DAILY_REPORT_UI.STATUS.SUBMITTED,
      color: 'text-info',
    },
    [LOGBOOK_STATUS.APPROVED]: {
      label: DAILY_REPORT_UI.STATUS.APPROVED,
      color: 'text-success',
    },
    APPROVED: {
      label: DAILY_REPORT_UI.STATUS.APPROVED,
      color: 'text-success',
    },
    [LOGBOOK_STATUS.NEEDS_REVISION]: {
      label: DAILY_REPORT_UI.STATUS.NEEDS_REVISION,
      color: 'text-warning',
    },
    NEEDS_REVISION: {
      label: DAILY_REPORT_UI.STATUS.NEEDS_REVISION,
      color: 'text-warning',
    },
    [LOGBOOK_STATUS.PUNCTUAL]: {
      label: DAILY_REPORT_UI.STATUS.PUNCTUAL,
      color: 'text-success',
    },
    PUNCTUAL: {
      label: DAILY_REPORT_UI.STATUS.PUNCTUAL,
      color: 'text-success',
    },
    [LOGBOOK_STATUS.LATE]: {
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

  return <span className={`${c.color} text-xs font-semibold`}>{c.label}</span>;
});

export default LogbookStatusTag;

'use client';

import React, { memo } from 'react';
import { Tag } from 'antd';
import { DAILY_REPORT_UI } from '@/constants/dailyReport/uiText';

const LogbookStatusTag = memo(function LogbookStatusTag({ status }) {
  const config = {
    0: {
      label: DAILY_REPORT_UI.STATUS.SUBMITTED,
      color: 'processing',
    },
    SUBMITTED: {
      label: DAILY_REPORT_UI.STATUS.SUBMITTED,
      color: 'processing',
    },
    1: {
      label: DAILY_REPORT_UI.STATUS.APPROVED,
      style: 'bg-emerald-50 text-emerald-600 border-emerald-200 border',
    },
    APPROVED: {
      label: DAILY_REPORT_UI.STATUS.APPROVED,
      style: 'bg-emerald-50 text-emerald-600 border-emerald-200 border',
    },
    2: {
      label: DAILY_REPORT_UI.STATUS.NEEDS_REVISION,
      style: 'bg-amber-50 text-amber-600 border-amber-200 border',
    },
    NEEDS_REVISION: {
      label: DAILY_REPORT_UI.STATUS.NEEDS_REVISION,
      style: 'bg-amber-50 text-amber-600 border-amber-200 border',
    },
    3: {
      label: DAILY_REPORT_UI.STATUS.PUNCTUAL,
      style: 'bg-green-50 text-green-600 border-green-200 border',
    },
    PUNCTUAL: {
      label: DAILY_REPORT_UI.STATUS.PUNCTUAL,
      style: 'bg-green-50 text-green-600 border-green-200 border',
    },
    4: {
      label: DAILY_REPORT_UI.STATUS.LATE,
      color: 'error',
    },
    LATE: {
      label: DAILY_REPORT_UI.STATUS.LATE,
      color: 'error',
    },
    UNKNOWN: {
      label: DAILY_REPORT_UI.STATUS.UNKNOWN,
      color: 'default',
    },
  };

  const c = config[status] || config.UNKNOWN;

  return (
    <Tag
      color={c.color}
      variant='filled'
      className='min-w-[100px] rounded-full py-0.5 text-center text-[10px] font-black tracking-widest uppercase'
    >
      {c.label}
    </Tag>
  );
});

export default LogbookStatusTag;

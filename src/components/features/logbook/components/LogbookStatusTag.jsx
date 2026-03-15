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
    PUNCTUAL: {
      label: DAILY_REPORT_UI.STATUS.PUNCTUAL,
      color: 'success',
    },
    3: {
      label: DAILY_REPORT_UI.STATUS.PUNCTUAL,
      color: 'success',
    },
    LATE: {
      label: DAILY_REPORT_UI.STATUS.LATE,
      color: 'error',
    },
    4: {
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

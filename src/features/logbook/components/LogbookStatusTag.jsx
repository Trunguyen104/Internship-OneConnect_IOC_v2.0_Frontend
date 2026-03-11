'use client';

import { DAILY_REPORT_UI } from '@/constants/dailyReport/uiText';

export default function LogbookStatusTag({ status }) {
  const config = {
    0: {
      label: DAILY_REPORT_UI.STATUS.SUBMITTED,
      style: 'bg-blue-50 text-blue-600 border-blue-200 border',
    },
    SUBMITTED: {
      label: DAILY_REPORT_UI.STATUS.SUBMITTED,
      style: 'bg-blue-50 text-blue-600 border-blue-200 border',
    },
    PUNCTUAL: {
      label: DAILY_REPORT_UI.STATUS.PUNCTUAL,
      style: 'bg-emerald-50 text-emerald-600 border-emerald-200 border',
    },
    3: {
      label: DAILY_REPORT_UI.STATUS.PUNCTUAL,
      style: 'bg-emerald-50 text-emerald-600 border-emerald-200 border',
    },
    LATE: {
      label: DAILY_REPORT_UI.STATUS.LATE,
      style: 'bg-red-50 text-red-600 border-red-200 border',
    },
    4: {
      label: DAILY_REPORT_UI.STATUS.LATE,
      style: 'bg-red-50 text-red-600 border-red-200 border',
    },
    UNKNOWN: {
      label: DAILY_REPORT_UI.STATUS.UNKNOWN,
      style: 'bg-gray-50 text-gray-600 border-gray-200 border',
    },
  };

  const c = config[status] || config.UNKNOWN;

  return (
    <div className={`inline-flex rounded-full px-3 py-1 text-[12px] font-bold ${c.style}`}>
      {c.label}
    </div>
  );
}

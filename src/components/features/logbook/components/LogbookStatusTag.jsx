import React, { memo } from 'react';

import StatusBadge from '@/components/ui/status-badge';
import { DAILY_REPORT_UI } from '@/constants/dailyReport/uiText';

const LogbookStatusTag = memo(function LogbookStatusTag({ status }) {
  const { STATUS, LOGBOOK_STATUS } = DAILY_REPORT_UI;

  const config = {
    [LOGBOOK_STATUS.SUBMITTED]: {
      label: STATUS.SUBMITTED,
      variant: 'info',
    },
    SUBMITTED: {
      label: STATUS.SUBMITTED,
      variant: 'info',
    },
    [LOGBOOK_STATUS.APPROVED]: {
      label: STATUS.APPROVED,
      variant: 'success',
    },
    APPROVED: {
      label: STATUS.APPROVED,
      variant: 'success',
    },
    [LOGBOOK_STATUS.NEEDS_REVISION]: {
      label: STATUS.NEEDS_REVISION,
      variant: 'warning',
    },
    NEEDS_REVISION: {
      label: STATUS.NEEDS_REVISION,
      variant: 'warning',
    },
    [LOGBOOK_STATUS.PUNCTUAL]: {
      label: STATUS.PUNCTUAL,
      variant: 'success',
    },
    PUNCTUAL: {
      label: STATUS.PUNCTUAL,
      variant: 'success',
    },
    [LOGBOOK_STATUS.LATE]: {
      label: STATUS.LATE,
      variant: 'error',
    },
    LATE: {
      label: STATUS.LATE,
      variant: 'error',
    },
    UNKNOWN: {
      label: STATUS.UNKNOWN,
      variant: 'neutral',
    },
  };

  const c = config[status] || config.UNKNOWN;

  return <StatusBadge variant={c.variant} label={c.label} />;
});

export default LogbookStatusTag;

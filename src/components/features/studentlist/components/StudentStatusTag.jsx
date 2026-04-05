import React from 'react';

import StatusBadge from '@/components/ui/status-badge';

import { STUDENT_STATUS_MAP } from '../constants/statusMap';

export default function StudentStatusTag({ status }) {
  const config = STUDENT_STATUS_MAP[status] || {
    label: 'UNKNOWN',
    variant: 'neutral',
  };

  return <StatusBadge variant={config.variant} label={config.label} />;
}

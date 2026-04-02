'use client';

import React from 'react';

import StatusBadge from '@/components/ui/status-badge';

import { JOB_POSTING_UI, JOB_STATUS_VARIANTS } from '../constants/job-postings.constant';

export default function JobPostingStatusBadge({ status }) {
  const variant = JOB_STATUS_VARIANTS[status] || 'neutral';
  const label = JOB_POSTING_UI.STATUS_LABELS[status] || 'Unknown';

  return <StatusBadge variant={variant} label={label} />;
}

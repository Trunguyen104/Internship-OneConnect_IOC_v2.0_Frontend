'use client';

import React from 'react';

import StatusBadge from '@/components/ui/status-badge';

import { JOB_POSTING_UI, JOB_STATUS_VARIANTS } from '../constants/job-postings.constant';

/**
 * Renders a chip-style badge showing the job posting status.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.status - The current status of the job (DRAFT, PUBLISHED, etc.).
 */
export default function JobPostingStatusBadge({ status }) {
  const variant = JOB_STATUS_VARIANTS[status] || 'neutral';
  const label = JOB_POSTING_UI.STATUS_LABELS[status] || 'Unknown';

  return <StatusBadge variant={variant} label={label} />;
}

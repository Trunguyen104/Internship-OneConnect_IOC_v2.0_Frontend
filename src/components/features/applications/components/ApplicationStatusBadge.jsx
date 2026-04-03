'use client';

import React from 'react';

import Badge from '@/components/ui/badge';
import { APPLICATION_STATUS_CONFIG } from '@/constants/applications/application.constants';

/**
 * Standardized Badge for Application Status.
 * Uses consistent colors and labels from the APPLICATION_STATUS_CONFIG.
 */
export const ApplicationStatusBadge = ({ status, className = '' }) => {
  // Normalize status - handle potentially stringified numbers or raw label strings
  const resolveStatus = (val) => {
    if (val === null || val === undefined) return null;

    // 1. Check direct match (e.g., number 1 or string "1")
    if (APPLICATION_STATUS_CONFIG[val]) return val;

    // 2. Try converting to number
    const num = Number(val);
    if (!isNaN(num) && APPLICATION_STATUS_CONFIG[num]) return num;

    // 3. Match by name (e.g., "APPLIED" or "Applied" matching config label)
    if (typeof val === 'string') {
      const normalized = val.trim().toLowerCase();
      const entry = Object.entries(APPLICATION_STATUS_CONFIG).find(([, cfg]) => {
        return (cfg.label || '').toLowerCase() === normalized;
      });
      if (entry) return Number(entry[0]);
    }

    return null;
  };

  const resolved = resolveStatus(status);
  const config = APPLICATION_STATUS_CONFIG[resolved] || {
    label: typeof status === 'string' && status.length > 0 ? status : 'Unknown',
    variant: 'default',
  };

  return (
    <Badge variant={config.variant} className={className} size="md">
      {config.label}
    </Badge>
  );
};

export default ApplicationStatusBadge;

'use client';

import React from 'react';

import Badge from '@/components/ui/badge';
import { APPLICATION_STATUS_CONFIG } from '@/constants/applications/application.constants';

/**
 * Standardized Badge for Application Status.
 * Uses consistent colors and labels from the APPLICATION_STATUS_CONFIG.
 */
export const ApplicationStatusBadge = ({ status, className = '' }) => {
  const config = APPLICATION_STATUS_CONFIG[status] || {
    label: 'Unknown',
    variant: 'default',
  };

  return (
    <Badge variant={config.variant} className={className} size="md">
      {config.label}
    </Badge>
  );
};

export default ApplicationStatusBadge;

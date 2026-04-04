'use client';

import React from 'react';

import Badge from '@/components/ui/badge';

import {
  PLACEMENT_STATUS_LABELS,
  PLACEMENT_STATUS_VARIANTS,
} from '../constants/placement.constants';

/**
 * Renders the placement status badge for a student.
 * AC-09: Badge colors for Unplaced, Pending Assignment, Placed.
 */
const PlacementStatusBadge = ({ status }) => {
  const label = PLACEMENT_STATUS_LABELS[status] || 'Unknown';
  const variant = PLACEMENT_STATUS_VARIANTS[status] || 'default';

  return (
    <Badge variant={variant} size="sm">
      {label}
    </Badge>
  );
};

export default PlacementStatusBadge;

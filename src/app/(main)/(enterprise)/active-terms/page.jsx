'use client';

import React from 'react';

import ActiveTermsDashboard from '@/components/features/active-terms/components/ActiveTermsDashboard';

/**
 * Active Terms Page for Enterprise Users.
 * This page hosts the ActiveTermsDashboard component within the Enterprise layout.
 */
export default function ActiveTermsPage() {
  return (
    <div className="p-6 h-full overflow-y-auto">
      <ActiveTermsDashboard />
    </div>
  );
}

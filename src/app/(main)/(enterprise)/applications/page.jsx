import React from 'react';

import ApplicationManagement from '@/components/features/applications/components/ApplicationManagement';

export const metadata = {
  title: 'Application Management | Enterprise',
};

/**
 * Lean Page exporter for the Application Management feature.
 * Logic is encapsulated within components/features/applications.
 */
export default function page() {
  return <ApplicationManagement />;
}

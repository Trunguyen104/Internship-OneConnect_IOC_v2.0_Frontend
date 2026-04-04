'use client';

import React from 'react';

import AllIssuesView from '@/components/features/backlog/components/AllIssuesView';
import StudentPageHeader from '@/components/layout/StudentPageHeader';
import StudentTabs from '@/components/layout/StudentTabs';

export default function AllIssuesPage() {
  return (
    <div className="animate-in fade-in flex min-h-0 flex-1 flex-col space-y-6 duration-500">
      <StudentPageHeader hidden />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <StudentTabs />
      </div>
      <AllIssuesView />
    </div>
  );
}

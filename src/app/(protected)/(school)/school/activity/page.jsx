'use client';

import React from 'react';

import StudentActivityList from '@/components/features/internship-student-activity/components/StudentActivityList';
import SchoolTopNav from '@/components/layout/SchoolTopNav';
import { usePageHeader } from '@/providers/PageHeaderProvider';

export default function SchoolActivityPage() {
  usePageHeader({
    title: 'Student Activity',
  });

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <SchoolTopNav />
      <main className="flex-1 overflow-auto bg-gray-50 p-4 2xl:p-6 w-full max-w-7xl mx-auto flex flex-col">
        <StudentActivityList />
      </main>
    </div>
  );
}

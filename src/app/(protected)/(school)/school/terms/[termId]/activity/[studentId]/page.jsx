'use client';

import React from 'react';

import StudentActivityDetail from '@/components/features/internship-student-activity/components/StudentActivityDetail';
import { usePageHeader } from '@/providers/PageHeaderProvider';

export default function TermStudentActivityDetailPage() {
  usePageHeader({
    title: 'Student Detail',
  });

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* 
          No SchoolTopNav here because this page is nested under [termId]/layout.jsx 
          which already provides the AppSidebar and Header.
      */}
      <main className="flex-1 overflow-auto bg-gray-50 p-4 2xl:p-6 w-full max-w-7xl mx-auto flex flex-col">
        <StudentActivityDetail />
      </main>
    </div>
  );
}

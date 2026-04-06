'use client';

import { useParams } from 'next/navigation';
import React from 'react';

import JobPostingDetail from '@/components/features/job-postings/components/JobPostingDetail';
import CompanyTopNav from '@/components/layout/CompanyTopNav';

export default function CompanyJobPostingDetailViewPage() {
  const { id } = useParams();

  return (
    <div className="flex h-full flex-col overflow-hidden w-full">
      <CompanyTopNav />
      <main className="flex-1 overflow-auto bg-slate-50 p-4 2xl:p-6 w-full max-w-full">
        <JobPostingDetail id={id} />
      </main>
    </div>
  );
}

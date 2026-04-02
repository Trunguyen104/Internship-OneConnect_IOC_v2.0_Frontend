'use client';

import { useParams } from 'next/navigation';
import React from 'react';

import ProjectDetailView from '@/components/features/project-management/components/ProjectDetailView';
import CompanyTopNav from '@/components/layout/CompanyTopNav';

export default function CompanyProjectDetailViewPage() {
  const { projectId } = useParams();

  return (
    <div className="flex h-full flex-col overflow-hidden w-full">
      <CompanyTopNav />
      <main className="flex-1 overflow-auto bg-slate-50 p-4 2xl:p-6 w-full max-w-full">
        <ProjectDetailView id={projectId} />
      </main>
    </div>
  );
}

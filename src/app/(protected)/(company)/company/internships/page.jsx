'use client';

import InternshipManagementContainer from '@/components/features/internship-management';
import CompanyTopNav from '@/components/layout/CompanyTopNav';

export default function CompanyInternshipsPage() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <CompanyTopNav />
      <main className="flex-1 overflow-y-auto flex flex-col bg-gray-50 p-4 2xl:p-6">
        <InternshipManagementContainer />
      </main>
    </div>
  );
}

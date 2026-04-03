'use client';

import EnterpriseDashboardContainer from '@/components/features/company-dashboard/components/EnterpriseDashboardContainer';
import CompanyTopNav from '@/components/layout/CompanyTopNav';

export default function CompanyHomePage() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <CompanyTopNav />
      <main className="flex-1 overflow-auto bg-gray-50 p-4 2xl:p-6 pb-12">
        <div className="mx-auto w-full max-w-[1600px]">
          <EnterpriseDashboardContainer />
        </div>
      </main>
    </div>
  );
}

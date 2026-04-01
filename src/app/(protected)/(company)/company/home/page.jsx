'use client';

import EnterpriseProfileContainer from '@/components/features/company-profile/components/EnterpriseProfileContainer';
import CompanyTopNav from '@/components/layout/CompanyTopNav';

export default function CompanyHomePage() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <CompanyTopNav />
      <main className="flex-1 overflow-auto bg-gray-50 p-4 2xl:p-6">
        <div className="w-full">
          <EnterpriseProfileContainer />
        </div>
      </main>
    </div>
  );
}

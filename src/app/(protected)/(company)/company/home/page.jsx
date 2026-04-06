'use client';

import EnterpriseAdminDashboardContainer from '@/components/features/company-dashboard/components/EnterpriseAdminDashboardContainer';
import EnterpriseDashboardContainer from '@/components/features/company-dashboard/components/EnterpriseDashboardContainer';
import MentorGroupsDashboard from '@/components/features/company-dashboard/components/MentorGroupsDashboard';
import CompanyTopNav from '@/components/layout/CompanyTopNav';
import { USER_ROLE } from '@/constants/common/enums';
import { useAuthStore } from '@/store/useAuthStore';

export default function CompanyHomePage() {
  const user = useAuthStore((s) => s.user);
  const userRole = user ? Number(user.role) : null;

  const isMentor = userRole === USER_ROLE.MENTOR;
  const isAdmin = userRole === USER_ROLE.ENTERPRISE_ADMIN;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <CompanyTopNav />
      <main className="flex-1 overflow-auto bg-gray-50/50 p-4 pb-12 2xl:p-8">
        <div className="mx-auto w-full max-w-[1600px]">
          {isMentor ? (
            <MentorGroupsDashboard />
          ) : isAdmin ? (
            <EnterpriseAdminDashboardContainer />
          ) : (
            <EnterpriseDashboardContainer />
          )}
        </div>
      </main>
    </div>
  );
}

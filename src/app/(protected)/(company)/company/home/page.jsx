'use client';

import EnterpriseDashboardContainer from '@/components/features/company-dashboard/components/EnterpriseDashboardContainer';
import CompanyTopNav from '@/components/layout/CompanyTopNav';
import { USER_ROLE } from '@/constants/common/enums';
import { ENTERPRISE_DASHBOARD_UI } from '@/constants/enterprise-dashboard/uiText';
import { useAuthStore } from '@/store/useAuthStore';

export default function CompanyHomePage() {
  const user = useAuthStore((s) => s.user);

  const isMentor = user && Number(user.role) === USER_ROLE.MENTOR;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <CompanyTopNav />
      <main className="flex-1 overflow-auto bg-gray-50 p-4 2xl:p-6 pb-12">
        <div className="mx-auto w-full max-w-[1600px]">
          {isMentor ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[40px] border border-slate-100 bg-white p-12 shadow-sm animate-in fade-in zoom-in duration-700">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-50">
                <span className="text-3xl">{ENTERPRISE_DASHBOARD_UI.MENTOR.EMOJI}</span>
              </div>
              <h2 className="mb-2 text-3xl font-black tracking-tight text-slate-900">
                {ENTERPRISE_DASHBOARD_UI.MENTOR.GREETING} {user.fullName || user.email}
                {ENTERPRISE_DASHBOARD_UI.MENTOR.EXCLAMATION}
              </h2>
              <p className="max-w-md text-center font-medium text-slate-500">
                {ENTERPRISE_DASHBOARD_UI.MENTOR.WELCOME}{' '}
                {ENTERPRISE_DASHBOARD_UI.MENTOR.PLACEHOLDER}
              </p>
            </div>
          ) : (
            <EnterpriseDashboardContainer />
          )}
        </div>
      </main>
    </div>
  );
}

import InternPhaseManagementContainer from '@/components/features/intern-phase-management/components';
import CompanyTopNav from '@/components/layout/CompanyTopNav';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Internship Phases | Company' };

export default function CompanyPhasesPage() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <CompanyTopNav />
      <main className="flex-1 overflow-auto bg-gray-50 p-4 2xl:p-6">
        <InternPhaseManagementContainer />
      </main>
    </div>
  );
}

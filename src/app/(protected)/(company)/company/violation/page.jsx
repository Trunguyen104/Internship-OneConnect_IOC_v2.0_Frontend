import ViolationManagement from '@/components/features/violation-reports/components';
import CompanyTopNav from '@/components/layout/CompanyTopNav';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Violation Reports | Company' };

export default function CompanyViolationsPage() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <CompanyTopNav />
      <main className="flex-1 overflow-hidden flex flex-col bg-gray-50 p-4 2xl:p-6">
        <ViolationManagement />
      </main>
    </div>
  );
}

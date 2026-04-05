import ApplicationManagement from '@/components/features/applications/components/ApplicationManagement';
import CompanyTopNav from '@/components/layout/CompanyTopNav';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Applications | Company' };

export default function CompanyApplicationsPage() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <CompanyTopNav />
      <main className="flex-1 overflow-auto bg-gray-50 p-4 2xl:p-6">
        <ApplicationManagement />
      </main>
    </div>
  );
}

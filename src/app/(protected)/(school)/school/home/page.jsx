import UniAdminDashboard from '@/components/features/dashboard/components/UniAdminDashboard';
import SchoolTopNav from '@/components/layout/SchoolTopNav';

export const metadata = {
  title: 'School Home | IOCv2',
  description: 'University administration home.',
};

export default function SchoolHomePage() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <SchoolTopNav />
      <main className="flex-1 overflow-auto bg-gray-50 p-4 2xl:p-6">
        <UniAdminDashboard />
      </main>
    </div>
  );
}

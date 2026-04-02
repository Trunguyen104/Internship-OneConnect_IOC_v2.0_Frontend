import ProjectManagement from '@/components/features/project-management/components';
import CompanyTopNav from '@/components/layout/CompanyTopNav';

export const metadata = { title: 'Projects | Company' };

export default function CompanyProjectsPage() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <CompanyTopNav />
      <main className="flex-1 overflow-hidden flex flex-col bg-gray-50 p-4 2xl:p-6">
        <ProjectManagement />
      </main>
    </div>
  );
}

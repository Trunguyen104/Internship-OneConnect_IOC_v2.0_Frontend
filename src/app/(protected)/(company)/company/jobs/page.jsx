import JobBoardPage from '@/components/features/job-board/components/JobBoardPage';
import CompanyTopNav from '@/components/layout/CompanyTopNav';

export const metadata = { title: 'Jobs | Company' };

export default function CompanyJobsPage() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <CompanyTopNav />
      <main className="flex-1 overflow-auto bg-gray-50 p-4 2xl:p-6">
        <JobBoardPage />
      </main>
    </div>
  );
}

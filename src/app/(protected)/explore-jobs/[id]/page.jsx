import JobDetail from '@/components/features/explore-jobs/components/JobDetail';
import StudentTopNav from '@/components/layout/StudentTopNav';

export const metadata = {
  title: 'Job Details | OneConnect',
  description: 'Detailed information about the internship opportunity.',
};

export default function Page() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <StudentTopNav />
      <main className="flex-1 overflow-auto bg-gray-50">
        <JobDetail />
      </main>
    </div>
  );
}

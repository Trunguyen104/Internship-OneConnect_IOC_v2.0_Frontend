import ExploreJobs from '@/components/features/explore-jobs/components/ExploreJobs';
import StudentTopNav from '@/components/layout/StudentTopNav';

export const metadata = { title: 'Job Board | Student' };

export default function StudentJobsPage() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <StudentTopNav />
      <main className="flex-1 overflow-auto bg-gray-50 p-4 2xl:p-6">
        <ExploreJobs />
      </main>
    </div>
  );
}

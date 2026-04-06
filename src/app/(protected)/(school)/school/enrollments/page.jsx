import InternshipEnrollments from '@/components/features/internship-enrollment-management/components';
import SchoolTopNav from '@/components/layout/SchoolTopNav';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Internship Enrollments | School',
  description: 'Manage student enrollments for internship terms.',
};

export default function SchoolEnrollmentsPage() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <SchoolTopNav />
      <main className="flex-1 overflow-hidden flex flex-col bg-gray-50 p-4 2xl:p-6">
        <InternshipEnrollments />
      </main>
    </div>
  );
}

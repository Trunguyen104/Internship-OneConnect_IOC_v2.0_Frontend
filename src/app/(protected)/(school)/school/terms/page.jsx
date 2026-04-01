import InternshipTerms from '@/components/features/internship-term-management/components';
import SchoolTopNav from '@/components/layout/SchoolTopNav';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Internship Terms | School',
  description: 'Manage internship terms for your university.',
};

export default function SchoolTermsPage() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <SchoolTopNav />
      <main className="flex-1 overflow-auto bg-gray-50 p-4 2xl:p-6">
        <InternshipTerms />
      </main>
    </div>
  );
}

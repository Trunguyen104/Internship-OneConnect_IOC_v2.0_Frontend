import EnterprisesPage from '@/components/features/enterprises/EnterprisesPage';
import SchoolTopNav from '@/components/layout/SchoolTopNav';

export const metadata = {
  title: 'Enterprises | School',
  description: 'Browse enterprise partners available on the platform.',
};

export default function SchoolEnterprisesPage() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <SchoolTopNav />
      <main className="flex-1 overflow-auto bg-gray-50 p-4 2xl:p-6">
        <EnterprisesPage />
      </main>
    </div>
  );
}

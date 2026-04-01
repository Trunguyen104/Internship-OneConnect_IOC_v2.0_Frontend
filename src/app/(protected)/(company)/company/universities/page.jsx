import UniversitiesPage from '@/components/features/universities/UniversitiesPage';
import CompanyTopNav from '@/components/layout/CompanyTopNav';

export const metadata = {
  title: 'Universities | Company',
  description: 'Partner universities linked to your organization.',
};

export default function CompanyUniversitiesPage() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <CompanyTopNav />
      <main className="flex-1 overflow-auto bg-gray-50 p-4 2xl:p-6">
        <UniversitiesPage />
      </main>
    </div>
  );
}

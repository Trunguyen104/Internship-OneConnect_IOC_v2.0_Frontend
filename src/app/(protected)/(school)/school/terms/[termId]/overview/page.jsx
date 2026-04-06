import UniAdminDashboard from '@/components/features/dashboard/components/UniAdminDashboard';

export const metadata = { title: 'Term Overview | School' };

export default async function TermOverviewPage({ params }) {
  const { termId } = await params;
  return <UniAdminDashboard termId={termId} />;
}

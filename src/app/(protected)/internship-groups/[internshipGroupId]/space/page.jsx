import Dashboard from '@/components/features/dashboard/components/Dashboard';
export default async function Page({ params }) {
  const { internshipGroupId } = await params;
  return <Dashboard internshipGroupId={internshipGroupId} />;
}

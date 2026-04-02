import { redirect } from 'next/navigation';

export default async function CompanyPhaseDetailPage({ params }) {
  const { phaseId } = await params;
  redirect(`/company/phases/${phaseId}/overview`);
}

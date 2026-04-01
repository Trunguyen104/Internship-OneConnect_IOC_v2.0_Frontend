import { redirect } from 'next/navigation';

export default function PhaseIndexPage({ params }) {
  redirect(`/company/phases/${params.phaseId}/overview`);
}

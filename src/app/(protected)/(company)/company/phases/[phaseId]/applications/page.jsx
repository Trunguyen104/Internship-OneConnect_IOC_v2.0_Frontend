import ApplicationManagement from '@/components/features/applications/components/ApplicationManagement';

export const metadata = { title: 'Applications | Phase Workspace' };

export default function PhaseApplicationsPage({ params }) {
  return <ApplicationManagement internshipPhaseId={params?.phaseId} />;
}

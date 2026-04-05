import EvaluationPage from '@/components/features/evaluation/components/EvaluationPage';
import StudentTopNav from '@/components/layout/StudentTopNav';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'My Evaluations | Student' };

export default function StudentEvaluationsPage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50">
      <StudentTopNav />
      <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <EvaluationPage />
        </div>
      </main>
    </div>
  );
}

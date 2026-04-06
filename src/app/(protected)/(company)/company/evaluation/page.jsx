import EvaluationContainer from '@/components/features/evaluation/components/mentor/EvaluationContainer';
import CompanyTopNav from '@/components/layout/CompanyTopNav';

export const metadata = {
  title: 'Evaluation | IOCv2',
  description: 'Manage and grade student evaluations.',
};

export default function EvaluationPage() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <CompanyTopNav />
      <main className="flex-1 overflow-hidden flex flex-col bg-gray-50 p-4 2xl:p-6">
        <EvaluationContainer />
      </main>
    </div>
  );
}

'use client';

import Card from '@/components/ui/Card';
// import Footer from '@/components/layout/Footer';
import CycleTable from './CycleTable';
import TeamEvaluationsModal from './TeamEvaluationsModal';
import ScoreDetailDrawer from './ScoreDetailDrawer';
import { useEvaluation } from '../hooks/useEvaluation';
import Pagination from '@/components/ui/Pagination';

export default function EvaluationPage() {
  const {
    MY_STUDENT_ID,
    page,
    pageSize,
    paginated,
    total,
    totalPages,
    setPage,
    setPageSize,
    selectedCycle,
    teamData,
    myEvaluation,
    teamVisible,
    detailVisible,
    openTeamOverview,
    openDetail,
    closeTeam,
    closeDetail,
  } = useEvaluation();

  return (
    <section className='flex flex-col space-y-6'>
      <h1 className='text-2xl font-bold text-slate-900'>Evaluation</h1>

      <Card>
        <CycleTable data={paginated} page={page} pageSize={pageSize} onDetail={openTeamOverview} />
      </Card>
      <Pagination
        total={total}
        page={page}
        pageSize={pageSize}
        totalPages={totalPages}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />

      <TeamEvaluationsModal
        visible={teamVisible}
        cycle={selectedCycle}
        onClose={closeTeam}
        onViewDetails={openDetail}
        teamData={teamData}
        myStudentId={MY_STUDENT_ID}
      />

      <ScoreDetailDrawer
        visible={detailVisible}
        cycle={selectedCycle}
        onClose={closeDetail}
        evaluationDetail={myEvaluation}
      />
    </section>
  );
}


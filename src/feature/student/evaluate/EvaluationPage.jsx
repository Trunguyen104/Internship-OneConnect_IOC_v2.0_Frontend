'use client';

import Card from '@/shared/components/Card';
// import Footer from '@/shared/components/Footer';
import CycleTable from './components/CycleTable';
import TeamEvaluationsModal from './components/TeamEvaluationsModal';
import ScoreDetailDrawer from './components/ScoreDetailDrawer';
import { useEvaluation } from './hooks/useEvaluation';
import Pagination from '@/shared/components/Pagination';

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

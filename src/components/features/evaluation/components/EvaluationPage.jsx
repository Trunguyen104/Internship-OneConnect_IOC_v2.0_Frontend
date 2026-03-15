'use client';

import Card from '@/components/ui/Card';
// import Footer from '@/components/layout/Footer';
import CycleTable from './CycleTable';
import TeamEvaluationsModal from './TeamEvaluationsModal';
import ScoreDetailDrawer from './ScoreDetailDrawer';
import { useEvaluation } from '../hooks/useEvaluation';
import { EVALUATION_UI } from '@/constants/evaluation/evaluation';
import Pagination from '@/components/ui/Pagination';
import StudentPageHeader from '@/components/layout/StudentPageHeader';

export default function EvaluationPage() {
  const {
    loading,
    myStudentId,
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

  if (loading && paginated.length === 0) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent'></div>
      </div>
    );
  }

  return (
    <section className='flex flex-col space-y-6'>
      <StudentPageHeader title={EVALUATION_UI.TITLE} />

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
        myStudentId={myStudentId}
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

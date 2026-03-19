'use client';

import { Empty } from 'antd';
import Card from '@/components/ui/card';
import CycleTable from './CycleTable';
import TeamEvaluationsModal from './TeamEvaluationsModal';
import ScoreDetailDrawer from './ScoreDetailDrawer';
import { useEvaluation } from '../hooks/useEvaluation';
import { EVALUATION_UI } from '@/constants/evaluation/evaluation';
import StudentPageHeader from '@/components/layout/StudentPageHeader';

export default function EvaluationPage() {
  const {
    loading,
    myStudentId,
    page,
    pageSize,
    paginated,
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
    <section className='animate-in fade-in flex min-h-0 flex-1 flex-col space-y-6 duration-500'>
      <StudentPageHeader title={EVALUATION_UI.TITLE} />

      <Card className='flex min-h-0 flex-1 flex-col overflow-hidden !p-4 sm:!p-8'>
        {loading && paginated.length === 0 ? (
          <div className='flex h-full items-center justify-center py-20'>
            <div className='border-primary/30 border-t-primary h-8 w-8 animate-spin rounded-full border-4'></div>
          </div>
        ) : paginated.length === 0 ? (
          <div className='flex flex-1 items-center justify-center py-12'>
            <Empty description={EVALUATION_UI.LABELS.NO_DATA} />
          </div>
        ) : (
          <CycleTable
            data={paginated}
            page={page}
            pageSize={pageSize}
            onDetail={openTeamOverview}
          />
        )}
      </Card>

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

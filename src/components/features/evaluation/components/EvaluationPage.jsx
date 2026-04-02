'use client';

import React from 'react';

import { EmptyState } from '@/components/ui/atoms';
import PageLayout from '@/components/ui/pagelayout';
import { EVALUATION_UI } from '@/constants/evaluation/evaluation';

import { useEvaluation } from '../hooks/useEvaluation';
import CycleTable from './CycleTable';
import ScoreDetailDrawer from './ScoreDetailDrawer';
import TeamEvaluationsModal from './TeamEvaluationsModal';

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
    <PageLayout>
      <PageLayout.Header title={EVALUATION_UI.TITLE} subtitle={EVALUATION_UI.SUBTITLE} />

      <PageLayout.Card className="flex flex-col overflow-hidden">
        <PageLayout.Content className="px-0">
          {loading && paginated.length === 0 ? (
            <div className="flex flex-1 items-center justify-center py-20">
              <div className="border-primary/30 border-t-primary h-8 w-8 animate-spin rounded-full border-4" />
            </div>
          ) : paginated.length === 0 ? (
            <div className="flex flex-1 items-center justify-center py-12">
              <EmptyState description={EVALUATION_UI.LABELS.NO_DATA} />
            </div>
          ) : (
            <CycleTable
              data={paginated}
              page={page}
              pageSize={pageSize}
              onDetail={openTeamOverview}
            />
          )}
        </PageLayout.Content>
      </PageLayout.Card>

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
    </PageLayout>
  );
}

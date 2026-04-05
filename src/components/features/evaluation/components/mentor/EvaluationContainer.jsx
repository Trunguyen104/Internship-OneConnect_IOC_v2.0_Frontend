'use client';

import { Empty, Spin } from 'antd';
import React from 'react';

import PageLayout from '@/components/ui/pagelayout';
import { EVALUATION_UI } from '@/constants/evaluation/evaluation';

import useEvaluationGroups from '../../hooks/useEvaluationGroups';
import MentorEvaluationPage from './MentorEvaluationPage';

export default function EvaluationContainer() {
  const { LABELS, MESSAGES } = EVALUATION_UI;
  const [isMounted, setIsMounted] = React.useState(false);
  const {
    phases,
    selectedPhase,
    setSelectedPhase,
    groups,
    selectedGroup,
    setSelectedGroup,
    loading,
  } = useEvaluationGroups();

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (loading && phases.length === 0) {
    return (
      <PageLayout>
        <PageLayout.Card className="flex items-center justify-center py-20">
          <Spin size="large" description={MESSAGES.LOADING} />
        </PageLayout.Card>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {loading && groups.length === 0 ? (
        <PageLayout.Card className="flex flex-col h-96 items-center justify-center gap-4">
          <Spin size="large" />
          <span className="text-sm font-bold text-muted/60 animate-pulse uppercase tracking-widest">
            {MESSAGES.LOADING}
          </span>
        </PageLayout.Card>
      ) : !selectedGroup ? (
        <PageLayout.Card className="flex h-[500px] flex-col items-center justify-center text-center">
          <div className="mb-6 rounded-[32px] bg-gray-50/50 p-10 ring-8 ring-gray-50/20 transition-transform hover:scale-105">
            <Empty description={false} image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
          <h3 className="text-xl font-black text-text mb-2 tracking-tight">
            {phases.length === 0
              ? LABELS.NO_PHASE_ASSIGNED || LABELS.NO_ASSIGNED_GROUP
              : groups.length === 0
                ? LABELS.NO_GROUPS
                : LABELS.SELECT_GROUP_PROMPT}
          </h3>
        </PageLayout.Card>
      ) : (
        <MentorEvaluationPage
          key={`${selectedPhase?.id}-${selectedGroup?.internshipId || selectedGroup?.id}`}
          internshipId={selectedGroup?.internshipId || selectedGroup?.id}
          groupName={selectedGroup?.groupName}
          phaseId={selectedPhase?.id}
          termDates={{
            startDate: selectedPhase?.startDate,
            endDate: selectedPhase?.endDate,
          }}
          phases={phases}
          selectedPhase={selectedPhase}
          setSelectedPhase={setSelectedPhase}
          groups={groups}
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
          loading={loading}
        />
      )}
    </PageLayout>
  );
}

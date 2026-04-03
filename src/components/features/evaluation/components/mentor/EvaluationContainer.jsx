'use client';

import { Empty, Spin } from 'antd';
import React from 'react';

import { EVALUATION_UI } from '@/constants/evaluation/evaluation';

import useEvaluationGroups from '../../hooks/useEvaluationGroups';
import MentorEvaluationPage from './MentorEvaluationPage';

export default function EvaluationContainer() {
  const { LABELS, MESSAGES } = EVALUATION_UI;
  const [isMounted, setIsMounted] = React.useState(false);
  const { terms, selectedTerm, setSelectedTerm, groups, selectedGroup, setSelectedGroup, loading } =
    useEvaluationGroups();

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (loading && terms.length === 0) {
    return (
      <div className="flex h-full items-center justify-center py-20">
        <Spin size="large" description={MESSAGES.LOADING} />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col fade-in">
      <div className="flex-1 min-h-[400px]">
        {loading && groups.length === 0 ? (
          <div className="flex flex-col h-96 items-center justify-center gap-4">
            <Spin size="large" />
            <span className="text-sm font-bold text-muted/60 animate-pulse uppercase tracking-widest">
              {MESSAGES.LOADING}
            </span>
          </div>
        ) : !selectedGroup ? (
          <div className="flex h-[500px] flex-col items-center justify-center rounded-[40px] border border-gray-100 bg-white/50 backdrop-blur-sm p-12 text-center transition-all duration-500 hover:shadow-xl hover:bg-white/80">
            <div className="mb-6 rounded-[32px] bg-gray-50/50 p-10 ring-8 ring-gray-50/20 transition-transform hover:scale-105">
              <Empty description={false} image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
            <h3 className="text-xl font-black text-text mb-2 tracking-tight">
              {terms.length === 0
                ? LABELS.NO_ASSIGNED_GROUP
                : groups.length === 0
                  ? LABELS.NO_GROUPS
                  : LABELS.SELECT_GROUP_PROMPT}
            </h3>
            {/* <p className="text-sm font-medium text-muted/60 max-w-sm">
              {LABELS.SELECT_GROUP_PROMPT_DETAIL}
            </p> */}
          </div>
        ) : (
          <MentorEvaluationPage
            key={`${selectedTerm?.id}-${selectedGroup?.internshipId || selectedGroup?.id}`}
            internshipId={selectedGroup?.internshipId || selectedGroup?.id}
            groupName={selectedGroup?.groupName}
            termId={selectedTerm?.id}
            termDates={{
              startDate: selectedTerm?.startDate,
              endDate: selectedTerm?.endDate,
            }}
            terms={terms}
            selectedTerm={selectedTerm}
            setSelectedTerm={setSelectedTerm}
            groups={groups}
            selectedGroup={selectedGroup}
            setSelectedGroup={setSelectedGroup}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}

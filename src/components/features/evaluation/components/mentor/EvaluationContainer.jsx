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
    <div className="flex flex-1 flex-col space-y-4">
      {/* Main Content Area - Filters move inside MentorEvaluationPage for better layout integration */}
      <div className="flex-1 min-h-[400px]">
        {loading && groups.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <Spin description={MESSAGES.LOADING} />
          </div>
        ) : !selectedGroup ? (
          <div className="flex h-96 flex-col items-center justify-center rounded-xl border-2 border-dashed bg-gray-50/20 p-12 text-center">
            <Empty
              description={
                terms.length === 0
                  ? LABELS.NO_ASSIGNED_GROUP
                  : groups.length === 0
                    ? LABELS.NO_GROUPS
                    : LABELS.SELECT_GROUP_PROMPT
              }
            />
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
            // Filters
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

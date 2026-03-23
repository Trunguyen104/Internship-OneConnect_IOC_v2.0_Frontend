'use client';

import { Empty, Select, Spin } from 'antd';
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
      {/* SaaS Filter Bar - Always show if terms exist */}
      <div className="flex items-center gap-6 rounded-xl border bg-white p-4 shadow-sm">
        {/* Term Select */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
            {LABELS.TERM}
          </span>
          <Select
            className="w-52"
            size="middle"
            value={selectedTerm?.id}
            onChange={(val) => setSelectedTerm(terms.find((t) => t.id === val))}
            options={terms.map((t) => ({
              label: t.name,
              value: t.id,
            }))}
            placeholder={LABELS.SELECT_TERM_PLACEHOLDER}
          />
        </div>

        {/* Group Select */}
        <div className="flex items-center gap-3 border-l pl-6">
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
            {LABELS.GROUP}
          </span>
          <Select
            className="w-72"
            size="middle"
            value={selectedGroup?.internshipId}
            onChange={(val) => setSelectedGroup(groups.find((g) => g.internshipId === val))}
            options={groups.map((g) => ({
              label: g.groupName,
              value: g.internshipId,
            }))}
            placeholder={LABELS.SELECT_GROUP_PLACEHOLDER}
            disabled={groups.length === 0}
            loading={loading && groups.length > 0}
          />
        </div>

        {loading && <Spin size="small" className="ml-2" />}
      </div>

      {/* Main Content Area */}
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
            key={`${selectedTerm?.id}-${selectedGroup.internshipId}`}
            internshipId={selectedGroup.internshipId}
            groupName={selectedGroup.groupName}
            termId={selectedGroup.termId}
            termDates={{
              startDate: selectedTerm?.startDate,
              endDate: selectedTerm?.endDate,
            }}
          />
        )}
      </div>
    </div>
  );
}

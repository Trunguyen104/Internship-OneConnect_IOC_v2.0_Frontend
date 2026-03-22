'use client';

import { Empty, Select, Spin } from 'antd';
import React from 'react';

import MentorEvaluationPage from '@/components/features/evaluation/components/mentor/MentorEvaluationPage';
import { useEvaluationGroups } from '@/components/features/evaluation/hooks/useEvaluationGroups';
import Card from '@/components/ui/card';
import { EVALUATION_UI } from '@/constants/evaluation/evaluation';

export default function EvaluationEntry() {
  const { LABELS, MESSAGES } = EVALUATION_UI;
  const { groups, selectedGroup, loading, handleSelectGroup } = useEvaluationGroups();

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center py-20">
        <Spin size="large" tip={MESSAGES.LOADING} />
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-12">
        <Card className="w-full max-w-lg space-y-4 p-12 text-center">
          <Empty description={LABELS.NO_ASSIGNED_GROUP} />
        </Card>
      </div>
    );
  }

  // Map groups to Select options, ensuring correct property names
  const groupOptions = groups.map((g) => ({
    label:
      g.groupName ||
      g.GroupName ||
      g.name ||
      `Internship Group ${g.internshipId?.slice(0, 8) || ''}`,
    value: g.internshipId || g.id,
  }));

  const selectedGroupId = selectedGroup?.internshipId || selectedGroup?.id;
  const selectedGroupName =
    selectedGroup?.groupName || selectedGroup?.GroupName || selectedGroup?.name;

  return (
    <div className="flex flex-1 flex-col space-y-4">
      {groups.length > 1 && (
        <div className="flex items-center gap-4 rounded-xl border bg-white p-4">
          <span className="text-sm font-semibold">{LABELS.CHOOSE_GROUP}</span>
          <Select
            className="w-64"
            value={selectedGroupId}
            onChange={handleSelectGroup}
            options={groupOptions}
            placeholder={LABELS.CHOOSE_GROUP}
          />
        </div>
      )}

      {selectedGroup && (
        <MentorEvaluationPage
          key={selectedGroupId}
          internshipId={selectedGroupId}
          groupName={selectedGroupName}
          termId={selectedGroup.termId}
          termDates={{
            startDate: selectedGroup.startDate,
            endDate: selectedGroup.endDate,
          }}
        />
      )}
    </div>
  );
}

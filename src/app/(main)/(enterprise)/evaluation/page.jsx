'use client';

import { Empty, Select, Spin } from 'antd';
import React, { useEffect, useState } from 'react';

import MentorEvaluationPage from '@/components/features/evaluation/components/mentor/MentorEvaluationPage';
import { InternshipGroupService } from '@/components/features/internship/services/internshipGroup.service';
import Card from '@/components/ui/card';
import { EVALUATION_UI } from '@/constants/evaluation/evaluation';

export default function EvaluationEntry() {
  const { LABELS, MESSAGES } = EVALUATION_UI;
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const res = await InternshipGroupService.getAll();
        const items = res?.data?.items || res?.data || [];
        setGroups(items);
        if (items.length > 0) {
          setSelectedGroup(items[0]);
        }
      } catch (error) {
        console.error('Error fetching groups:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

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

  return (
    <div className="flex flex-1 flex-col space-y-4">
      {groups.length > 1 && (
        <div className="flex items-center gap-4 rounded-xl border bg-white p-4">
          <span className="text-sm font-semibold">{LABELS.CHOOSE_GROUP}</span>
          <Select
            className="w-64"
            value={selectedGroup?.internshipId || selectedGroup?.id}
            onChange={(val) =>
              setSelectedGroup(groups.find((g) => (g.internshipId || g.id) === val))
            }
            options={groups.map((g) => ({ label: g.name, value: g.internshipId || g.id }))}
          />
        </div>
      )}

      {selectedGroup && (
        <MentorEvaluationPage
          internshipId={selectedGroup.internshipId || selectedGroup.id}
          termId={selectedGroup.termId}
        />
      )}
    </div>
  );
}

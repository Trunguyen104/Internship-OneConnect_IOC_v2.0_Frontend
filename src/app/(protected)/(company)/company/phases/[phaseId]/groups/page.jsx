'use client';

import { TeamOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import React from 'react';

import InternPhaseGroupTab from '@/components/features/intern-phase-management/components/InternPhaseGroupTab';
import { InternPhaseService } from '@/components/features/intern-phase-management/services/intern-phase.service';

const COPY = {
  TITLE: 'Internship Groups',
  SUB: 'All internship groups assigned within this phase.',
};

export default function PhaseGroupsPage() {
  const { phaseId } = useParams();

  const { data: groups, isLoading } = useQuery({
    queryKey: ['phase-groups', phaseId],
    queryFn: () => InternPhaseService.getGroups(phaseId),
    enabled: !!phaseId,
  });

  return (
    <div className="flex-1 overflow-auto p-4 2xl:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-sm">
            <TeamOutlined className="text-2xl" />
          </div>
          <div>
            <h1 className="mb-0.5 text-2xl font-black tracking-tight text-slate-800">
              {COPY.TITLE}
            </h1>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{COPY.SUB}</p>
          </div>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <InternPhaseGroupTab data={groups?.items || groups?.data?.items} loading={isLoading} />
      </div>
    </div>
  );
}

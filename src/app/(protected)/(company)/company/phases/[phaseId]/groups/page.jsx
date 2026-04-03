'use client';

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
    <div className="flex-1 overflow-auto p-4 2xl:p-8 flex flex-col">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm flex-1 flex flex-col">
        <InternPhaseGroupTab
          data={groups?.items || groups?.data?.items || (Array.isArray(groups) ? groups : [])}
          loading={isLoading}
        />
      </div>
    </div>
  );
}

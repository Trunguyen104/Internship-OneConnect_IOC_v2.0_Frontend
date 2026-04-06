'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import React from 'react';

import InternPhaseGroupTab from '@/components/features/intern-phase-management/components/InternPhaseGroupTab';
import { InternPhaseService } from '@/components/features/intern-phase-management/services/intern-phase.service';
import PageLayout from '@/components/ui/pagelayout';
import { INTERN_PHASE_MANAGEMENT } from '@/constants/intern-phase-management/intern-phase';

export default function PhaseGroupsPage() {
  const { phaseId } = useParams();
  const { DETAILS } = INTERN_PHASE_MANAGEMENT;

  const COPY = {
    TITLE: DETAILS.TABS.GROUPS,
    SUB: DETAILS.METADATA.TITLE,
  };

  // Cấu hình Header cho trang danh sách nhóm thực tập
  const COPY = {
    TITLE: 'Internship Groups',
    SUB: INTERN_PHASE_MANAGEMENT.DETAILS.METADATA.TITLE,
  };

  const { data: groups, isLoading } = useQuery({
    queryKey: ['phase-groups', phaseId],
    queryFn: () => InternPhaseService.getGroups(phaseId),
    enabled: !!phaseId,
  });

  return (
    <PageLayout>
      <PageLayout.Header title={COPY.TITLE} subtitle={COPY.SUB} />
      <PageLayout.Card className="flex flex-col overflow-hidden p-6 py-4">
        <PageLayout.Content className="flex flex-col max-h-[450px] overflow-hidden px-0">
          <InternPhaseGroupTab
            data={groups?.items || groups?.data?.items || (Array.isArray(groups) ? groups : [])}
            loading={isLoading}
          />
        </PageLayout.Content>
      </PageLayout.Card>
    </PageLayout>
  );
}

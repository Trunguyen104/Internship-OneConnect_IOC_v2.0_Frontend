'use client';

import { Empty, Skeleton } from 'antd';
import React, { useEffect, useState } from 'react';

import { INTERNSHIP_UI } from '@/constants/internship-management/internship';
import { useToast } from '@/providers/ToastProvider';

import InternshipCard from './components/InternshipCard';
import { INTERNSHIP_STATUS } from './constants/internshipStatus.js';
import { InternshipGroupService } from './services/internship-group.service';

const InternshipDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [internships, setInternships] = useState([]);

  const toast = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [phasesResponse, groupsResponse] = await Promise.all([
          InternshipGroupService.getMyPhases(),
          InternshipGroupService.getMyGroups(),
        ]);

        const phases = phasesResponse?.data?.items || phasesResponse?.data || [];
        const groups = groupsResponse?.data?.items || groupsResponse?.data || [];

        const enrichedInternships = phases.map((phase, index) => {
          const group = groups.find((g) => g.phaseId === phase.phaseId);
          const clientKey = phase.phaseId ?? `phase-${index}`;

          return {
            id: group?.internshipGroupId || group?.id || phase.phaseId,
            phaseId: phase.phaseId,
            clientKey,
            displayName: phase.name || phase.phaseName,
            groupName: group?.groupName || group?.projectName || phase.name || phase.phaseName,
            status: phase.status,
            isPlaced: !!group,
            enterpriseName: group?.enterpriseName || phase.enterpriseName,
            mentorName: group?.mentorName || group?.mentor?.fullName,
            projectName: group?.projectName,
            journeyStep: group?.journeyStep || 0,
            startDate: group?.startDate || phase.startDate,
            endDate: group?.endDate || phase.endDate,
          };
        });

        setInternships(enrichedInternships);
      } catch (error) {
        toast.error('Error', INTERNSHIP_UI.MESSAGES.ERROR_FETCH);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-5xl space-y-6 py-2">
        {[1].map((i) => (
          <div key={i} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <Skeleton active avatar paragraph={{ rows: 4 }} />
          </div>
        ))}
      </div>
    );
  }

  if (internships.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <Empty description={INTERNSHIP_UI.LABELS.NO_DATA} />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <header className="border-b border-gray-100 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
          {INTERNSHIP_UI.TITLE.replace(INTERNSHIP_UI.JOURNEY_HIGHLIGHT, '')}
          <span className="text-primary">{INTERNSHIP_UI.JOURNEY_HIGHLIGHT}</span>
        </h1>
        <p className="text-muted mt-2 text-sm font-medium leading-relaxed sm:text-base">
          {INTERNSHIP_UI.SUBTITLE}
        </p>
      </header>

      <div className="flex flex-col gap-6">
        {internships.map((item) => (
          <InternshipCard key={item.clientKey ?? item.id} data={item}>
            <InternshipCard.Header
              title={item.displayName}
              isCurrent={item.status === INTERNSHIP_STATUS.IN_PROGRESS}
            />
            <InternshipCard.Stepper />

            <InternshipCard.BodyTitle
              title={item.groupName}
              href={`/internship-groups/${item.id}/space`}
            />

            <InternshipCard.Info
              enterprise={item.enterpriseName}
              mentor={item.mentorName}
              project={item.projectName}
            />
          </InternshipCard>
        ))}
      </div>
    </div>
  );
};

export default InternshipDashboard;

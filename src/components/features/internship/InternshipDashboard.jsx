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

        const termsResponse = await InternshipGroupService.getMyTerms();

        const isSuccess = termsResponse?.success === true || termsResponse?.isSuccess === true;
        if (!termsResponse || !isSuccess || !termsResponse.data) {
          setInternships([]);
          return;
        }

        const termsData = termsResponse.data || [];
        const enrichedInternships = termsData.map((termItem, index) => {
          const clientKey = termItem.termId ?? `internship-${index}`;

          return {
            id: termItem.internshipGroupId || termItem.termId,
            termId: termItem.termId,
            clientKey,
            displayName: termItem.termName,
            groupName: termItem.projectName || termItem.termName,
            status: termItem.status, // TermDisplayStatus (1: Upcoming, 2: Active, 3: Ended, 4: Closed)
            enrollmentStatus: termItem.enrollmentStatus,
            placementStatus: termItem.placementStatus,
            isPlaced: termItem.isPlaced,
            enterpriseName: termItem.enterpriseName,
            mentorName: termItem.mentorName,
            projectName: termItem.projectName,
            journeyStep: termItem.journeyStep,
            startDate: termItem.startDate,
            endDate: termItem.endDate,
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
      <div className="mx-auto max-w-5xl space-y-8 p-8">
        {[1].map((i) => (
          <div key={i} className="bg-surface rounded-3xl p-6 shadow-sm">
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
    <div className="mx-auto max-w-5xl space-y-12 px-6 py-16">
      <header className="mb-12">
        <h1 className="text-text text-4xl font-black tracking-tight sm:text-5xl">
          {INTERNSHIP_UI.TITLE.replace(INTERNSHIP_UI.JOURNEY_HIGHLIGHT, '')}
          <span className="text-primary italic">{INTERNSHIP_UI.JOURNEY_HIGHLIGHT}</span>
        </h1>
        <p className="text-muted mt-4 text-lg font-medium leading-relaxed">
          {INTERNSHIP_UI.SUBTITLE}
        </p>
      </header>

      <div className="flex flex-col gap-8">
        {internships.map((item) => (
          <InternshipCard key={item.clientKey ?? item.id} data={item}>
            <InternshipCard.Header
              title={item.displayName}
              isCurrent={item.status === INTERNSHIP_STATUS.ACTIVE}
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

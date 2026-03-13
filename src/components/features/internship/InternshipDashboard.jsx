'use client';

import React, { useEffect, useState } from 'react';
import { Skeleton, Empty, notification } from 'antd';
import { InternshipGroupService } from './services/internshipGroup.service';
import InternshipCard from './components/InternshipCard';
import { INTERNSHIP_STATUS } from './constants/internshipStatus.js';

const TEXT = {
  DIAGNOSTIC_MSG: '--- InternshipDashboard (Direct Term Mapping) ---',
  LOADING_FALLBACK: 'Internship Cycle',
  ERROR_FETCH: 'An unexpected error occurred while fetching dashboard data.',
  NO_DATA: 'No internship placement found',
  JOURNEY_TITLE: 'My Internship Journey',
  JOURNEY_SUBTITLE: 'Track your progress and manage your internship placement in one place.',
  JOURNEY_HIGHLIGHT: 'Journey',
};

const InternshipDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [internships, setInternships] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        console.log(TEXT.DIAGNOSTIC_MSG);

        // 1. Fetch from /mine
        const mineResponse = await InternshipGroupService.getMine();
        console.log('Mine API Response:', mineResponse);

        if (!mineResponse || mineResponse.success !== true || !mineResponse.data) {
          setInternships([]);
          return;
        }

        const mineDataList = mineResponse.data;
        const enrichedInternships = await Promise.all(mineDataList.map(async (mineItem) => {
          let termStatus = 1; // Default to Active (1)

          // MAP DATA:
          // termName -> Cycle name (e.g., "Spring 2026")
          // groupName -> Group name (e.g., "Nhóm OJT .NET...")
          let termName = mineItem.term?.name || TEXT.LOADING_FALLBACK;
          let groupName = mineItem.name;

          // 2. Fetch Term Details for state/status (Source of Truth)
          const targetTermId = mineItem.termId || mineItem.term?.id;

          if (targetTermId) {
            try {
              const termRes = await InternshipGroupService.getTermById(targetTermId);
              if (termRes && (termRes.success || termRes.isSuccess !== false)) {
                const termData = termRes.data || termRes;
                // termStatus Enum: 0: Upcoming, 1: Active, 2: Ended, 3: Closed
                termStatus = termData.status ?? 1;
                termName = termData.name || termName;
                console.log(`Resolved Term Status for ${termName}:`, termStatus);
              }
            } catch (err) {
              console.warn('Failed to fetch term status:', err);
            }
          }

          return {
            id: mineItem.id,
            displayName: termName,
            groupName: groupName,
            status: termStatus,
            enterpriseName: mineItem.enterprise?.name,
            mentorName: mineItem.mentors?.[0]?.fullName,
            projectName: mineItem.project?.name || mineItem.name
          };
        }));

        setInternships(enrichedInternships);
      } catch (error) {
        console.error('Dashboard Fetch Error:', error);
        notification.error({
          message: 'Error',
          description: TEXT.ERROR_FETCH,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-8 p-8">
        {[1].map((i) => (
          <div key={i} className="rounded-3xl bg-white p-6 shadow-sm">
            <Skeleton active avatar paragraph={{ rows: 4 }} />
          </div>
        ))}
      </div>
    );
  }

  if (internships.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <Empty description={TEXT.NO_DATA} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-6 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">
          My Internship <span className="text-primary italic">{TEXT.JOURNEY_HIGHLIGHT}</span>
        </h1>
        <p className="mt-2 text-slate-500 font-medium">
          {TEXT.JOURNEY_SUBTITLE}
        </p>
      </header>

      <div className="flex flex-col gap-8">
        {internships.map((item) => (
          <InternshipCard
            key={item.id}
            data={item}
          >
            <InternshipCard.Header
              title={item.displayName}
              isCurrent={item.status === INTERNSHIP_STATUS.ACTIVE}
            />
            <InternshipCard.Stepper />

            <InternshipCard.BodyTitle
              title={item.groupName}
            />

            <InternshipCard.Info
              enterprise={item.enterpriseName}
              mentor={item.mentorName}
              project={item.projectName}
            />
            <InternshipCard.Action
              onDetailClick={() => {
                notification.info({
                  message: 'Coming Soon',
                  description: 'The Detailed Training Plan view is currently under development.',
                });
              }}
            />
          </InternshipCard>
        ))}
      </div>
    </div>
  );
};

export default InternshipDashboard;

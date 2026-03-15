'use client';

import React, { useEffect, useState } from 'react';
import { Skeleton, Empty, notification } from 'antd';
import { INTERNSHIP_UI } from '@/constants/internship-management/internship';
import { InternshipGroupService } from './services/internshipGroup.service';
import InternshipCard from './components/InternshipCard';
import { INTERNSHIP_STATUS } from './constants/internshipStatus.js';

const InternshipDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [internships, setInternships] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        console.log(INTERNSHIP_UI.MESSAGES.FETCHING_JOURNEY);

        const mineResponse = await InternshipGroupService.getMine();

        if (!mineResponse || mineResponse.success !== true || !mineResponse.data) {
          setInternships([]);
          return;
        }

        const mineDataList = mineResponse.data;
        const enrichedInternships = await Promise.all(
          mineDataList.map(async (mineItem) => {
            let termStatus = 1; // Default to Active (1)

            let termName = mineItem.term?.name || INTERNSHIP_UI.LABELS.FALLBACK_CYCLE;
            let groupName = mineItem.name;

            const targetTermId = mineItem.termId || mineItem.term?.id;

            if (targetTermId) {
              try {
                const termRes = await InternshipGroupService.getTermById(targetTermId);
                if (termRes && (termRes.success || termRes.isSuccess !== false)) {
                  const termData = termRes.data || termRes;
                  termStatus = termData.status ?? 1;
                  termName = termData.name || termName;
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
              projectName: mineItem.project?.name || mineItem.name,
            };
          }),
        );

        setInternships(enrichedInternships);
      } catch (error) {
        console.error('Dashboard Fetch Error:', error);
        notification.error({
          message: 'Lỗi',
          description: INTERNSHIP_UI.MESSAGES.ERROR_FETCH,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className='mx-auto max-w-5xl space-y-8 p-8'>
        {[1].map((i) => (
          <div key={i} className='bg-surface rounded-3xl p-6 shadow-sm'>
            <Skeleton active avatar paragraph={{ rows: 4 }} />
          </div>
        ))}
      </div>
    );
  }

  if (internships.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center p-20'>
        <Empty description={INTERNSHIP_UI.LABELS.NO_DATA} />
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-5xl space-y-8 px-6 py-12'>
      <header className='mb-10'>
        <h1 className='text-text text-3xl font-black tracking-tight'>
          {INTERNSHIP_UI.TITLE.replace(INTERNSHIP_UI.JOURNEY_HIGHLIGHT, '')}
          <span className='text-primary italic'>{INTERNSHIP_UI.JOURNEY_HIGHLIGHT}</span>
        </h1>
        <p className='text-muted mt-2 font-medium'>{INTERNSHIP_UI.SUBTITLE}</p>
      </header>

      <div className='flex flex-col gap-8'>
        {internships.map((item) => (
          <InternshipCard key={item.id} data={item}>
            <InternshipCard.Header
              title={item.displayName}
              isCurrent={item.status === INTERNSHIP_STATUS.ACTIVE}
            />
            <InternshipCard.Stepper />

            <InternshipCard.BodyTitle title={item.groupName} />

            <InternshipCard.Info
              enterprise={item.enterpriseName}
              mentor={item.mentorName}
              project={item.projectName}
            />
            <InternshipCard.Action
              onDetailClick={() => {
                notification.info({
                  message: INTERNSHIP_UI.LABELS.COMING_SOON,
                  description: INTERNSHIP_UI.LABELS.COMING_SOON_DESC,
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

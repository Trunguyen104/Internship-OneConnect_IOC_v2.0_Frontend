'use client';

import { Empty, Skeleton } from 'antd';
import React, { useEffect, useState } from 'react';

import { INTERNSHIP_UI } from '@/constants/internship-management/internship';
import { UI_TEXT } from '@/lib/UI_Text';
import { useToast } from '@/providers/ToastProvider';

import InternshipCard from './components/InternshipCard';
import { mineService } from './services/mine.service';

const InternshipDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [contextData, setContextData] = useState(null);

  const toast = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const response = await mineService.getMyContext();
        const data = response?.data;

        setContextData(data);
      } catch (_error) {
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

  if (!contextData || (!contextData.currentTerm && !contextData.internship)) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <Empty description={INTERNSHIP_UI.LABELS.NO_DATA} />
      </div>
    );
  }

  // Map the new context data to the format expected by the UI.
  const { currentTerm, internship, university, studentInfo } = contextData;
  const isPlaced = !!internship?.group;

  // Calculate a basic journey step based on data presence
  let journeyStep = 1;
  if (currentTerm?.enrollmentStatus === 'Enrolled') journeyStep = 2;
  if (internship?.enterprise) journeyStep = 3;
  if (isPlaced) journeyStep = 4;

  const mappedInternship = {
    id: internship?.group?.groupId || currentTerm?.termId,
    clientKey: currentTerm?.termId || 'context',
    displayName: currentTerm?.termName || 'Current Term',
    groupName: internship?.group?.groupName || 'No Group Assigned',
    status: currentTerm?.status,
    isPlaced: isPlaced,
    enterpriseName: internship?.enterprise?.name || 'No Enterprise',
    mentorName: internship?.mentor?.name || 'No Mentor',
    projectName: internship?.project?.name || 'No Project',
    journeyStep: journeyStep,
    startDate: currentTerm?.startDate,
    endDate: currentTerm?.endDate,
  };

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
        {/* Render University and Student context header info if needed */}
        <div className="mb-4 text-sm text-slate-500">
          <strong>
            {UI_TEXT.INTERNSHIP.UNIVERSITY_PREFIX}
            {UI_TEXT.COMMON.COLON}
          </strong>{' '}
          {university?.name} {UI_TEXT.COMMON.BAR}{' '}
          <strong>
            {UI_TEXT.INTERNSHIP.CLASS_PREFIX}
            {UI_TEXT.COMMON.COLON}
          </strong>{' '}
          {studentInfo?.className} {UI_TEXT.COMMON.BAR}{' '}
          <strong>
            {UI_TEXT.INTERNSHIP.MAJOR_PREFIX}
            {UI_TEXT.COMMON.COLON}
          </strong>{' '}
          {studentInfo?.major}
        </div>

        <InternshipCard data={mappedInternship}>
          <InternshipCard.Header
            title={mappedInternship.displayName}
            isCurrent={mappedInternship.status === 'Active'}
          />
          <InternshipCard.Stepper />

          <InternshipCard.BodyTitle
            title={mappedInternship.groupName}
            href={`/internship-groups/${mappedInternship.id}/space`}
          />

          <InternshipCard.Info
            enterprise={mappedInternship.enterpriseName}
            mentor={mappedInternship.mentorName}
            project={mappedInternship.projectName}
          />
        </InternshipCard>
      </div>
    </div>
  );
};

export default InternshipDashboard;

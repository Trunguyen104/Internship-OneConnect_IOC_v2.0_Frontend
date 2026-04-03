'use client';

import { Skeleton } from 'antd';
import React, { useEffect, useState } from 'react';

import { userService } from '@/components/features/user/services/user.service';
import { APPLICATION_STATUS } from '@/constants/applications/application.constants';
import { INTERNSHIP_UI } from '@/constants/internship-management/internship';
import { useToast } from '@/providers/ToastProvider';

import { ApplicationService } from '../applications/services/application.service';
import InternshipCard from './components/InternshipCard';
import {
  ApplicationStatusCard,
  CVUploadBanner,
  PlacementInfoCard,
  SearchJobsCTA,
  StudentEmptyState,
} from './components/StudentStatusComponents';
import { InternshipGroupService } from './services/internship-group.service';

const InternshipDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    phases: [],
    groups: [],
    studentApps: [],
    userInfo: null,
  });

  const toast = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [phasesResponse, groupsResponse, studentAppsRes, userRes] = await Promise.all([
          InternshipGroupService.getMyPhases(),
          InternshipGroupService.getMyGroups(),
          ApplicationService.getStudentApplications(),
          userService.getMe(),
        ]);

        const extractArray = (res) => {
          if (Array.isArray(res)) return res;
          if (Array.isArray(res?.items)) return res.items;
          if (Array.isArray(res?.data?.items)) return res.data.items;
          if (Array.isArray(res?.data)) return res.data;
          return [];
        };

        setData({
          phases: extractArray(phasesResponse),
          groups: extractArray(groupsResponse),
          studentApps: extractArray(studentAppsRes),
          userInfo: userRes?.data || userRes,
        });
      } catch (error) {
        console.error('Dashboard error:', error);
        toast.error('Error', INTERNSHIP_UI.MESSAGES.ERROR_FETCH);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-8 py-10">
        <Skeleton
          active
          avatar
          paragraph={{ rows: 4 }}
          className="rounded-[40px] border border-slate-100 bg-white p-10"
        />
        <Skeleton
          active
          paragraph={{ rows: 3 }}
          className="rounded-[40px] border border-slate-100 bg-white p-10"
        />
      </div>
    );
  }

  const { phases, groups, studentApps, userInfo } = data;

  const isEnrolled = phases.length > 0 || studentApps.length > 0;
  const hasCv = !!(userInfo?.cvUrl || userInfo?.cvLocalPath);

  const activeApp = studentApps.find((a) => {
    const s = String(a.status);
    return (
      s === String(APPLICATION_STATUS.APPLIED) ||
      s === String(APPLICATION_STATUS.INTERVIEWING) ||
      s === String(APPLICATION_STATUS.OFFERED) ||
      s === String(APPLICATION_STATUS.PENDING_ASSIGNMENT)
    );
  });

  const placedApp = studentApps.find((a) => String(a.status) === String(APPLICATION_STATUS.PLACED));
  const hasGroup = groups.length > 0;
  const isPlacedButNoGroup = placedApp && !hasGroup;

  if (!isEnrolled) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-8 px-6 py-12">
        <StudentEmptyState />
        {!hasCv && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <CVUploadBanner variant="prepare" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-12 px-6 py-12">
      <header className="relative">
        <div className="absolute -left-12 top-0 h-24 w-1 bg-indigo-600 rounded-full hidden lg:block" />
        <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-[1.1]">
          {INTERNSHIP_UI.TITLE.replace(INTERNSHIP_UI.JOURNEY_HIGHLIGHT, '')}
          <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
            {INTERNSHIP_UI.JOURNEY_HIGHLIGHT}
          </span>
        </h1>
        <p className="mt-3 text-base font-bold text-slate-400 max-w-2xl">
          {INTERNSHIP_UI.SUBTITLE}
        </p>
      </header>

      <div className="flex flex-col gap-10">
        {/* Term Section */}
        {phases.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
                {INTERNSHIP_UI.SECTIONS.CURRENT_PHASE}
              </h2>
              <div className="h-px flex-1 bg-slate-100" />
            </div>
            <div className="space-y-6">
              {phases.map((phase, index) => {
                const phaseId = phase.id || phase.internshipPhaseId;
                const group = groups.find((g) => (g.internshipPhaseId || g.phaseId) === phaseId);
                return (
                  <InternshipCard
                    key={phaseId || `phase-${index}`}
                    data={{
                      ...phase,
                      displayName: phase.name || phase.phaseName,
                      groupName: group?.groupName || phase.name,
                      isPlaced: !!group,
                      journeyStep: group ? 4 : activeApp ? 2 : 0,
                    }}
                  >
                    <InternshipCard.Header
                      title={phase.name || phase.phaseName}
                      isCurrent={phase.status === 'InProgress'}
                    />
                    <InternshipCard.Stepper />
                  </InternshipCard>
                );
              })}
            </div>
          </section>
        )}

        {/* Dynamic Status Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
              {INTERNSHIP_UI.SECTIONS.ACTION_CENTER}
            </h2>
            <div className="h-px flex-1 bg-slate-100" />
          </div>

          <div className="grid grid-cols-1 gap-8">
            {!hasCv && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <CVUploadBanner variant="urgent" />
              </div>
            )}

            {!hasGroup && activeApp && (
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-600">
                <ApplicationStatusCard app={activeApp} />
              </div>
            )}

            {isPlacedButNoGroup && (
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-600">
                <PlacementInfoCard enterpriseName={placedApp.enterpriseName} />
              </div>
            )}

            {!hasGroup && !activeApp && !placedApp && hasCv && (
              <div className="animate-in zoom-in duration-700">
                <SearchJobsCTA />
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default InternshipDashboard;

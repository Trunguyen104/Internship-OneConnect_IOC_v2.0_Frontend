'use client';

import { Skeleton } from 'antd';
import { useRouter } from 'next/navigation';
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
import { SELF_APPLY_STEPS, UNI_ASSIGN_STEPS } from './constants/internshipStatus';
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
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const results = await Promise.allSettled([
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

        const phasesResponse = results[0].status === 'fulfilled' ? results[0].value : [];
        const groupsResponse = results[1].status === 'fulfilled' ? results[1].value : [];
        const studentAppsRes = results[2].status === 'fulfilled' ? results[2].value : [];
        const userRes = results[3].status === 'fulfilled' ? results[3].value : null;

        console.log('Dashboard data:', {
          phases: extractArray(phasesResponse),
          groups: extractArray(groupsResponse),
          apps: extractArray(studentAppsRes),
        });

        setData({
          phases: extractArray(phasesResponse),
          groups: extractArray(groupsResponse),
          studentApps: extractArray(studentAppsRes),
          userInfo: userRes?.data || userRes,
        });

        if (results.some((r) => r.status === 'rejected')) {
          const rejected = results
            .map((r, i) => (r.status === 'rejected' ? i : -1))
            .filter((i) => i !== -1);
          console.warn('Dashboard partially failed to load:', rejected);
        }
      } catch (error) {
        console.error('Dashboard fatal error:', error);
        toast.error('Error', INTERNSHIP_UI.MESSAGES.ERROR_FETCH);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <div className="absolute -left-12 top-0 h-24 w-1 bg-primary rounded-full hidden lg:block" />
        <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-[1.1]">
          {INTERNSHIP_UI.TITLE.replace(INTERNSHIP_UI.JOURNEY_HIGHLIGHT, '')}
          <span className="bg-gradient-to-r from-primary to-rose-500 bg-clip-text text-transparent">
            {userInfo?.fullName || userInfo?.FullName || INTERNSHIP_UI.JOURNEY_HIGHLIGHT}
          </span>
        </h1>
        <p className="mt-3 text-base font-bold text-slate-400 max-w-2xl">
          {INTERNSHIP_UI.SUBTITLE}
        </p>
      </header>

      <div className="flex flex-col gap-10">
        {/* Term Section */}
        {(() => {
          const extractPhaseId = (p) =>
            String(p.internshipPhaseId || p.phaseId || p.internshipId || p.id || '');

          // Consolidate phases from explicit phases and applications
          const seenPhaseIds = new Set(phases.map((p) => extractPhaseId(p)).filter(Boolean));
          const allPhases = [...phases];

          studentApps.forEach((app) => {
            // Only add phase from application if it's active/placed and not already in the list
            const statusVal = parseInt(app.status, 10);
            const isActiveStatus = [
              APPLICATION_STATUS.APPLIED,
              APPLICATION_STATUS.INTERVIEWING,
              APPLICATION_STATUS.OFFERED,
              APPLICATION_STATUS.PENDING_ASSIGNMENT,
              APPLICATION_STATUS.PLACED,
            ].some((s) => String(s) === String(statusVal));

            if (!isActiveStatus) return;

            const phaseIdCandidate = extractPhaseId(app);
            if (phaseIdCandidate && !seenPhaseIds.has(phaseIdCandidate)) {
              seenPhaseIds.add(phaseIdCandidate);
              allPhases.push({
                id: phaseIdCandidate,
                name:
                  app.internPhaseName ||
                  app.phaseName ||
                  app.internshipPhase?.name ||
                  'Active Internship',
                status: app.internshipPhase?.status || 'InProgress',
              });
            }
          });

          if (allPhases.length === 0) return null;

          // NEW LOGIC: If there are multiple phases, but some have groups and some don't,
          // prioritize the ones with groups to prevent duplicate "ghost" cards from old applications.
          const phasesWithGroupMeta = allPhases.map((phase) => {
            const currentPhaseId = extractPhaseId(phase);
            const hasGroupAssign = groups.some((g) => {
              const gid = extractPhaseId(g);
              return gid && (gid === currentPhaseId || currentPhaseId === 'fallback-stage');
            });

            // Also check if any application for this phase already has a groupName
            const hasAppGroup = studentApps.some((a) => {
              const aid = extractPhaseId(a);
              return aid === currentPhaseId && (a.groupName || a.internshipGroupId);
            });

            return { ...phase, hasActualGroup: hasGroupAssign || hasAppGroup };
          });

          const someHaveGroups = phasesWithGroupMeta.some((p) => p.hasActualGroup);
          const rawPhasesToRender = someHaveGroups
            ? phasesWithGroupMeta.filter((p) => p.hasActualGroup)
            : phasesWithGroupMeta;

          // ULTIMATE DEDUP: Ensure each unique ID only appears once in the final list
          const finalPhasesToRender = [];
          const dedupSet = new Set();
          rawPhasesToRender.forEach((p) => {
            const pid = extractPhaseId(p);
            if (pid && !dedupSet.has(pid)) {
              dedupSet.add(pid);
              finalPhasesToRender.push(p);
            } else if (!pid) {
              finalPhasesToRender.push(p);
            }
          });

          return (
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
                  {INTERNSHIP_UI.SECTIONS.CURRENT_PHASE}
                </h2>
                <div className="h-px flex-1 bg-slate-100" />
              </div>
              <div className="space-y-6">
                {finalPhasesToRender.map((phase, index) => {
                  const currentPhaseId = String(phase.id || phase.phaseId || '');

                  const groupFromService = groups.find((g) => {
                    const gid = String(
                      g.internshipPhaseId || g.phaseId || g.internshipGroupId || g.id || ''
                    );
                    const pid = String(phase.internshipPhaseId || phase.phaseId || phase.id || '');
                    return (gid && pid && gid === pid) || currentPhaseId === 'fallback-stage';
                  });

                  const appForPhase = studentApps.find((a) => {
                    if (currentPhaseId === 'fallback-stage') return true;
                    const aid = String(a.internshipPhaseId || a.phaseId || a.id || '');
                    const pid = String(phase.internshipPhaseId || phase.phaseId || phase.id || '');
                    return (aid && pid && aid === pid) || (aid && aid === currentPhaseId);
                  });

                  // Prioritize explicit group object, then application with group data
                  const group =
                    groupFromService ||
                    (appForPhase?.groupName || appForPhase?.internshipGroupId ? appForPhase : null);

                  // Calculate Journey Step and Choose Stepper configuration
                  const isUniAssign =
                    appForPhase?.applicationSource === 2 ||
                    appForPhase?.source === 2 ||
                    appForPhase?.sourceLabel === 'Uni Assign';

                  const currentSteps = isUniAssign ? UNI_ASSIGN_STEPS : SELF_APPLY_STEPS;
                  let step = 1; // Default

                  if (isUniAssign) {
                    // Uni Assign Flow: Pending Review (1) -> Placement (2) -> Finalize (3)
                    const statusVal = parseInt(appForPhase?.status, 10);
                    if (phase.status === 'Closed' || phase.status === 3) {
                      step = 3;
                    } else if (group || statusVal === APPLICATION_STATUS.PLACED) {
                      step = 2;
                    } else {
                      step = 1;
                    }
                  } else {
                    // Self-Apply Flow
                    if (phase.status === 'Closed' || phase.status === 3) {
                      step = 5;
                    } else if (group) {
                      step = 4;
                    } else if (appForPhase) {
                      const statusVal = parseInt(appForPhase.status, 10);
                      if (statusVal === APPLICATION_STATUS.PLACED) {
                        step = 4;
                      } else if (statusVal === APPLICATION_STATUS.OFFERED) {
                        step = 3;
                      } else if (statusVal === APPLICATION_STATUS.INTERVIEWING) {
                        step = 2;
                      } else if (statusVal === APPLICATION_STATUS.APPLIED) {
                        step = 1;
                      } else if (statusVal === APPLICATION_STATUS.PENDING_ASSIGNMENT) {
                        step = 3;
                      }
                    }
                  }

                  return (
                    <InternshipCard
                      key={phase.id || `phase-${index}`}
                      data={{
                        ...phase,
                        displayName: phase.name || phase.phaseName,
                        groupName: group?.groupName || group?.name || phase.name,
                        isPlaced: !!group || (appForPhase && appForPhase.status === 5),
                        journeyStep: step,
                        steps: currentSteps,
                      }}
                    >
                      <InternshipCard.Header
                        title={phase.name || phase.phaseName}
                        isCurrent={phase.status === 'InProgress'}
                      />
                      <InternshipCard.Stepper />
                      {group ? (
                        <>
                          <InternshipCard.BodyTitle
                            title={group.groupName || group.name}
                            href={`/internship-groups/${group.id || group.internshipGroupId || group.groupId || group.internshipId}/space`}
                          />
                          <InternshipCard.Info
                            mentor={group.mentorName}
                            enterprise={group.enterpriseName}
                            project={
                              group.projectName ||
                              (typeof group.project === 'string'
                                ? group.project
                                : group.project?.name) ||
                              group.projectTitle ||
                              group.ProjectName ||
                              group.project?.projectName ||
                              group.nameProject ||
                              group.project_name
                            }
                          />
                          <InternshipCard.Action
                            onDetailClick={() => {
                              const gid =
                                group.id ||
                                group.internshipGroupId ||
                                group.groupId ||
                                group.internshipId;
                              if (gid) router.push(`/internship-groups/${gid}/space`);
                            }}
                          />
                        </>
                      ) : isUniAssign && appForPhase ? (
                        <>
                          <InternshipCard.BodyTitle title={INTERNSHIP_UI.LABELS.NO_GROUP} />
                          <InternshipCard.Info
                            enterprise={appForPhase.enterpriseName}
                            mentor={INTERNSHIP_UI.LABELS.UPDATE_PENDING}
                          />
                          {parseInt(appForPhase.status, 10) ===
                            APPLICATION_STATUS.PENDING_ASSIGNMENT && (
                            <div className="mt-4 flex flex-col items-end">
                              <p className="text-muted text-sm font-medium italic">
                                {INTERNSHIP_UI.MESSAGES.WAITING_FOR_HR}
                              </p>
                            </div>
                          )}
                        </>
                      ) : appForPhase ? (
                        <>
                          <InternshipCard.BodyTitle title={INTERNSHIP_UI.LABELS.NO_GROUP} />
                          <InternshipCard.Info
                            enterprise={appForPhase.enterpriseName}
                            mentor={INTERNSHIP_UI.LABELS.UPDATE_PENDING}
                          />
                        </>
                      ) : (
                        <InternshipCard.BodyTitle title={INTERNSHIP_UI.LABELS.NO_GROUP} />
                      )}
                    </InternshipCard>
                  );
                })}
              </div>
            </section>
          );
        })()}

        {/* Dynamic Action Center Section — Only shows if there are actionable items */}
        {(() => {
          const showActionCenter =
            !hasCv ||
            (!hasGroup && activeApp) ||
            isPlacedButNoGroup ||
            (!hasGroup && !activeApp && !placedApp && hasCv);

          if (!showActionCenter) return null;

          return (
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
                  {INTERNSHIP_UI.SECTIONS.ACTION_CENTER}
                </h2>
                <div className="h-px flex-1 bg-slate-100" />
              </div>

              <div className="grid grid-cols-1 gap-8">
                {/* Urgent: Missing CV */}
                {!hasCv && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <CVUploadBanner variant="urgent" />
                  </div>
                )}

                {/* Status: Application pending or assigned but not grouped */}
                {!hasGroup && activeApp && (
                  <div className="animate-in fade-in slide-in-from-bottom-6 duration-600">
                    <ApplicationStatusCard app={activeApp} />
                  </div>
                )}

                {/* Congratulations: Placed but waiting for group creation */}
                {isPlacedButNoGroup && (
                  <div className="animate-in fade-in slide-in-from-bottom-6 duration-600">
                    <PlacementInfoCard enterpriseName={placedApp.enterpriseName} />
                  </div>
                )}

                {/* Gợi ý: Has CV but no application yet */}
                {!hasGroup && !activeApp && !placedApp && hasCv && (
                  <div className="animate-in zoom-in duration-700">
                    <SearchJobsCTA />
                  </div>
                )}
              </div>
            </section>
          );
        })()}
      </div>
    </div>
  );
};

export default InternshipDashboard;

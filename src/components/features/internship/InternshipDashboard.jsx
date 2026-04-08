'use client';

import { Skeleton } from 'antd';
import { CalendarDays, GraduationCap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { mineService } from '@/components/features/internship/services/mine.service';
import { userService } from '@/components/features/user/services/user.service';
import { EmptyState } from '@/components/ui/emptystate';
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
    context: null,
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
          mineService.getMyContext(),
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
        const contextRes = results[4].status === 'fulfilled' ? results[4].value : null;

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
          context: contextRes?.data || contextRes,
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

  const { phases, groups, studentApps, userInfo, context } = data;

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
  const isPlaced = !!placedApp || hasGroup || !!context?.internship;
  const isPlacedButNoGroup = isPlaced && !hasGroup;

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
    const phaseName =
      app.internPhaseName || app.phaseName || app.internshipPhase?.name || 'Active Internship';

    if (phaseIdCandidate && !seenPhaseIds.has(phaseIdCandidate)) {
      seenPhaseIds.add(phaseIdCandidate);
      allPhases.push({
        id: phaseIdCandidate,
        name: phaseName,
        status: app.internshipPhase?.status || 'InProgress',
      });
    }
  });

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
      <header className="flex flex-col gap-8">
        <div className="relative">
          <div className="absolute -left-12 top-0 hidden h-24 w-1 rounded-full bg-primary lg:block" />
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-900">
              {INTERNSHIP_UI.TITLE.replace(INTERNSHIP_UI.JOURNEY_HIGHLIGHT, '')}
              <span className="bg-linear-to-r from-primary to-rose-500 bg-clip-text text-transparent">
                {userInfo?.fullName || userInfo?.FullName || INTERNSHIP_UI.JOURNEY_HIGHLIGHT}
              </span>
            </h1>
            <p className="max-w-2xl text-base font-bold text-slate-400">{INTERNSHIP_UI.SUBTITLE}</p>
          </div>
        </div>

        {context && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 animate-in fade-in slide-in-from-left-4 duration-700">
            {context.currentTerm?.termName && (
              <div className="group flex items-center gap-4 rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm transition-all hover:bg-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary shadow-xs ring-1 ring-primary-100/50">
                  <CalendarDays className="size-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 capitalize">
                    {INTERNSHIP_UI.LABELS.TERM}
                  </span>
                  <span className="text-xl font-black text-slate-800 tracking-tight">
                    {context.currentTerm.termName}
                  </span>
                  {context.currentTerm.startDate && context.currentTerm.endDate && (
                    <span className="mt-0.5 text-xs font-bold text-slate-500">
                      {new Date(context.currentTerm.startDate).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                      })}{' '}
                      -{' '}
                      {new Date(context.currentTerm.endDate).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  )}
                </div>
              </div>
            )}

            {context.university?.name && (
              <div className="group flex items-center gap-4 rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm transition-all hover:bg-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 shadow-xs ring-1 ring-indigo-100/50">
                  <GraduationCap className="size-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 capitalize">
                    {INTERNSHIP_UI.LABELS.UNIVERSITY}
                  </span>
                  <span className="text-xl font-black text-slate-800 tracking-tight capitalize">
                    {context.university.name}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </header>

      <div className="flex flex-col gap-10">
        {!isPlaced && allPhases.length === 0 && (
          <section className="animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="rounded-[40px] border border-slate-100 bg-white p-10 shadow-sm transition-all hover:shadow-md">
              <EmptyState
                title={INTERNSHIP_UI.MESSAGES?.NO_PLACEMENT_TITLE || 'No Official Internship Yet'}
                description={
                  INTERNSHIP_UI.MESSAGES?.NO_PLACEMENT_DESC ||
                  "You haven't been officially placed in an internship group. Track your active applications in the Action Center below."
                }
              />
            </div>
          </section>
        )}

        {/* Phase List Section - Always show if there are active phases/apps to show the progress stepper */}
        {allPhases.length > 0 &&
          (() => {
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

            if (finalPhasesToRender.length === 0) return null;

            return (
              <section className="space-y-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
                    {finalPhasesToRender.some((p) => {
                      const app = studentApps.find(
                        (a) => String(extractPhaseId(a)) === String(extractPhaseId(p))
                      );
                      return parseInt(app?.status, 10) === 5;
                    })
                      ? INTERNSHIP_UI.SECTIONS.CURRENT_PHASE
                      : INTERNSHIP_UI.SECTIONS.JOURNEY_TRACKING || 'Internship Progress'}
                  </h2>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>
                <div className="space-y-6">
                  {finalPhasesToRender.map((phase, index) => {
                    const currentPhaseId = String(phase.id || phase.phaseId || '');
                    const pidGlobal = extractPhaseId(phase);

                    // MERGE STRATEGY: Try to find the most complete data for this phase
                    const groupFromService = groups.find((g) => {
                      const gid = String(
                        g.internshipPhaseId || g.phaseId || g.internshipGroupId || g.id || ''
                      );
                      return (
                        (gid && pidGlobal && gid === pidGlobal) ||
                        currentPhaseId === 'fallback-stage'
                      );
                    });

                    const appForPhase = studentApps.find((a) => {
                      if (currentPhaseId === 'fallback-stage') return true;
                      const aid = String(a.internshipPhaseId || a.phaseId || a.id || '');
                      return (
                        (aid && pidGlobal && aid === pidGlobal) || (aid && aid === currentPhaseId)
                      );
                    });

                    // Enrichment from Context: ONLY if a group is actually assigned in context
                    const isContextMatch =
                      context?.internshipPhaseId === pidGlobal ||
                      context?.internship?.internshipPhaseId === pidGlobal ||
                      context?.internship?.phase?.phaseId === pidGlobal ||
                      context?.internship?.phaseId === pidGlobal;

                    const contextGroup =
                      isContextMatch && context?.internship?.group ? context.internship : null;

                    const isPlacedFromApp =
                      appForPhase &&
                      (parseInt(appForPhase.status, 10) === APPLICATION_STATUS.PLACED ||
                        appForPhase.groupName ||
                        appForPhase.internshipGroupId);

                    const baseGroup = groupFromService || (isPlacedFromApp ? appForPhase : null);
                    const group = baseGroup
                      ? {
                          ...baseGroup,
                          // Prioritize context names if base is missing them
                          enterpriseName:
                            baseGroup.enterpriseName ||
                            contextGroup?.enterprise?.name ||
                            contextGroup?.enterpriseName,
                          mentorName:
                            baseGroup.mentorName ||
                            contextGroup?.mentor?.name ||
                            contextGroup?.mentor?.fullName ||
                            contextGroup?.mentorName,
                          projectName:
                            baseGroup.projectName ||
                            contextGroup?.project?.name ||
                            contextGroup?.projectName,
                          project: baseGroup.project || contextGroup?.project,
                        }
                      : contextGroup;

                    const isUniAssign =
                      appForPhase?.applicationSource === 2 ||
                      appForPhase?.source === 2 ||
                      appForPhase?.sourceLabel === 'Uni Assign';

                    const currentSteps = isUniAssign ? UNI_ASSIGN_STEPS : SELF_APPLY_STEPS;
                    let step = 1;

                    if (isUniAssign) {
                      const statusVal = parseInt(appForPhase?.status, 10);
                      if (phase.status === 'Closed' || phase.status === 3) {
                        step = 3;
                      } else if (group || statusVal === APPLICATION_STATUS.PLACED) {
                        step = 2;
                      } else {
                        step = 1;
                      }
                    } else {
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
                          isPlaced: parseInt(appForPhase?.status, 10) === 5,
                          journeyStep: step,
                          steps: currentSteps,
                        }}
                      >
                        {parseInt(appForPhase?.status, 10) === 5 ? (
                          <InternshipCard.Header
                            title={phase.name || phase.phaseName}
                            isCurrent={phase.status === 'InProgress'}
                          />
                        ) : (
                          <div className="mb-10 flex flex-col gap-2">
                            <h3 className="text-3xl font-black tracking-tight text-slate-800">
                              {INTERNSHIP_UI.MESSAGES.JOB_APP_TRACKING}
                            </h3>
                            <p className="text-sm font-bold text-slate-400">
                              {INTERNSHIP_UI.MESSAGES.JOB_APP_DESC}
                            </p>
                          </div>
                        )}

                        <div className="relative px-2 py-4">
                          <InternshipCard.Stepper />
                        </div>

                        {group && parseInt(appForPhase?.status, 10) === 5 ? (
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
                        ) : (
                          <div className="mt-10 space-y-6">
                            <div className="flex items-center gap-4">
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                                {INTERNSHIP_UI.SECTIONS.ACTION_CENTER}
                              </span>
                              <div className="h-px flex-1 bg-slate-50" />
                            </div>

                            {!hasCv && (
                              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <CVUploadBanner variant="urgent" />
                              </div>
                            )}

                            {activeApp ? (
                              <div className="animate-in fade-in slide-in-from-bottom-4 duration-600">
                                <ApplicationStatusCard app={activeApp} />
                              </div>
                            ) : (
                              !placedApp &&
                              hasCv && (
                                <div className="animate-in zoom-in duration-700">
                                  <SearchJobsCTA />
                                </div>
                              )
                            )}

                            {isPlacedButNoGroup && (
                              <div className="animate-in fade-in slide-in-from-bottom-4 duration-600">
                                <PlacementInfoCard enterpriseName={placedApp.enterpriseName} />
                              </div>
                            )}
                          </div>
                        )}
                      </InternshipCard>
                    );
                  })}
                </div>
              </section>
            );
          })()}

        {/* Dynamic Action Center Section — Only shows if there are actionable items and they aren't already integrated above */}
        {(() => {
          const isAnythingPlaced = allPhases.some((p) => {
            const app = studentApps.find(
              (a) => String(extractPhaseId(a)) === String(extractPhaseId(p))
            );
            return parseInt(app?.status, 10) === 5;
          });

          // If we have integrated the actions into the card (unplaced state), we don't need the bottom section
          if (!isAnythingPlaced) return null;

          // For placed students, we might still show actions like missing CV at the bottom
          if (!hasCv) {
            return (
              <section className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex items-center gap-4">
                  <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
                    {INTERNSHIP_UI.SECTIONS.ACTION_CENTER}
                  </h2>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>
                <CVUploadBanner variant="urgent" />
              </section>
            );
          }

          return null;
        })()}
      </div>
    </div>
  );
};

export default InternshipDashboard;

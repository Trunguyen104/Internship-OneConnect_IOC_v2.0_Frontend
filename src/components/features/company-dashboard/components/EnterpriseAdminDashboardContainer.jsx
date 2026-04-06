'use client';

import { AlertCircle, FileText, Layers, Plus, ShieldAlert, Users, Zap } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import Card from '@/components/ui/card';
import { PageLayout } from '@/components/ui/pagelayout';
import { Spinner } from '@/components/ui/spinner';
import StatusBadge from '@/components/ui/status-badge';
import { USER_ROLE } from '@/constants/common/enums';
import { ADMIN_DASHBOARD_UI } from '@/constants/enterprise-dashboard/adminUiText';
import {
  INTERN_PHASE_STATUS,
  INTERN_PHASE_STATUS_LABELS,
} from '@/constants/intern-phase-management/intern-phase';

import { AssignMentorModal } from '../../internship-management/internship-group-management/components/AssignMentorModal';
import { useEnterpriseAdminDashboard } from '../hooks/useEnterpriseAdminDashboard';

const StatCard = ({ title, value, subtitle, icon: Icon, colorClass, show = true, href, badge }) => {
  if (!show) return null;
  const content = (
    <Card
      className={`relative flex flex-col justify-between border-none shadow-sm transition-all duration-300 hover:shadow-md p-5 ${href ? 'cursor-pointer hover:-translate-y-1 hover:shadow-lg' : ''}`}
    >
      <div className="flex flex-row items-start justify-between">
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
            {title}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-800 tabular-nums leading-none">
              {value}
            </span>
            {subtitle && (
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {subtitle}
              </span>
            )}
          </div>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl shrink-0 shadow-sm ml-4 ${colorClass}`}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {badge && (
        <div className="absolute top-4 right-4 bg-amber-500 text-white px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-md shadow-amber-500/30 flex items-center gap-1 animate-pulse">
          <AlertCircle className="w-3 h-3" />
          {badge}
        </div>
      )}
      {href && (
        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-primary transition-colors">
          <span>
            {ADMIN_DASHBOARD_UI.GROUPS.VIEW_ALL.split(' ')[0]}{' '}
            {ADMIN_DASHBOARD_UI.GROUPS.VIEW_ALL.split(' ')[1]}
          </span>
          <span>{ADMIN_DASHBOARD_UI.SYMBOL_ARROW}</span>
        </div>
      )}
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block group">
        {content}
      </Link>
    );
  }

  return content;
};

export default function EnterpriseAdminDashboardContainer() {
  const {
    stats,
    groupsWithoutMentor,
    recentViolations,
    phaseOverview,
    assignModal,
    setAssignModal,
    mentors,
    loadingMentors,
    handleAssignMentorSubmit,
    loading,
    role,
  } = useEnterpriseAdminDashboard();

  if (!loading && Number(role) !== USER_ROLE.ENTERPRISE_ADMIN) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center p-8 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
        <div className="text-4xl mb-4">{ADMIN_DASHBOARD_UI.SYMBOL_BLOCK}</div>
        <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">
          {ADMIN_DASHBOARD_UI.ACCESS_DENIED}
        </h3>
        <p className="text-slate-500 max-w-sm mt-2 font-medium">
          {ADMIN_DASHBOARD_UI.NO_PERMISSION}
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-[500px] items-center justify-center">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <PageLayout className="gap-6 animate-in fade-in duration-700 pb-10">
      <div className="flex flex-col gap-1 px-1">
        <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
          {ADMIN_DASHBOARD_UI.TITLE}
        </h2>
        <p className="text-sm font-medium text-slate-500">{ADMIN_DASHBOARD_UI.SUBTITLE}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title={ADMIN_DASHBOARD_UI.STATS.INTERN_PHASE_ACTIVE}
          value={stats.internPhasesActive}
          subtitle={ADMIN_DASHBOARD_UI.STATS.REMAINING_SLOTS_SUBTITLE.replace(
            '{count}',
            stats.remainingCapacity
          )}
          icon={Layers}
          colorClass="bg-blue-50 text-blue-600"
          href="/company/phases"
        />
        <StatCard
          title={ADMIN_DASHBOARD_UI.STATS.PENDING_APPLICATIONS}
          value={stats.pendingApps}
          subtitle={ADMIN_DASHBOARD_UI.STATS.PENDING_APPS_SUBTITLE}
          icon={FileText}
          colorClass="bg-orange-50 text-orange-600"
          href="/company/applications"
        />
        <StatCard
          title={ADMIN_DASHBOARD_UI.STATS.PLACED_STUDENTS}
          value={stats.placedStudents}
          subtitle={ADMIN_DASHBOARD_UI.STATS.PLACED_STUDENTS_SUBTITLE}
          icon={Users}
          colorClass="bg-emerald-50 text-emerald-600"
          href="/company/internships"
        />
        <StatCard
          title={ADMIN_DASHBOARD_UI.STATS.ACTIVE_GROUPS}
          value={stats.activeGroups}
          subtitle={ADMIN_DASHBOARD_UI.STATS.ACTIVE_GROUPS_SUBTITLE}
          icon={Zap}
          colorClass="bg-purple-50 text-purple-600"
          href="/company/internships"
        />
        <StatCard
          title={ADMIN_DASHBOARD_UI.STATS.NEAR_END_PHASES}
          value={stats.nearEndPhases}
          subtitle={`<= 14 days`}
          icon={AlertCircle}
          colorClass="bg-amber-50 text-amber-500"
          badge={stats.nearEndPhases > 0 ? ADMIN_DASHBOARD_UI.STATS.NEAR_END_PHASES_BADGE : null}
          show={stats.nearEndPhases > 0}
          href="/company/phases"
        />
        <StatCard
          title={ADMIN_DASHBOARD_UI.STATS.UNRESOLVED_VIOLATIONS}
          value={stats.unresolvedViolations}
          subtitle={ADMIN_DASHBOARD_UI.STATS.UNRESOLVED_VIOLATIONS_SUBTITLE || '30 days'}
          icon={ShieldAlert}
          colorClass="bg-rose-50 text-rose-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Groups Without Mentor */}
        <Card className="h-full border-none shadow-sm overflow-hidden flex flex-col">
          <Card.Header className="bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
            <Card.Title className="text-sm font-black uppercase tracking-widest text-slate-700 flex items-center gap-2">
              <Users className="h-4 w-4 text-orange-500" />
              {ADMIN_DASHBOARD_UI.GROUPS.TITLE}
            </Card.Title>
          </Card.Header>
          <Card.Content className="p-0 flex flex-col h-full bg-white">
            {groupsWithoutMentor.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
                  <span className="text-emerald-500 text-xl font-bold">
                    {ADMIN_DASHBOARD_UI.SYMBOL_CHECK}
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-600">
                  {ADMIN_DASHBOARD_UI.GROUPS.ALL_ASSIGNED_MSG}
                </p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">
                  {ADMIN_DASHBOARD_UI.GROUPS.NO_WARNINGS}
                </p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col min-h-0">
                <div className="overflow-auto hidden sm:block">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {ADMIN_DASHBOARD_UI.GROUPS.NAME}
                        </th>
                        <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {ADMIN_DASHBOARD_UI.GROUPS.PHASE}
                        </th>
                        <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                          {ADMIN_DASHBOARD_UI.GROUPS.STUDENTS.split(' ')[2]}
                        </th>
                        <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                          {ADMIN_DASHBOARD_UI.GROUPS.ASSIGN_MENTOR.split(' ')[0]}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {groupsWithoutMentor.slice(0, 5).map((group) => (
                        <tr
                          key={group.internshipGroupId}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="px-5 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-slate-800">{group.name}</span>
                              <span className="text-[10px] font-medium text-slate-400 mt-1">
                                {ADMIN_DASHBOARD_UI.GROUPS.START_DATE}:{' '}
                                {new Date(group.phaseStartDate).toLocaleDateString('vi-VN')}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex flex-col items-start gap-1.5">
                              <span className="text-xs font-bold text-slate-700 line-clamp-1 block">
                                {group.internshipPhaseName}
                              </span>
                              <span
                                className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${group.phaseStatus === INTERN_PHASE_STATUS.UPCOMING ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}
                              >
                                {group.phaseStatus === INTERN_PHASE_STATUS.UPCOMING
                                  ? INTERN_PHASE_STATUS_LABELS[INTERN_PHASE_STATUS.UPCOMING]
                                  : INTERN_PHASE_STATUS_LABELS[INTERN_PHASE_STATUS.ACTIVE]}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-center">
                            <span className="text-xs font-black text-slate-700 tabular-nums">
                              {group.studentCount}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <button
                              onClick={() => setAssignModal({ open: true, group })}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                            >
                              <span>{ADMIN_DASHBOARD_UI.GROUPS.ASSIGN_MENTOR}</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Fallback */}
                <div className="sm:hidden divide-y divide-slate-50">
                  {groupsWithoutMentor.slice(0, 5).map((group) => (
                    <div key={group.internshipGroupId} className="p-4 flex flex-col gap-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-sm font-bold text-slate-800 block">
                            {group.name}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400 mt-1">
                            {ADMIN_DASHBOARD_UI.GROUPS.STUDENTS.split(' ')[2]}: {group.studentCount}
                          </span>
                        </div>
                        <span
                          className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${group.phaseStatus === INTERN_PHASE_STATUS.UPCOMING ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}
                        >
                          {group.phaseStatus === INTERN_PHASE_STATUS.UPCOMING
                            ? INTERN_PHASE_STATUS_LABELS[INTERN_PHASE_STATUS.UPCOMING]
                            : INTERN_PHASE_STATUS_LABELS[INTERN_PHASE_STATUS.ACTIVE]}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
                        <span className="text-[10px] font-medium text-slate-400">
                          {new Date(group.phaseStartDate).toLocaleDateString('vi-VN')}
                        </span>
                        <button
                          onClick={() => setAssignModal({ open: true, group })}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-xs font-bold"
                        >
                          <span>{ADMIN_DASHBOARD_UI.GROUPS.ASSIGN_MENTOR}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-slate-50 flex justify-center mt-auto bg-white/50">
                  {groupsWithoutMentor.length > 5 && (
                    <Link
                      href="/company/phases"
                      className="text-xs font-black text-primary hover:text-primary/80 uppercase tracking-widest transition-colors"
                    >
                      {ADMIN_DASHBOARD_UI.GROUPS.VIEW_ALL.split(' ')[0]}{' '}
                      {ADMIN_DASHBOARD_UI.LABEL_ALL} {groupsWithoutMentor.length}{' '}
                      {ADMIN_DASHBOARD_UI.GROUPS.TITLE.split(' ')[1].toLowerCase()}{' '}
                      {ADMIN_DASHBOARD_UI.SYMBOL_ARROW}
                    </Link>
                  )}
                </div>
              </div>
            )}
          </Card.Content>
        </Card>

        {/* Recent Violations */}
        <Card className="h-full border-none shadow-sm overflow-hidden flex flex-col">
          <Card.Header className="bg-slate-50/50 border-b border-slate-100">
            <Card.Title className="text-sm font-black uppercase tracking-widest text-slate-700 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-rose-500" />
              {ADMIN_DASHBOARD_UI.VIOLATIONS.TITLE}
            </Card.Title>
          </Card.Header>
          <Card.Content className="p-0">
            {recentViolations.length === 0 ? (
              <div className="py-12 text-center text-slate-400 italic text-sm">
                {ADMIN_DASHBOARD_UI.VIOLATIONS.EMPTY}
              </div>
            ) : (
              <ul className="divide-y divide-slate-50">
                {recentViolations.slice(0, 5).map((v) => (
                  <li
                    key={v.violationReportId}
                    className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-black text-rose-600">
                          {ADMIN_DASHBOARD_UI.STATS.VIOLATION_PREFIX}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800 leading-tight">
                          {v.studentName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {v.internshipGroupName}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] block font-black text-slate-400 uppercase tracking-tighter">
                        {ADMIN_DASHBOARD_UI.STATS.REPORTED_BY}
                      </span>
                      <span className="text-[11px] font-bold text-slate-700">{v.mentorName}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card.Content>
        </Card>
      </div>

      {/* Phase Overview Table */}
      <Card className="border-none shadow-sm overflow-hidden min-h-[400px] flex flex-col">
        <Card.Header className="bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
          <Card.Title className="text-sm font-black uppercase tracking-widest text-slate-700 flex items-center gap-2">
            <Layers className="h-4 w-4 text-emerald-500" />
            {ADMIN_DASHBOARD_UI.PHASES.TITLE}
          </Card.Title>
          {phaseOverview.length > 0 && (
            <Link
              href="/company/phases"
              className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest"
            >
              {ADMIN_DASHBOARD_UI.PHASES.VIEW_ALL} {ADMIN_DASHBOARD_UI.SYMBOL_ARROW}
            </Link>
          )}
        </Card.Header>
        <Card.Content className="p-0 flex-1 flex flex-col">
          {phaseOverview.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
              <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                <Layers className="h-8 w-8 text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium max-w-sm mb-6">
                {ADMIN_DASHBOARD_UI.PHASES.EMPTY}
              </p>
              <Link
                href="/company/phases"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all active:scale-[0.98]"
              >
                <Plus className="h-4 w-4" />
                {ADMIN_DASHBOARD_UI.PHASES.CREATE_NEW}
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/30 border-b border-slate-100">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {ADMIN_DASHBOARD_UI.PHASES.NAME}
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {ADMIN_DASHBOARD_UI.PHASES.STATUS}
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {ADMIN_DASHBOARD_UI.PHASES.TIMELINE}
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                      {ADMIN_DASHBOARD_UI.PHASES.SLOTS}
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                      {ADMIN_DASHBOARD_UI.PHASES.REMAINING}
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                      {ADMIN_DASHBOARD_UI.PHASES.JOBS}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {phaseOverview.map((phase) => (
                    <tr
                      key={phase.internshipPhaseId}
                      className="hover:bg-slate-50/30 transition-colors group"
                    >
                      <td className="px-6 py-5">
                        <Link
                          href={`/company/phases/${phase.internshipPhaseId}`}
                          className="text-sm font-bold text-slate-800 hover:text-primary transition-colors block"
                        >
                          {phase.name}
                        </Link>
                      </td>
                      <td className="px-6 py-5">
                        <StatusBadge
                          variant={
                            phase.status === INTERN_PHASE_STATUS.ACTIVE ? 'success' : 'warning'
                          }
                          label={INTERN_PHASE_STATUS_LABELS[phase.status]}
                          pulseDot={phase.status === INTERN_PHASE_STATUS.ACTIVE}
                        />
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                          <span>{new Date(phase.startDate).toLocaleDateString('vi-VN')}</span>
                          <span className="text-slate-300">{ADMIN_DASHBOARD_UI.SYMBOL_MINUS}</span>
                          <span>{new Date(phase.endDate).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex flex-col items-center gap-1.5">
                          <span className="text-sm font-bold text-slate-700 tabular-nums">
                            {phase.placedCount}/{phase.capacity}
                          </span>
                          <div className="h-1 w-16 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${phase.placedCount >= phase.capacity ? 'bg-rose-500' : 'bg-primary'}`}
                              style={{
                                width: `${Math.min(100, (phase.placedCount / phase.capacity) * 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span
                          className={`text-sm font-black tabular-nums ${phase.capacity - phase.placedCount <= 0 ? 'text-rose-500' : 'text-slate-700'}`}
                        >
                          {Math.max(0, phase.capacity - phase.placedCount)}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right font-bold text-slate-700 text-sm">
                        {phase.jobPostingCount}{' '}
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter ml-1">
                          {ADMIN_DASHBOARD_UI.PHASES.POSTS}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card.Content>
      </Card>

      {/* Assign Mentor Modal */}
      <AssignMentorModal
        open={assignModal.open}
        group={assignModal.group}
        mentors={mentors}
        loading={loadingMentors}
        onCancel={() => setAssignModal({ open: false, group: null })}
        onConfirm={handleAssignMentorSubmit}
      />
    </PageLayout>
  );
}

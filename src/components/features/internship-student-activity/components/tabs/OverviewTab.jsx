'use client';

import {
  CalendarOutlined,
  ExclamationCircleOutlined,
  HomeOutlined,
  MailOutlined,
  ReadOutlined,
  SolutionOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import React from 'react';

import Badge from '@/components/ui/badge';
import Card from '@/components/ui/card';
import { UI_TEXT } from '@/lib/UI_Text';

const InfoRow = ({ label, value, icon, className }) => (
  <div
    className={`flex items-center py-3.5 border-b border-slate-50 last:border-0 hover:bg-slate-50/80 transition-all px-4 rounded-2xl group ${className}`}
  >
    <div className="flex items-center gap-4 w-48 shrink-0">
      {icon && (
        <span className="text-slate-400 text-xl opacity-30 group-hover:opacity-100 group-hover:text-primary transition-all duration-300">
          {icon}
        </span>
      )}
      <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest leading-none">
        {label}
      </span>
    </div>
    <span className="text-sm font-extrabold text-slate-800 tracking-tight break-words flex-1">
      {value || <span className="opacity-20">{UI_TEXT.COMMON.EM_DASH}</span>}
    </span>
  </div>
);

const SectionCard = ({ title, children, icon, className, accentColor = 'primary' }) => (
  <Card
    className={`!p-10 !rounded-[40px] border border-white shadow-xl shadow-slate-200/50 bg-white relative overflow-hidden transition-all duration-500 hover:shadow-2xl ${className}`}
  >
    <div className={`absolute top-0 left-0 w-full h-[6px] bg-${accentColor}/10`} />
    <div
      className={`absolute top-0 left-0 w-24 h-[6px] bg-${accentColor} rounded-r-full shadow-[0_0_10px_rgba(var(--color-${accentColor}-rgb),0.3)]`}
    />

    <div className="flex items-center justify-between mb-10 relative z-10">
      <h4 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-500 flex items-center gap-4">
        <div
          className={`size-11 rounded-[20px] bg-white flex items-center justify-center text-${accentColor} text-xl shadow-inner border border-slate-100 shadow-slate-200/50 group-hover:scale-110 transition-transform duration-500`}
        >
          {icon}
        </div>
        {title}
      </h4>
    </div>
    <div className="relative z-10">{children}</div>
  </Card>
);

export default function OverviewTab({
  student,
  enterprises = [],
  evaluations = [],
  violations = [],
  loading,
}) {
  if (loading || !student)
    return (
      <div className="p-32 text-center">
        <div className="inline-block size-12 border-[5px] border-primary/20 border-t-primary rounded-full animate-spin mb-8" />
        <div className="text-slate-400 font-black uppercase tracking-[0.25em] text-[11px] animate-pulse">
          {UI_TEXT.COMMON.LOADING}
        </div>
      </div>
    );

  const isUnplaced = student.internshipStatus === 'Unplaced' || student.internshipStatus === 5;

  const currentEnterprise = enterprises.find(
    (e) =>
      (e.enterpriseId && e.enterpriseId === student.enterpriseId) ||
      (e.name && e.name === student.enterpriseName)
  );
  const enterpriseAddress = currentEnterprise?.address || student.enterpriseAddress || 'N/A';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-12">
      <div className="lg:col-span-6 space-y-12">
        <SectionCard
          title={UI_TEXT.STUDENT_ACTIVITY.OVERVIEW.PERSONAL_INFO}
          icon={<SolutionOutlined />}
          accentColor="primary"
        >
          <div className="space-y-1">
            <InfoRow
              label={UI_TEXT.STUDENT_ACTIVITY.OVERVIEW.INFO_FIELDS.FULL_NAME}
              value={student.fullName}
              icon={<UserOutlined />}
            />
            <InfoRow
              label={UI_TEXT.STUDENT_ACTIVITY.OVERVIEW.INFO_FIELDS.CLASS}
              value={student.className || student.class}
              icon={<TeamOutlined />}
            />
            <InfoRow
              label={UI_TEXT.STUDENT_ACTIVITY.OVERVIEW.INFO_FIELDS.STUDENT_ID}
              value={student.studentCode}
              icon={<ReadOutlined />}
            />
            <InfoRow
              label={UI_TEXT.STUDENT_ACTIVITY.OVERVIEW.INFO_FIELDS.MAJOR}
              value={student.major}
              icon={<ReadOutlined />}
            />
            <InfoRow
              label={UI_TEXT.STUDENT_ACTIVITY.OVERVIEW.INFO_FIELDS.TERM}
              value={student.termName}
              icon={<CalendarOutlined />}
            />
            <InfoRow
              label={UI_TEXT.STUDENT_ACTIVITY.OVERVIEW.INFO_FIELDS.DURATION}
              value={
                student.termStartDate ? `${student.termStartDate} – ${student.termEndDate}` : '—'
              }
              icon={<CalendarOutlined />}
            />
          </div>

          <div className="my-10 h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent" />

          <div className="space-y-1">
            <div className="flex items-center justify-between mb-6 px-4">
              <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-3">
                <div className="size-2 rounded-full bg-info shadow-[0_0_8px_rgba(var(--color-info-rgb),0.5)]" />
                {UI_TEXT.STUDENT_ACTIVITY.OVERVIEW.ENTERPRISE_INFO}
              </h5>
              {isUnplaced && (
                <Badge
                  variant="danger-soft"
                  size="xs"
                  className="font-extrabold uppercase tracking-widest px-4 py-1.5"
                >
                  {UI_TEXT.STUDENT_ACTIVITY.OVERVIEW.WAITING_PLACEMENT}
                </Badge>
              )}
            </div>

            <InfoRow
              label={UI_TEXT.STUDENT_ACTIVITY.OVERVIEW.INFO_FIELDS.ENTERPRISE}
              value={
                isUnplaced ? UI_TEXT.STUDENT_ACTIVITY.OVERVIEW.UNPLACED : student.enterpriseName
              }
              icon={<TeamOutlined />}
            />
            {!isUnplaced && (
              <>
                <InfoRow
                  label={UI_TEXT.STUDENT_ACTIVITY.OVERVIEW.INFO_FIELDS.ADDRESS}
                  value={enterpriseAddress}
                  icon={<HomeOutlined />}
                />
                <InfoRow
                  label={UI_TEXT.STUDENT_ACTIVITY.OVERVIEW.INFO_FIELDS.MENTOR}
                  value={student.mentorName}
                  icon={<UserOutlined />}
                />
                <InfoRow
                  label={UI_TEXT.STUDENT_ACTIVITY.OVERVIEW.INFO_FIELDS.EMAIL}
                  value={student.mentorEmail}
                  icon={<MailOutlined />}
                />
              </>
            )}
          </div>
        </SectionCard>
      </div>

      <div className="lg:col-span-4 space-y-12">
        {!isUnplaced && (
          <div className="group relative bg-white rounded-[44px] p-10 border border-white shadow-2xl shadow-info/5 hover:shadow-info/15 transition-all duration-700 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[6px] bg-info/10" />
            <div className="absolute top-0 left-0 w-32 h-[6px] bg-info rounded-r-full shadow-[0_0_15px_rgba(var(--color-info-rgb),0.35)]" />

            <div className="absolute top-[-10%] right-[-10%] size-64 bg-info/5 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-1000" />
            <div className="relative z-10 flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="size-11 rounded-[20px] bg-info/5 flex items-center justify-center text-info text-xl shadow-inner border border-info/10">
                    <ReadOutlined />
                  </div>
                  <h4 className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">
                    {UI_TEXT.STUDENT_ACTIVITY.OVERVIEW.LOGBOOK_ACTIVITY}
                  </h4>
                </div>
              </div>

              <div className="flex items-end justify-between">
                <div className="flex flex-col">
                  <span className="text-5xl font-black text-slate-800 tracking-tighter italic leading-none drop-shadow-sm">
                    {student.activity?.submitted}
                    <span className="text-2xl text-slate-300 mx-2">/</span>
                    {student.activity?.totalWorkDays}
                  </span>
                  <span className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-500 mt-4">
                    {UI_TEXT.STUDENT_ACTIVITY.OVERVIEW.REPORTS_SUBMITTED}
                  </span>
                </div>
                <div className="px-5 py-2 bg-info text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-info/20">
                  {student.activity?.progress}%
                </div>
              </div>

              <div className="relative pt-2">
                <div className="h-3 w-full bg-slate-50/80 rounded-full overflow-hidden shadow-inner border border-slate-100/50">
                  <div
                    className="h-full bg-gradient-to-r from-info to-blue-400 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${student.activity?.progress}%` }}
                  />
                </div>
              </div>

              <p className="text-[11px] font-black text-slate-500 leading-relaxed italic">
                {UI_TEXT.STUDENT_ACTIVITY.OVERVIEW.TRACK_DESC}
              </p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-[44px] p-10 border border-white shadow-2xl shadow-slate-200/50 hover:shadow-warning/10 transition-all duration-700 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[6px] bg-warning/10" />
          <div className="absolute top-0 left-0 w-32 h-[6px] bg-warning rounded-r-full shadow-[0_0_15px_rgba(var(--color-warning-rgb),0.35)]" />

          <div className="flex items-center justify-between mb-10 relative z-10">
            <h4 className="text-xs font-black uppercase tracking-[0.25em] text-slate-500 flex items-center gap-4">
              <div className="size-11 rounded-[22px] bg-warning/5 flex items-center justify-center text-warning text-xl shadow-inner border border-warning/10 transition-transform group-hover:scale-110">
                <SolutionOutlined />
              </div>
              {UI_TEXT.STUDENT_ACTIVITY.OVERVIEW.PUBLISHED_EVALUATIONS}
            </h4>
          </div>

          {evaluations.length > 0 ? (
            <div className="space-y-4">
              {evaluations.slice(0, 3).map((ev, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-5 bg-slate-50/50 rounded-[24px] border border-white group hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary font-black text-sm border border-slate-50 group-hover:scale-110 transition-transform">
                      {idx + 1}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-800 tracking-tight">
                        {ev.cycleName}
                      </span>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
                        {dayjs(ev.cycleStartDate).format('DD/MM/YYYY')}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant="success-soft"
                    size="xs"
                    className="font-black text-[9px] tracking-widest uppercase px-3 py-1 rounded-lg"
                  >
                    {UI_TEXT.STUDENT_ACTIVITY.OVERVIEW.PUBLISHED}
                  </Badge>
                </div>
              ))}
              {evaluations.length > 3 && (
                <div className="text-center pt-4">
                  <span className="px-6 py-2 rounded-full bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">
                    + {evaluations.length - 3} {UI_TEXT.STUDENT_ACTIVITY.OVERVIEW.OTHER_CYCLES}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="py-14 text-center bg-slate-50/30 rounded-[32px] border border-dashed border-slate-200">
              <SolutionOutlined className="text-slate-200 text-4xl mb-4 opacity-40" />
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-8 leading-relaxed">
                {UI_TEXT.STUDENT_ACTIVITY.OVERVIEW.NO_EVALS}
              </p>
            </div>
          )}
        </div>

        {student.violationCount > 0 && (
          <div className="group bg-gradient-to-br from-red-50/50 to-white rounded-[40px] p-10 border border-red-50 shadow-xl shadow-red-100/40 hover:shadow-2xl transition-all duration-700 overflow-hidden relative">
            <div className="absolute -top-10 -right-10 size-40 bg-red-100/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-red-500/70 flex items-center gap-3">
                  <div className="size-10 rounded-2xl bg-red-100/50 text-red-600 flex items-center justify-center shadow-inner">
                    <ExclamationCircleOutlined />
                  </div>
                  {UI_TEXT.STUDENT_ACTIVITY.OVERVIEW.RECENT_VIOLATIONS}
                </h4>
              </div>

              <div className="flex items-center gap-8">
                <div className="size-24 rounded-[32px] bg-white shadow-2xl shadow-red-200/50 flex flex-col items-center justify-center text-red-500 border border-red-50 group-hover:-rotate-3 transition-transform duration-500">
                  <span className="text-4xl font-black leading-none">{student.violationCount}</span>
                  <span className="text-[10px] font-black uppercase opacity-40 mt-1">
                    {UI_TEXT.STUDENT_ACTIVITY.OVERVIEW.RECORDS}
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-lg font-black text-slate-800 leading-tight italic truncate pr-4">
                    {student.latestViolationType ||
                      UI_TEXT.STUDENT_ACTIVITY.OVERVIEW.VIOLATION_RECORDED}
                  </span>
                  <div className="flex items-center gap-3 mt-4">
                    <span className="px-2 py-0.5 bg-red-100/50 rounded-md text-[10px] font-black text-red-500 uppercase tracking-widest">
                      {UI_TEXT.STUDENT_ACTIVITY.OVERVIEW.DATE}
                    </span>
                    <span className="text-[11px] font-black text-slate-600 uppercase">
                      {violations?.[0]?.occurredDate || UI_TEXT.STUDENT_ACTIVITY.OVERVIEW.RECENTLY}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import {
  CalendarOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  HomeOutlined,
  MailOutlined,
  ReadOutlined,
  SolutionOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import React from 'react';

import Card from '@/components/ui/card';
import { STUDENT_ACTIVITY_UI } from '@/constants/student-activity/student-activity';
import { cn } from '@/lib/cn';
import { UI_TEXT } from '@/lib/UI_Text';

const InfoRow = ({ label, value, icon, className }) => (
  <div
    className={`flex items-center py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50/80 transition-all px-4 rounded-xl group ${className}`}
  >
    <div className="flex items-center gap-3 w-44 shrink-0">
      {icon && (
        <span className="text-slate-400 text-lg opacity-40 group-hover:opacity-100 group-hover:text-primary transition-all duration-300">
          {icon}
        </span>
      )}
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] leading-none">
        {label}
      </span>
    </div>
    <span className="text-sm font-black text-slate-900 tracking-tight break-words flex-1">
      {value || <span className="opacity-20 font-bold">{UI_TEXT.COMMON.EMPTY_VALUE}</span>}
    </span>
  </div>
);

const SectionCard = ({ title, children, icon, className, accentColor = 'primary' }) => (
  <Card
    className={`!p-8 !rounded-[32px] border border-slate-100/80 shadow-md shadow-slate-200/40 bg-white relative overflow-hidden group !min-h-0 ${className}`}
  >
    <div className={`absolute top-0 left-0 w-full h-[4px] bg-slate-50`} />
    <div
      className={`absolute top-0 left-0 w-16 h-[4px] bg-${accentColor} rounded-r-full shadow-[0_0_8px_rgba(var(--color-${accentColor}-rgb),0.3)] group-hover:w-full transition-all duration-700`}
    />

    <div className="flex items-center justify-between mb-6 relative z-10">
      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-3">
        <div
          className={`size-9 rounded-xl bg-white flex items-center justify-center text-${accentColor} text-lg shadow-sm border border-slate-100/50 transition-transform duration-500`}
        >
          {icon}
        </div>
        {title}
      </h4>
    </div>
    <div className="relative z-10">{children}</div>
  </Card>
);

const StatusMiniCard = ({
  title,
  value,
  subValue,
  icon,
  progress,
  color = 'primary',
  className,
}) => (
  <div
    className={cn(
      'p-6 rounded-[32px] transition-all duration-500 group overflow-hidden relative border border-slate-100 shadow-lg shadow-slate-200/40 bg-white hover:shadow-xl hover:border-primary/10 hover:-translate-y-1',
      className
    )}
  >
    <div
      className={`absolute top-0 right-0 p-4 text-${color} opacity-[0.08] group-hover:opacity-[0.15] group-hover:scale-125 transition-all duration-700 pointer-events-none`}
    >
      {React.cloneElement(icon, { style: { fontSize: '80px' } })}
    </div>

    <div className="flex flex-col gap-5 relative z-10">
      <div className="flex items-center gap-3">
        <div
          className={`size-9 rounded-xl bg-${color}/10 flex items-center justify-center text-${color} text-base transition-transform group-hover:scale-110`}
        >
          {icon}
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          {title}
        </span>
      </div>

      <div className="flex items-baseline gap-2.5">
        <span className="text-xl font-black text-slate-900 tracking-tighter tabular-nums leading-none">
          {value}
        </span>
        {subValue && (
          <span className="text-[11px] font-bold text-slate-500 tracking-tight leading-tight">
            {subValue}
          </span>
        )}
      </div>

      {progress !== undefined && (
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
            <span className="text-slate-400">{STUDENT_ACTIVITY_UI.OVERVIEW.COMPLETED}</span>
            <span className={`text-${color} font-black`}>{progress}%</span>
          </div>
          <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
            <div
              className={`h-full bg-${color} rounded-full shadow-[0_0_8px_rgba(var(--color-${color}-rgb),0.4)] transition-all duration-1000 ease-out`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  </div>
);

export default function OverviewTab({
  student,
  evaluations = [],
  violations = [],
  logbookTotal,
  loading,
}) {
  if (loading || !student)
    return (
      <div className="p-32 text-center">
        <div className="inline-block size-12 border-[5px] border-primary/20 border-t-primary rounded-full animate-spin mb-8" />
        <div className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[11px] animate-pulse">
          {UI_TEXT.COMMON.LOADING}
        </div>
      </div>
    );

  const isUnplaced =
    student.internshipStatus === STUDENT_ACTIVITY_UI.MAPPING.STATUS.UNPLACED ||
    student.internshipStatus === 5;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 -mt-4">
      <div className="lg:col-span-6 space-y-6">
        <SectionCard
          title={STUDENT_ACTIVITY_UI.OVERVIEW.PERSONAL_INFO}
          icon={<SolutionOutlined />}
          accentColor="primary"
        >
          <div className="space-y-1">
            <InfoRow
              label={STUDENT_ACTIVITY_UI.OVERVIEW.INFO_FIELDS.FULL_NAME}
              value={student.fullName}
              icon={<UserOutlined />}
            />
            <InfoRow
              label={STUDENT_ACTIVITY_UI.OVERVIEW.INFO_FIELDS.CLASS}
              value={student.className}
              icon={<TeamOutlined />}
            />
            <InfoRow
              label={STUDENT_ACTIVITY_UI.OVERVIEW.INFO_FIELDS.STUDENT_ID}
              value={student.studentCode}
              icon={<ReadOutlined />}
            />
            <InfoRow
              label={STUDENT_ACTIVITY_UI.OVERVIEW.INFO_FIELDS.MAJOR}
              value={student.major}
              icon={<ReadOutlined />}
            />
            <InfoRow
              label={STUDENT_ACTIVITY_UI.OVERVIEW.INFO_FIELDS.INTERNSHIP_TERM}
              value={
                student.termName
                  ? `${student.termName} (${dayjs(student.termStartDate).format('DD/MM/YYYY')} – ${dayjs(student.termEndDate).format('DD/MM/YYYY')})`
                  : null
              }
              icon={<CalendarOutlined />}
            />
          </div>

          <div className="my-6 h-px bg-slate-100 mx-4" />

          <div className="space-y-1">
            <div className="flex items-center justify-between mb-4 px-4 text-info">
              <h5 className="text-[9px] font-bold uppercase tracking-[0.15em] flex items-center gap-2">
                <TeamOutlined />
                {STUDENT_ACTIVITY_UI.OVERVIEW.INFO_FIELDS.BUSINESS_MENTOR_INFO}
              </h5>
            </div>

            <InfoRow
              label={STUDENT_ACTIVITY_UI.OVERVIEW.INFO_FIELDS.ENTERPRISE}
              value={isUnplaced ? STUDENT_ACTIVITY_UI.OVERVIEW.NO_BUSINESS : student.enterpriseName}
              icon={<HomeOutlined />}
            />
            {!isUnplaced && (
              <>
                <InfoRow
                  label={STUDENT_ACTIVITY_UI.OVERVIEW.INFO_FIELDS.DEPARTMENT_POSITION}
                  value={student.enterprisePosition}
                  icon={<SolutionOutlined />}
                />
                <InfoRow
                  label={STUDENT_ACTIVITY_UI.OVERVIEW.INFO_FIELDS.MENTOR}
                  value={student.mentorName}
                  icon={<UserOutlined />}
                />
                <InfoRow
                  label={STUDENT_ACTIVITY_UI.OVERVIEW.INFO_FIELDS.MENTOR_EMAIL}
                  value={student.mentorEmail}
                  icon={<MailOutlined />}
                />
                <InfoRow
                  label={STUDENT_ACTIVITY_UI.OVERVIEW.INFO_FIELDS.DURATION}
                  value={
                    student.termStartDate && student.termEndDate
                      ? `${dayjs(student.termStartDate).format('DD/MM/YYYY')} – ${dayjs(student.termEndDate).format('DD/MM/YYYY')}`
                      : UI_TEXT.COMMON.EMPTY_VALUE
                  }
                  icon={<CalendarOutlined />}
                />
              </>
            )}
          </div>
        </SectionCard>
      </div>

      <div className="lg:col-span-4 space-y-6">
        {!isUnplaced && logbookTotal && (
          <StatusMiniCard
            title={STUDENT_ACTIVITY_UI.LOGBOOK_ACTIVITY}
            value={`${logbookTotal.submitted}/${logbookTotal.total}`}
            subValue={
              logbookTotal.missing > 0
                ? `(${STUDENT_ACTIVITY_UI.OVERVIEW.MISSING_TEXT}: ${logbookTotal.missing})`
                : STUDENT_ACTIVITY_UI.OVERVIEW.ALL_SUBMITTED
            }
            icon={<ReadOutlined />}
            progress={logbookTotal.percentComplete}
            color="info"
          />
        )}

        <StatusMiniCard
          title={STUDENT_ACTIVITY_UI.OVERVIEW.MENTOR_EVALUATION}
          value={student.publishedEvaluationCount || 0}
          subValue={STUDENT_ACTIVITY_UI.OVERVIEW.PUBLISHED_CYCLES}
          icon={<SolutionOutlined />}
          color="warning"
          className={evaluations.length === 0 ? 'opacity-60' : ''}
        />

        {student.violationCount > 0 ? (
          <StatusMiniCard
            title={STUDENT_ACTIVITY_UI.OVERVIEW.RECENT_VIOLATIONS}
            value={student.violationCount}
            subValue={
              violations[0]?.description
                ? `${STUDENT_ACTIVITY_UI.OVERVIEW.LATEST}: ${violations[0].description}`
                : STUDENT_ACTIVITY_UI.VIOLATIONS.DISCIPLINARY_RECORD
            }
            icon={<ExclamationCircleOutlined />}
            color="danger"
          />
        ) : (
          <StatusMiniCard
            title={STUDENT_ACTIVITY_UI.OVERVIEW.DISCIPLINE}
            value={0}
            subValue={STUDENT_ACTIVITY_UI.OVERVIEW.NO_VIOLATIONS}
            icon={<CheckCircleOutlined />}
            color="success"
            variant="soft"
          />
        )}
      </div>
    </div>
  );
}

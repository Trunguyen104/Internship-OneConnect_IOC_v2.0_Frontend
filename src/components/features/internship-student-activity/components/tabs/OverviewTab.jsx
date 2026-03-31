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
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">
        {label}
      </span>
    </div>
    <span className="text-sm font-bold text-slate-800 tracking-tight break-words flex-1">
      {value || <span className="opacity-20">{UI_TEXT.COMMON.EMPTY_VALUE}</span>}
    </span>
  </div>
);

const SectionCard = ({ title, children, icon, className, accentColor = 'primary' }) => (
  <Card
    className={`!p-6 !rounded-[24px] border border-white shadow-xl shadow-slate-200/40 bg-white relative overflow-hidden group !min-h-0 ${className}`}
  >
    <div className={`absolute top-0 left-0 w-full h-[4px] bg-slate-50`} />
    <div
      className={`absolute top-0 left-0 w-16 h-[4px] bg-${accentColor} rounded-r-full shadow-[0_0_8px_rgba(var(--color-${accentColor}-rgb),0.3)] group-hover:w-full transition-all duration-700`}
    />

    <div className="flex items-center justify-between mb-6 relative z-10">
      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-3">
        <div
          className={`size-9 rounded-xl bg-white flex items-center justify-center text-${accentColor} text-lg shadow-sm border border-slate-100 transition-transform duration-500`}
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
    className={`p-5 rounded-[24px] bg-white border border-white shadow-lg shadow-slate-200/30 hover:shadow-xl transition-all duration-500 group overflow-hidden relative ${className}`}
  >
    <div
      className={`absolute top-0 right-0 p-4 text-${color} opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-700`}
    >
      {React.cloneElement(icon, { style: { fontSize: '64px' } })}
    </div>

    <div className="flex flex-col gap-4 relative z-10">
      <div className="flex items-center gap-3">
        <div
          className={`size-8 rounded-lg bg-${color}/10 flex items-center justify-center text-${color} text-sm`}
        >
          {icon}
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
          {title}
        </span>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-black text-slate-800 tracking-tighter italic">{value}</span>
        {subValue && <span className="text-xs font-bold text-slate-400">{subValue}</span>}
      </div>

      {progress !== undefined && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-[9px] font-black uppercase">
            <span className="text-slate-400">{STUDENT_ACTIVITY_UI.OVERVIEW.COMPLETED}</span>
            <span className={`text-${color}`}>{progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
            <div
              className={`h-full bg-${color} rounded-full transition-all duration-1000`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  </div>
);

export default function OverviewTab({ student, evaluations = [], violations = [], loading }) {
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
              value={`${student.termName} (${dayjs(student.termStartDate).format('DD/MM/YYYY')} – ${dayjs(student.termEndDate).format('DD/MM/YYYY')})`}
              icon={<CalendarOutlined />}
            />
          </div>

          <div className="my-6 h-px bg-slate-100 mx-4" />

          <div className="space-y-1">
            <div className="flex items-center justify-between mb-4 px-4 text-info">
              <h5 className="text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
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
        {!isUnplaced && student.logbook && (
          <StatusMiniCard
            title={STUDENT_ACTIVITY_UI.LOGBOOK_ACTIVITY}
            value={`${student.logbook.submitted}/${student.logbook.total}`}
            subValue={`(${STUDENT_ACTIVITY_UI.OVERVIEW.MISSING}: ${student.logbook.missing})`}
            icon={<ReadOutlined />}
            progress={student.logbook.percentComplete}
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

        {student.violationCount > 0 && (
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
        )}

        {student.violationCount === 0 && (
          <div className="p-5 rounded-[24px] bg-emerald-50/50 border border-emerald-100 flex items-center gap-4">
            <div className="size-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
              <CheckCircleOutlined />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600/70">
                {STUDENT_ACTIVITY_UI.OVERVIEW.DISCIPLINE}
              </span>
              <span className="text-sm font-black text-emerald-800 tracking-tight">
                {STUDENT_ACTIVITY_UI.OVERVIEW.NO_VIOLATIONS}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import {
  CalendarOutlined,
  ExclamationCircleOutlined,
  MailOutlined,
  ReadOutlined,
  SolutionOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import React from 'react';

import Badge from '@/components/ui/badge';
import Card from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

import { STUDENT_ACTIVITY_UI } from '../../constants/student-activity.constants';

const InfoRow = ({ label, value, icon, className }) => (
  <div className={`flex items-center justify-between py-4 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-all px-3 rounded-xl group ${className}`}>
    <div className="flex items-center gap-3">
      {icon && <span className="text-slate-400 text-lg opacity-40 group-hover:opacity-100 transition-opacity">{icon}</span>}
      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
    </div>
    <span className="text-sm font-black text-slate-700 tracking-tight text-right break-words max-w-[60%]">{value || <span className="opacity-20">—</span>}</span>
  </div>
);

const SectionCard = ({ title, children, icon, className, headerExtra }) => (
  <Card className={`!p-6 !rounded-[32px] border-none shadow-sm bg-white overflow-hidden transition-all hover:shadow-md ${className}`}>
    <div className="flex items-center justify-between mb-6">
      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
        <div className="size-8 rounded-xl bg-slate-50 flex items-center justify-center text-primary text-sm shadow-inner">
          {icon}
        </div>
        {title}
      </h4>
      {headerExtra}
    </div>
    {children}
  </Card>
);

export default function OverviewTab({ student, loading }) {
  if (loading || !student) return <div className="p-8 text-center text-slate-400 font-bold animate-pulse italic">Loading comprehensive student data...</div>;

  const { OVERVIEW } = STUDENT_ACTIVITY_UI.DETAIL;
  const isUnplaced = student.derivedStatus?.value === 'UNPLACED';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Column Left: 60% */}
      <div className="lg:col-span-6 space-y-8">
        <SectionCard title={OVERVIEW.SECTION_PERSONAL} icon={<UserOutlined />}>
          <div className="grid grid-cols-1 gap-1">
            <InfoRow label={OVERVIEW.NAME} value={student.studentFullName} icon={<SolutionOutlined />} />
            <InfoRow label={OVERVIEW.CLASS} value={student.className || student.class} icon={<TeamOutlined />} />
            <InfoRow label={OVERVIEW.STUDENT_ID} value={student.studentCode} icon={<ReadOutlined />} />
            <InfoRow label={OVERVIEW.MAJOR} value={student.major} icon={<ReadOutlined />} />
            <InfoRow label={OVERVIEW.YEAR} value={student.academicYear || student.year} icon={<CalendarOutlined />} />
          </div>
        </SectionCard>

        <SectionCard title={OVERVIEW.ENTERPRISE} icon={<TeamOutlined />} headerExtra={isUnplaced && <Badge variant="danger-soft" size="xs">Waiting for placement</Badge>}>
          <div className="grid grid-cols-1 gap-1">
            <InfoRow label={OVERVIEW.ENTERPRISE} value={isUnplaced ? OVERVIEW.UNPLACED : student.enterpriseName} />
            {!isUnplaced && (
              <>
                <InfoRow label={OVERVIEW.DEPARTMENT} value={student.department} />
                <InfoRow label={OVERVIEW.MENTOR} value={student.mentorName} icon={<UserOutlined />} />
                <InfoRow label={OVERVIEW.EMAIL} value={student.mentorEmail} icon={<MailOutlined />} />
              </>
            )}
          </div>
        </SectionCard>

        <SectionCard title={OVERVIEW.TERM} icon={<CalendarOutlined />}>
          <div className="grid grid-cols-1 gap-1">
            <InfoRow label={OVERVIEW.TERM} value={student.termName} />
            <InfoRow 
              label="Internship Duration" 
              value={student.startDate ? `${student.startDate} – ${student.endDate}` : '—'} 
              icon={<CalendarOutlined />} 
            />
          </div>
        </SectionCard>
      </div>

      {/* Column Right: 40% */}
      <div className="lg:col-span-4 space-y-6">
        {!isUnplaced && (
          <SectionCard title="📖 LOGBOOK ACTIVITY" className="bg-primary/5 ring-1 ring-primary/10">
            <div className="flex flex-col gap-6 p-2">
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="size-2 rounded-full bg-error animate-pulse" />
                    <span className="text-[11px] font-black text-error/60 uppercase tracking-widest leading-none">Missing: {student.activity?.missing}</span>
                  </div>
                  <span className="text-3xl font-black text-slate-800 tracking-tight leading-none italic">Submitted: {student.activity?.submitted}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-4xl font-black text-primary tracking-tighter leading-none">{student.activity?.progress}%</span>
                  <span className="text-[10px] font-bold text-primary/40 uppercase tracking-tighter">Completion</span>
                </div>
              </div>
              
              <div className="relative pt-2">
                <Progress
                  type="line"
                  percent={student.activity?.progress}
                  strokeColor={{
                    '0%': student.activity?.progress < 50 ? '#ef4444' : '#10b981',
                    '100%': '#2563eb',
                  }}
                  size={['100%', 12]}
                  showInfo={false}
                  className="!rounded-full shadow-inner"
                />
              </div>
              
              <div className="bg-white/50 p-3 rounded-2xl border border-primary/10 text-center">
                <span className="text-[11px] font-black text-primary/60 uppercase tracking-[0.15em] leading-normal italic">
                  {OVERVIEW.LOGBOOK_PROGRESS.replace('{p}', student.activity?.progress)}
                </span>
              </div>
            </div>
          </SectionCard>
        )}

        <SectionCard title="📋 PUBLISHED EVALUATIONS" icon={<SolutionOutlined />}>
          {student.evalSummary && student.evalSummary.length > 0 ? (
            <div className="space-y-4 pt-2">
              {student.evalSummary.map((ev, i) => (
                <div key={i} className="group flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-sm transition-all cursor-default">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-800 tracking-tight">{ev.cycleName}</span>
                    <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-1">SLA Met</span>
                  </div>
                  <Badge variant={ev.status === 'Hoàn tất' || ev.status === 'Completed' ? 'success' : 'warning'} size="xs" className="font-black uppercase tracking-widest text-[9px] py-1">
                    {ev.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
              <SolutionOutlined className="text-slate-200 text-4xl mb-3" />
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{OVERVIEW.NO_EVALUATION}</p>
            </div>
          )}
        </SectionCard>

        {student.violationCount > 0 && (
          <SectionCard title="⚠️ RECENT VIOLATIONS" className="bg-error-surface/20 ring-1 ring-error/10 overflow-visible" icon={<ExclamationCircleOutlined className="text-error" />}>
            <div className="flex items-center gap-5 p-2">
              <div className="size-16 rounded-[24px] bg-white shadow-xl flex items-center justify-center text-error text-2xl font-black border border-error/10 shrink-0 transform -rotate-3 hover:rotate-0 transition-transform">
                {student.violationCount}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-black text-error leading-tight truncate">{student.latestViolationType || 'Disciplinary Issue'}</span>
                <span className="text-[10px] font-black text-error/30 uppercase tracking-[0.2em] mt-1 italic">Last report recorded</span>
              </div>
            </div>
          </SectionCard>
        )}
      </div>
    </div>
  );
}

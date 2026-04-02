'use client';

import { Button, Empty, Skeleton, Space, Tag, Tooltip } from 'antd';
import dayjs from 'dayjs';
import {
  AlertTriangle,
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Edit,
  ExternalLink,
  FileText,
  MapPin,
  Send,
  Target,
  Trash2,
  Users,
  XCircle,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useMemo } from 'react';

import { PageLayout } from '@/components/ui/pagelayout';

import { JOB_AUDIENCE, JOB_POSTING_UI, JOB_STATUS } from '../constants/job-postings.constant';
import { useJobPostingActions, useJobPostingDetail } from '../hooks/useJobPostings';
import { useInternshipPhases } from '../hooks/useJobPostings';
import { useJobPostingsActionsHandler } from '../hooks/useJobPostingsActionsHandler';
import JobPostingDrawer from './JobPostingDrawer';
import JobPostingStatusBadge from './JobPostingStatusBadge';

/**
 * Premium Detail Page for Job Postings (HR View).
 */
export default function JobPostingDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { jobDetail: job, isLoading } = useJobPostingDetail(id);
  const { phases } = useInternshipPhases();
  const actions = useJobPostingActions();
  const { isDrawerOpen, selectedRecord, onAction, closeDrawer } = useJobPostingsActionsHandler({
    actions,
  });

  const { applicationsSummary, totalApplications } = useMemo(() => {
    if (!job) return { applicationsSummary: {}, totalApplications: 0 };

    const summary = {};
    let total = 0;

    (job.applicationStatusCounts || []).forEach((item) => {
      summary[item.status] = item.count;
      total += item.count;
    });

    return { applicationsSummary: summary, totalApplications: total };
  }, [job]);

  const activeAppCount = useMemo(() => {
    if (!job) return 0;
    return (job.applicationStatusCounts || [])
      .filter((item) => [1, 2, 3].includes(item.status)) // Applied, Interviewing, Offered
      .reduce((sum, item) => sum + item.count, 0);
  }, [job]);

  // Lookup Phase Info from the list if not provided in the detail object
  const phaseInfo = useMemo(() => {
    if (!job?.internshipPhaseId || !phases) return null;
    // Ensure case-insensitive or string-based ID comparison
    return phases.find((p) => {
      const pId = p.internshipPhaseId || p.phaseId || p.id;
      return pId?.toString().toLowerCase() === job.internshipPhaseId.toString().toLowerCase();
    });
  }, [job?.internshipPhaseId, phases]);

  const { isPhaseFull, placedCount, totalCapacity } = useMemo(() => {
    if (!phaseInfo) return { isPhaseFull: false, placedCount: 0, totalCapacity: 0 };

    const total = phaseInfo.capacity || 0;
    const remaining = phaseInfo.remainingCapacity ?? total;
    const placed = total - remaining;

    return {
      isPhaseFull: total > 0 && remaining <= 0,
      placedCount: placed,
      totalCapacity: total,
    };
  }, [phaseInfo]);

  const displayPhaseName = job?.termName || job?.internshipPhaseName || phaseInfo?.name || 'N/A';

  const displayPhaseDates = useMemo(() => {
    const isInvalid = (d) => !d || dayjs(d).year() <= 1901;

    // Prioritize phaseInfo dates if job dates are default/invalid
    const start = isInvalid(job?.startDate) ? phaseInfo?.startDate : job?.startDate;
    const end = isInvalid(job?.endDate) ? phaseInfo?.endDate : job?.endDate;

    if (isInvalid(start) || isInvalid(end)) return null;

    return `${dayjs(start).format('MMM D')} — ${dayjs(end).format('MMM D, YYYY')}`;
  }, [job?.startDate, job?.endDate, phaseInfo]);

  if (isLoading) {
    return (
      <PageLayout className="animate-pulse bg-[#f8f9fa]">
        <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
          <Skeleton.Button active size="small" shape="round" className="mb-4" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton active paragraph={{ rows: 4 }} className="bg-surface p-8 rounded-[2rem]" />
              <Skeleton active paragraph={{ rows: 10 }} className="bg-surface p-8 rounded-[2rem]" />
            </div>
            <Skeleton active paragraph={{ rows: 8 }} className="bg-surface p-8 rounded-[2rem]" />
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!job) {
    return (
      <PageLayout className="flex flex-col items-center justify-center min-h-[70vh] bg-[#f8f9fa]">
        <Empty description={JOB_POSTING_UI.DETAIL.NOT_FOUND} />
        <Button
          type="primary"
          onClick={() => router.push('/company/jobs')}
          className="mt-6 h-11 px-8 rounded-xl font-bold font-sm"
        >
          {JOB_POSTING_UI.DETAIL.BACK_TO_LIST}
        </Button>
      </PageLayout>
    );
  }

  const handleAction = (key) => {
    onAction(key, job);
  };

  return (
    <PageLayout className="pb-20 bg-[#f8f9fa]">
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-6 w-full animate-in slide-in-from-bottom duration-700">
        {/* Navigation & Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <button
            onClick={() => router.push('/company/jobs')}
            className="flex items-center gap-2 text-muted hover:text-primary transition-colors group"
          >
            <div className="bg-white p-2 rounded-xl border border-border/40 group-hover:border-primary/30 shadow-sm transition-all">
              <ArrowLeft className="h-4 w-4" />
            </div>
            <span className="font-bold text-[10px] uppercase tracking-widest">
              {JOB_POSTING_UI.DETAIL.BACK_TO_LIST}
            </span>
          </button>

          <Space size="middle">
            {job.status === JOB_STATUS.DRAFT && (
              <Tooltip title={JOB_POSTING_UI.MENU.PUBLISH}>
                <Button
                  icon={<Send className="h-4 w-4" />}
                  className="h-10 w-10 flex items-center justify-center rounded-xl bg-success text-white border-none shadow-lg shadow-success/20 hover:brightness-105 active:scale-95 transition-all"
                  onClick={() => handleAction('publish')}
                />
              </Tooltip>
            )}
            {job.status === JOB_STATUS.PUBLISHED && (
              <Tooltip title={JOB_POSTING_UI.MENU.CLOSE}>
                <Button
                  icon={<XCircle className="h-4 w-4" />}
                  className="h-10 w-10 flex items-center justify-center rounded-xl bg-warning text-white border-none shadow-lg shadow-warning/20 hover:brightness-105 active:scale-95 transition-all"
                  onClick={() => handleAction('close')}
                />
              </Tooltip>
            )}
            {job.status === JOB_STATUS.CLOSED && (
              <Tooltip title={JOB_POSTING_UI.MENU.REPUBLISH}>
                <Button
                  icon={<Send className="h-4 w-4" />}
                  className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary text-white border-none shadow-lg shadow-primary/20 hover:brightness-105 active:scale-95 transition-all"
                  onClick={() => handleAction('publish')}
                />
              </Tooltip>
            )}
            <Tooltip title={JOB_POSTING_UI.MENU.EDIT}>
              <Button
                icon={<Edit className="h-4 w-4" />}
                className="h-10 w-10 flex items-center justify-center rounded-xl border-primary text-primary hover:bg-primary/5 shadow-sm active:scale-95 transition-all"
                onClick={() => handleAction('edit')}
              />
            </Tooltip>
            <Tooltip title={JOB_POSTING_UI.MENU.DELETE}>
              <Button
                icon={<Trash2 className="h-4 w-4" />}
                danger
                className="h-10 w-10 flex items-center justify-center rounded-xl p-0 shadow-sm active:scale-95 transition-all"
                onClick={() => handleAction('delete')}
              />
            </Tooltip>
          </Space>
        </div>

        {isPhaseFull && (
          <div className="mb-8 p-4 md:p-6 bg-warning/5 border border-warning/10 rounded-[2rem] flex flex-col md:flex-row items-center gap-4 md:gap-6 animate-in slide-in-from-top duration-500 shadow-sm shadow-warning/5 ring-1 ring-warning/20">
            <div className="bg-warning/10 p-3 rounded-2xl shrink-0">
              <AlertTriangle className="h-6 w-6 text-warning" />
            </div>
            <div className="space-y-1 text-center md:text-left">
              <p className="text-sm font-black text-text uppercase tracking-widest opacity-80">
                {JOB_POSTING_UI.DETAIL.PHASE_CAPACITY_REACHED}
              </p>
              <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">
                {JOB_POSTING_UI.FORM.MESSAGES.CAPACITY_WARNING(
                  displayPhaseName,
                  placedCount,
                  totalCapacity
                )}
              </p>
            </div>
            <div className="md:ml-auto shrink-0">
              <Button
                onClick={() => handleAction('close')}
                className="rounded-xl h-10 px-6 font-bold text-xs uppercase tracking-widest border-warning/30 text-warning hover:bg-warning/5"
              >
                {JOB_POSTING_UI.MENU.CLOSE}
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-surface border border-border/40 rounded-[2.5rem] p-8 md:p-10 shadow-sm relative overflow-hidden ring-1 ring-white/50">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <JobPostingStatusBadge status={job.status} />
                </div>

                <h1 className="text-3xl md:text-4xl font-black text-text mb-4 tracking-tight leading-tight">
                  {job.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-muted font-bold text-[11px] uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 opacity-50" />
                    <span>{job.position}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 opacity-50" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 opacity-50" />
                    <span>{job.enterprise?.fullName || 'Your Company'}</span>
                  </div>
                </div>
              </div>

              {/* Abstract Glass Background Decoration */}
              <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            </div>

            {/* Content Details */}
            <div className="bg-surface border border-border/40 rounded-[2.5rem] p-8 md:p-10 shadow-sm space-y-12">
              <DetailSection
                title={JOB_POSTING_UI.FORM.FIELDS.DESCRIPTION}
                content={job.description}
                icon={<FileText className="h-5 w-5 text-primary" />}
              />
              <DetailSection
                title={JOB_POSTING_UI.FORM.FIELDS.REQUIREMENTS}
                content={job.requirements}
                icon={<Target className="h-5 w-5 text-warning" />}
              />
              <DetailSection
                title={JOB_POSTING_UI.FORM.FIELDS.BENEFITS}
                content={job.benefit}
                icon={<CheckCircle2 className="h-5 w-5 text-success" />}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card - Crucial for HR */}
            <div className="bg-surface border border-border/40 rounded-[2rem] p-8 shadow-sm overflow-hidden relative group">
              <h3 className="text-sm font-black text-text mb-6 uppercase tracking-widest flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                {JOB_POSTING_UI.DETAIL.APPLICANTS_SUMMARY}
              </h3>

              <div className="space-y-4">
                <StatItem
                  label={JOB_POSTING_UI.DETAIL.STATS.TOTAL_ACTIVE}
                  value={totalApplications}
                  color="bg-primary/5 text-primary"
                  isMain
                />
                <div className="grid grid-cols-1 gap-3 pt-2">
                  <StatItem
                    label={JOB_POSTING_UI.DETAIL.STATS.APPLIED}
                    value={applicationsSummary[1] || 0}
                    color="bg-blue-50 text-blue-600"
                  />
                  <StatItem
                    label={JOB_POSTING_UI.DETAIL.STATS.INTERVIEWING}
                    value={applicationsSummary[2] || 0}
                    color="bg-orange-50 text-orange-600"
                  />
                  <StatItem
                    label={JOB_POSTING_UI.DETAIL.STATS.OFFERED}
                    value={applicationsSummary[3] || 0}
                    color="bg-green-50 text-green-600"
                  />
                  <StatItem
                    label={JOB_POSTING_UI.DETAIL.STATS.PLACED}
                    value={applicationsSummary[5] || 0}
                    color="bg-purple-50 text-purple-600"
                  />
                </div>
              </div>

              {totalApplications > 0 && (
                <Button
                  type="link"
                  className="w-full mt-6 text-primary font-bold text-[11px] uppercase tracking-widest p-0 flex items-center justify-center gap-2"
                  onClick={() => router.push(`/applications?jobId=${job.jobId}`)}
                >
                  {JOB_POSTING_UI.DETAIL.MANAGE_ALL_APPLICANTS} <ExternalLink className="h-3 w-3" />
                </Button>
              )}

              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Users className="h-20 w-20" />
              </div>
            </div>

            {/* Quick Facts Card */}
            <div className="bg-surface border border-border/40 rounded-[2rem] p-8 shadow-sm">
              <h3 className="text-sm font-black text-text mb-6 uppercase tracking-widest">
                {JOB_POSTING_UI.DETAIL.JOB_DETAILS}
              </h3>
              <div className="space-y-6">
                <FactItem
                  icon={<Calendar className="h-4 w-4" />}
                  label={JOB_POSTING_UI.DETAIL.FACT_LABELS.PHASE}
                  value={displayPhaseName}
                  subValue={displayPhaseDates}
                />
                <FactItem
                  icon={<Clock className="h-4 w-4" />}
                  label={JOB_POSTING_UI.DETAIL.FACT_LABELS.DEADLINE}
                  value={
                    job.expireDate
                      ? dayjs(job.expireDate).format('DD MMMM, YYYY')
                      : JOB_POSTING_UI.PLACEHOLDERS.DASH_FALLBACK
                  }
                  color={dayjs(job.expireDate).isBefore(dayjs()) ? 'text-danger' : 'text-text'}
                />
                <FactItem
                  icon={<Target className="h-4 w-4" />}
                  label={JOB_POSTING_UI.DETAIL.FACT_LABELS.AUDIENCE}
                  value={
                    job.audience === JOB_AUDIENCE.PUBLIC
                      ? JOB_POSTING_UI.FORM.REACH.PUBLIC_TITLE
                      : JOB_POSTING_UI.FORM.REACH.TARGETED_TITLE
                  }
                />
                {job.audience === JOB_AUDIENCE.TARGETED && job.universityIds?.length > 0 && (
                  <div className="ml-9 mt-2 flex flex-wrap gap-1.5">
                    {job.universityIds.map((id, idx) => (
                      <Tag
                        key={idx}
                        className="m-0 text-[10px] font-bold uppercase tracking-tight bg-muted/5 border-border rounded-lg"
                      >
                        {JOB_POSTING_UI.DETAIL.SCHOOL_ID} {id}
                      </Tag>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Re-use the drawer for editing */}
      <JobPostingDrawer
        open={isDrawerOpen}
        onCancel={closeDrawer}
        record={selectedRecord}
        phases={phases}
        onSuccess={() => {
          closeDrawer();
          // We can optionally refresh data here but Detail fetch is usually enough
          router.refresh();
        }}
      />
    </PageLayout>
  );
}

// Helper Components
function DetailSection({ title, content, icon }) {
  if (!content && !title) return null;
  return (
    <section className="animate-in fade-in slide-in-from-left duration-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-surface p-2.5 rounded-2xl border border-border/40 shadow-sm ring-4 ring-bg/50">
          {icon}
        </div>
        <h2 className="text-xl font-black text-text tracking-tight uppercase tracking-widest text-sm">
          {title}
        </h2>
      </div>
      <div
        className="text-muted text-sm leading-relaxed prose prose-slate max-w-none prose-sm whitespace-pre-wrap pl-1"
        dangerouslySetInnerHTML={{ __html: content || `<em>${JOB_POSTING_UI.DETAIL.NO_INFO}</em>` }}
      />
    </section>
  );
}

function StatItem({ label, value, color, isMain = false }) {
  return (
    <div
      className={`p-4 rounded-2xl flex items-center justify-between shadow-sm transition-all hover:scale-[1.01] ${color} ${isMain ? 'ring-2 ring-primary/20 bg-primary/5' : 'border border-border/10'}`}
    >
      <span
        className={`font-bold tracking-tight ${isMain ? 'text-[11px] uppercase tracking-widest' : 'text-xs'}`}
      >
        {label}
      </span>
      <span className={`font-black ${isMain ? 'text-2xl' : 'text-lg'}`}>{value}</span>
    </div>
  );
}

function FactItem({ icon, label, value, subValue, color = 'text-text' }) {
  return (
    <div className="flex gap-4">
      <div className="h-10 w-10 rounded-2xl bg-muted/5 flex items-center justify-center shrink-0 border border-border/10">
        <span className="text-primary">{icon}</span>
      </div>
      <div>
        <p className="text-muted text-[10px] font-black uppercase tracking-widest mb-1 leading-none">
          {label}
        </p>
        <p className={`font-bold text-xs ${color} leading-snug`}>{value || 'N/A'}</p>
        {subValue && <p className="text-muted text-[10px] font-medium mt-0.5">{subValue}</p>}
      </div>
    </div>
  );
}

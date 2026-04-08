'use client';

import { Tooltip } from 'antd';
import {
  AlertCircle,
  Building2,
  Calendar,
  ChevronLeft,
  Globe,
  MapPin,
  Sparkles,
  Timer,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';

import { PageLayout } from '@/components/ui/pagelayout';

import { EXPLORE_JOBS_UI } from '../constants/explore-jobs.constant';
import { useExploreJobs } from '../hooks/useExploreJobs';
import ApplyModal from './ApplyModal';

export default function JobDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { useJobDetail, getEligibility, isApplying, applyJob, cvUrl, hasCV } = useExploreJobs();
  const { data: job, isLoading: isJobLoading } = useJobDetail(id);

  const isLoading = isJobLoading;

  if (isLoading) {
    return (
      <PageLayout className="animate-pulse">
        <div className="h-10 w-32 bg-surface rounded-xl mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-64 bg-surface rounded-4xl" />
            <div className="h-96 bg-surface rounded-4xl" />
          </div>
          <div className="h-96 bg-surface rounded-4xl" />
        </div>
      </PageLayout>
    );
  }

  if (!job && !isJobLoading) {
    return (
      <PageLayout className="flex flex-col items-center justify-center min-h-[60vh] bg-[#f8f9fa]">
        <h2 className="text-xl font-bold text-text mb-4">
          {EXPLORE_JOBS_UI.DETAIL.MESSAGES.NOT_FOUND}
        </h2>
        <button
          onClick={() => router.push('/explore-jobs')}
          className="bg-primary text-white px-6 py-2 rounded-xl font-bold font-sm"
        >
          {EXPLORE_JOBS_UI.DETAIL.MESSAGES.BACK_TO_LIST}
        </button>
      </PageLayout>
    );
  }

  if (!job) return null;

  const eligibility = getEligibility(job.jobId);

  return (
    <PageLayout className="animate-in slide-in-from-bottom duration-700 pb-20 bg-[#f8f9fa]">
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-6 w-full">
        {/* Navigation */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted hover:text-primary transition-colors mb-5 group"
        >
          <div className="bg-white p-1.5 rounded-lg border border-border/40 group-hover:border-primary/30 shadow-sm">
            <ChevronLeft className="h-4 w-4" />
          </div>
          <span className="font-bold text-[10px] uppercase tracking-widest">
            {EXPLORE_JOBS_UI.DETAIL.BACK_LINK}
          </span>
        </button>

        {/* Missing CV Prominent Header - Direct guidance */}
        {!hasCV && (
          <div className="mb-6 bg-warning/5 border border-warning/20 rounded-3xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 animate-in slide-in-from-top duration-500">
            <div className="flex items-center gap-3">
              <div className="bg-warning/10 p-2 rounded-xl">
                <AlertCircle className="h-5 w-5 text-warning" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-text mb-0.5">
                  {EXPLORE_JOBS_UI.ELIGIBILITY.NO_CV_TITLE}
                </h4>
                <p className="text-xs text-muted">{EXPLORE_JOBS_UI.ELIGIBILITY.NO_CV}</p>
              </div>
            </div>
            <Link
              href="/student/profile"
              className="bg-warning text-white px-5 py-2 rounded-xl font-bold text-[13px] hover:bg-warning-hover transition-all shadow-lg shadow-warning/10 whitespace-nowrap"
            >
              {EXPLORE_JOBS_UI.APPLY_MODAL.UPDATE_CV_NOW}
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Header - Compact */}
            <div className="bg-surface border border-border/40 rounded-4xl p-6 md:p-8 shadow-sm relative overflow-hidden">
              <div className="flex flex-col md:flex-row gap-6 items-start relative z-10">
                <div className="h-20 w-20 rounded-2xl bg-surface border-2 border-white shadow-lg flex items-center justify-center overflow-hidden shrink-0">
                  {job.enterprise?.logoUrl ? (
                    <img
                      src={job.enterprise.logoUrl}
                      alt={job.enterprise.fullName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-primary font-bold text-2xl">
                      {job.enterprise?.fullName?.[0]}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 bg-primary/5 text-primary text-[10px] font-bold px-2.5 py-1 rounded-full mb-3 uppercase tracking-widest">
                    <Sparkles className="h-3 w-3" />
                    <span>{job.position || EXPLORE_JOBS_UI.DETAIL.ROLE_BADGE_FALLBACK}</span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-text mb-3 leading-tight">
                    {job.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-muted text-sm font-medium">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 opacity-60" />
                      <span>{job.enterprise?.fullName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-primary/80">
                      <Sparkles className="h-3.5 w-3.5 opacity-60" />
                      <span>{job.position}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 opacity-60" />
                      <span>{job.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute top-0 right-0 w-1/4 h-full bg-linear-to-l from-primary/5 to-transparent pointer-events-none" />
            </div>

            {/* Details Section */}
            <div className="bg-surface border border-border/40 rounded-4xl p-6 md:p-8 shadow-sm space-y-10">
              <section>
                <h2 className="text-lg font-extrabold text-text mb-4 flex items-center gap-3">
                  <div className="h-6 w-1 bg-primary rounded-full" />
                  {EXPLORE_JOBS_UI.DETAIL.DESCRIPTION_TITLE}
                </h2>
                <div className="text-muted text-[13px] leading-relaxed space-y-4 whitespace-pre-wrap">
                  {job.description || EXPLORE_JOBS_UI.CARD.NOT_AVAILABLE}
                </div>
              </section>

              <section>
                <h2 className="text-lg font-extrabold text-text mb-4 flex items-center gap-3">
                  <div className="h-6 w-1 bg-primary rounded-full" />
                  {EXPLORE_JOBS_UI.DETAIL.REQUIREMENTS_TITLE}
                </h2>
                <div className="text-muted text-[13px] leading-relaxed space-y-4 whitespace-pre-wrap">
                  {job.requirements || EXPLORE_JOBS_UI.CARD.NOT_AVAILABLE}
                </div>
              </section>

              <section>
                <h2 className="text-lg font-extrabold text-text mb-4 flex items-center gap-3">
                  <div className="h-6 w-1 bg-primary rounded-full" />
                  {EXPLORE_JOBS_UI.DETAIL.BENEFITS_TITLE}
                </h2>
                <div className="text-muted text-[13px] leading-relaxed space-y-4 whitespace-pre-wrap">
                  {job.benefits || EXPLORE_JOBS_UI.CARD.NOT_AVAILABLE}
                </div>
              </section>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-surface border border-border/40 rounded-4xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-text mb-6">
                {EXPLORE_JOBS_UI.DETAIL.SIDEBAR.TITLE}
              </h3>

              <div className="space-y-5 mb-8">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                    <Sparkles className="h-4 w-4 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-muted text-[10px] font-bold uppercase tracking-widest mb-0.5">
                      {EXPLORE_JOBS_UI.DETAIL.SIDEBAR.POSITION}
                    </p>
                    <p className="text-text font-bold text-xs capitalize">
                      {job.position || EXPLORE_JOBS_UI.DETAIL.ROLE_BADGE_FALLBACK}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-muted text-[10px] font-bold uppercase tracking-widest mb-0.5">
                      {EXPLORE_JOBS_UI.DETAIL.SIDEBAR.DEADLINE}
                    </p>
                    <p className="text-text font-bold text-xs">
                      {job.deadline || EXPLORE_JOBS_UI.DETAIL.SIDEBAR.DEADLINE_FALLBACK}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-success/5 flex items-center justify-center shrink-0">
                    <Timer className="h-4 w-4 text-success" />
                  </div>
                  <div>
                    <p className="text-muted text-[10px] font-bold uppercase tracking-widest mb-0.5">
                      {EXPLORE_JOBS_UI.DETAIL.SIDEBAR.DURATION}
                    </p>
                    <p className="text-text font-bold text-xs">
                      {job.startDate} {EXPLORE_JOBS_UI.SEPARATOR.DATE_RANGE} {job.endDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-warning/5 flex items-center justify-center shrink-0">
                    <Globe className="h-4 w-4 text-warning" />
                  </div>
                  <div>
                    <p className="text-muted text-[10px] font-bold uppercase tracking-widest mb-0.5">
                      {EXPLORE_JOBS_UI.DETAIL.SIDEBAR.AUDIENCE}
                    </p>
                    <p className="text-text font-bold text-xs">
                      {job.audienceType || EXPLORE_JOBS_UI.DETAIL.SIDEBAR.AUDIENCE_PUBLIC}
                    </p>
                  </div>
                </div>
              </div>

              <Tooltip
                title={
                  !eligibility.eligible ? (
                    <div className="text-[11px] p-0.5">
                      {eligibility.reason}
                      {!hasCV && (
                        <Link
                          href="/student/profile"
                          className="ml-1 text-white border-b border-white hover:opacity-80 transition-opacity"
                        >
                          {EXPLORE_JOBS_UI.APPLY_MODAL.UPDATE_CV_LINK}
                        </Link>
                      )}
                    </div>
                  ) : (
                    ''
                  )
                }
                placement="topLeft"
              >
                <div className="w-full">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    disabled={!eligibility.eligible || isApplying}
                    className={`w-full py-3.5 rounded-xl font-bold text-sm text-white shadow-lg transition-all duration-300 ${
                      eligibility.eligible
                        ? 'bg-primary hover:bg-primary-hover shadow-primary/10 active:scale-[0.98]'
                        : eligibility.reason === EXPLORE_JOBS_UI.ELIGIBILITY.ACTIVE_APP_EXISTS
                          ? 'bg-success/20 text-success border border-success/30 cursor-default'
                          : 'bg-muted/30 cursor-not-allowed'
                    }`}
                  >
                    {isApplying
                      ? EXPLORE_JOBS_UI.DETAIL.SIDEBAR.PROCESSING
                      : eligibility.reason === EXPLORE_JOBS_UI.ELIGIBILITY.ACTIVE_APP_EXISTS
                        ? EXPLORE_JOBS_UI.DETAIL.SIDEBAR.APPLIED
                        : EXPLORE_JOBS_UI.DETAIL.SIDEBAR.APPLY_NOW}
                  </button>
                </div>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      <ApplyModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        job={job}
        cvUrl={cvUrl}
        isApplying={isApplying}
        onConfirm={async () => {
          await applyJob({ jobId: job.jobId });
          setIsModalOpen(false);
        }}
      />
    </PageLayout>
  );
}

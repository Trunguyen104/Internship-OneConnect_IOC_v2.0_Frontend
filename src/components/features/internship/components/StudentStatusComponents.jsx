'use client';

import dayjs from 'dayjs';
import { Briefcase, Building2, ChevronRight, FileText, Sparkles } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { STUDENT_APPLICATIONS_UI } from '@/components/features/student-applications/constants/uiText';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/ui/status-badge';
import { INTERNSHIP_UI } from '@/constants/internship-management/internship';
import { cn } from '@/lib/cn';

/**
 * Premium UI components for Student Dashboard to match AC-01 to AC-04
 */

// AC-01 Hero Empty State (Premium Glassmorphism Style)
export const StudentEmptyState = () => (
  <div className="relative overflow-hidden rounded-[40px] border border-slate-100 bg-white p-16 text-center shadow-2xl shadow-primary-100/20">
    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-50/50 blur-3xl" />
    <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-primary-100/30 blur-3xl" />

    <div className="relative flex flex-col items-center">
      <div className="relative mb-8 h-28 w-28 animate-bounce duration-3000">
        <div className="absolute inset-0 animate-pulse rounded-full bg-primary-100/50" />
        <div className="relative flex h-full w-full items-center justify-center rounded-full bg-linear-to-tr from-primary-50 via-white to-white shadow-inner">
          <Building2 className="size-12 text-primary-400" />
        </div>
      </div>

      <h3 className="mb-3 text-2xl font-black tracking-tight text-slate-800">
        {INTERNSHIP_UI.EMPTY_STATE.NOT_ENROLLED_TITLE}
      </h3>
      <p className="max-w-md text-base font-bold leading-relaxed text-slate-400">
        {INTERNSHIP_UI.EMPTY_STATE.NOT_ENROLLED_SUBTITLE}
      </p>
    </div>
  </div>
);

// AC-01/02 CV Banner (Modern Alert Style)
export const CVUploadBanner = ({ variant = 'prepare' }) => (
  <div
    className={cn(
      'group flex flex-wrap items-center justify-between gap-6 rounded-[24px] border p-6 transition-all duration-300 hover:shadow-lg',
      variant === 'urgent'
        ? 'border-amber-100 bg-linear-to-r from-amber-50 to-white shadow-amber-100/20'
        : 'border-primary-100 bg-linear-to-r from-primary-50 to-white shadow-primary-100/20'
    )}
  >
    <div className="flex items-center gap-5">
      <div
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm transition-transform group-hover:scale-110',
          variant === 'urgent' ? 'bg-amber-100 text-amber-600' : 'bg-primary text-white'
        )}
      >
        <FileText className="size-6" />
      </div>
      <div className="flex flex-col">
        <span
          className={cn(
            'text-[10px] font-black uppercase tracking-[0.2em]',
            variant === 'urgent' ? 'text-amber-500' : 'text-primary-500'
          )}
        >
          {variant === 'urgent'
            ? INTERNSHIP_UI.LABELS.ATTENTION
            : INTERNSHIP_UI.LABELS.RECOMMENDATION}
        </span>
        <p
          className={cn(
            'text-[15px] font-black',
            variant === 'urgent' ? 'text-amber-900' : 'text-primary-900'
          )}
        >
          {variant === 'urgent'
            ? INTERNSHIP_UI.BANNERS.NO_CV_URGENT
            : INTERNSHIP_UI.BANNERS.PREPARE_CV}
        </p>
      </div>
    </div>
    <Button
      asChild
      className={cn(
        'h-12 rounded-xl px-8 font-black tracking-widest text-white shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0',
        variant === 'urgent'
          ? 'bg-amber-600 shadow-amber-200 hover:bg-amber-700 hover:shadow-amber-300'
          : 'bg-primary shadow-primary-200 hover:bg-primary-600 hover:shadow-primary-300'
      )}
    >
      <Link href="/profile">{INTERNSHIP_UI.BANNERS.UPLOAD_CV_BTN}</Link>
    </Button>
  </div>
);

// AC-03 Application Status Card (Premium Layout)
export const ApplicationStatusCard = ({ app }) => {
  const statusMap = {
    1: {
      label: INTERNSHIP_UI.LABELS.APPLIED,
      variant: 'warning-soft',
      className: 'bg-amber-100/50 text-amber-700 border-amber-200',
    },
    2: {
      label: INTERNSHIP_UI.LABELS.INTERVIEWING,
      variant: 'blue',
      className: 'bg-blue-100/50 text-blue-700 border-blue-200',
    },
    3: {
      label: INTERNSHIP_UI.LABELS.OFFERED,
      variant: 'success',
      className: 'bg-green-100/50 text-green-700 border-green-200',
    },
    4: {
      label: INTERNSHIP_UI.LABELS.PENDING_ASSIGNMENT,
      variant: 'primary-soft',
      className: 'bg-primary-100/50 text-primary-700 border-primary-200',
    },
  };
  const config = statusMap[app.status] || {
    label: INTERNSHIP_UI.LABELS.UNKNOWN,
    variant: 'neutral',
  };

  return (
    <div className="group relative overflow-hidden rounded-[32px] border border-slate-100 bg-white p-2 shadow-2xl shadow-slate-200/40 transition-all duration-300 hover:shadow-primary-100">
      <div className="flex flex-col gap-1 p-6 pb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            {INTERNSHIP_UI.LABELS.ACTIVE_APPLICATION}
          </span>
          <StatusBadge
            variant={config.variant}
            label={config.label}
            className={cn('font-black text-[10px] h-6 px-3', config.className)}
          />
        </div>

        <div className="flex items-center gap-5">
          <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-slate-50 bg-white p-1 shadow-inner transition-transform group-hover:scale-105">
            {app.enterpriseLogo ? (
              <img
                src={app.enterpriseLogo}
                alt=""
                className="h-full w-full object-contain rounded-xl"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-50">
                <Building2 className="size-8 text-slate-200" />
              </div>
            )}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <h4 className="truncate text-xl font-black tracking-tight text-slate-800">
              {app.jobPostingTitle || STUDENT_APPLICATIONS_UI.COMMON.GENERAL_APP}
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-400">{app.enterpriseName}</span>
              <div className="h-1 w-1 rounded-full bg-slate-200" />
              <span className="text-xs font-bold text-slate-300">
                {INTERNSHIP_UI.LABELS.APPLIED} {dayjs(app.appliedAt).format('DD MMM')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-50 bg-slate-50/50 p-2">
        <Button
          asChild
          variant="ghost"
          className="h-12 w-full rounded-2xl font-black uppercase tracking-[0.15em] text-[11px] text-slate-600 transition-all hover:bg-white hover:text-primary hover:shadow-sm active:scale-95"
        >
          <Link href="/my-applications" className="flex items-center justify-center gap-2">
            {INTERNSHIP_UI.LABELS.VIEW_DETAIL}
            <ChevronRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

// AC-04 Placement Info Card (Success Style)
export const PlacementInfoCard = ({ enterpriseName }) => (
  <div className="relative overflow-hidden rounded-[32px] border border-green-100 bg-linear-to-br from-green-50 to-white p-8 shadow-xl shadow-green-100/20">
    <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-green-100/30 blur-2xl" />
    <div className="flex items-start gap-6">
      <div className="flex size-16 shrink-0 items-center justify-center rounded-[20px] bg-green-500 text-white shadow-lg shadow-green-200 animate-pulse-subtle">
        <Sparkles className="size-8" />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-black tracking-tight text-green-900 leading-tight">
          {INTERNSHIP_UI.BANNERS.PLACEMENT_SUCCESS.replace('{enterpriseName}', enterpriseName)}
        </h3>
        <p className="max-w-md text-sm font-bold text-green-600 leading-relaxed opacity-80">
          {INTERNSHIP_UI.BANNERS.PLACEMENT_PENDING_GROUP}
        </p>
      </div>
    </div>
  </div>
);

// Search Jobs CTA (Minimalist & Modern)
export const SearchJobsCTA = () => (
  <div className="group relative flex flex-col items-center justify-center overflow-hidden rounded-[40px] border border-dashed border-slate-200 bg-white p-12 transition-all hover:border-primary-400 hover:bg-slate-50/50">
    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[24px] bg-slate-50 text-slate-300 transition-all group-hover:bg-primary-50 group-hover:text-primary-500 group-hover:scale-110">
      <Briefcase className="size-10" />
    </div>
    <p className="mb-6 text-base font-bold text-slate-500 text-center max-w-xs">
      {INTERNSHIP_UI.LABELS.SEARCH_JOBS}
    </p>
    <Button
      asChild
      className="h-12 rounded-xl bg-slate-900 px-10 font-black uppercase tracking-widest text-white shadow-xl shadow-slate-200 transition-all hover:bg-primary hover:shadow-primary-200 hover:-translate-y-1"
    >
      <Link href="/student/jobs">{INTERNSHIP_UI.LABELS.VIEW_JOB_POSTINGS}</Link>
    </Button>
  </div>
);

'use client';

import dayjs from 'dayjs';
import { Briefcase, Building2, ChevronRight, FileText, Sparkles } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { STUDENT_APPLICATIONS_UI } from '@/components/features/student-applications/constants/uiText';
import { Button } from '@/components/ui/button';
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
export const ApplicationStatusCard = ({ app, isFlat = true }) => {
  return (
    <div
      className={cn(
        'group relative flex flex-col gap-4 lg:flex-row lg:items-center justify-between overflow-hidden transition-all duration-300',
        isFlat
          ? 'bg-slate-50/50 rounded-[24px] border border-slate-100 p-6 hover:bg-slate-50 shadow-xs'
          : 'rounded-[32px] border border-slate-100 bg-white p-6 shadow-2xl shadow-slate-200/40 hover:shadow-primary-100'
      )}
    >
      <div className="flex flex-1 items-center gap-6">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[20px] border border-white bg-white p-1.5 shadow-sm transition-transform group-hover:scale-105">
          {app.enterpriseLogo ? (
            <img
              src={app.enterpriseLogo}
              alt=""
              className="h-full w-full object-contain rounded-[14px]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-50">
              <Building2 className="size-9 text-slate-200" />
            </div>
          )}
        </div>

        <div className="flex flex-col min-w-0 gap-1">
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-black tracking-[0.2em] text-slate-300">
              {INTERNSHIP_UI.LABELS.ACTIVE_APPLICATION}
            </span>
            <div className="h-1 w-1 rounded-full bg-slate-200" />
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[9px] font-black text-amber-600 tracking-widest capitalize">
                {INTERNSHIP_UI.LABELS.IN_PROGRESS}
              </span>
            </div>
          </div>
          <h4 className="truncate text-xl font-black tracking-tight text-slate-800 leading-none">
            {app.jobPostingTitle || STUDENT_APPLICATIONS_UI.COMMON.GENERAL_APP}
          </h4>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-bold text-slate-500">{app.enterpriseName}</span>
            <div className="h-1 w-1 rounded-full bg-slate-300" />
            <span className="text-xs font-bold text-slate-400">
              {INTERNSHIP_UI.LABELS.APPLIED} {dayjs(app.appliedAt).format('DD MMM, YYYY')}
            </span>
          </div>
        </div>
      </div>

      <div className="shrink-0 lg:pl-6">
        <Button
          asChild
          variant="outline"
          className="h-12 rounded-[18px] border-slate-200 px-8 font-black tracking-[0.15em] text-[10px] text-slate-500 shadow-sm transition-all hover:bg-slate-900 hover:text-white hover:border-slate-900 hover:shadow-xl hover:shadow-slate-200 active:scale-95 group"
        >
          <Link href="/my-applications" className="flex items-center gap-2.5">
            <span className="capitalize">{INTERNSHIP_UI.LABELS.VIEW_DETAIL}</span>
            <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
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

'use client';

import { Briefcase, Search, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

import { PageLayout } from '@/components/ui/pagelayout';
import Pagination from '@/components/ui/pagination';

import { EXPLORE_JOBS_UI } from '../constants/explore-jobs.constant';
import { useExploreJobs } from '../hooks/useExploreJobs';
import JobCard from './JobCard';

export default function ExploreJobs() {
  const router = useRouter();
  const {
    jobs,
    total,
    isLoading,
    isPlaced,
    page,
    pageSize,
    setPage,
    setPageSize,
    searchTerm,
    setSearchTerm,
  } = useExploreJobs();

  const handleJobClick = (id) => {
    router.push(`/explore-jobs/${id}`);
  };

  if (isPlaced) {
    return (
      <PageLayout className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="bg-success-surface h-20 w-20 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-success/10">
          <Sparkles className="h-10 w-10 text-success" />
        </div>
        <h1 className="text-3xl font-bold text-text mb-4">{EXPLORE_JOBS_UI.PLACED_STATE.TITLE}</h1>
        <p className="text-muted max-w-md mx-auto text-lg leading-relaxed">
          {EXPLORE_JOBS_UI.PLACED_STATE.SUBTITLE}
        </p>
        <button
          onClick={() => router.push('/dashboard')}
          className="mt-8 bg-primary text-white px-8 py-3 rounded-2xl font-bold font-sm shadow-xl shadow-primary/20 hover:scale-105 transition-all"
        >
          {EXPLORE_JOBS_UI.PLACED_STATE.BACK_TO_DASHBOARD}
        </button>
      </PageLayout>
    );
  }

  return (
    <PageLayout className="animate-in fade-in duration-700 bg-[#f8f9fa]">
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-4 w-full">
        {/* Hero Header - Ultra Compact & Elegant */}
        <div className="relative overflow-hidden bg-white border border-border/40 rounded-[2rem] p-5 md:p-7 mb-7 shadow-sm">
          <div className="relative z-10 max-w-lg">
            <div className="inline-flex items-center gap-1.5 bg-primary/5 text-primary text-[8px] font-bold px-2 py-0.5 rounded-full mb-3 uppercase tracking-widest">
              <Sparkles className="h-2.5 w-2.5" />
              <span>{EXPLORE_JOBS_UI.HEADER.DISCOVER}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-text mb-2 leading-tight">
              {EXPLORE_JOBS_UI.HEADER.TITLE}{' '}
              <span className="text-primary italic">{EXPLORE_JOBS_UI.HEADER.TITLE_ITALIC}</span>.
            </h1>
            <p className="text-muted text-[13px] leading-relaxed mb-5 max-w-sm opacity-80">
              {EXPLORE_JOBS_UI.HEADER.SUBTITLE}
            </p>

            <div className="relative max-w-sm group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted group-focus-within:text-primary transition-colors">
                <Search className="h-3.5 w-3.5" />
              </div>
              <input
                type="text"
                placeholder={EXPLORE_JOBS_UI.HEADER.SEARCH_PLACEHOLDER}
                className="w-full bg-bg border border-border/60 rounded-lg py-2 pl-9 pr-3 text-[12px] text-text placeholder:text-muted/60 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Background Decorative Element */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none hidden md:block" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
        </div>

        {/* Main Grid Section */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-1 rounded-md">
              <Briefcase className="h-3 w-3 text-primary" />
            </div>
            <h2 className="text-base font-bold text-text">{EXPLORE_JOBS_UI.HEADER.FOR_YOU}</h2>
          </div>
          <span className="text-muted text-[9px] font-bold uppercase tracking-widest opacity-50">
            {EXPLORE_JOBS_UI.HEADER.RESULTS_COUNT(total)}
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-44 bg-white rounded-[1.5rem] border border-border/40" />
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((job) => (
              <JobCard key={job.jobId} job={job} onClick={handleJobClick} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-[2rem] border border-border/40 border-dashed">
            <div className="bg-muted/10 h-11 w-11 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Search className="h-5 w-5 text-muted/50" />
            </div>
            <h3 className="text-base font-bold text-text mb-1">
              {EXPLORE_JOBS_UI.HEADER.NOT_FOUND_TITLE}
            </h3>
            <p className="text-muted text-[12px]">{EXPLORE_JOBS_UI.HEADER.NOT_FOUND_SUBTITLE}</p>
          </div>
        )}

        {total > pageSize && (
          <div className="mt-10 pb-20">
            <Pagination
              page={page}
              pageSize={pageSize}
              total={total}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </div>
        )}
      </div>
    </PageLayout>
  );
}

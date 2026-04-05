'use client';

import { Archive, Briefcase, FileEdit, Globe } from 'lucide-react';
import React, { useMemo, useState } from 'react';

import { StatCard } from '@/components/ui/atoms';
import PageLayout from '@/components/ui/pagelayout';
import Pagination from '@/components/ui/pagination';

import { JOB_POSTING_UI, JOB_STATUS } from '../constants/job-postings.constant';
import { useInternshipPhases, useJobPostingActions, useJobPostings } from '../hooks/useJobPostings';
import { useJobPostingsActionsHandler } from '../hooks/useJobPostingsActionsHandler';
import JobPostingDrawer from './JobPostingDrawer';
import JobPostingsFilters from './JobPostingsFilters';
import JobPostingsTable from './JobPostingsTable';

export default function JobPostings() {
  const [filters, setFilters] = useState({
    search: '',
    status: undefined,
    includeDeleted: false,
    page: 1,
    size: 10,
  });

  // Data fetching
  const { jobPostings, totalCount, isLoading } = useJobPostings(filters);
  const { phases } = useInternshipPhases();
  const actions = useJobPostingActions();

  // Action Handling Logic (Extracted)
  const { isDrawerOpen, selectedRecord, onAction, openCreateDrawer, closeDrawer } =
    useJobPostingsActionsHandler({ actions });

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1,
    }));
  };

  const handlePageChange = (page, size) => {
    setFilters((prev) => ({ ...prev, page, size }));
  };

  // derived state for StatCards
  const statusCounts = useMemo(() => {
    const counts = {
      [JOB_STATUS.DRAFT]: 0,
      [JOB_STATUS.PUBLISHED]: 0,
      [JOB_STATUS.CLOSED]: 0,
      [JOB_STATUS.DELETED]: 0,
    };
    jobPostings.forEach((job) => {
      if (counts[job.status] !== undefined) counts[job.status]++;
    });
    return counts;
  }, [jobPostings]);

  return (
    <PageLayout className="animate-in fade-in flex min-h-0 flex-1 flex-col space-y-6 duration-500">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 px-4 md:px-8">
        <StatCard
          label={JOB_POSTING_UI.FILTERS.DRAFT}
          value={statusCounts[JOB_STATUS.DRAFT]}
          icon={<FileEdit className="h-5 w-5" />}
          color="var(--color-warning)"
          colorClass="text-warning-text bg-warning-surface shadow-warning/5"
          className="!p-4.5 overflow-hidden border-warning/10"
        />
        <StatCard
          label={JOB_POSTING_UI.FILTERS.PUBLISHED}
          value={statusCounts[JOB_STATUS.PUBLISHED]}
          icon={<Globe className="h-5 w-5" />}
          color="var(--color-success)"
          colorClass="text-success bg-success-surface shadow-success/5"
          className="!p-4.5 overflow-hidden border-success/10"
        />
        <StatCard
          label={JOB_POSTING_UI.FILTERS.CLOSED}
          value={statusCounts[JOB_STATUS.CLOSED]}
          icon={<Archive className="h-5 w-5" />}
          color="var(--color-danger)"
          colorClass="text-danger bg-danger-surface shadow-danger/5"
          className="!p-4.5 overflow-hidden border-danger/10"
        />
        <StatCard
          label={JOB_POSTING_UI.FILTERS.ALL}
          value={totalCount}
          icon={<Briefcase className="h-5 w-5" />}
          color="var(--color-primary)"
          colorClass="text-primary bg-primary-surface shadow-primary/5"
          className="!p-4.5 overflow-hidden border-primary/10"
        />
      </div>

      <PageLayout.Card className="flex min-h-[500px] flex-1 flex-col overflow-hidden !p-4 sm:!p-8 mx-4 md:mx-8 mb-6">
        <JobPostingsFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onCreate={openCreateDrawer}
        />

        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
          <JobPostingsTable
            data={jobPostings}
            loading={isLoading}
            onAction={onAction}
            pagination={{
              current: filters.page,
              pageSize: filters.size,
              total: totalCount,
            }}
          />
        </div>

        <div className="border-border/50 mt-auto flex-shrink-0 border-t pt-6 text-muted">
          <Pagination
            total={totalCount}
            page={filters.page}
            pageSize={filters.size}
            totalPages={Math.max(1, Math.ceil(totalCount / filters.size))}
            onPageChange={(page) => handlePageChange(page, filters.size)}
            onPageSizeChange={(size) => handlePageChange(1, size)}
          />
        </div>
      </PageLayout.Card>

      <JobPostingDrawer
        open={isDrawerOpen}
        record={selectedRecord}
        phases={phases}
        onCancel={closeDrawer}
        onSuccess={closeDrawer}
      />
    </PageLayout>
  );
}

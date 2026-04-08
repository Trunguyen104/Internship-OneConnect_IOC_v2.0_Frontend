'use client';

import { useMemo, useState } from 'react';

import { JOB_STATUS } from '../constants/job-postings.constant';

/**
 * Hook to manage job postings filtering, pagination, and statistics.
 */
export const useJobPostingsFilters = (jobPostings = []) => {
  const [filters, setFilters] = useState({
    search: '',
    status: undefined,
    includeDeleted: false,
    page: 1,
    size: 10,
  });

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

  return {
    filters,
    statusCounts,
    handleFilterChange,
    handlePageChange,
  };
};

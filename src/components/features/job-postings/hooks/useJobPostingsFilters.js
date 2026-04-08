'use client';

import { useState } from 'react';

/**
 * Hook to manage job postings filtering, pagination, and statistics.
 */
export const useJobPostingsFilters = () => {
  const [filters, setFilters] = useState({
    search: '',
    status: 'ALL',
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

  return {
    filters,
    handleFilterChange,
    handlePageChange,
  };
};

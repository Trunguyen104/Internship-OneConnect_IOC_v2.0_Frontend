'use client';
import { useCallback, useState } from 'react';

export const useViolationFilters = () => {
  const [termId, setTermId] = useState(null);
  const [termOptions, setTermOptions] = useState([]);
  const [fetchingTerms, setFetchingTerms] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [groupIdFilter, setGroupIdFilter] = useState(undefined);
  const [createdByIdFilter, setCreatedByIdFilter] = useState(undefined);
  const [dateRange, setDateRange] = useState([null, null]);
  const [sortConfig, setSortConfig] = useState({
    column: 'createdAt',
    order: 'desc',
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  const handleGroupChange = useCallback(
    (value) => {
      const normalizedValue = value ? value.toString().toLowerCase() : undefined;
      setGroupIdFilter(normalizedValue);
      setPagination((prev) => ({ ...prev, current: 1 }));
    },
    [setGroupIdFilter, setPagination]
  );

  const handleCreatedByChange = useCallback((value) => {
    setCreatedByIdFilter(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  const handleDateRangeChange = useCallback((dates) => {
    setDateRange(dates);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  const handleTableChange = useCallback((newPagination, _filters, sorter) => {
    setPagination((prev) => ({
      ...prev,
      ...newPagination,
    }));

    if (sorter?.field) {
      setSortConfig({
        column: sorter.field,
        order: sorter.order === 'ascend' ? 'asc' : 'desc',
      });
    }
  }, []);

  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setGroupIdFilter(undefined);
    setCreatedByIdFilter(undefined);
    setDateRange([null, null]);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  return {
    searchTerm,
    groupIdFilter,
    createdByIdFilter,
    dateRange,
    sortConfig,
    pagination,
    termId,
    setTermId,
    termOptions,
    setTermOptions,
    fetchingTerms,
    setFetchingTerms,
    setPagination,
    handleSearchChange,
    handleGroupChange,
    handleCreatedByChange,
    handleDateRangeChange,
    handleTableChange,
    resetFilters,
  };
};

'use client';

import { useState } from 'react';

export const useProjectFilters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [groupIdFilter, setGroupIdFilter] = useState(undefined);
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const handleSearchChange = (val) => {
    setSearchTerm(val);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleGroupFilterChange = (val) => {
    setGroupIdFilter(val);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleStatusFilterChange = (val) => {
    setStatusFilter(val);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleTableChange = (newPagination) => {
    setPagination((prev) => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
  };

  const handlePageSizeChange = (newSize) => {
    setPagination((prev) => ({
      ...prev,
      current: 1,
      pageSize: newSize,
    }));
  };

  return {
    searchTerm,
    groupIdFilter,
    statusFilter,
    pagination,
    setPagination,
    handleSearchChange,
    handleGroupFilterChange,
    handleStatusFilterChange,
    handleTableChange,
    handlePageSizeChange,
  };
};

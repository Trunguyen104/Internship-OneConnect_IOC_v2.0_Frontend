'use client';

import { useCallback, useState } from 'react';

export const useProjectFilters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [groupIdFilter, setGroupIdFilter] = useState(undefined);
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [visibilityFilter, setVisibilityFilter] = useState(undefined);
  const [showArchived, setShowArchived] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const handleSearchChange = useCallback((val) => {
    setSearchTerm(val);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  const handleGroupFilterChange = useCallback((val) => {
    setGroupIdFilter(val);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  const handleStatusFilterChange = useCallback((val) => {
    setStatusFilter(val);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  const handleVisibilityFilterChange = useCallback((val) => {
    setVisibilityFilter(val);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  const handleShowArchivedChange = useCallback((val) => {
    setShowArchived(val);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  const handleTableChange = useCallback((newPagination) => {
    setPagination((prev) => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
  }, []);

  const handlePageSizeChange = useCallback((newSize) => {
    setPagination((prev) => ({
      ...prev,
      current: 1,
      pageSize: newSize,
    }));
  }, []);

  return {
    searchTerm,
    groupIdFilter,
    statusFilter,
    visibilityFilter,
    showArchived,
    pagination,
    setPagination,
    handleSearchChange,
    handleGroupFilterChange,
    handleStatusFilterChange,
    handleVisibilityFilterChange,
    handleShowArchivedChange,
    handleTableChange,
    handlePageSizeChange,
  };
};

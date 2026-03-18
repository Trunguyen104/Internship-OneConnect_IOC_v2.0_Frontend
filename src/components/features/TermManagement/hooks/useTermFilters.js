'use client';
import { useState, useCallback } from 'react';

export const useTermFilters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [sortConfig, setSortConfig] = useState({ column: 'createdat', order: 'desc' });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  const handleStatusChange = useCallback((value) => {
    setStatusFilter(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  const handleTableChange = useCallback((newPagination, filters, sorter) => {
    if (sorter && sorter.field) {
      setSortConfig({
        column: sorter.field.toLowerCase(),
        order: sorter.order === 'ascend' ? 'asc' : 'desc',
      });
    }
    setPagination((prev) => ({ ...prev, current: newPagination.current }));
  }, []);

  return {
    searchTerm,
    statusFilter,
    sortConfig,
    pagination,
    setPagination,
    handleSearchChange,
    handleStatusChange,
    handleTableChange,
  };
};

'use client';
import { useCallback, useState } from 'react';

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

  const handleTableChange = useCallback((newPagination) => {
    setPagination((prev) => ({ ...prev, current: newPagination.current }));
  }, []);

  const handlePageSizeChange = useCallback((size) => {
    setPagination((prev) => ({ ...prev, pageSize: size, current: 1 }));
  }, []);

  const handleSortChange = useCallback((column, order) => {
    setSortConfig({
      column: column.toLowerCase(),
      order: order === 'Asc' ? 'asc' : 'desc',
    });
    setPagination((prev) => ({ ...prev, current: 1 }));
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
    handlePageSizeChange,
    handleSortChange,
  };
};

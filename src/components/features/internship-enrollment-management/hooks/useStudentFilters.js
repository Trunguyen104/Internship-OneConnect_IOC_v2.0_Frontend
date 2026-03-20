'use client';
import { useCallback, useState } from 'react';

export const useStudentFilters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [majorFilter, setMajorFilter] = useState('');
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
    setStatusFilter(value || '');
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  const handleMajorChange = useCallback((value) => {
    setMajorFilter(value || '');
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  const handlePageChange = useCallback((page) => {
    setPagination((prev) => ({ ...prev, current: page }));
  }, []);

  return {
    searchTerm,
    statusFilter,
    majorFilter,
    pagination,
    setPagination,
    handleSearchChange,
    handleStatusChange,
    handleMajorChange,
    handlePageChange,
  };
};

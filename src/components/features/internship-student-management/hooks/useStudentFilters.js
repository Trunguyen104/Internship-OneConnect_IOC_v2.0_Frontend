import { useCallback, useState } from 'react';

export const useStudentFilters = () => {
  const [search, setSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState('ALL');
  const [mentorFilter, setMentorFilter] = useState('ALL');
  const [phaseId, setPhaseId] = useState('ALL_VISIBLE');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [sort, setSort] = useState({ column: 'FullName', order: 'Asc' });

  const handleSearchChange = useCallback((value) => {
    setSearch(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  const handleGroupFilterChange = useCallback((value) => {
    setGroupFilter(value || 'ALL');
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  const handleMentorFilterChange = useCallback((value) => {
    setMentorFilter(value || 'ALL');
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  const handleTableChange = useCallback((page) => {
    setPagination((prev) => ({ ...prev, current: page }));
  }, []);

  const handlePageSizeChange = useCallback((size) => {
    setPagination({ current: 1, pageSize: size });
  }, []);

  const resetFilters = useCallback(() => {
    setSearch('');
    setGroupFilter('ALL');
    setMentorFilter('ALL');
    setPagination({ current: 1, pageSize: 10 });
  }, []);

  return {
    search,
    groupFilter,
    mentorFilter,
    phaseId,
    pagination,
    sort,
    setSearch,
    setGroupFilter,
    setMentorFilter,
    setPhaseId,
    setSort,
    setPagination,
    handleSearchChange,
    handleGroupFilterChange,
    handleMentorFilterChange,
    handleTableChange,
    handlePageSizeChange,
    resetFilters,
  };
};

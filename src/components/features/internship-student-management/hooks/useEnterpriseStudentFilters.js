import { useCallback, useEffect, useState } from 'react';

import { universityService } from '@/services/university.service';

import { TermService } from '../../internship-term-management/services/term.service';
import { useDebounce } from './useDebounce';

const DEFAULT_PAGINATION = {
  current: 1,
  pageSize: 10,
};

export const useEnterpriseStudentFilters = () => {
  const [termId, setTermId] = useState(null);
  const [termOptions, setTermOptions] = useState([]);
  const [fetchingTerms, setFetchingTerms] = useState(false);
  const [universityOptions, setUniversityOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setFetchingTerms(true);
      try {
        // Fetch Terms
        const termRes = await TermService.getAll({ PageNumber: 1, PageSize: 100 });
        const terms = termRes?.data?.items || [];
        if (terms.length > 0) {
          setTermOptions(terms.map((t) => ({ label: t.name, value: t.termId || t.id })));
          // Backend Status: 1=Upcoming, 2=Active, 4=Ended/Closed (based on user swagger)
          const activeTerm = terms.find((t) => t.status === 2 || t.status === 'Active') || terms[0];
          setTermId(activeTerm.termId || activeTerm.id);
        }

        // Fetch Universities
        const uniRes = await universityService.getAll({ PageNumber: 1, PageSize: 100 });
        const unis = uniRes?.data?.items || [];
        setUniversityOptions(unis.map((u) => ({ label: u.name, value: u.id || u.universityId })));
      } catch (err) {
        console.error('Failed to fetch filter data:', err);
      } finally {
        setFetchingTerms(false);
      }
    };
    fetchData();
  }, []);
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebounce(searchValue, 300);

  const [filters, setFilters] = useState({
    status: null, // 'Pending', 'Approved', 'Rejected'
    mentorAssigned: null, // true, false
    hasGroup: null, // true, false
    projectAssigned: null, // true, false
    universityId: null,
    major: null,
    dateRange: null,
  });

  const [sort, setSort] = useState({
    column: 'AppliedAt',
    order: 'desc',
  });

  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);

  const handleSearch = useCallback((value) => {
    setSearchValue(value);
    setPagination(DEFAULT_PAGINATION);
  }, []);

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination(DEFAULT_PAGINATION);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      status: null,
      mentorAssigned: null,
      hasGroup: null,
      projectAssigned: null,
      universityId: null,
      major: null,
      dateRange: null,
    });
    setSearchValue('');
    setSort({ column: 'AppliedAt', order: 'desc' });
    setPagination(DEFAULT_PAGINATION);
  }, []);

  const handleTableChange = useCallback((newPagination, newFilters, newSorter) => {
    setPagination({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });

    if (newSorter && newSorter.columnKey) {
      setSort({
        column: Array.isArray(newSorter.columnKey) ? newSorter.columnKey[0] : newSorter.columnKey,
        order: newSorter.order === 'ascend' ? 'asc' : 'desc',
      });
    } else if (!newSorter.columnKey) {
      setSort({ column: 'AppliedAt', order: 'desc' });
    }
  }, []);

  return {
    termId,
    setTermId,
    searchValue,
    debouncedSearch,
    handleSearch,
    filters,
    handleFilterChange,
    resetFilters,
    sort,
    pagination,
    handleTableChange,
    termOptions,
    fetchingTerms,
    universityOptions,
  };
};

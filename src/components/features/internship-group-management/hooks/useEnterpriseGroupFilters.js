import { useCallback, useEffect, useState } from 'react';

import { EnterpriseTermService } from '../../internship-student-management/services/enterprise-term.service';
import { useDebounce } from './useDebounce';

const DEFAULT_PAGINATION = {
  current: 1,
  pageSize: 10,
};

export const useEnterpriseGroupFilters = () => {
  const [termId, setTermId] = useState(null);
  const [termOptions, setTermOptions] = useState([]);
  const [fetchingTerms, setFetchingTerms] = useState(false);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        setFetchingTerms(true);
        const res = await EnterpriseTermService.getActiveTerms();
        const terms = res?.data?.terms || [];

        if (terms.length > 0) {
          setTermOptions(terms.map((t) => ({ label: t.termName, value: t.termId })));
          // Priority to Active term if possible, otherwise first one
          setTermId(terms[0].termId);
        }
      } catch (err) {
        console.error('Failed to fetch enterprise active terms:', err);
      } finally {
        setFetchingTerms(false);
      }
    };
    fetchTerms();
  }, []);
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebounce(searchValue, 300);

  const [filters, setFilters] = useState({
    status: null, // 0 = InProgress, 1 = Finished, 2 = Archived
  });

  const [sort, setSort] = useState({
    column: 'CreatedAt',
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
    setFilters({ status: null });
    setSearchValue('');
    setSort({ column: 'CreatedAt', order: 'desc' });
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
      setSort({ column: 'CreatedAt', order: 'desc' });
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
  };
};

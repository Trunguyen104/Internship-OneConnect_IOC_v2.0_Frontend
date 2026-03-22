import { useCallback, useEffect, useState } from 'react';

import { TermService } from '../../internship-term-management/services/term.service';
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
        const res = await TermService.getAll({ PageNumber: 1, PageSize: 100 });
        const items = res?.data?.items || [];

        if (items.length > 0) {
          setTermOptions(items.map((t) => ({ label: t.name, value: t.termId || t.id })));
          const activeTerm = items.find((t) => t.status === 2 || t.status === 'Active') || items[0];
          setTermId(activeTerm.termId || activeTerm.id);
        }
      } catch (err) {
        console.error('Failed to fetch terms:', err);
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

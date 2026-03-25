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
        const res = await EnterpriseTermService.getAllTerms();
        const terms = res?.data?.items || res?.data || [];

        if (terms.length > 0) {
          const options = terms.map((t) => ({
            label: t.name || t.termName || t.TermName || 'Unnamed Term',
            value: t.termId || t.id || t.internshipTermId,
            status: t.status,
          }));

          const allOption = {
            label: 'All Terms',
            value: 'ALL_ACTIVE',
            status: 2,
          };

          setTermOptions([allOption, ...options]);
          setTermId('ALL_ACTIVE');
        }
      } catch (err) {
        // Error handled silently or via toast if needed
      } finally {
        setFetchingTerms(false);
      }
    };
    fetchTerms();
  }, []);
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebounce(searchValue, 300);

  const [filters, setFilters] = useState({
    status: null,
    includeArchived: false,
    dateFilter: null, // Month/Year
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
    setFilters({ status: null, includeArchived: false, dateFilter: null });
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

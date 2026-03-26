import { useCallback, useEffect, useState } from 'react';

import { EnterprisePhaseService } from '../../internship-student-management/services/enterprise-phase.service';
import { useDebounce } from './useDebounce';

const DEFAULT_PAGINATION = {
  current: 1,
  pageSize: 10,
};

export const useEnterpriseGroupFilters = () => {
  const [phaseId, setPhaseId] = useState(null);
  const [phaseOptions, setPhaseOptions] = useState([]);
  const [fetchingPhases, setFetchingPhases] = useState(false);

  useEffect(() => {
    const fetchPhases = async () => {
      try {
        setFetchingPhases(true);
        const res = await EnterprisePhaseService.getPhases();
        const phases = res?.data?.items || res?.data || [];

        if (phases.length > 0) {
          const options = phases.map((p) => ({
            label: p.name || p.phaseName || 'Unnamed Phase',
            value: p.id || p.phaseId,
            status: p.status,
          }));

          const allOption = {
            label: 'All Phases',
            value: 'ALL_VISIBLE',
            status: undefined, // Show all
          };

          setPhaseOptions([allOption, ...options]);
          setPhaseId('ALL_VISIBLE');
        }
      } catch (err) {
        // Error handled silently
      } finally {
        setFetchingPhases(false);
      }
    };
    fetchPhases();
  }, []);
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebounce(searchValue, 300);

  const [filters, setFilters] = useState({
    status: null,
    includeArchived: false,
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
    setFilters({ status: null, includeArchived: false });
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
    phaseId,
    setPhaseId,
    searchValue,
    debouncedSearch,
    handleSearch,
    filters,
    handleFilterChange,
    resetFilters,
    sort,
    pagination,
    handleTableChange,
    phaseOptions,
    fetchingPhases,
  };
};

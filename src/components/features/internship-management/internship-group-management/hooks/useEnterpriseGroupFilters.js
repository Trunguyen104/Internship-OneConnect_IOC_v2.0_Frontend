import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';

import { EnterprisePhaseService } from '../../../internship-student-management/services/enterprise-phase.service';
import { useDebounce } from './useDebounce';

const DEFAULT_PAGINATION = {
  current: 1,
  pageSize: 10,
};

export const useEnterpriseGroupFilters = () => {
  const [phaseId, setPhaseId] = useState('ALL_VISIBLE');

  const allPhasesOption = {
    label: 'All Phases',
    value: 'ALL_VISIBLE',
    status: undefined,
  };

  const { data: rawOptions = [], isLoading: fetchingPhases } = useQuery({
    queryKey: ['enterprise-phases-list'],
    queryFn: async () => {
      try {
        const res = await EnterprisePhaseService.getPhases();
        const dataArr =
          res?.data?.data?.items ||
          res?.data?.items ||
          res?.items ||
          res?.data ||
          res?.result?.items ||
          res?.value?.items ||
          (Array.isArray(res) ? res : []);
        const phases = Array.isArray(dataArr) ? dataArr : [];

        return phases.map((p) => {
          let s = p.status;
          if (typeof s === 'string') {
            const statusMap = { open: 1, inprogress: 2, completed: 3, closed: 4 };
            s = statusMap[s.toLowerCase()] || s;
          }

          return {
            label: p.name || p.phaseName || 'Unnamed Phase',
            value: p.phaseId || p.id || p.PhaseId || p.Id,
            status: s,
            startDate: p.startDate,
            endDate: p.endDate,
            enterpriseId: p.enterpriseId,
          };
        });
      } catch (err) {
        console.error('Failed to fetch phases:', err);
        return [];
      }
    },
    staleTime: 10 * 60 * 1000,
  });

  const phaseOptions = useMemo(() => [allPhasesOption, ...rawOptions], [rawOptions]);

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

  const handleTableChange = useCallback(
    (newPagination, newFilters, newSorter) => {
      // Support both AntD object {current, pageSize} and primitive number (page)
      const isObject = typeof newPagination === 'object' && newPagination !== null;
      const nextCurrent = isObject ? newPagination.current : newPagination;
      const nextPageSize = isObject ? newPagination.pageSize : pagination.pageSize;

      setPagination({
        current: Math.max(1, nextCurrent || 1),
        pageSize: Math.max(1, nextPageSize || 10),
      });

      if (newSorter && newSorter.columnKey) {
        setSort({
          column: Array.isArray(newSorter.columnKey) ? newSorter.columnKey[0] : newSorter.columnKey,
          order: newSorter.order === 'ascend' ? 'asc' : 'desc',
        });
      } else if (newSorter && !newSorter?.columnKey) {
        setSort({ column: 'CreatedAt', order: 'desc' });
      }
    },
    [pagination.pageSize]
  );

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

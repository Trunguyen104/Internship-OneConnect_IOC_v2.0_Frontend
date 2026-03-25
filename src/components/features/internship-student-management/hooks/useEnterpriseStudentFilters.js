import { useCallback, useEffect, useState } from 'react';

import { universityService } from '@/services/university.service';

import { EnterprisePhaseService } from '../../internship-student-management/services/enterprise-phase.service';
import { useDebounce } from './useDebounce';

const DEFAULT_PAGINATION = {
  current: 1,
  pageSize: 10,
};

export const useEnterpriseStudentFilters = () => {
  const [phaseId, setPhaseId] = useState(null);
  const [phaseOptions, setPhaseOptions] = useState([]);
  const [fetchingPhases, setFetchingPhases] = useState(false);
  const [universityOptions, setUniversityOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setFetchingPhases(true);
      try {
        // Fetch Phases
        const phaseRes = await EnterprisePhaseService.getPhases();
        const phases = phaseRes?.data?.items || [];
        if (phases.length > 0) {
          setPhaseOptions(
            phases.map((p) => ({ label: p.phaseName || p.name, value: p.phaseId || p.id }))
          );
          // Backend Status: 0=Draft, 1=Open, 2=InProgress, 3=Closed
          const activePhase = phases.find((p) => p.status === 2) || phases[0];
          setPhaseId(activePhase.phaseId || activePhase.id);
        }

        // Fetch Universities
        const uniRes = await universityService.getAll({ PageNumber: 1, PageSize: 100 });
        const unis = uniRes?.data?.items || [];
        setUniversityOptions(unis.map((u) => ({ label: u.name, value: u.id || u.universityId })));
      } catch (err) {
        // Silent error
      } finally {
        setFetchingPhases(false);
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
    universityOptions,
  };
};

import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

/**
 * Enrollment filters. When rendered under `/school/terms/[termId]/enrollments`,
 * `termId` is taken from the route so it matches the sidebar workspace.
 */
export const useStudentFilters = () => {
  const params = useParams();
  const routeTermId = typeof params?.termId === 'string' ? params.termId : null;

  /** When off a term-scoped route, the dropdown stores the active term. */
  const [selectedTermId, setSelectedTermId] = useState(null);
  const termId = routeTermId ?? selectedTermId;

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('FullName');
  const [sortOrder, setSortOrder] = useState('Asc');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Reset to page 1 when the route-driven term changes (sidebar navigation)
  useEffect(() => {
    if (!routeTermId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- term scope from URL; reset list page when it changes
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, [routeTermId]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleTermChange = useCallback((value) => {
    setSelectedTermId(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  const handleStatusChange = useCallback((value) => {
    setStatusFilter(value || '');
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  const handlePageChange = useCallback((page) => {
    setPagination((prev) => ({ ...prev, current: page }));
  }, []);

  const handlePageSizeChange = useCallback((size) => {
    setPagination((prev) => ({ ...prev, pageSize: size, current: 1 }));
  }, []);

  const handleSortChange = useCallback((newSortBy, newSortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  return {
    termId,
    searchTerm,
    debouncedSearchTerm,
    statusFilter,
    sortBy,
    sortOrder,
    pagination,
    setPagination,
    handleTermChange,
    handleSearchChange,
    handleStatusChange,
    handlePageChange,
    handlePageSizeChange,
    handleSortChange,
  };
};

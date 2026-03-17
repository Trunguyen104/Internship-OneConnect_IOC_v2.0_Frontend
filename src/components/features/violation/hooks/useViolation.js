'use client';

import { useState, useMemo } from 'react';

const MOCK_VIOLATIONS = [
  // {
  //   id: 'V001',
  //   type: 'Late Arrival',
  //   description: 'Arrived 20 minutes late for the morning shift.',
  //   violationTime: '2024-03-01T08:20:00',
  //   reporter: 'Admin',
  //   createdAt: '2024-03-01',
  //   severity: 'MEDIUM',
  // },
  // {
  //   id: 'V002',
  //   type: 'Missed Meeting',
  //   description: 'Did not attend the weekly progress review.',
  //   violationTime: '2024-03-05T14:00:00',
  //   reporter: 'Mentor',
  //   createdAt: '2024-03-05',
  //   severity: 'HIGH',
  // },
  // {
  //   id: 'V003',
  //   type: 'Dress Code',
  //   description: 'Wore non-business casual attire on a Friday.',
  //   violationTime: '2024-03-08T09:00:00',
  //   reporter: 'HR',
  //   createdAt: '2024-03-08',
  //   severity: 'LOW',
  // },
];

export function useViolation() {
  const [violations] = useState(MOCK_VIOLATIONS);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortOrder, setSortOrder] = useState('desc');

  const handleSortDate = () => {
    setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
  };

  const filtered = useMemo(() => {
    return violations.filter(
      (v) =>
        v.type.toLowerCase().includes(search.toLowerCase()) ||
        v.description.toLowerCase().includes(search.toLowerCase()),
    );
  }, [violations, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime() || 0;
      const timeB = new Date(b.createdAt).getTime() || 0;
      return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
    });
  }, [filtered, sortOrder]);

  const total = sorted.length;
  const totalPages = Math.ceil(total / pageSize);
  const paginated = useMemo(() => {
    return sorted.slice((page - 1) * pageSize, page * pageSize);
  }, [sorted, page, pageSize]);

  return {
    search,
    setSearch,
    page,
    setPage,
    pageSize,
    setPageSize,
    sortOrder,
    handleSortDate,
    paginated,
    total,
    totalPages,
  };
}

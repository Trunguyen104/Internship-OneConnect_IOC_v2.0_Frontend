'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import { SEMESTER_STATUS } from '@/constants/internship-placement/placement.constants';

import { PlacementService } from '../services/placement.service';

/**
 * Custom hook for managing internship placement.
 * Encapsulates state for selection, pagination, modals, and data fetching.
 */
export const useInternshipPlacement = ({
  semesterId,
  semesterStatus = SEMESTER_STATUS.ACTIVE,
  initialSearchTerm = '',
}) => {
  // State management
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [modalType, setModalType] = useState(null); // 'assign', 'reassign', 'unassign'
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Data fetching
  const {
    data: res,
    isLoading: isLoadingStudents,
    refetch,
  } = useQuery({
    queryKey: ['semester-students', semesterId, page, pageSize, searchTerm],
    queryFn: () =>
      PlacementService.getStudentsByTerm({
        termId: semesterId,
        pageNumber: page,
        pageSize,
      }),
    enabled: !!semesterId,
  });

  // Data transformation logic
  const students = useMemo(() => {
    const termData = res?.data?.items?.[0] || {};
    const rawItems = termData.students || [];

    return rawItems.map((s) => {
      const rawStatus = s.internshipApplicationStatus;
      const isPending = rawStatus === 4;
      const isPlaced = rawStatus === 5;

      return {
        ...s,
        fullName: s.studentName,
        id: s.studentId,
        studentTermId: s.studentId,
        displayStatus: rawStatus,
        isPending,
        isPlaced,
        hasInternshipData: isPlaced || isPending,
        email: s.email || '',
        enterpriseName: s.enterpriseName || (isPlaced ? 'Placed' : isPending ? 'Pending' : ''),
      };
    });
  }, [res]);

  // Computed values
  const pagination = {
    current: res?.data?.pageNumber || page,
    pageSize: res?.data?.pageSize || pageSize,
    total: res?.data?.totalCount || 0,
  };

  const isEnded =
    semesterStatus === SEMESTER_STATUS.ENDED || semesterStatus === SEMESTER_STATUS.CLOSED;

  // Handlers
  const onSelectChange = (newSelectedRowKeys, newSelectedRows) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRows(newSelectedRows);
  };

  const handleOpenAssign = () => setModalType('assign');
  const handleOpenReassign = () => setModalType('reassign');
  const handleOpenUnassign = (records) => {
    if (records) {
      setSelectedRows(Array.isArray(records) ? records : [records]);
    }
    setModalType('unassign');
  };
  const handleCloseModal = () => setModalType(null);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setPage(1); // Reset to first page on search
  };

  return {
    // State
    students,
    isLoading: isLoadingStudents,
    selectedRowKeys,
    selectedRows,
    modalType,
    searchTerm,
    pagination,
    isEnded,

    // Actions
    onSelectChange,
    setPage,
    setPageSize,
    handleSearch,
    handleOpenAssign,
    handleOpenReassign,
    handleOpenUnassign,
    handleCloseModal,
    refreshData: refetch,
  };
};

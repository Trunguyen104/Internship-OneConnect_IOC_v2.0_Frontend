import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';

import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { useToast } from '@/providers/ToastProvider';
import { getErrorDetail } from '@/utils/errorUtils';

import { StudentActivityService } from '../services/student-activity.service';
import { MOCK_ENTERPRISES, MOCK_EVALUATIONS, MOCK_STUDENTS, MOCK_TERMS, MOCK_VIOLATIONS } from '../services/mockData';

export const useStudentActivity = (useMock = true) => {
  const toast = useToast();
  const { STUDENT_ACTIVITY_STATUS } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN;

  // List State
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [terms, setTerms] = useState([]);
  const [enterprises, setEnterprises] = useState([]);
  const [termId, setTermId] = useState(null);
  const [enterpriseId, setEnterpriseId] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [logbookFilter, setLogbookFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
  const [sort, setSort] = useState({ column: 'fullName', order: 'asc' });

  // Summary State
  const [summary, setSummary] = useState({
    total: 0,
    interning: 0,
    missingLogbook: 0,
    unplaced: 0,
  });

  // Detail State
  const [studentDetail, setStudentDetail] = useState(null);
  const [evaluations, setEvaluations] = useState([]);
  const [violations, setViolations] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);

  /**
   * Calculate working days (Mon-Fri) between two dates
   */
  const calculateWorkDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    if (end.isBefore(start)) return 0;

    let count = 0;
    let current = start;
    while (current.isBefore(end) || current.isSame(end, 'day')) {
      const dayOfWeek = current.day();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // Not Sunday (0) or Saturday (6)
        count++;
      }
      current = current.add(1, 'day');
    }
    return count;
  };

  const mapStudentActivity = useCallback((item) => {
    const today = dayjs();
    const phaseEnd = item.internPhaseEnd ? dayjs(item.internPhaseEnd) : null;
    const groupAddedAt = item.internGroupAddedAt ? dayjs(item.internGroupAddedAt) : null;

    let Y = 0;
    if (groupAddedAt) {
      const endDate = phaseEnd && phaseEnd.isBefore(today) ? phaseEnd : today;
      Y = calculateWorkDays(groupAddedAt, endDate);
    }

    const X = item.logbookSubmittedCount || 0;
    const Z = Math.max(0, Y - X);
    const progress = Y > 0 ? Math.round((X / Y) * 100) : 0;

    // Derive Status
    let status = STUDENT_ACTIVITY_STATUS.UNPLACED;
    if (item.placementStatus === 'PLACED') {
      if (!item.groupId) {
        status = STUDENT_ACTIVITY_STATUS.NO_GROUP;
      } else if (item.termStatus === 'CLOSED' || item.termStatus === 'ENDED') {
        status = STUDENT_ACTIVITY_STATUS.COMPLETED;
      } else {
        status = STUDENT_ACTIVITY_STATUS.INTERNING;
      }
    } else if (
      item.hasPendingAssignment || 
      ['PENDING_HR_APPROVAL', 'INTERVIEWING', 'OFFERED', 'PendingHRApproval', 'Interviewing', 'Offered'].includes(item.placementStatus) ||
      item.isDirectApply
    ) {
      status = STUDENT_ACTIVITY_STATUS.PENDING;
    }

    return {
      ...item,
      activity: {
        totalWorkDays: Y,
        submitted: X,
        missing: Z,
        progress,
      },
      derivedStatus: status,
    };
  }, [STUDENT_ACTIVITY_STATUS]);

  const fetchInitialData = useCallback(async () => {
    if (useMock) {
      setTerms(MOCK_TERMS);
      setEnterprises(MOCK_ENTERPRISES);
      setTermId(MOCK_TERMS[0].id);
      return;
    }

    try {
      const [termsRes, enterprisesRes] = await Promise.all([
        StudentActivityService.getUniversityTerms(),
        StudentActivityService.getEnterprises(),
      ]);

      const termsList = termsRes?.data?.items || termsRes?.data || [];
      setTerms(termsList);
      setEnterprises(enterprisesRes?.data || []);

      const activeTerm = termsList.find((t) => t.status === 2 || t.status === 'ACTIVE');
      if (activeTerm) {
        setTermId(activeTerm.termId || activeTerm.id);
      } else if (termsList.length > 0) {
        setTermId(termsList[0].termId || termsList[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch initial data:', error);
    }
  }, [useMock]);

  const fetchStudents = useCallback(async () => {
    if (!termId || termId === 'ALL') return;

    setLoading(true);
    try {
      if (useMock) {
        // Simple mock search/filtering
        let filtered = MOCK_STUDENTS;
        if (searchTerm) {
          filtered = filtered.filter(s => 
            s.studentFullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.studentCode.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        if (enterpriseId !== 'ALL') {
          filtered = filtered.filter(s => s.enterpriseId === enterpriseId);
        }
        
        const items = filtered.map(mapStudentActivity);
        setStudents(items);
        setPagination((prev) => ({ ...prev, total: items.length }));
        setSummary({
          total: items.length,
          interning: items.filter(i => i.derivedStatus.value === 'INTERNING').length,
          missingLogbook: items.filter(i => i.activity.progress < 75).length,
          unplaced: items.filter(i => i.derivedStatus.value === 'UNPLACED').length,
        });
        return;
      }

      const params = {
        pageNumber: pagination.current,
        pageSize: pagination.pageSize,
        enterpriseId: enterpriseId === 'ALL' ? undefined : enterpriseId,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        logbookStatus: logbookFilter === 'ALL' ? undefined : logbookFilter,
        searchTerm: searchTerm || undefined,
        sortBy: sort.column,
        sortOrder: sort.order,
      };

      const res = await StudentActivityService.getStudentActivities(termId, params);
      const items = (res?.data?.items || []).map(mapStudentActivity);

      setStudents(items);
      setPagination((prev) => ({ ...prev, total: res?.data?.totalCount || 0 }));
      setSummary({
        total: res?.data?.stats?.total || 0,
        interning: res?.data?.stats?.interning || 0,
        missingLogbook: res?.data?.stats?.missingLogbook || 0,
        unplaced: res?.data?.stats?.unplaced || 0,
      });
    } catch (error) {
      toast.error(getErrorDetail(error, 'Could not load student list'));
    } finally {
      setLoading(false);
    }
  }, [
    termId,
    enterpriseId,
    statusFilter,
    logbookFilter,
    searchTerm,
    pagination.current,
    pagination.pageSize,
    sort,
    mapStudentActivity,
    toast,
    useMock
  ]);

  const fetchStudentDetail = useCallback(
    async (studentId) => {
      setDetailLoading(true);
      try {
        if (useMock) {
          const mockDetail = MOCK_STUDENTS.find(s => s.studentId === studentId) || MOCK_STUDENTS[0];
          setStudentDetail(mapStudentActivity(mockDetail));
          setEvaluations(MOCK_EVALUATIONS);
          setViolations(MOCK_VIOLATIONS);
          return;
        }

        const [detailRes, evalsRes, violsRes] = await Promise.all([
          StudentActivityService.getStudentActivityDetail(studentId),
          StudentActivityService.getStudentEvaluations(studentId),
          StudentActivityService.getStudentViolations(studentId),
        ]);

        setStudentDetail(mapStudentActivity(detailRes?.data || detailRes));
        setEvaluations(evalsRes?.data || []);
        setViolations(violsRes?.data || []);
      } catch (error) {
        toast.error(getErrorDetail(error, 'Could not load student details'));
      } finally {
        setDetailLoading(false);
      }
    },
    [mapStudentActivity, toast, useMock]
  );

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const resetFilters = () => {
    setEnterpriseId('ALL');
    setStatusFilter('ALL');
    setLogbookFilter('ALL');
    setSearchTerm('');
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  return {
    students,
    loading,
    summary,
    terms,
    enterprises,
    termId,
    enterpriseId,
    statusFilter,
    logbookFilter,
    searchTerm,
    pagination,
    sort,
    studentDetail,
    evaluations,
    violations,
    detailLoading,

    setTermId,
    setEnterpriseId,
    setStatusFilter,
    setLogbookFilter,
    setSearchTerm,
    setPagination,
    setSort,
    resetFilters,
    fetchStudentDetail,
    refresh: fetchStudents,
  };
};

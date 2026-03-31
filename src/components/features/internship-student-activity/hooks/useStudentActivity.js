import { useCallback, useEffect, useState } from 'react';

import { useToast } from '@/providers/ToastProvider';
import { getErrorDetail } from '@/utils/errorUtils';

import { StudentActivityService } from '../services/student-activity.service';

const useStudentActivity = () => {
  const toast = useToast();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [terms, setTerms] = useState([]);
  const [enterprises, setEnterprises] = useState([]);
  const [termId, setTermId] = useState(null);
  const [enterpriseId, setEnterpriseId] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [logbookFilter, setLogbookFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  const [summary, setSummary] = useState({
    total: 0,
    interning: 0,
    missingLogbook: 0,
    unplaced: 0,
  });

  const [studentDetail, setStudentDetail] = useState(null);
  const [evaluations, setEvaluations] = useState([]);
  const [violations, setViolations] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchInitialData = useCallback(async () => {
    try {
      const [termsRes, enterprisesRes] = await Promise.all([
        StudentActivityService.getUniversityTerms(),
        StudentActivityService.getEnterprises(),
      ]);

      const termsList = termsRes?.data?.items || termsRes?.data || [];
      const enterprisesList = enterprisesRes?.data?.items || enterprisesRes?.data || [];

      setTerms(termsList);
      setEnterprises(enterprisesList);

      const activeTerm = termsList.find((t) => t.status === 2 || t.status === 'ACTIVE');
      if (activeTerm) {
        setTermId(activeTerm.termId || activeTerm.id);
      } else if (termsList.length > 0) {
        setTermId(termsList[0].termId || termsList[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch initial data:', error);
    }
  }, []);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        TermId: termId === 'ALL' ? undefined : termId,
        SearchTerm: debouncedSearchTerm || undefined,
        EnterpriseId: enterpriseId === 'ALL' ? undefined : enterpriseId,
        Status: statusFilter === 'ALL' ? undefined : statusFilter,
        LogbookStatus: logbookFilter === 'ALL' ? undefined : logbookFilter,
        SortBy: sortBy || undefined,
        SortOrder: sortOrder || undefined,
        PageNumber: pagination.current,
        PageSize: pagination.pageSize,
      };

      const res = await StudentActivityService.getStudentActivities(params);
      const data = res?.data || {};

      setStudents(data.students?.items || data.items || []);
      setPagination((prev) => ({
        ...prev,
        total: data.students?.totalCount || data.totalCount || 0,
      }));

      const stats = data.summary || {};
      setSummary({
        total: stats.totalStudents || 0,
        interning: stats.activeInternship || 0,
        missingLogbook: stats.missingLogbook || 0,
        unplaced: stats.unplaced || 0,
      });

      if (data.resolvedTermId && !termId) {
        setTermId(data.resolvedTermId);
      }
    } catch (error) {
      toast.error(getErrorDetail(error, 'Could not load student list'));
    } finally {
      setLoading(false);
    }
  }, [
    termId,
    debouncedSearchTerm,
    enterpriseId,
    statusFilter,
    logbookFilter,
    pagination.current,
    pagination.pageSize,
    sortBy,
    sortOrder,
    toast,
  ]);

  const fetchStudentDetail = useCallback(
    async (studentId, forcedTermId) => {
      setDetailLoading(true);
      try {
        const currentTermId = forcedTermId || termId;
        const detailRes = await StudentActivityService.getStudentActivityDetail(
          studentId,
          currentTermId
        );
        const detailData = detailRes?.data || detailRes;

        setStudentDetail(detailData);

        const resolvedTerm = detailData?.resolvedTermId || currentTermId;
        const [evalsRes, violsRes] = await Promise.all([
          StudentActivityService.getStudentEvaluations(studentId, resolvedTerm),
          StudentActivityService.getStudentViolations(studentId, resolvedTerm),
        ]);

        setEvaluations(evalsRes?.data?.cycles || []);
        setViolations(violsRes?.data?.violations || []);
      } catch (error) {
        toast.error(getErrorDetail(error, 'Could not load student details'));
      } finally {
        setDetailLoading(false);
      }
    },
    [termId, toast]
  );

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    if (termId) {
      fetchStudents();
    }
  }, [fetchStudents, termId]);

  const resetFilters = () => {
    setEnterpriseId('ALL');
    setStatusFilter('ALL');
    setLogbookFilter('ALL');
    setSearchTerm('');
    setSortBy(null);
    setSortOrder(null);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const onSort = (key, order) => {
    setSortBy(key);
    setSortOrder(order);
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
    sortBy,
    sortOrder,
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
    resetFilters,
    onSort,
    fetchStudentDetail,
    refresh: fetchStudents,
  };
};

export default useStudentActivity;

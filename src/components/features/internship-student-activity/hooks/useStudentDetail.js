import { useQuery } from '@tanstack/react-query';

import { StudentActivityService } from '../services/student-activity.service';

export const useStudentDetail = (studentId, termId) => {
  // 1. Fetch Student Activity Detail
  const studentDetailQuery = useQuery({
    queryKey: ['student-activity-detail', studentId, termId],
    queryFn: () => StudentActivityService.getStudentActivityDetail(studentId, termId),
    enabled: !!studentId,
    select: (res) => res?.data || res,
  });

  const resolvedDetailTermId = studentDetailQuery.data?.resolvedTermId || termId;

  // 2. Fetch Student Evaluations
  const evaluationsQuery = useQuery({
    queryKey: ['student-evaluations', studentId, resolvedDetailTermId],
    queryFn: () => StudentActivityService.getStudentEvaluations(studentId, resolvedDetailTermId),
    enabled: !!studentId && !!resolvedDetailTermId,
    select: (res) => res?.data?.cycles || [],
  });

  // 3. Fetch Student Violations
  const violationsQuery = useQuery({
    queryKey: ['student-violations', studentId, resolvedDetailTermId],
    queryFn: () => StudentActivityService.getStudentViolations(studentId, resolvedDetailTermId),
    enabled: !!studentId && !!resolvedDetailTermId,
    select: (res) => res?.data?.violations || [],
  });

  // 4. Fetch Student Logbook Total
  const logbookTotalQuery = useQuery({
    queryKey: ['student-logbook-total', studentId, resolvedDetailTermId],
    queryFn: () => StudentActivityService.getStudentLogbookTotal(studentId, resolvedDetailTermId),
    enabled: !!studentId && !!resolvedDetailTermId,
    select: (res) => res?.data?.logbook || res?.logbook,
  });

  // 5. Fetch Student Logbook Weekly
  const logbookWeeklyQuery = useQuery({
    queryKey: ['student-logbook-weekly', studentId, resolvedDetailTermId],
    queryFn: () => StudentActivityService.getStudentLogbookWeekly(studentId, resolvedDetailTermId),
    enabled: !!studentId && !!resolvedDetailTermId,
    select: (res) => res?.data?.weeks || [],
  });

  return {
    student: studentDetailQuery.data,
    evaluations: evaluationsQuery.data || [],
    violations: violationsQuery.data || [],
    logbookTotal: logbookTotalQuery.data,
    logbookWeekly: logbookWeeklyQuery.data || [],
    loading:
      studentDetailQuery.isLoading ||
      evaluationsQuery.isLoading ||
      violationsQuery.isLoading ||
      logbookTotalQuery.isLoading ||
      logbookWeeklyQuery.isLoading,
    isError:
      studentDetailQuery.isError ||
      evaluationsQuery.isError ||
      violationsQuery.isError ||
      logbookTotalQuery.isError ||
      logbookWeeklyQuery.isError,
  };
};

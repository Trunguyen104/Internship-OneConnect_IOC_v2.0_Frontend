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

  return {
    student: studentDetailQuery.data,
    evaluations: evaluationsQuery.data || [],
    violations: violationsQuery.data || [],
    loading:
      studentDetailQuery.isLoading || evaluationsQuery.isLoading || violationsQuery.isLoading,
    isError: studentDetailQuery.isError || evaluationsQuery.isError || violationsQuery.isError,
  };
};

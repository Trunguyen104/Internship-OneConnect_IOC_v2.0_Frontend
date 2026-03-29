'use client';

import { useQuery } from '@tanstack/react-query';

import { ProjectService } from '../services/project.service';

/**
 * Hook to manage project detail and assigned students for the Detail Drawer.
 * @param {string} projectId - ID of the project
 * @param {string} groupId - ID of the associated internship group
 * @param {boolean} enabled - Whether to enable fetching (e.g., when drawer is visible)
 */
export function useProjectDetail(projectId, groupId, enabled = false) {
  // 1. Fetch Project Detail
  const projectQuery = useQuery({
    queryKey: ['project-detail', projectId],
    queryFn: async () => {
      const res = await ProjectService.getById(projectId);
      return res?.data || res;
    },
    enabled: enabled && !!projectId,
    staleTime: 0,
  });

  // 2. Fetch Assigned Students
  const studentsQuery = useQuery({
    queryKey: ['project-group-students', groupId],
    queryFn: async () => {
      const res = await ProjectService.getStudentsByGroup(groupId);
      const data = res?.data || res;
      return data?.members || (Array.isArray(data) ? data : []);
    },
    enabled: enabled && !!groupId,
    staleTime: 0,
  });

  return {
    project: projectQuery.data || null,
    loading: projectQuery.isLoading,
    students: studentsQuery.data || [],
    studentsLoading: studentsQuery.isLoading,
    refresh: () => {
      projectQuery.refetch();
      studentsQuery.refetch();
    },
    refreshStudents: studentsQuery.refetch,
  };
}

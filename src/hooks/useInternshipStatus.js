'use client';

import { useQuery } from '@tanstack/react-query';

import { ApplicationService } from '@/components/features/applications/services/application.service';
import { InternshipGroupService } from '@/components/features/internship/services/internship-group.service';
import { userService } from '@/components/features/user/services/user.service';
import { APPLICATION_STATUS } from '@/constants/applications/application.constants';

/**
 * useInternshipStatus — Universal hook to get student internship state for navigation and layout.
 */
export function useInternshipStatus() {
  const { data: phases = [] } = useQuery({
    queryKey: ['my-phases'],
    queryFn: () =>
      InternshipGroupService.getMyPhases().then((res) => {
        // Robustly extract array regardless of wrapper
        if (Array.isArray(res)) return res;
        if (Array.isArray(res?.items)) return res.items;
        if (Array.isArray(res?.data?.items)) return res.data.items;
        if (Array.isArray(res?.data)) return res.data;
        return [];
      }),
    staleTime: 1000 * 60 * 5,
  });

  const { data: groups = [] } = useQuery({
    queryKey: ['my-groups'],
    queryFn: () =>
      InternshipGroupService.getMyGroups().then((res) => {
        if (Array.isArray(res)) return res;
        if (Array.isArray(res?.items)) return res.items;
        if (Array.isArray(res?.data?.items)) return res.data.items;
        if (Array.isArray(res?.data)) return res.data;
        return [];
      }),
    staleTime: 1000 * 60 * 5,
  });

  const { data: apps = [] } = useQuery({
    queryKey: ['student-applications'],
    queryFn: () =>
      ApplicationService.getStudentApplications().then((res) => {
        if (Array.isArray(res)) return res;
        if (Array.isArray(res?.items)) return res.items;
        if (Array.isArray(res?.data?.items)) return res.data.items;
        if (Array.isArray(res?.data)) return res.data;
        return [];
      }),
    staleTime: 1000 * 60 * 5,
  });

  const { data: userInfo } = useQuery({
    queryKey: ['me'],
    queryFn: () => userService.getMe().then((res) => res?.data || res),
    staleTime: 1000 * 60 * 10,
  });

  const isEnrolled = phases.length > 0 || apps.length > 0;
  const isPlaced = groups.length > 0 || apps.some((a) => a.status === APPLICATION_STATUS.PLACED);
  const hasActiveApp = apps.some((a) => a.status < 5); // Applied, Interviewing, Offered
  const hasCv = !!(userInfo?.cvUrl || userInfo?.cvLocalPath);

  return {
    isEnrolled,
    isPlaced,
    hasActiveApp,
    hasCv,
    isLoading: false,
  };
}

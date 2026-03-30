import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { getDashboardData } from '@/components/features/dashboard/services/dashboard.service';
import { DASHBOARD_UI } from '@/constants/dashboard/uiText';

export function useDashboard(internshipGroupId) {
  // Use React Query for dashboard data
  const {
    data: dashboardData = null,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['dashboard-data', internshipGroupId],
    queryFn: async () => {
      try {
        const res = await getDashboardData(internshipGroupId);
        // Unwrap Result<T>.Data if it exists, otherwise use raw response
        return res?.data ?? res;
      } catch (err) {
        throw err;
      }
    },
    enabled: !!internshipGroupId,
    staleTime: 5 * 60 * 1000,
  });

  const completionPie = useMemo(() => {
    if (!dashboardData) return [];
    return [
      { name: DASHBOARD_UI.COMPLETED, value: dashboardData?.completionRatio?.onTime || 0 },
      { name: DASHBOARD_UI.OVERDUE, value: dashboardData?.completionRatio?.overdue || 0 },
    ];
  }, [dashboardData]);

  const err = error ? error?.message || DASHBOARD_UI.ERROR : '';

  return {
    data: dashboardData,
    err,
    loading,
    completionPie,
  };
}

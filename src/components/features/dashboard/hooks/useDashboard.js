import { useEffect, useMemo, useState } from 'react';

import { getDashboardData } from '@/components/features/dashboard/services/dashboard.service';
import { DASHBOARD_UI } from '@/constants/dashboard/uiText';

export function useDashboard(internshipGroupId) {
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(!!internshipGroupId);
  const [prevId, setPrevId] = useState(internshipGroupId);

  // Reset state during render when internshipGroupId changes
  // This is the recommended pattern for resetting state from props:
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  if (internshipGroupId !== prevId) {
    setPrevId(internshipGroupId);
    setLoading(!!internshipGroupId);
    setData(null);
    setErr('');
  }

  useEffect(() => {
    if (!internshipGroupId) return;

    getDashboardData(internshipGroupId)
      .then((res) => {
        // Unwrap Result<T>.Data if it exists, otherwise use raw response
        const dashboardData = res?.data ?? res;
        setData(dashboardData);
        setErr('');
      })
      .catch((e) => setErr(e?.message || DASHBOARD_UI.ERROR))
      .finally(() => setLoading(false));
  }, [internshipGroupId]);

  const completionPie = useMemo(() => {
    if (!data) return [];
    return [
      { name: DASHBOARD_UI.COMPLETED, value: data?.completionRatio?.onTime || 0 },
      { name: DASHBOARD_UI.OVERDUE, value: data?.completionRatio?.overdue || 0 },
    ];
  }, [data]);

  return { data, err, loading, completionPie };
}

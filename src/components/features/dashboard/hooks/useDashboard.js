import { useEffect, useMemo, useState } from 'react';

import { getDashboardData } from '@/components/features/dashboard/services/dashboard.service';
import { DASHBOARD_UI } from '@/constants/dashboard/uiText';

export function useDashboard() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    getDashboardData()
      .then(setData)
      .catch((e) => setErr(e?.message || DASHBOARD_UI.ERROR));
  }, []);

  const completionPie = useMemo(() => {
    if (!data) return [];
    return [
      { name: DASHBOARD_UI.COMPLETED, value: data.completionRatio.onTime },
      { name: DASHBOARD_UI.OVERDUE, value: data.completionRatio.overdue },
    ];
  }, [data]);

  return { data, err, completionPie };
}

import { useState, useEffect, useMemo } from 'react';
import { getDashboardData } from '@/features/dashboard/services/dashboard.service';

export function useDashboard() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    getDashboardData()
      .then(setData)
      .catch((e) => setErr(e?.message || 'Load failed'));
  }, []);

  const completionPie = useMemo(() => {
    if (!data) return [];
    return [
      { name: 'Completed', value: data.completionRatio.onTime },
      { name: 'Overdue', value: data.completionRatio.overdue },
    ];
  }, [data]);

  return { data, err, completionPie };
}


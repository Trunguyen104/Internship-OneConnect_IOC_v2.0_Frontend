import { useCallback, useEffect, useState } from 'react';

import { activeTermService } from '../services/active-term.service';

export const useActiveTerms = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActiveTerms = useCallback(async () => {
    try {
      setLoading(true);
      const res = await activeTermService.getActiveTerms();
      setData(res?.data?.terms || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch active terms:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveTerms();
  }, [fetchActiveTerms]);

  return { data, loading, error, refresh: fetchActiveTerms };
};

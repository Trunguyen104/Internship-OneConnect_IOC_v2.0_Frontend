import { useEffect, useState } from 'react';

import activeTermService from '../services/active-term.service';

/**
 * Custom hook to fetch and manage active terms and their evaluation cycles.
 */
export function useActiveTermsData() {
  const [terms, setTerms] = useState([]);
  const [cycles, setCycles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Concurrent fetching to avoid waterfalls
        const [termsData, cyclesData] = await Promise.all([
          activeTermService.getActiveTerms(),
          activeTermService.getEvaluationCycles(),
        ]);

        if (isMounted) {
          setTerms(Array.isArray(termsData) ? termsData : []);
          setCycles(Array.isArray(cyclesData) ? cyclesData : []);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to fetch internship terms data');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    terms,
    cycles,
    isLoading,
    error,
  };
}

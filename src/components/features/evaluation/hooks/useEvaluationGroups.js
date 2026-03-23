import { useEffect, useState } from 'react';

import { InternshipGroupService } from '@/components/features/internship/services/internshipGroup.service';

/**
 * Hook to manage term and group selection for evaluation.
 * Refined to handle data fetching more robustly for Enterprise Admins.
 */
export default function useEvaluationGroups() {
  const [terms, setTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [loading, setLoading] = useState(false);

  // Initial load: Fetch terms from multiple sources for resilience
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setSelectedTerm(null);
        setTerms([]);

        // Attempt parallel fetch for terms
        const results = await Promise.allSettled([
          InternshipGroupService.getAllTerms({ pageSize: 100 }),
          InternshipGroupService.getMyTerms(),
        ]);

        let combinedTerms = [];

        results.forEach((res) => {
          if (res.status === 'fulfilled') {
            const data = res.value?.data?.items || res.value?.data || [];
            const mapped = (Array.isArray(data) ? data : []).map((t) => ({
              id: t.termId || t.id,
              name: t.name || t.termName,
              startDate: t.startDate,
              endDate: t.endDate,
            }));
            combinedTerms = [...combinedTerms, ...mapped];
          }
        });

        // Deduplicate by ID
        let uniqueTerms = Array.from(
          new Map(combinedTerms.filter((t) => t.id).map((t) => [t.id, t])).values()
        );

        // FALLBACK: If terms found lack names or no terms found at all, derive from groups
        if (uniqueTerms.length === 0 || uniqueTerms.some((t) => !t.name)) {
          try {
            const groupRes = await InternshipGroupService.getAll({ pageSize: 50 });
            const groupItems = groupRes?.data?.items || groupRes?.data || [];

            // Extract unique term IDs from groups
            const termIdsFromGroups = [
              ...new Set(groupItems.map((g) => g.termId).filter((id) => id)),
            ];

            // Fetch missing term details from Term Service
            const termDetailResults = await Promise.allSettled(
              termIdsFromGroups.map((id) => InternshipGroupService.getTermById(id))
            );

            const derivedTerms = termDetailResults
              .filter((r) => r.status === 'fulfilled' && r.value?.data)
              .map((r) => ({
                id: r.value.data.termId || r.value.data.id,
                name: r.value.data.name || r.value.data.termName,
                startDate: r.value.data.startDate,
                endDate: r.value.data.endDate,
              }));

            // Merge derived terms with any existing ones
            uniqueTerms = Array.from(
              new Map(
                [...uniqueTerms, ...derivedTerms].filter((t) => t.id).map((t) => [t.id, t])
              ).values()
            );
          } catch (gErr) {
            console.warn('Fallback recovery from groups failed:', gErr);
          }
        }

        // Final sorting by date (newest first)
        uniqueTerms.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

        setTerms(uniqueTerms);

        if (uniqueTerms.length > 0) {
          const now = new Date();
          const ongoing =
            uniqueTerms.find((t) => new Date(t.startDate) <= now && new Date(t.endDate) >= now) ||
            uniqueTerms[0];

          setSelectedTerm(ongoing);
        }
      } catch (error) {
        console.error('Final terms fetch catch:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Load groups when selectedTerm changes
  useEffect(() => {
    const fetchGroupsForTerm = async () => {
      if (!selectedTerm?.id) {
        setGroups([]);
        setSelectedGroup(null);
        return;
      }

      try {
        setLoading(true);
        const res = await InternshipGroupService.getAll({
          termId: selectedTerm.id,
          pageSize: 100,
        });

        const items = res?.data?.items || res?.data || [];
        setGroups(items);

        if (items.length > 0) {
          setSelectedGroup(items[0]);
        } else {
          setSelectedGroup(null);
        }
      } catch (error) {
        console.error('Error fetching groups:', error);
        setGroups([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGroupsForTerm();
  }, [selectedTerm?.id]);

  return {
    terms,
    selectedTerm,
    setSelectedTerm,
    groups,
    selectedGroup,
    setSelectedGroup,
    loading,
  };
}

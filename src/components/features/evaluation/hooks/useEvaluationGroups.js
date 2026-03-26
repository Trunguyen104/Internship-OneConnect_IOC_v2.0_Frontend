import { useEffect, useState } from 'react';

import { InternshipGroupService } from '@/components/features/internship/services/internshipGroup.service';
import { TermService } from '@/components/features/internship-term-management/services/term.service';

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
          TermService.getAll({ pageSize: 100 }, { silent: true }),
          InternshipGroupService.getMyTerms({}, { silent: true }),
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
            const groupRes = await InternshipGroupService.getAll(
              { pageSize: 100 },
              { silent: true }
            );
            const groupItems = groupRes?.data?.items || groupRes?.data || [];

            // Group by TermId to get the earliest/latest dates for each term
            const termsMap = new Map();
            groupItems.forEach((g) => {
              if (!g.termId) return;

              if (!termsMap.has(g.termId)) {
                termsMap.set(g.termId, {
                  id: g.termId,
                  name: null, // We'll try to fetch or synthesize
                  startDate: g.startDate,
                  endDate: g.endDate,
                });
              } else {
                // Keep the widest range if groups have different dates
                const current = termsMap.get(g.termId);
                if (
                  g.startDate &&
                  (!current.startDate || new Date(g.startDate) < new Date(current.startDate))
                ) {
                  current.startDate = g.startDate;
                }
                if (
                  g.endDate &&
                  (!current.endDate || new Date(g.endDate) > new Date(current.endDate))
                ) {
                  current.endDate = g.endDate;
                }
              }
            });

            // Try to fetch real names for these terms
            const termDetailResults = await Promise.allSettled(
              Array.from(termsMap.keys()).map((id) => TermService.getById(id))
            );

            termDetailResults.forEach((res, index) => {
              const termId = Array.from(termsMap.keys())[index];
              const termData = termsMap.get(termId);

              if (res.status === 'fulfilled' && res.value?.data) {
                termData.name = res.value.data.name || res.value.data.termName;
                termData.startDate = res.value.data.startDate || termData.startDate;
                termData.endDate = res.value.data.endDate || termData.endDate;
              } else if (!termData.name) {
                // Synthesis: Fallback name if API fails
                const date = termData.startDate ? new Date(termData.startDate) : new Date();
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const season =
                  month >= 9 ? 'Fall' : month >= 5 ? 'Summer' : month >= 1 ? 'Spring' : 'Term';
                termData.name = `${season} ${year}`;
              }
            });

            const derivedTerms = Array.from(termsMap.values());

            // Merge derived terms with any existing ones (prefer derived if existing is name-less)
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
        uniqueTerms.sort((a, b) => {
          const dateA = a.startDate ? new Date(a.startDate) : new Date(0);
          const dateB = b.startDate ? new Date(b.startDate) : new Date(0);
          return dateB - dateA;
        });

        setTerms(uniqueTerms);

        if (uniqueTerms.length > 0) {
          const now = new Date();
          // Precise detection: find the one containing today
          let ongoing = uniqueTerms.find((t) => {
            if (!t.startDate || !t.endDate) return false;
            const start = new Date(t.startDate);
            const end = new Date(t.endDate);
            // Include full days
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            return start <= now && end >= now;
          });

          // Fallback to the latest one if none strictly ongoing today
          if (!ongoing) ongoing = uniqueTerms[0];

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
        const res = await InternshipGroupService.getAll(
          {
            termId: selectedTerm.id,
            pageSize: 100,
          },
          { silent: true }
        );

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

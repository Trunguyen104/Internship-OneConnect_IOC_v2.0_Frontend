import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { InternshipGroupService } from '@/components/features/internship/services/internship-group.service';
import { TermService } from '@/components/features/internship-term-management/services/term.service';

/**
 * Hook to manage term and group selection for evaluation.
 * Refined to handle data fetching more robustly for Enterprise Admins.
 */
export default function useEvaluationGroups() {
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);

  // 1. Fetch Terms with Complex Fallback Logic
  const { data: terms = [], isLoading: loadingTerms } = useQuery({
    queryKey: ['evaluation-terms-context'],
    queryFn: async () => {
      try {
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
            const termsMap = new Map();
            groupItems.forEach((g) => {
              if (!g.termId) return;
              if (!termsMap.has(g.termId)) {
                termsMap.set(g.termId, {
                  id: g.termId,
                  name: null,
                  startDate: g.startDate,
                  endDate: g.endDate,
                });
              } else {
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
                const date = termData.startDate ? new Date(termData.startDate) : new Date();
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const season =
                  month >= 9 ? 'Fall' : month >= 5 ? 'Summer' : month >= 1 ? 'Spring' : 'Term';
                termData.name = `${season} ${year}`;
              }
            });

            const derivedTerms = Array.from(termsMap.values());
            uniqueTerms = Array.from(
              new Map(
                [...uniqueTerms, ...derivedTerms].filter((t) => t.id).map((t) => [t.id, t])
              ).values()
            );
          } catch {}
        }

        uniqueTerms.sort((a, b) => {
          const dateA = a.startDate ? new Date(a.startDate) : new Date(0);
          const dateB = b.startDate ? new Date(b.startDate) : new Date(0);
          return dateB - dateA;
        });

        return uniqueTerms;
      } catch {
        return [];
      }
    },
    staleTime: 10 * 60 * 1000,
  });

  // 2. Auto-select ongoing term once terms are loaded
  useEffect(() => {
    if (terms.length > 0 && !selectedTerm) {
      const now = new Date();
      let ongoing = terms.find((t) => {
        if (!t.startDate || !t.endDate) return false;
        const start = new Date(t.startDate);
        const end = new Date(t.endDate);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        return start <= now && end >= now;
      });
      if (!ongoing) ongoing = terms[0];
      const target = ongoing;
      setTimeout(() => {
        setSelectedTerm(target);
      }, 0);
    }
  }, [terms, selectedTerm]);

  // 3. Fetch Groups for Selected Term
  const { data: groups = [], isLoading: loadingGroups } = useQuery({
    queryKey: ['evaluation-groups', selectedTerm?.id],
    queryFn: async () => {
      try {
        const res = await InternshipGroupService.getAll(
          { termId: selectedTerm.id, pageSize: 100 },
          { silent: true }
        );
        return res?.data?.items || res?.data || [];
      } catch {
        return [];
      }
    },
    enabled: !!selectedTerm?.id,
    staleTime: 5 * 60 * 1000,
  });

  // 4. Auto-select first group once groups are loaded
  useEffect(() => {
    if (groups.length > 0 && !selectedGroup) {
      setTimeout(() => setSelectedGroup(groups[0]), 0);
    } else if (groups.length === 0) {
      setTimeout(() => setSelectedGroup(null), 0);
    }
  }, [groups, selectedGroup]);

  // Reset group selection when term changes
  useEffect(() => {
    setTimeout(() => setSelectedGroup(null), 0);
  }, [selectedTerm?.id]);

  return {
    terms,
    selectedTerm,
    setSelectedTerm,
    groups,
    selectedGroup,
    setSelectedGroup,
    loading: loadingTerms || loadingGroups,
  };
}

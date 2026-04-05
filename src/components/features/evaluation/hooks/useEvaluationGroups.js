import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { InternshipGroupService } from '@/components/features/internship/services/internship-group.service';

/**
 * Hook to manage phase and group selection for evaluation.
 * Updated to use Internship Phases instead of Academic Terms.
 */
export default function useEvaluationGroups(targetGroupId = null) {
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [hasInitializedTarget, setHasInitializedTarget] = useState(false);

  // 0. Fetch Target Group Info (if targetGroupId is provided and not initialized)
  const { data: targetGroupInfo } = useQuery({
    queryKey: ['target-group-info', targetGroupId],
    queryFn: () => InternshipGroupService.getById(targetGroupId),
    enabled: !!targetGroupId && !hasInitializedTarget,
    staleTime: Infinity,
  });

  // 1. Fetch Phases
  const { data: phases = [], isLoading: loadingPhases } = useQuery({
    queryKey: ['evaluation-phases-context'],
    queryFn: async () => {
      try {
        const res = await InternshipGroupService.getMyPhases({}, { silent: true });
        const data = res?.data?.items || res?.data || [];
        const mapped = (Array.isArray(data) ? data : []).map((p) => ({
          id: p.internshipPhaseId || p.phaseId || p.id,
          name: p.name || p.phaseName,
          startDate: p.startDate,
          endDate: p.endDate,
        }));

        return mapped.sort((a, b) => {
          const dateA = a.startDate ? new Date(a.startDate) : new Date(0);
          const dateB = b.startDate ? new Date(b.startDate) : new Date(0);
          return dateB - dateA;
        });
      } catch {
        return [];
      }
    },
    staleTime: 10 * 60 * 1000,
  });

  // 2. Auto-select phase once phases are loaded
  useEffect(() => {
    if (phases.length > 0 && !selectedPhase) {
      // 2a. Priority: Target Group's Phase
      const targetPhaseId = targetGroupInfo?.data?.internshipPhaseId || targetGroupInfo?.data?.id;

      if (targetPhaseId) {
        const found = phases.find((p) => p.id === targetPhaseId);
        if (found) {
          setTimeout(() => setSelectedPhase(found), 0);
          return;
        }
      }

      // 2b. Fallback: Ongoing Phase or First Phase
      const now = new Date();
      let ongoing = phases.find((p) => {
        if (!p.startDate || !p.endDate) return false;
        const start = new Date(p.startDate);
        const end = new Date(p.endDate);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        return start <= now && end >= now;
      });

      if (!ongoing) ongoing = phases[0];
      const target = ongoing;
      setTimeout(() => setSelectedPhase(target), 0);
    }
  }, [phases, selectedPhase, targetGroupInfo]);

  // 3. Fetch Groups for Selected Phase
  const { data: groups = [], isLoading: loadingGroups } = useQuery({
    queryKey: ['evaluation-groups', selectedPhase?.id],
    queryFn: async () => {
      try {
        const res = await InternshipGroupService.getAll(
          { phaseId: selectedPhase.id, pageSize: 100 },
          { silent: true }
        );
        return res?.data?.items || res?.data || [];
      } catch {
        return [];
      }
    },
    enabled: !!selectedPhase?.id,
    staleTime: 5 * 60 * 1000,
  });

  // 4. Group Selection Logic (Auto-select first or reset)
  useEffect(() => {
    if (!loadingGroups) {
      if (groups.length > 0) {
        // 4a. Priority: Target Group
        if (targetGroupId && !hasInitializedTarget) {
          const found = groups.find((g) => (g.internshipId || g.id) === targetGroupId);
          if (found) {
            const grp = found;
            setTimeout(() => {
              setSelectedGroup(grp);
              setHasInitializedTarget(true);
            }, 0);
            return;
          }
        }

        // 4b. If no group selected OR current selected group does not belong to the new groups list
        const currentGroupId = selectedGroup?.internshipId || selectedGroup?.id;
        const isCurrentInList = groups.some((g) => (g.internshipId || g.id) === currentGroupId);

        if (!selectedGroup || !isCurrentInList) {
          const firstGroup = groups[0];
          setTimeout(() => setSelectedGroup(firstGroup), 0);
        }
      } else {
        setTimeout(() => setSelectedGroup(null), 0);
      }
    }
  }, [groups, loadingGroups, selectedGroup, targetGroupId, hasInitializedTarget]);

  return {
    phases,
    selectedPhase,
    setSelectedPhase,
    groups,
    selectedGroup,
    setSelectedGroup,
    loading: loadingPhases || loadingGroups,
  };
}

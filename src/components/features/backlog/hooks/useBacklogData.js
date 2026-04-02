import { useQuery } from '@tanstack/react-query';
import { useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react';

import { productBacklogService } from '@/components/features/backlog/services/product-backlog.service';
import { ProjectService } from '@/components/features/project/services/project.service';
import { SPRINT_STATUS } from '@/constants/common/enums';
import { useToast } from '@/providers/ToastProvider';

/**
 * Hook for core backlog data (Epics, Sprints, Items)
 */
export function useBacklogData() {
  const toast = useToast();

  const [selectedEpicId, setSelectedEpicId] = useState('ALL');
  const [searchText, setSearchText] = useState('');
  const deferredSearchText = useDeferredValue(searchText);

  const [sprints, setSprints] = useState([]);
  const [backlogItems, setBacklogItems] = useState([]);

  // 1. Initialize Project
  const { data: projectId = null } = useQuery({
    queryKey: ['backlog-project-init'],
    queryFn: async () => {
      try {
        const res = await ProjectService.getAll({ PageNumber: 1, PageSize: 1 });
        return res?.data?.items?.[0]?.projectId || null;
      } catch {
        toast.error('Unable to load project');
        return null;
      }
    },
    staleTime: Infinity,
  });

  // 2. Fetch Backlog Data (Epics, Sprints, Items)
  const {
    data: backlogData,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ['backlog-board-data', projectId],
    queryFn: async () => {
      try {
        const [resEpics, resBacklog] = await Promise.all([
          productBacklogService.getEpics(projectId),
          productBacklogService.getWorkItemsBacklog(projectId),
        ]);

        let epicsData =
          resEpics?.data?.items || resEpics?.data || (Array.isArray(resEpics) ? resEpics : []);
        epicsData = epicsData.map((e) => ({ ...e, id: e.id || e.workItemId }));

        let sprintsData = [];
        let backlogItemsData = [];

        if (resBacklog?.data) {
          const rawSprints = resBacklog.data.sprints || [];
          sprintsData = rawSprints.map((s) => {
            let st = s.status?.name || s.status;
            if (typeof st === 'string') {
              const upper = st.toUpperCase();
              if (upper === 'PLANNED' || upper === 'PLANNING') st = SPRINT_STATUS.PLANNED;
              else if (upper === 'ACTIVE') st = SPRINT_STATUS.ACTIVE;
              else if (upper === 'COMPLETED' || upper === 'DONE') st = SPRINT_STATUS.COMPLETED;
            }
            return {
              ...s,
              status: st,
              sprintId: s.sprintId || s.id,
              items: (s.items || []).map((it) => ({ ...it, id: it.workItemId || it.id })),
            };
          });

          const bkItems = resBacklog.data.productBacklog?.items || resBacklog.data.items || [];
          backlogItemsData = bkItems.map((it) => ({ ...it, id: it.workItemId || it.id }));
        }

        return { epics: epicsData, sprints: sprintsData, backlogItems: backlogItemsData };
      } catch (err) {
        toast.error('Error loading backlog board data');
        throw err;
      }
    },
    enabled: !!projectId,
    staleTime: 2 * 60 * 1000,
  });

  // Derived epics from query data (no local modification)
  const epics = useMemo(() => backlogData?.epics || [], [backlogData?.epics]);

  // Sync local state when query data changes
  useEffect(() => {
    if (backlogData) {
      setTimeout(() => {
        setSprints(backlogData.sprints || []);
        setBacklogItems(backlogData.backlogItems || []);
      }, 0);
    }
  }, [backlogData?.sprints, backlogData?.backlogItems, backlogData]);

  // Derived Logic
  const appendEpicName = useCallback(
    (item) => {
      const found = epics.find((e) => e.id === item.parentId);
      return { ...item, epicName: found ? found.title || found.name : '' };
    },
    [epics]
  );

  const filteredBacklogItems = useMemo(() => {
    const query = deferredSearchText.trim().toLowerCase();
    return backlogItems
      .filter((it) => it && (selectedEpicId === 'ALL' || it.parentId === selectedEpicId))
      .filter((it) => {
        if (!query) return true;
        const summary = (it.title || it.name || '').toString().replace(/<[^>]*>/g, '');
        return summary.toLowerCase().includes(query);
      })
      .map(appendEpicName);
  }, [backlogItems, appendEpicName, selectedEpicId, deferredSearchText]);

  const filteredSprints = useMemo(() => {
    const query = deferredSearchText.trim().toLowerCase();
    const sprintsWithFilteredItems = sprints.map((sp) => ({
      ...sp,
      items: (sp.items || [])
        .filter((it) => it && (selectedEpicId === 'ALL' || it.parentId === selectedEpicId))
        .filter((it) => {
          if (!query) return true;
          const summary = (it.title || it.name || '').toString().replace(/<[^>]*>/g, '');
          return summary.toLowerCase().includes(query);
        })
        .map(appendEpicName),
    }));

    if (!query) return sprintsWithFilteredItems;
    return sprintsWithFilteredItems.filter((sp) => (sp.items || []).length > 0);
  }, [sprints, appendEpicName, selectedEpicId, deferredSearchText]);

  return {
    projectId,
    epics,
    sprints,
    setSprints,
    backlogItems,
    setBacklogItems,
    loading,
    selectedEpicId,
    setSelectedEpicId,
    searchText,
    setSearchText,
    filteredBacklogItems,
    filteredSprints,
    fetchData: refetch,
  };
}

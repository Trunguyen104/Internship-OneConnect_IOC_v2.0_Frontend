import { useState, useCallback, useEffect, useMemo } from 'react';
import { productBacklogService } from '@/components/features/backlog/services/productbacklog.service';
import { ProjectService } from '@/components/features/project/services/projectService';
import { useToast } from '@/providers/ToastProvider';
import { SPRINT_STATUS } from '@/constants/enums';

/**
 * Hook for core backlog data (Epics, Sprints, Items)
 */
export function useBacklogData() {
  const toast = useToast();

  const [projectId, setProjectId] = useState(null);
  const [epics, setEpics] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [backlogItems, setBacklogItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedEpicId, setSelectedEpicId] = useState('ALL');

  // Initialize Project
  useEffect(() => {
    const initProject = async () => {
      try {
        const res = await ProjectService.getAll({ PageNumber: 1, PageSize: 1 });
        if (res?.data?.items?.length > 0) {
          setProjectId(res.data.items[0].projectId);
        }
      } catch {
        toast.error('Không lấy được project');
      }
    };
    initProject();
  }, [toast]);

  // Fetch Data
  const fetchData = useCallback(
    async (id, showLoading = true) => {
      if (!id) return;
      try {
        if (showLoading) setLoading(true);

        const [resEpics, resBacklog] = await Promise.all([
          productBacklogService.getEpics(id),
          productBacklogService.getWorkItemsBacklog(id),
        ]);

        let epicsData =
          resEpics?.data?.items || resEpics?.data || (Array.isArray(resEpics) ? resEpics : []);
        setEpics(epicsData.map((e) => ({ ...e, id: e.id || e.workItemId })));

        if (resBacklog?.data) {
          const rawSprints = resBacklog.data.sprints || [];
          setSprints(
            rawSprints.map((s) => {
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
            }),
          );

          const bkItems = resBacklog.data.productBacklog?.items || resBacklog.data.items || [];
          setBacklogItems(bkItems.map((it) => ({ ...it, id: it.workItemId || it.id })));
        }
      } catch (err) {
        toast.error('Lỗi khi tải dữ liệu Backlog Board');
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  useEffect(() => {
    fetchData(projectId);
  }, [projectId, fetchData]);

  // Derived Logic
  const appendEpicName = useCallback(
    (item) => {
      const found = epics.find((e) => e.id === item.parentId);
      return { ...item, epicName: found ? found.title || found.name : '' };
    },
    [epics],
  );

  const filteredBacklogItems = useMemo(() => {
    return backlogItems
      .filter((it) => it && (selectedEpicId === 'ALL' || it.parentId === selectedEpicId))
      .map(appendEpicName);
  }, [backlogItems, appendEpicName, selectedEpicId]);

  const filteredSprints = useMemo(() => {
    return sprints.map((sp) => ({
      ...sp,
      items: (sp.items || [])
        .filter((it) => it && (selectedEpicId === 'ALL' || it.parentId === selectedEpicId))
        .map(appendEpicName),
    }));
  }, [sprints, appendEpicName, selectedEpicId]);

  return {
    projectId,
    epics,
    setEpics,
    sprints,
    setSprints,
    backlogItems,
    setBacklogItems,
    loading,
    selectedEpicId,
    setSelectedEpicId,
    filteredBacklogItems,
    filteredSprints,
    fetchData,
  };
}

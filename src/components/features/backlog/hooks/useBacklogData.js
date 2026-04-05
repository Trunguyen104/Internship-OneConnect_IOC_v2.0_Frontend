import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useCallback, useDeferredValue, useMemo, useState } from 'react';

import { productBacklogService } from '@/components/features/backlog/services/product-backlog.service';
import { EnterpriseGroupService } from '@/components/features/internship-management/internship-group-management/services/enterprise-group.service';
import { ProjectService } from '@/components/features/project/services/project.service';
import { SPRINT_STATUS, WORK_ITEM_STATUS } from '@/constants/common/enums';
import { useToast } from '@/providers/ToastProvider';

/**
 * Hook for core backlog data (Epics, Sprints, Items)
 */
export function useBacklogData() {
  const toast = useToast();
  const { internshipGroupId } = useParams();

  const [selectedEpicId, setSelectedEpicId] = useState('ALL');
  const [searchText, setSearchText] = useState('');
  const deferredSearchText = useDeferredValue(searchText);

  const [epics, setEpics] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [backlogItems, setBacklogItems] = useState([]);

  // 1. Initialize Project
  const { data: projectId = null, isLoading: loadingProjectId } = useQuery({
    queryKey: ['backlog-project-init', internshipGroupId],
    queryFn: async () => {
      if (!internshipGroupId) return null;
      try {
        const res = await ProjectService.getByInternshipGroup(internshipGroupId);
        const data = res?.data || res;
        const items = data?.items || (Array.isArray(data) ? data : []);
        return items?.[0]?.projectId || null;
      } catch {
        toast.error('Unable to load project');
        return null;
      }
    },
    enabled: !!internshipGroupId,
    staleTime: 5 * 60 * 1000,
  });

  // 1.5 Fetch Group Members
  const { data: members = [] } = useQuery({
    queryKey: ['backlog-group-members', internshipGroupId],
    queryFn: async () => {
      if (!internshipGroupId) return [];
      try {
        const res = await EnterpriseGroupService.getGroupDetail(internshipGroupId);
        const rawData = res?.data || res;
        return (rawData?.members || rawData?.students || []).map((s) => ({
          id: s.studentId || s.id || s.applicationId,
          fullName: s.studentFullName || s.fullName || s.name || 'Unknown',
        }));
      } catch (err) {
        console.error('Error loading group members:', err);
        return [];
      }
    },
    enabled: !!internshipGroupId,
    staleTime: 5 * 60 * 1000,
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
        const [resEpics, resBacklog, resAllItems] = await Promise.all([
          productBacklogService.getEpics(projectId),
          productBacklogService.getWorkItemsBacklog(projectId),
          productBacklogService.getWorkItems(projectId),
        ]);

        // 1. Process Epics
        const rawEpics =
          resEpics?.data?.items ||
          resEpics?.items ||
          (Array.isArray(resEpics?.data) ? resEpics.data : Array.isArray(resEpics) ? resEpics : []);

        const epicsData = rawEpics.map((e) => ({
          ...e,
          id: e.id || e.workItemId,
          title: e.title || e.name || 'Untitled Epic',
        }));

        // 2. Map items from ALL items for history lookup
        const allItemsRaw =
          resAllItems?.data?.items ||
          resAllItems?.items ||
          (Array.isArray(resAllItems) ? resAllItems : []);
        const allItemsMap = {};
        allItemsRaw.forEach((it) => {
          const item = {
            ...it,
            id: it.workItemId || it.id,
            sprintId:
              it.sprintId ||
              it.sprint?.sprintId ||
              it.sprint?.id ||
              it.sprintid ||
              it.sprint_id ||
              null,
            parentId: it.parentId || it.parentID || it.epicId || it.epic_id || it.parentid || null,
          };
          allItemsMap[item.id] = item;
        });

        // Helper specifically for enrichment during queryFn
        const enrichWithEpicName = (item) => {
          if (!item) return item;
          const pid =
            item.parentId ||
            item.parentID ||
            item.epicId ||
            item.epic_id ||
            item.parentid ||
            item.parentWorkItemId;
          if (!pid) return { ...item, epicName: '' };
          const found = epicsData.find((e) => {
            const eid = e.id || e.workItemId || e.epicId || e.epicID;
            return (
              String(eid || '')
                .toLowerCase()
                .trim() ===
              String(pid || '')
                .toLowerCase()
                .trim()
            );
          });
          const newName = found ? found.title || found.name || found.summary : '';
          return { ...item, epicName: newName };
        };

        const sprintIds = new Set();

        // 3. Process Sprints
        const sprintsRaw = resBacklog?.data?.sprints || resBacklog?.sprints || [];

        const finalSprints = sprintsRaw.map((s) => {
          const sid = s.sprintId || s.id;
          const sidStr = String(sid);
          sprintIds.add(sidStr);

          // Get items already in this sprint from the Backlog API (active/planned items)
          // Enrichment: Merge with allItemsMap to get parentId and full details missing from Backlog API
          const itemsFromBacklog = (s.items || []).map((it) => {
            const id = it.workItemId || it.id;
            const fullDetails = allItemsMap[id] || {};
            // PRIORITY: item 'it' from the specific Backlog API should override enrichment 'fullDetails'
            return enrichWithEpicName({
              ...fullDetails,
              ...it,
              id,
              sprintId: sid,
            });
          });

          const itemIdsInSprint = new Set(itemsFromBacklog.map((it) => String(it.id)));

          // Augment with DONE items from allItemsMap that belong to this sprint
          const additionalItems = [];
          Object.values(allItemsMap).forEach((item) => {
            const itemSid =
              item.sprintId ||
              item.sprint?.sprintId ||
              item.sprint?.id ||
              item.sprintid ||
              item.sprint_id;
            if (String(itemSid) === sidStr && !itemIdsInSprint.has(String(item.id))) {
              additionalItems.push(enrichWithEpicName(item));
            }
          });

          let st = s.status?.name || s.status;
          if (typeof st === 'string') {
            const upper = st.toUpperCase();
            if (upper === 'PLANNED' || upper === 'PLANNING') st = SPRINT_STATUS.PLANNED;
            else if (upper === 'ACTIVE') st = SPRINT_STATUS.ACTIVE;
            else if (upper === 'COMPLETED' || upper === 'DONE') st = SPRINT_STATUS.COMPLETED;
          }

          return {
            ...s,
            sprintId: sid,
            id: sid,
            status: st,
            items: [...itemsFromBacklog, ...additionalItems],
          };
        });

        // 4. Process Backlog Items (exclude DONE)
        const itemsFromBacklogBase = (
          resBacklog?.data?.productBacklog?.items ||
          resBacklog?.data?.backlogItems ||
          resBacklog?.backlogItems ||
          []
        ).map((it) => {
          const id = it.workItemId || it.id;
          const fullDetails = allItemsMap[id] || {};
          // PRIORITY: item 'it' from the specific Backlog API should override enrichment 'fullDetails'
          return enrichWithEpicName({
            ...fullDetails,
            ...it,
            id,
          });
        });

        // Keep track of all IDs already placed in Sprints or Backlog from the Backlog API
        const itemIdsFoundSoFar = new Set(itemsFromBacklogBase.map((it) => String(it.id)));
        finalSprints.forEach((s) => {
          (s.items || []).forEach((it) => itemIdsFoundSoFar.add(String(it.id)));
        });

        // Supplement Backlog Items from All Items if missing (tasks with no sprint)
        const additionalBacklogItems = [];
        Object.values(allItemsMap).forEach((item) => {
          const sid =
            item.sprintId ||
            item.sprint?.sprintId ||
            item.sprint?.id ||
            item.sprintid ||
            item.sprint_id;
          if (!sid && !itemIdsFoundSoFar.has(String(item.id))) {
            additionalBacklogItems.push(enrichWithEpicName(item));
          }
        });

        const backlogItemsData = [...itemsFromBacklogBase, ...additionalBacklogItems].filter(
          (it) => it.status !== WORK_ITEM_STATUS.DONE
        );

        return { epics: epicsData, sprints: finalSprints, backlogItems: backlogItemsData };
      } catch (err) {
        toast.error('Error loading backlog board data');
        throw err;
      }
    },
    enabled: !!projectId,
    staleTime: 2 * 60 * 1000,
  });

  // Sync local state when query data changes
  const [lastData, setLastData] = useState(null);
  if (backlogData && backlogData !== lastData) {
    setLastData(backlogData);
    setEpics(backlogData.epics || []);
    setSprints(backlogData.sprints || []);
    setBacklogItems(backlogData.backlogItems || []);
  }

  // Helper to attach epicName for UI display
  const appendEpicName = useCallback(
    (item) => {
      if (!item) return item;
      const pid =
        item.parentId ||
        item.parentID ||
        item.epicId ||
        item.epic_id ||
        item.parentid ||
        item.parentWorkItemId;
      if (!pid) return { ...item, epicName: item.epicName || '' };

      const found = epics.find((e) => {
        const eid = e.id || e.workItemId || e.epicId || e.epicID;
        return (
          String(eid || '')
            .toLowerCase()
            .trim() ===
          String(pid || '')
            .toLowerCase()
            .trim()
        );
      });

      const newName = found ? found.title || found.name || found.summary : '';
      if (newName) return { ...item, epicName: newName };

      return { ...item, epicName: item.epicName || '' };
    },
    [epics]
  );

  const filteredBacklogItems = useMemo(() => {
    const query = deferredSearchText.trim().toLowerCase();
    return backlogItems
      .filter((it) => {
        if (!it) return false;
        // 1. Filter by Epic
        if (selectedEpicId !== 'ALL' && it.parentId !== selectedEpicId) return false;

        // 2. Filter by Search Query
        if (query) {
          const summary = (it.title || it.name || '')
            .toString()
            .replace(/<[^>]*>/g, '')
            .toLowerCase();
          if (!summary.includes(query)) return false;
        }

        // 3. Hide Done from Backlog section (always)
        const status = it.status?.name || it.status;
        if (status === WORK_ITEM_STATUS.DONE || status === 'DONE') return false;

        return true;
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
          const summary = (it.title || it.name || '')
            .toString()
            .replace(/<[^>]*>/g, '')
            .toLowerCase();
          return summary.includes(query);
        })
        .map(appendEpicName),
    }));

    if (!query) return sprintsWithFilteredItems;
    return sprintsWithFilteredItems.filter((sp) => (sp.items || []).length > 0);
  }, [sprints, appendEpicName, selectedEpicId, deferredSearchText]);

  return {
    projectId,
    epics,
    setEpics,
    sprints,
    setSprints,
    backlogItems,
    setBacklogItems,
    loading,
    loadingProjectId,
    members,
    selectedEpicId,
    setSelectedEpicId,
    searchText,
    setSearchText,
    filteredBacklogItems,
    filteredSprints,
    fetchData: refetch,
  };
}

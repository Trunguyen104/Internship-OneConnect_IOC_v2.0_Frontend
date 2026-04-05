import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { productBacklogService } from '@/components/features/backlog/services/product-backlog.service';
import { useToast } from '@/providers/ToastProvider';

import { useBacklogData } from './useBacklogData';
import { useBacklogUI } from './useBacklogUI';

/**
 * Main Orchestrator Hook for Backlog Board
 */
export function useBacklogBoard() {
  const toast = useToast();
  const queryClient = useQueryClient();

  // 1. Data Logic
  const data = useBacklogData();
  const { projectId, sprints, setSprints, backlogItems, setBacklogItems, fetchData } = data;

  // 2. UI/Modal Logic
  const ui = useBacklogUI();

  // 3. Compute absolute creation order of all issues
  const itemOrders = useMemo(() => {
    const allItems = [...backlogItems];
    sprints.forEach((sp) => {
      if (sp.items) allItems.push(...sp.items);
    });

    const uniqueItemsMap = {};
    allItems.forEach((i) => {
      uniqueItemsMap[i.workItemId || i.id] = i;
    });
    const uniqueItems = Object.values(uniqueItemsMap);

    const sorted = uniqueItems.sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (timeA && timeB && timeA !== timeB) return timeA - timeB;

      const idA = a.workItemId || a.id || '';
      const idB = b.workItemId || b.id || '';
      return idA.localeCompare(idB);
    });

    const map = {};
    sorted.forEach((item, idx) => {
      map[item.workItemId || item.id] = idx + 1;
    });
    return map;
  }, [backlogItems, sprints]);

  // Actions
  const handleDeleteSprint = async (sprintId) => {
    try {
      const res = await productBacklogService.deleteSprint(projectId, sprintId);
      if (res && res.isSuccess !== false) {
        toast.success('Sprint deleted successfully');
        setSprints((prev) => prev.filter((s) => s.sprintId !== sprintId));
        fetchData(projectId, false);
      } else {
        toast.error(res.message || 'Unable to delete sprint');
      }
    } catch {
      toast.error('Server error while deleting sprint');
    }
  };

  const handleDeleteEpic = async (epicId) => {
    try {
      const res = await productBacklogService.deleteEpic(projectId, epicId);
      if (res && res.isSuccess !== false) {
        toast.success('Epic deleted successfully');
        fetchData(projectId, false);
      } else {
        toast.error(res.message || 'Unable to delete epic');
      }
    } catch {
      toast.error('Server error while deleting epic');
    }
  };

  const handleDeleteWorkItem = async (workItemId) => {
    if (!workItemId) return;

    // Optimistic local update
    setBacklogItems((prev) => prev.filter((it) => (it.workItemId || it.id) !== workItemId));
    setSprints((prev) =>
      prev.map((s) => ({
        ...s,
        items: (s.items || []).filter((it) => (it.workItemId || it.id) !== workItemId),
      }))
    );

    try {
      const res = await productBacklogService.deleteWorkItem(projectId, workItemId);
      if (res?.isSuccess === false) {
        toast.error(res?.message || 'Unable to delete work item');
        fetchData(projectId, false);
        return;
      }

      toast.success('Work item deleted successfully');
      fetchData(projectId, false);
      queryClient.invalidateQueries({ queryKey: ['all-tasks-history'] });
    } catch {
      toast.error('Server error while deleting work item');
      fetchData(projectId, false);
      queryClient.invalidateQueries({ queryKey: ['all-tasks-history'] });
    }
  };

  const handleSprintActionClick = (sprint, isStart) => {
    ui.setSelectedSprintAction(sprint);
    if (isStart) ui.setOpenStartSprint(true);
    else ui.setOpenCompleteSprint(true);
  };

  const handleQuickCreateSprint = () => {
    ui.setOpenCreateSprint(true);
  };

  // Drag and Drop Handler
  const handleDragEnd = useCallback(
    async (event) => {
      const { active, over } = event;
      if (!over) return;

      const activeId = active.id;
      const overId = over.id;

      let sourceSprintId = null;
      let draggedItem = null;

      // Find the source and the item
      for (const s of sprints) {
        const found = (s.items || []).find((it) => (it.workItemId || it.id) === activeId);
        if (found) {
          sourceSprintId = s.sprintId;
          draggedItem = { ...found, workItemId: found.workItemId || found.id };
          break;
        }
      }

      if (!draggedItem) {
        const found = backlogItems.find((it) => (it.workItemId || it.id) === activeId);
        if (found) {
          draggedItem = { ...found, workItemId: found.workItemId || found.id };
        }
      }

      if (!draggedItem) return;

      const workItemId = draggedItem.workItemId;

      // Destination logic
      if (overId === 'BACKLOG') {
        if (sourceSprintId === null) return;

        try {
          // Optimistic local update
          setSprints((prev) =>
            prev.map((s) =>
              s.sprintId === sourceSprintId
                ? { ...s, items: s.items.filter((it) => (it.workItemId || it.id) !== activeId) }
                : s
            )
          );
          setBacklogItems((prev) => [...prev, draggedItem]);

          const res = await productBacklogService.moveWorkItemToBacklog(projectId, workItemId);
          if (res?.isSuccess === false || res?.success === false) {
            throw new Error(res.message || 'Unable to move to backlog');
          }
          toast.success('Moved item to backlog');
          queryClient.invalidateQueries({ queryKey: ['work-board-data', projectId] });
        } catch (err) {
          toast.error(err.message || 'Error moving to backlog');
          fetchData(projectId, false);
        }
      } else {
        const targetSprintId = overId;
        if (sourceSprintId === targetSprintId) return;

        try {
          // Optimistic local update
          if (sourceSprintId) {
            setSprints((prev) =>
              prev.map((s) =>
                s.sprintId === sourceSprintId
                  ? { ...s, items: s.items.filter((it) => (it.workItemId || it.id) !== activeId) }
                  : s.sprintId === targetSprintId
                    ? {
                        ...s,
                        items: [...(s.items || []), { ...draggedItem, sprintId: targetSprintId }],
                      }
                    : s
              )
            );
          } else {
            setBacklogItems((prev) => prev.filter((it) => (it.workItemId || it.id) !== activeId));
            setSprints((prev) =>
              prev.map((s) =>
                s.sprintId === targetSprintId
                  ? {
                      ...s,
                      items: [...(s.items || []), { ...draggedItem, sprintId: targetSprintId }],
                    }
                  : s
              )
            );
          }

          const res = await productBacklogService.moveWorkItemToSprint(
            projectId,
            workItemId,
            targetSprintId
          );
          if (res?.isSuccess === false || res?.success === false) {
            throw new Error(res.message || 'Unable to move to sprint');
          }
          toast.success('Moved item to sprint');
          queryClient.invalidateQueries({ queryKey: ['work-board-data', projectId] });
        } catch (err) {
          toast.error(err.message || 'Error moving to sprint');
          fetchData(projectId, false);
        }
      }
    },
    [projectId, sprints, backlogItems, setSprints, setBacklogItems, fetchData, toast, queryClient]
  );

  return {
    ...data,
    ...ui,
    itemOrders,
    handleDeleteSprint,
    handleDeleteEpic,
    handleDeleteWorkItem,
    handleSprintActionClick,
    handleQuickCreateSprint,
    handleDragEnd,
  };
}

import { useMemo, useCallback } from 'react';
import { productBacklogService } from '@/components/features/backlog/services/productbacklog.service';
import { useToast } from '@/providers/ToastProvider';
import { useBacklogData } from './useBacklogData';
import { useBacklogUI } from './useBacklogUI';

/**
 * Main Orchestrator Hook for Backlog Board
 */
export function useBacklogBoard() {
  const toast = useToast();
  
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
    if (!window.confirm('Bạn có chắc chắn muốn xóa Sprint này không? Các nhiệm vụ bên trong sẽ quay về Backlog.'))
      return;

    try {
      const res = await productBacklogService.deleteSprint(projectId, sprintId);
      if (res && res.isSuccess !== false) {
        toast.success('Xóa Sprint thành công');
        setSprints((prev) => prev.filter((s) => s.sprintId !== sprintId));
        fetchData(projectId, false);
      } else {
        toast.error(res.message || 'Không thể xóa Sprint');
      }
    } catch (err) {
      toast.error('Lỗi server khi xóa Sprint');
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
  const handleDragEnd = useCallback(async (event) => {
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
        setSprints(prev => prev.map(s => 
          s.sprintId === sourceSprintId 
            ? { ...s, items: s.items.filter(it => (it.workItemId || it.id) !== activeId) }
            : s
        ));
        setBacklogItems(prev => [...prev, draggedItem]);

        const res = await productBacklogService.moveWorkItemToBacklog(projectId, workItemId);
        if (res?.isSuccess === false || res?.success === false) {
          throw new Error(res.message || 'Không thể chuyển về Backlog');
        }
        toast.success('Đã chuyển nhiệm vụ về Backlog');
      } catch (err) {
        toast.error(err.message || 'Lỗi khi chuyển về Backlog');
        fetchData(projectId, false);
      }
    } else {
      const targetSprintId = overId;
      if (sourceSprintId === targetSprintId) return;

      try {
        // Optimistic local update
        if (sourceSprintId) {
          setSprints(prev => prev.map(s => 
            s.sprintId === sourceSprintId 
              ? { ...s, items: s.items.filter(it => (it.workItemId || it.id) !== activeId) }
              : s.sprintId === targetSprintId
              ? { ...s, items: [...(s.items || []), { ...draggedItem, sprintId: targetSprintId }] }
              : s
          ));
        } else {
          setBacklogItems(prev => prev.filter(it => (it.workItemId || it.id) !== activeId));
          setSprints(prev => prev.map(s => 
            s.sprintId === targetSprintId
              ? { ...s, items: [...(s.items || []), { ...draggedItem, sprintId: targetSprintId }] }
              : s
          ));
        }

        const res = await productBacklogService.moveWorkItemToSprint(projectId, workItemId, targetSprintId);
        if (res?.isSuccess === false || res?.success === false) {
          throw new Error(res.message || 'Không thể chuyển vào Sprint');
        }
        toast.success('Đã chuyển nhiệm vụ vào Sprint');
      } catch (err) {
        toast.error(err.message || 'Lỗi khi chuyển vào Sprint');
        fetchData(projectId, false);
      }
    }
  }, [projectId, sprints, backlogItems, setSprints, setBacklogItems, fetchData, toast]);

  return {
    ...data,
    ...ui,
    itemOrders,
    handleDeleteSprint,
    handleSprintActionClick,
    handleQuickCreateSprint,
    handleDragEnd
  };
}


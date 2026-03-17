'use client';

import { useCallback } from 'react';
import { productBacklogService } from '@/components/features/backlog/services/productbacklog.service';
import { useToast } from '@/providers/ToastProvider';
import { WORK_ITEM_TYPE, WORK_ITEM_PRIORITY } from '@/constants/common/enums';
import { WORK_BOARD_UI } from '@/constants/work-board/uiText';
import { COLUMNS } from './useBoardData';

/**
 * Hook for Board Drag and Drop logic
 */
export function useBoardDnd({ projectId, items, setItems, fetchBoardData, setActiveId }) {
  const toast = useToast();

  const onDragStart = useCallback(
    (event) => {
      setActiveId(event.active.id);
    },
    [setActiveId],
  );

  const onDragOver = useCallback(
    (event) => {
      const { active, over } = event;
      if (!over) return;
      const activeId = active.id;
      const overId = over.id;
      const activeTask = items.find((i) => i.id === activeId);
      if (!activeTask) return;

      const isOverAColumn = COLUMNS.some((col) => col.id === overId || Number(overId) === col.id);
      const overColumnId = isOverAColumn
        ? Number(overId)
        : items.find((i) => i.id === overId)?.status;

      if (!overColumnId || overColumnId === activeTask.status) return;

      setItems((prev) =>
        prev.map((item) => (item.id === activeId ? { ...item, status: overColumnId } : item)),
      );
    },
    [items, setItems],
  );

  const onDragEnd = useCallback(
    async (event) => {
      const { active, over } = event;
      setActiveId(null);
      if (!over) return;

      const activeId = active.id;
      const currentTask = items.find((i) => i.id === activeId);
      if (!currentTask) return;

      try {
        const taskRes = await productBacklogService.getWorkItemById(projectId, activeId);
        if (taskRes && taskRes.data) {
          const d = taskRes.data;

          const toInt = (val, enumObj, defaultVal) => {
            if (!val) return defaultVal;
            const id = val.id !== undefined ? val.id : val;
            if (typeof id === 'number') return id;
            if (typeof id === 'string') {
              const up = id.toUpperCase().replace(/\s|_/g, '');
              for (const [k, v] of Object.entries(enumObj)) {
                if (k.replace(/_/g, '') === up) return v;
              }
            }
            return defaultVal;
          };

          const payload = {
            projectId,
            title: d.title,
            name: d.title,
            description: d.description || '',
            type: toInt(d.type, WORK_ITEM_TYPE, WORK_ITEM_TYPE.USER_STORY),
            status: currentTask.status,
            priority: toInt(d.priority, WORK_ITEM_PRIORITY, WORK_ITEM_PRIORITY.MEDIUM),
            parentId: d.parentId || null,
            assigneeId: d.assigneeId || null,
            storyPoint: d.storyPoint || 0,
          };

          const updateRes = await productBacklogService.updateWorkItem(
            projectId,
            activeId,
            payload,
          );

          if (updateRes?.isSuccess || updateRes?.status === 200 || updateRes?.data) {
            fetchBoardData(false);
          } else {
            toast.error(WORK_BOARD_UI.ERROR_SAVE_STATUS);
            fetchBoardData(false);
          }
        }
      } catch {
        toast.error(WORK_BOARD_UI.ERROR_SAVE_CHANGES);
        fetchBoardData(false);
      }
    },
    [projectId, items, fetchBoardData, setActiveId, toast],
  );

  return { onDragStart, onDragOver, onDragEnd };
}

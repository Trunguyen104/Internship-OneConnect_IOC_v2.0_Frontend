'use client';

import { useCallback } from 'react';
import { productBacklogService } from '@/components/features/backlog/services/productbacklog.service';
import { useToast } from '@/providers/ToastProvider';
import { WORK_ITEM_TYPE, WORK_ITEM_STATUS, WORK_ITEM_PRIORITY } from '@/constants/enums';

/**
 * Hook for Board actions (Task click, submission)
 */
export function useBoardActions({ projectId, ui, fetchBoardData }) {
  const toast = useToast();

  const handleTaskClick = useCallback(async (task) => {
    try {
      const res = await productBacklogService.getWorkItemById(projectId, task.id);
      ui.setSelectedTask(res?.data ? { ...task, ...res.data } : task);
      ui.setOpenUpdateTask(true);
    } catch {
      ui.setSelectedTask(task);
      ui.setOpenUpdateTask(true);
    }
  }, [projectId, ui]);

  const handleUpdateSubmit = useCallback(async (payload) => {
    try {
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

      const apiPayload = {
        title: payload.summary,
        description: payload.description,
        type: toInt(payload.type, WORK_ITEM_TYPE, WORK_ITEM_TYPE.USER_STORY),
        status: Number(payload.status) || WORK_ITEM_STATUS.TODO,
        priority: toInt(payload.priority, WORK_ITEM_PRIORITY, WORK_ITEM_PRIORITY.MEDIUM),
        parentId: payload.epic || null,
        assigneeId: payload.assignee || null,
        dueDate: payload.dueDate,
        storyPoint: payload.points || 0,
      };

      const workItemId = payload.id;
      const currentSprintId = ui.selectedTask?.sprintId;
      const newSprintId = payload.sprintId;

      const resUpdate = await productBacklogService.updateWorkItem(projectId, workItemId, apiPayload);
      if (!resUpdate || (resUpdate.isSuccess === false && !resUpdate.data)) throw new Error('Update failed');

      if (currentSprintId !== newSprintId && newSprintId !== undefined) {
        if (!newSprintId) {
          await productBacklogService.moveWorkItemToBacklog(projectId, workItemId);
        } else {
          await productBacklogService.moveWorkItemToSprint(projectId, workItemId, newSprintId);
        }
      }

      toast.success('Cập nhật nhiệm vụ thành công!');
      ui.setOpenUpdateTask(false);
      fetchBoardData(false);
    } catch (error) {
      toast.error('Lỗi khi cập nhật nhiệm vụ');
    }
  }, [projectId, ui, fetchBoardData, toast]);

  return { handleTaskClick, handleUpdateSubmit };
}

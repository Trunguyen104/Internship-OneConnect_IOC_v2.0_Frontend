'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { productBacklogService } from '@/components/features/backlog/services/productbacklog.service';
import { ProjectService } from '@/components/features/project/services/projectService';
import { useToast } from '@/providers/ToastProvider';
import {
  WORK_ITEM_STATUS,
  WORK_ITEM_TYPE,
  WORK_ITEM_PRIORITY,
  SPRINT_STATUS,
} from '@/constants/common/enums';

import { WORK_BOARD_UI } from '@/constants/work-board/uiText';

export const COLUMNS = [
  { id: WORK_ITEM_STATUS.TODO, title: WORK_BOARD_UI.COLUMN_TODO, underline: 'bg-muted' },
  {
    id: WORK_ITEM_STATUS.IN_PROGRESS,
    title: WORK_BOARD_UI.COLUMN_IN_PROGRESS,
    underline: 'bg-info',
  },
  { id: WORK_ITEM_STATUS.REVIEW, title: WORK_BOARD_UI.COLUMN_REVIEW, underline: 'bg-warning' },
  { id: WORK_ITEM_STATUS.DONE, title: WORK_BOARD_UI.COLUMN_DONE, underline: 'bg-success' },
];

/**
 * Hook for core Board data (Items, Epics, Sprints, Project)
 */
export function useBoardData() {
  const [items, setItems] = useState([]);
  const [projectId, setProjectId] = useState(null);
  const [epics, setEpics] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchProjectId = async () => {
      try {
        const res = await ProjectService.getAll({ PageNumber: 1, PageSize: 1 });
        if (res?.data?.items?.length > 0) {
          setProjectId(res.data.items[0].projectId);
        }
      } catch {
        toast.error(WORK_BOARD_UI.ERROR_FETCH_PROJECT);
      }
    };
    fetchProjectId();
  }, [toast]);

  const fetchBoardData = useCallback(
    async (showLoading = true) => {
      if (!projectId) return;
      try {
        if (showLoading) setLoading(true);
        const [sprintsRes, epicsRes] = await Promise.all([
          productBacklogService.getWorkItemsBacklog(projectId),
          productBacklogService.getEpics(projectId),
        ]);

        setEpics(epicsRes?.data?.items || epicsRes?.data || []);
        const sprintsData = sprintsRes?.data?.sprints || [];
        setSprints(sprintsData);

        const activeSprint =
          sprintsData.find((s) => {
            const sStatus = s.status?.id || s.status;
            return (
              sStatus === SPRINT_STATUS.ACTIVE ||
              String(sStatus).toUpperCase() === 'ACTIVE' ||
              s.status?.name?.toUpperCase() === 'ACTIVE'
            );
          }) || sprintsData[0];

        if (activeSprint) {
          const itemsToMap = activeSprint.items || activeSprint.featureWorkItems || [];

          const mappedItems = itemsToMap.map((it, idx) => {
            let s = it.status?.id || it.status;
            if (typeof s === 'string') {
              const upper = s.toUpperCase().replace(/\s|_/g, '');
              if (upper === 'TODO') s = WORK_ITEM_STATUS.TODO;
              else if (upper === 'INPROGRESS') s = WORK_ITEM_STATUS.IN_PROGRESS;
              else if (upper === 'REVIEW') s = WORK_ITEM_STATUS.REVIEW;
              else if (upper === 'DONE') s = WORK_ITEM_STATUS.DONE;
              else s = WORK_ITEM_STATUS.TODO;
            }

            let t = it.type?.id || it.type;
            if (typeof t === 'string') {
              const upper = t.toUpperCase().replace(/\s|_/g, '');
              if (upper === 'EPIC') t = WORK_ITEM_TYPE.EPIC;
              else if (upper === 'USERSTORY') t = WORK_ITEM_TYPE.USER_STORY;
              else if (upper === 'TASK') t = WORK_ITEM_TYPE.TASK;
              else if (upper === 'SUBTASK') t = WORK_ITEM_TYPE.SUBTASK;
              else t = WORK_ITEM_TYPE.USER_STORY;
            }

            let p = it.priority?.id || it.priority;
            if (typeof p === 'string') {
              const upper = p.toUpperCase();
              p = WORK_ITEM_PRIORITY[upper] || WORK_ITEM_PRIORITY.MEDIUM;
            }

            return {
              id: it.workItemId || it.id,
              displayId: it.key || `ISSUE-${idx + 1}`,
              title: it.title || it.name,
              type: t || WORK_ITEM_TYPE.USER_STORY,
              priority: p || WORK_ITEM_PRIORITY.MEDIUM,
              points: it.storyPoint || 0,
              assignee: it.assigneeName || WORK_BOARD_UI.UNASSIGNED,
              status: s || WORK_ITEM_STATUS.TODO,
              sprintId: activeSprint.sprintId || activeSprint.id,
              parentId: it.parentId,
            };
          });
          setItems(mappedItems);
        }
      } catch {
        toast.error(WORK_BOARD_UI.ERROR_FETCH_BOARD);
      } finally {
        setLoading(false);
      }
    },
    [projectId, toast],
  );

  useEffect(() => {
    fetchBoardData();
  }, [fetchBoardData]);

  const byColumn = useMemo(() => {
    const map = Object.fromEntries(COLUMNS.map((c) => [c.id, []]));
    items.forEach((it) => {
      if (map[it.status]) map[it.status].push(it);
    });
    return map;
  }, [items]);

  return {
    projectId,
    items,
    setItems,
    epics,
    sprints,
    loading,
    byColumn,
    fetchBoardData,
  };
}

'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { productBacklogService } from '@/components/features/backlog/services/product-backlog.service';
import { ProjectService } from '@/components/features/project/services/project.service';
import {
  SPRINT_STATUS,
  WORK_ITEM_PRIORITY,
  WORK_ITEM_STATUS,
  WORK_ITEM_TYPE,
} from '@/constants/common/enums';
import { WORK_BOARD_UI } from '@/constants/work-board/uiText';
import { useToast } from '@/providers/ToastProvider';

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
  const toast = useToast();

  // Local state for items to support smooth DND
  const [items, setItems] = useState([]);

  const { internshipGroupId } = useParams();

  // 1. Fetch Project ID
  const { data: projectId = null, isLoading: loadingProjectId } = useQuery({
    queryKey: ['work-board-project-init', internshipGroupId],
    queryFn: async () => {
      if (!internshipGroupId) return null;
      try {
        const res = await ProjectService.getByInternshipGroup(internshipGroupId);
        const data = res?.data || res;
        const items = data?.items || (Array.isArray(data) ? data : []);
        return items?.[0]?.projectId || null;
      } catch {
        toast.error(WORK_BOARD_UI.ERROR_FETCH_PROJECT);
        return null;
      }
    },
    enabled: !!internshipGroupId,
    staleTime: 5 * 60 * 1000,
  });

  // 2. Fetch Board Data
  const {
    data: boardResult,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ['work-board-data', projectId],
    queryFn: async () => {
      try {
        const [sprintsRes, epicsRes] = await Promise.all([
          productBacklogService.getWorkItemsBacklog(projectId),
          productBacklogService.getEpics(projectId),
        ]);

        const epicsData = epicsRes?.data?.items || epicsRes?.data || [];
        const sprintsData = sprintsRes?.data?.sprints || [];

        const activeSpr = sprintsData.find((s) => {
          const sStatus = s.status?.id || s.status;
          return (
            sStatus === SPRINT_STATUS.ACTIVE ||
            String(sStatus).toUpperCase() === 'ACTIVE' ||
            s.status?.name?.toUpperCase() === 'ACTIVE'
          );
        });

        let mappedItems = [];
        if (activeSpr) {
          const itemsToMap = activeSpr.items || activeSpr.featureWorkItems || [];
          mappedItems = itemsToMap.map((it, idx) => {
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
              sprintId: activeSpr.sprintId || activeSpr.id,
              parentId: it.parentId,
            };
          });
        }

        return {
          items: mappedItems,
          epics: epicsData,
          sprints: sprintsData,
          activeSprint: activeSpr,
        };
      } catch (err) {
        toast.error(WORK_BOARD_UI.ERROR_FETCH_BOARD);
        throw err;
      }
    },
    enabled: !!projectId,
    staleTime: 2 * 60 * 1000,
  });

  /**
   * Sync items with fetched data
   * We only need to sync "items" because it can be modified by DND locally.
   * "epics", "sprints", and "activeSprint" can be derived directly from boardResult.
   */
  useEffect(() => {
    if (boardResult?.items) {
      setTimeout(() => {
        setItems(boardResult.items);
      }, 0);
    }
  }, [boardResult?.items, boardResult]);

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
    epics: boardResult?.epics || [],
    sprints: boardResult?.sprints || [],
    activeSprint: boardResult?.activeSprint || null,
    loading,
    loadingProjectId,
    byColumn,
    fetchBoardData: refetch,
  };
}

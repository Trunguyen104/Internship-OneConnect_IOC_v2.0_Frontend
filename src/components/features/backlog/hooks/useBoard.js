import { useState, useCallback, useMemo, useEffect } from 'react';
import { productBacklogService } from '@/components/features/backlog/services/productbacklog.service';
import { ProjectService } from '@/components/features/project/services/projectService';
import { useToast } from '@/providers/ToastProvider';
import { WORK_ITEM_STATUS, WORK_ITEM_TYPE, WORK_ITEM_PRIORITY, SPRINT_STATUS } from '@/constants/enums';

export const COLUMNS = [
  { id: WORK_ITEM_STATUS.TODO, title: 'To Do', underline: 'bg-gray-700' },
  { id: WORK_ITEM_STATUS.IN_PROGRESS, title: 'In Progress', underline: 'bg-blue-600' },
  { id: WORK_ITEM_STATUS.REVIEW, title: 'In Review', underline: 'bg-yellow-500' },
  { id: WORK_ITEM_STATUS.DONE, title: 'Done', underline: 'bg-green-500' },
];

export function useBoard() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const toast = useToast();

  const [openUpdateTask, setOpenUpdateTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [epics, setEpics] = useState([]);
  const [sprints, setSprints] = useState([]);

  useEffect(() => {
    const fetchProjectId = async () => {
      try {
        const res = await ProjectService.getAll({ PageNumber: 1, PageSize: 1 });
        if (res?.data?.items?.length > 0) {
          setProjectId(res.data.items[0].projectId);
        }
      } catch {
        toast.error('Không lấy được project');
      }
    };
    fetchProjectId();
  }, [toast]);

  const fetchSprints = useCallback(async (showLoading = true) => {
    if (!projectId) return;
    try {
      const [sprintsRes, epicsRes] = await Promise.all([
        productBacklogService.getWorkItemsBacklog(projectId),
        productBacklogService.getEpics(projectId),
      ]);

      setEpics(epicsRes?.data?.items || epicsRes?.data || []);
      const sprintsData = sprintsRes?.data?.sprints || [];
      setSprints(sprintsData);
      console.log('DEBUG: sprintsData', sprintsData);

      const activeSprint =
        sprintsData.find((s) => {
          const sStatus = s.status?.id || s.status;
          return (
            sStatus === SPRINT_STATUS.ACTIVE ||
            String(sStatus).toUpperCase() === 'ACTIVE' ||
            s.status?.name?.toUpperCase() === 'ACTIVE'
          );
        }) || sprintsData[0];

      console.log('DEBUG: activeSprint found', activeSprint);

      if (activeSprint) {
        // Items can be in featureWorkItems or items
        const itemsToMap = activeSprint.items || activeSprint.featureWorkItems || [];
        console.log('DEBUG: itemsToMap length', itemsToMap.length);

        const mappedItems = itemsToMap.map((it, idx) => {
          // Normalize status robustly
          let s = it.status?.id || it.status;
          if (typeof s === 'string') {
            const upper = s.toUpperCase().replace(/\s|_/g, '');
            if (upper === 'TODO') s = WORK_ITEM_STATUS.TODO;
            else if (upper === 'INPROGRESS') s = WORK_ITEM_STATUS.IN_PROGRESS;
            else if (upper === 'REVIEW') s = WORK_ITEM_STATUS.REVIEW;
            else if (upper === 'DONE') s = WORK_ITEM_STATUS.DONE;
            else s = WORK_ITEM_STATUS.TODO;
          }

          // Normalize type
          let t = it.type?.id || it.type;
          if (typeof t === 'string') {
            const upper = t.toUpperCase().replace(/\s|_/g, '');
            if (upper === 'EPIC') t = WORK_ITEM_TYPE.EPIC;
            else if (upper === 'USERSTORY') t = WORK_ITEM_TYPE.USER_STORY;
            else if (upper === 'TASK') t = WORK_ITEM_TYPE.TASK;
            else if (upper === 'SUBTASK') t = WORK_ITEM_TYPE.SUBTASK;
            else t = WORK_ITEM_TYPE.USER_STORY;
          }

          // Normalize priority
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
            assignee: it.assigneeName || '—',
            status: s || WORK_ITEM_STATUS.TODO,
            sprintId: activeSprint.sprintId || activeSprint.id,
            parentId: it.parentId,
          };
        });
        setItems(mappedItems);
        console.log('DEBUG: mappedItems', mappedItems);
      }
    } catch (err) {
      console.error('FETCH BOARD ERROR:', err);
      toast.error('Lỗi khi tải dữ liệu');
    }
  }, [projectId, toast]);

  useEffect(() => {
    fetchSprints();
  }, [fetchSprints]);

  const byColumn = useMemo(() => {
    const map = Object.fromEntries(COLUMNS.map((c) => [c.id, []]));
    items.forEach((it) => {
      if (map[it.status]) map[it.status].push(it);
    });
    return map;
  }, [items]);

  const handleTaskClick = async (task) => {
    try {
      const res = await productBacklogService.getWorkItemById(projectId, task.id);
      setSelectedTask(res?.data ? { ...task, ...res.data } : task);
      setOpenUpdateTask(true);
    } catch {
      setSelectedTask(task);
      setOpenUpdateTask(true);
    }
  };

  const handleUpdateSubmit = async (payload) => {
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

      console.log('DEBUG: handleUpdateSubmit apiPayload:', apiPayload);

      const workItemId = payload.id;
      const currentSprintId = selectedTask?.sprintId;
      const newSprintId = payload.sprintId;

      const resUpdate = await productBacklogService.updateWorkItem(
        projectId,
        workItemId,
        apiPayload,
      );
      if (!resUpdate || (resUpdate.isSuccess === false && !resUpdate.data)) throw new Error('Update failed');

      if (currentSprintId !== newSprintId && newSprintId !== undefined) {
        if (!newSprintId) {
          await productBacklogService.moveWorkItemToBacklog(projectId, workItemId);
        } else {
          await productBacklogService.moveWorkItemToSprint(projectId, workItemId, newSprintId);
        }
      }

      toast.success('Cập nhật nhiệm vụ thành công!');
      setOpenUpdateTask(false);
      fetchSprints(false);
    } catch (error) {
      console.error('DEBUG: UPDATE ERROR:', error);
      toast.error('Lỗi khi cập nhật nhiệm vụ');
    }
  };

  function onDragStart(event) {
    setActiveId(event.active.id);
  }

  function onDragOver(event) {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    const activeTask = items.find((i) => i.id === activeId);
    if (!activeTask) return;
    const isOverAColumn = COLUMNS.some((col) => col.id === overId || Number(overId) === col.id);
    const overColumnId = isOverAColumn ? Number(overId) : items.find((i) => i.id === overId)?.status;
    if (!overColumnId || overColumnId === activeTask.status) return;
    setItems((prev) =>
      prev.map((item) => (item.id === activeId ? { ...item, status: overColumnId } : item)),
    );
  }

  async function onDragEnd(event) {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeId = active.id;
    const currentTask = items.find((i) => i.id === activeId);
    if (!currentTask) return;

    console.log('DEBUG: onDragEnd activeId:', activeId, 'status:', currentTask.status);

    try {
      const taskRes = await productBacklogService.getWorkItemById(projectId, activeId);
      if (taskRes && taskRes.data) {
        const d = taskRes.data;

        // Helper string-to-int conversion
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
          name: d.title, // Add name field as seen in BacklogBoard
          description: d.description || '',
          type: toInt(d.type, WORK_ITEM_TYPE, WORK_ITEM_TYPE.USER_STORY),
          status: currentTask.status, // integer from onDragOver
          priority: toInt(d.priority, WORK_ITEM_PRIORITY, WORK_ITEM_PRIORITY.MEDIUM),
          parentId: d.parentId || null,
          assigneeId: d.assigneeId || null,
          storyPoint: d.storyPoint || 0,
        };

        console.log('DEBUG: Updating item with payload:', payload);
        const updateRes = await productBacklogService.updateWorkItem(projectId, activeId, payload);
        
        if (updateRes?.isSuccess || updateRes?.status === 200 || updateRes?.data) {
          console.log('DEBUG: Update persistence success!');
          // Force fetch to verify server state
          fetchSprints(false);
        } else {
          console.error('DEBUG: Update persistence failed', updateRes);
          toast.error('Không thể lưu trạng thái mới');
          fetchSprints(false);
        }
      }
    } catch (err) {
      console.error('DEBUG: updateWorkItem API Error:', err);
      toast.error('Lỗi khi lưu thay đổi');
      fetchSprints(false);
    }
  }

  const activeTask = useMemo(() => items.find((it) => it.id === activeId), [activeId, items]);

  return {
    items,
    query,
    setQuery,
    byColumn,
    activeTask,
    epics,
    sprints,
    openUpdateTask,
    setOpenUpdateTask,
    selectedTask,
    setSelectedTask,
    handleTaskClick,
    handleUpdateSubmit,
    onDragStart,
    onDragOver,
    onDragEnd
  };
}


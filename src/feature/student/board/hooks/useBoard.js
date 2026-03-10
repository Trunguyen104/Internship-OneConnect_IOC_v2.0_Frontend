import { useState, useCallback, useMemo, useEffect } from 'react';
import { productBacklogService } from '@/services/productbacklog.service';
import { ProjectService } from '@/services/projectService';
import { useToast } from '@/providers/ToastProvider';

export const COLUMNS = [
  { id: 'Todo', title: 'To Do', underline: 'bg-gray-700' },
  { id: 'InProgress', title: 'In Progress', underline: 'bg-blue-600' },
  { id: 'Review', title: 'In Review', underline: 'bg-yellow-500' },
  { id: 'Done', title: 'Done', underline: 'bg-green-500' },
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

      const activeSprint =
        sprintsData.find((s) => s.status?.toUpperCase() === 'ACTIVE') || sprintsData[0];

      if (activeSprint) {
        const itemsToMap = activeSprint.featureWorkItems || activeSprint.items || [];
        const mappedItems = itemsToMap.map((it, idx) => ({
          id: it.workItemId || it.id,
          displayId: it.key || `ISSUE-${idx + 1}`,
          title: it.title || it.name,
          type: it.type || 'UserStory',
          priority: it.priority || 'MEDIUM',
          points: it.storyPoint || 0,
          assignee: it.assigneeName || '—',
          status: it.status || 'Todo', 
          sprintId: activeSprint.sprintId,
          parentId: it.parentId,
        }));
        setItems(mappedItems);
      }
    } catch {
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
      const apiPayload = {
        title: payload.summary,
        description: payload.description,
        type: payload.type,
        status: payload.status,
        priority: payload.priority,
        parentId: payload.epic || null,
        assigneeId: payload.assignee || null,
        dueDate: payload.dueDate,
        storyPoint: payload.points || 0,
      };

      const workItemId = payload.id;
      const currentSprintId = selectedTask?.sprintId;
      const newSprintId = payload.sprintId;

      const resUpdate = await productBacklogService.updateWorkItem(
        projectId,
        workItemId,
        apiPayload,
      );
      if (!resUpdate || resUpdate.isSuccess === false) throw new Error('Update failed');

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
      console.error(error);
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
    const isOverAColumn = COLUMNS.some((col) => col.id === overId);
    const overColumnId = isOverAColumn ? overId : items.find((i) => i.id === overId)?.status;
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
    try {
      const taskRes = await productBacklogService.getWorkItemById(projectId, activeId);
      if (taskRes && taskRes.data) {
        const d = taskRes.data;
        const payload = {
          title: d.title,
          description: d.description || '',
          type: d.type,
          status: currentTask.status, 
          priority: d.priority,
          parentId: d.parentId || null,
          assigneeId: d.assigneeId || null,
          storyPoint: d.storyPoint || 0,
        };
        await productBacklogService.updateWorkItem(projectId, activeId, payload);
      }
    } catch (err) {
      console.error('Lỗi cập nhật:', err);
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

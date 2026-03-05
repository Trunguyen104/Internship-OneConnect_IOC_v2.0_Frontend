'use client';
import PageShell from '@/shared/components/PageShell';
import { useEffect, useMemo, useState, useCallback } from 'react';
import StudentTabs from '@/shared/components/StudentTabs';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDroppable,
} from '@dnd-kit/core';

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { productBacklogService } from '@/services/productbacklog.service';
import { ProjectService } from '@/services/projectService';
import { useToast } from '@/providers/ToastProvider';

// Import Modal
import UpdateTaskModal from '@/shared/components/UpdateTaskModal';

// CHÚ Ý: Đổi ID khớp hoàn toàn với Enum trả về từ Backend (Thường là VIẾT HOA)
const COLUMNS = [
  { id: 'Todo', title: 'To Do', underline: 'bg-gray-700' },
  { id: 'InProgress', title: 'In Progress', underline: 'bg-blue-600' },
  { id: 'Review', title: 'In Review', underline: 'bg-yellow-500' },
  { id: 'Done', title: 'Done', underline: 'bg-green-500' },
];

export default function Board() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const toast = useToast();

  // Modal states
  const [openUpdateTask, setOpenUpdateTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [epics, setEpics] = useState([]);
  const [sprints, setSprints] = useState([]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

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

  // Hàm fetch dữ liệu (Dùng useCallback để đồng bộ như bên Backlog)
  const fetchSprints = useCallback(async (showLoading = true) => {
    if (!projectId) return;
    try {
      const [sprintsRes, epicsRes] = await Promise.all([
        productBacklogService.getWorkItemsBacklog(projectId),
        productBacklogService.getEpics(projectId)
      ]);

      setEpics(epicsRes?.data?.items || epicsRes?.data || []);
      let sprintsData = sprintsRes?.data?.sprints || [];
      setSprints(sprintsData);

      const activeSprint = sprintsData.find((s) => s.status?.toUpperCase() === 'ACTIVE') || sprintsData[0];

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
          status: it.status || 'Todo', // Chuẩn hóa viết hoa
          sprintId: activeSprint.sprintId,
          parentId: it.parentId
        }));
        setItems(mappedItems);
      }
    } catch (err) {
      toast.error('Lỗi khi tải dữ liệu');
    }
  }, [projectId, toast]);

  useEffect(() => {
    fetchSprints();
  }, [fetchSprints]);

  const byColumn = useMemo(() => {
    const map = Object.fromEntries(COLUMNS.map((c) => [c.id, []]));
    items.forEach((it) => {
      // Không dùng .toUpperCase() ở đây nữa để khớp chính xác ID
      if (map[it.status]) map[it.status].push(it);
    });
    return map;
  }, [items]);

  // Xử lý Click mở Modal
  const handleTaskClick = async (task) => {
    try {
      const res = await productBacklogService.getWorkItemById(projectId, task.id);
      setSelectedTask(res?.data ? { ...task, ...res.data } : task);
      setOpenUpdateTask(true);
    } catch (e) {
      setSelectedTask(task);
      setOpenUpdateTask(true);
    }
  };

  // Hàm Submit Cập Nhật (Copy logic chuẩn từ Backlog sang)
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

      // 1. Update chi tiết
      const resUpdate = await productBacklogService.updateWorkItem(projectId, workItemId, apiPayload);
      if (!resUpdate || resUpdate.isSuccess === false) throw new Error("Update failed");

      // 2. Di chuyển Sprint nếu cần
      if (currentSprintId !== newSprintId && newSprintId !== undefined) {
        if (!newSprintId) {
          await productBacklogService.moveWorkItemToBacklog(projectId, workItemId);
        } else {
          await productBacklogService.moveWorkItemToSprint(projectId, workItemId, newSprintId);
        }
      }

      toast.success('Cập nhật nhiệm vụ thành công!');
      setOpenUpdateTask(false);

      // 3. Đồng bộ lại dữ liệu board (Không dùng loading để tránh nháy màn hình)
      fetchSprints(false);

    } catch (error) {
      console.error(error);
      toast.error('Lỗi khi cập nhật nhiệm vụ');
    }
  };

  // Dnd Handlers
  function onDragStart(event) { setActiveId(event.active.id); }

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
    setItems((prev) => prev.map((item) => item.id === activeId ? { ...item, status: overColumnId } : item));
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
          status: currentTask.status, // Status mới từ state sau khi drag
          priority: d.priority,
          parentId: d.parentId || null,
          assigneeId: d.assigneeId || null,
          storyPoint: d.storyPoint || 0,
        };
        await productBacklogService.updateWorkItem(projectId, activeId, payload);
      }
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
    }
  }

  const activeTask = useMemo(() => items.find((it) => it.id === activeId), [activeId, items]);

  return (
    <PageShell>
      <div className='flex flex-col gap-4 mb-4'>
        <StudentTabs />
        <div className='flex items-center gap-2'>
          <div className='w-full max-w-sm border rounded-full px-4 py-2 bg-white'>
            <input
              placeholder="Search tasks..."
              className='bg-transparent outline-none w-full text-sm'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full'>
          {COLUMNS.map((col) => (
            <BoardColumn
              key={col.id}
              column={col}
              tasks={byColumn[col.id].filter(t => t.title.toLowerCase().includes(query.toLowerCase()))}
              onCardClick={handleTaskClick}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={{ duration: 250, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
          {activeTask ? <IssueCard task={activeTask} isOverlay /> : null}
        </DragOverlay>
      </DndContext>

      {/* MODAL UPDATE */}
      <UpdateTaskModal
        open={openUpdateTask}
        epics={epics}
        sprints={sprints}
        initialData={selectedTask}
        onClose={() => {
          setOpenUpdateTask(false);
          setSelectedTask(null);
        }}
        onSubmit={handleUpdateSubmit}
      />
    </PageShell>
  );
}

function BoardColumn({ column, tasks, onCardClick }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  return (
    <div className='flex flex-col w-full h-full'>
      <div className='flex items-center gap-2 mb-3'>
        <span className='text-sm font-bold text-gray-700'>{column.title}</span>
        <span className='text-[11px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full'>{tasks.length}</span>
      </div>
      <div className={`h-1 w-full ${column.underline} mb-4 rounded-full opacity-80`} />
      <div
        ref={setNodeRef}
        className={`flex flex-col gap-4 p-1 min-h-[calc(100vh-300px)] transition-colors rounded-xl ${isOver ? 'bg-gray-50/50' : 'bg-transparent'}`}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((t) => (
            <SortableIssueCard key={t.id} task={t} onClick={onCardClick} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

function SortableIssueCard({ task, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = { transform: CSS.Translate.toString(transform), transition, opacity: isDragging ? 0.3 : 1 };
  return (
    <div ref={setNodeRef} style={style} className="touch-none" onClick={() => onClick(task)}>
      <div {...attributes} {...listeners}>
        <IssueCard task={task} />
      </div>
    </div>
  );
}

function IssueCard({ task, isOverlay }) {
  const getPriorityStyle = (priority) => {
    const p = priority?.toUpperCase();
    if (p === 'HIGH') return 'bg-orange-50 text-orange-700';
    if (p === 'LOW') return 'bg-green-50 text-green-700';
    return 'bg-blue-50 text-blue-700';
  };

  return (
    <div className={`bg-white border p-4 rounded-[24px] shadow-sm flex flex-col gap-3 transition-all relative ${isOverlay ? 'cursor-grabbing border-blue-500 shadow-xl scale-105' : 'cursor-grab border-gray-100 hover:shadow-md hover:border-gray-200'}`}>
      <div className='flex justify-between items-start'>
        <div className='px-3 py-1 border border-gray-100 rounded-full text-[10px] font-bold text-gray-400 bg-white uppercase'>{task.type || 'User Story'}</div>
      </div>
      <div className='mt-0.5'>
        <div className='text-[18px] font-extrabold text-gray-900 leading-none mb-2'>{task.displayId}</div>
        <div className='text-[14px] font-medium text-gray-600 line-clamp-3 leading-snug' dangerouslySetInnerHTML={{ __html: task.title }} />
      </div>
      <div className='flex flex-wrap gap-2 items-center mt-1'>
        <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${getPriorityStyle(task.priority)}`}>
          {task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1).toLowerCase()}
        </span>
        {task.points > 0 && <span className='w-6 h-6 flex items-center justify-center text-[11px] font-bold bg-blue-50 text-blue-500 rounded-full border border-blue-100'>{task.points}</span>}
      </div>
      <div className='flex items-center mt-1'>
        <div className='w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-400 text-[10px] font-bold uppercase'>
          {task.assignee?.charAt(0).toUpperCase()}
        </div>
      </div>
    </div>
  );
}
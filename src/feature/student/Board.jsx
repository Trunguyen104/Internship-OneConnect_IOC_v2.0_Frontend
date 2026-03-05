'use client';
import PageShell from '@/shared/components/PageShell';
import { useEffect, useMemo, useState } from 'react';
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

import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { productBacklogService } from '@/services/productbacklog.service';
import { ProjectService } from '@/services/projectService';
import { useToast } from '@/providers/ToastProvider';

const COLUMNS = [
  { id: 'TODO', title: 'To Do', underline: 'bg-gray-700' },
  { id: 'IN_PROGRESS', title: 'In Progress', underline: 'bg-blue-600' },
  { id: 'IN_REVIEW', title: 'In Review', underline: 'bg-yellow-500' },
  { id: 'DONE', title: 'Done', underline: 'bg-green-500' },
];

export default function BoardPage() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState(null);

  const toast = useToast();
  const [projectId, setProjectId] = useState(null);

  // Fetch Project ID
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

  // Fetch Active Sprint Tasks
  useEffect(() => {
    if (!projectId) return;

    const fetchSprints = async () => {
      try {
        const sprintsRes = await productBacklogService.getWorkItemsBacklog(projectId);
        let sprintsData = [];
        if (sprintsRes?.data?.sprints) {
          sprintsData = sprintsRes.data.sprints;
        }

        // Ưu tiên Sprint đang ACTIVE, nếu không lấy Sprint đầu tiên
        const activeSprint =
          sprintsData.find((s) => s.status?.toUpperCase() === 'ACTIVE') || sprintsData[0];

        if (activeSprint) {
          const itemsToMap = activeSprint.featureWorkItems || activeSprint.items || [];
          const mappedItems = itemsToMap.map((it, idx) => ({
            id: it.workItemId || it.id,
            displayId: it.key || `ISSUE-${idx + 1}`,
            title: it.title || it.name,
            type: it.type || 'UserStory',
            tag: it.type || 'Task',
            priority: it.priority || 'MEDIUM',
            points: it.storyPoint || it.point || it.points || 0,
            assignee: it.assigneeName || it.assignee || '—',
            status: it.status ? it.status.toUpperCase() : 'TODO',
          }));
          setItems(mappedItems);
        } else {
          setItems([]);
        }
      } catch (err) {
        console.error('Fetch sprints failed:', err);
        toast.error('Lỗi khi tải dữ liệu Bảng công việc');
      }
    };

    fetchSprints();
  }, [projectId, toast]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((x) => {
      const hay = `${x.id} ${x.title} ${x.tag} ${x.type} ${x.priority}`.toLowerCase();
      return hay.includes(q);
    });
  }, [items, query]);

  const byColumn = useMemo(() => {
    const map = Object.fromEntries(COLUMNS.map((c) => [c.id, []]));
    for (const it of filtered) (map[it.status] ??= []).push(it);
    return map;
  }, [filtered]);

  function findContainer(taskId) {
    return items.find((x) => x.id === taskId)?.status;
  }

  function onDragStart(e) {
    setActiveId(e.active.id);
  }

  async function onDragEnd(e) {
    const { active, over } = e;
    setActiveId(null);
    if (!over) return;

    const activeTaskId = active.id;
    const overId = over.id;

    const fromCol = findContainer(activeTaskId);
    const toCol = COLUMNS.some((c) => c.id === overId) ? overId : findContainer(overId);

    if (!fromCol || !toCol) return;

    if (fromCol !== toCol) {
      // Optimistic update
      setItems((prev) => prev.map((x) => (x.id === activeTaskId ? { ...x, status: toCol } : x)));

      // API call
      try {
        if (!projectId) throw new Error('Missing Project ID');

        const taskRes = await productBacklogService.getWorkItemById(projectId, activeTaskId);
        if (taskRes && taskRes.data) {
          const currentData = taskRes.data;
          const apiPayload = {
            title: currentData.title,
            description: currentData.description || '',
            type: currentData.type || 'UserStory',
            status: toCol,
            priority: currentData.priority || 'MEDIUM',
            parentId: currentData.parentId || null,
            assigneeId: currentData.assigneeId || null,
            dueDate: currentData.dueDate || null,
            storyPoint: currentData.storyPoint || 0,
          };
          const updateRes = await productBacklogService.updateWorkItem(
            projectId,
            activeTaskId,
            apiPayload,
          );
          if (updateRes && updateRes.isSuccess === false) {
            throw new Error(updateRes.message || 'Cập nhật thất bại');
          }
        } else {
          throw new Error('Không lấy được dữ liệu của task');
        }
      } catch (err) {
        console.error('Lỗi khi cập nhật trạng thái:', err);
        toast.error('Cập nhật trạng thái thất bại');
        // Revert UI nếu lỗi
        setItems((prev) =>
          prev.map((x) => (x.id === activeTaskId ? { ...x, status: fromCol } : x)),
        );
      }
    }
  }

  const activeTask = activeId ? items.find((x) => x.id === activeId) : null;

  return (
    <PageShell>
      <div className='flex flex-col gap-4 mb-4'>
        <div className='w-full'>
          <StudentTabs />
        </div>

        <div className='flex items-center gap-2'>
          <Search value={query} onChange={setQuery} />
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-4'>
          {COLUMNS.map((col) => (
            <BoardColumn key={col.id} column={col} tasks={byColumn[col.id] || []} />
          ))}
        </div>

        <DragOverlay>{activeTask ? <IssueCard task={activeTask} isOverlay /> : null}</DragOverlay>
      </DndContext>
    </PageShell>
  );
}

function Search({ value, onChange }) {
  return (
    <div className='flex items-center justify-between gap-2 rounded-4xl border border-border/80 bg-surface px-5 py-2.5 w-full max-w-sm'>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder='Search'
        className='outline-none bg-transparent text-base w-full placeholder:text-muted/70 text-text'
      />
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='20'
        height='20'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className='text-muted/70 shrink-0'
      >
        <circle cx='11' cy='11' r='8'></circle>
        <line x1='21' y1='21' x2='16.65' y2='16.65'></line>
      </svg>
    </div>
  );
}

function BoardColumn({ column, tasks }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div className='min-w-0'>
      <div className='flex items-center gap-2 mb-3'>
        <div className='text-base font-semibold'>{column.title}</div>
        <div className='text-xs text-muted rounded-full border border-border/60 px-2 py-0.5 bg-surface'>
          {tasks.length}
        </div>
        <button className='ml-auto text-muted hover:text-text px-2'>+</button>
      </div>
      <div className={`h-0.5 rounded-full ${column.underline} mb-3`} />

      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={[
            'flex flex-col gap-3 min-h-[160px] rounded-xl',
            isOver ? 'bg-primary/5' : '',
          ].join(' ')}
        >
          {tasks.map((t) => (
            <SortableIssueCard key={t.id} task={t} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

function SortableIssueCard({ task }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <IssueCard task={task} />
    </div>
  );
}

function IssueCard({ task, isOverlay }) {
  return (
    <div
      className={[
        'rounded-2xl bg-surface border border-border/60 shadow-sm px-4 py-4',
        'flex flex-col',
        'min-h-[220px]',
        isOverlay ? 'shadow-md' : '',
      ].join(' ')}
    >
      {/* header */}
      <div className='flex items-start justify-between gap-2'>
        <span className='text-xs px-3 py-1 rounded-full border border-border/60 bg-surface'>
          {task.type}
        </span>
        <button className='text-muted hover:text-text'>⋮</button>
      </div>

      {/* content */}
      <div className='mt-3 text-lg font-extrabold tracking-wide'>{task.displayId || task.id}</div>

      {/* ✅ cố định vùng title để card đều nhau */}
      <div
        className='mt-1 text-sm leading-5 line-clamp-2 min-h-[40px]'
        dangerouslySetInnerHTML={{ __html: task.title }}
      />

      <div className='mt-3 flex flex-wrap gap-2'>
        <span className='text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20'>
          {task.tag}
        </span>
      </div>

      {/* ✅ đẩy footer xuống đáy */}
      <div className='mt-auto pt-3 flex items-center gap-2'>
        <span
          className={[
            'text-xs px-2.5 py-1 rounded-full',
            task.priority === 'High'
              ? 'bg-primary/10 text-primary border border-primary/20'
              : 'bg-bg border border-border/60',
          ].join(' ')}
        >
          {task.priority}
        </span>

        {task.points ? (
          <span className='text-xs px-2.5 py-1 rounded-full bg-bg border border-border/60'>
            {task.points}
          </span>
        ) : (
          <span className='text-muted text-sm'>-</span>
        )}

        <div className='ml-auto w-9 h-9 rounded-full bg-bg border border-border/60 flex items-center justify-center text-sm font-semibold'>
          {task.assignee ? task.assignee.charAt(0).toUpperCase() : '?'}
        </div>
      </div>
    </div>
  );
}

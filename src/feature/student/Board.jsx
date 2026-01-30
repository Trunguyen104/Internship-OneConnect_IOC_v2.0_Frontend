'use client';
import PageShell from '@/shared/components/PageShell';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

// ✅ Chọn 1 trong 2 (mock hoặc API)
import { getJobBoardMock } from '@/mocks/jobboardMock';
// import { getJobBoardData } from '@/services/jobboard.service';

const COLUMNS = [
  { id: 'todo', title: 'To Do', underline: 'bg-gray-700' },
  { id: 'in_progress', title: 'In Progress', underline: 'bg-blue-600' },
  { id: 'in_review', title: 'In Review', underline: 'bg-yellow-500' },
  { id: 'done', title: 'Done', underline: 'bg-green-500' },
];

export default function BoardPage() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState(null);

  // ✅ Load data (đang dùng mock)
  useEffect(() => {
    getJobBoardMock().then(setItems).catch(console.error);

    // Backend xong thì đổi sang dòng này:
    // getJobBoardData().then(setItems).catch(console.error);
  }, []);

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

  function onDragEnd(e) {
    const { active, over } = e;
    setActiveId(null);
    if (!over) return;

    const activeTaskId = active.id;
    const overId = over.id;

    const fromCol = findContainer(activeTaskId);
    const toCol = COLUMNS.some((c) => c.id === overId) ? overId : findContainer(overId);

    if (!fromCol || !toCol) return;

    if (fromCol !== toCol) {
      setItems((prev) => prev.map((x) => (x.id === activeTaskId ? { ...x, status: toCol } : x)));
    }
  }

  const activeTask = activeId ? items.find((x) => x.id === activeId) : null;

  return (
    <PageShell title='Bảng công việc'>
      <div className='flex items-center justify-between mb-4 gap-4'>
        <StudentTabs />
        <div className='flex items-center gap-2'>
          <Search value={query} onChange={setQuery} />
          <button className='text-sm px-4 py-2 rounded-full border border-border/60 bg-surface shadow-sm hover:bg-bg'>
            Bộ lọc
          </button>
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
    <div className='flex items-center gap-2 rounded-full border border-border/60 bg-surface shadow-sm px-4 py-2'>
      <span className='text-muted text-sm'>🔎</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder='Tìm kiếm'
        className='outline-none bg-transparent text-sm w-56 placeholder:text-muted'
      />
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
      <div className='mt-3 text-lg font-extrabold tracking-wide'>{task.id}</div>

      {/* ✅ cố định vùng title để card đều nhau */}
      <div className='mt-1 text-sm leading-5 line-clamp-2 min-h-[40px]'>{task.title}</div>

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
          {task.assignee}
        </div>
      </div>
    </div>
  );
}

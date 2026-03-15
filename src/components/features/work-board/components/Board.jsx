'use client';
import PageShell from '@/components/layout/PageShell';
import StudentTabs from '@/components/layout/StudentTabs';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';

import UpdateTaskModal from '@/components/features/backlog/components/UpdateTaskModal';

import { useBoard, COLUMNS } from '../hooks/useBoard';
import { BoardColumn } from './BoardColumn';
import { IssueCard } from './IssueCard';
import { WORK_BOARD_UI } from '@/constants/work-board';

export default function Board() {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const {
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
    onDragEnd,
  } = useBoard();

  return (
    <PageShell>
      <div className='mb-4 flex flex-col gap-4'>
        <StudentTabs />
        <div className='flex items-center gap-2'>
          <div className='border-border bg-surface flex w-full max-w-sm items-center rounded-full border px-4 py-2 max-sm:max-w-xs'>
            <input
              placeholder={WORK_BOARD_UI.SEARCH_PLACEHOLDER}
              className='text-text w-full bg-transparent text-sm outline-none'
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
        <div className='grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
          {COLUMNS.map((col) => (
            <BoardColumn
              key={col.id}
              column={col}
              tasks={byColumn[col.id].filter((t) =>
                t.title.toLowerCase().includes(query.toLowerCase()),
              )}
              onCardClick={handleTaskClick}
            />
          ))}
        </div>

        <DragOverlay
          dropAnimation={{ duration: 250, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}
        >
          {activeTask ? <IssueCard task={activeTask} isOverlay /> : null}
        </DragOverlay>
      </DndContext>

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

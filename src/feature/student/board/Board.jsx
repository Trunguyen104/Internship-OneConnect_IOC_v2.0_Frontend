'use client';
import PageShell from '@/shared/components/PageShell';
import StudentTabs from '@/shared/components/StudentTabs';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';

import UpdateTaskModal from '@/shared/components/UpdateTaskModal';

import { useBoard, COLUMNS } from './hooks/useBoard';
import { BoardColumn } from './components/BoardColumn';
import { IssueCard } from './components/IssueCard';

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
    onDragEnd
  } = useBoard();

  return (
    <PageShell>
      <div className='flex flex-col gap-4 mb-4'>
        <StudentTabs />
        <div className='flex items-center gap-2'>
          <div className='w-full max-w-sm border rounded-full px-4 py-2 bg-white'>
            <input
              placeholder='Search tasks...'
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

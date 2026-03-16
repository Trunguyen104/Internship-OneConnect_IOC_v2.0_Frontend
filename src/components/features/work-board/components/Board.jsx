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
import SearchBar from '@/components/ui/SearchBar';
import { WORK_BOARD_UI } from '@/constants/work-board/uiText';
import { EmptySprintState } from './EmptySprintState';

export default function Board() {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const {
    query,
    setQuery,
    byColumn,
    activeTask,
    activeSprint,
    epics,
    sprints,
    loading,
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
        {activeSprint && (
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder={WORK_BOARD_UI.SEARCH_PLACEHOLDER}
            width='w-full max-w-sm'
          />
        )}
      </div>

      {!activeSprint && !loading ? (
        <EmptySprintState />
      ) : (
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
      )}

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

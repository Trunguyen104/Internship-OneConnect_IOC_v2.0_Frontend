'use client';
import {
  closestCorners,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import UpdateTaskModal from '@/components/features/backlog/components/UpdateTaskModal';
import StudentPageHeader from '@/components/layout/StudentPageHeader';
import StudentTabs from '@/components/layout/StudentTabs';
import SearchBar from '@/components/ui/searchbar';
import { WORK_BOARD_UI } from '@/constants/work-board/uiText';

import { COLUMNS, useBoard } from '../hooks/useBoard';
import { BoardColumn } from './BoardColumn';
import { EmptySprintState } from './EmptySprintState';
import { IssueCard } from './IssueCard';

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
    <div className="animate-in fade-in flex min-h-0 flex-1 flex-col space-y-6 duration-500">
      <StudentPageHeader hidden />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <StudentTabs />
        {activeSprint && (
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder={WORK_BOARD_UI.SEARCH_PLACEHOLDER}
            width="w-full max-w-sm"
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
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {COLUMNS.map((col) => (
              <BoardColumn
                key={col.id}
                column={col}
                tasks={byColumn[col.id].filter((t) =>
                  t.title.toLowerCase().includes(query.toLowerCase())
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
    </div>
  );
}

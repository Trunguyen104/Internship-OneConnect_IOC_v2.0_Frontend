'use client';

import {
  closestCorners,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import React from 'react';

import UpdateTaskModal from '@/components/features/backlog/components/UpdateTaskModal';
import StudentPageHeader from '@/components/layout/StudentPageHeader';
import StudentTabs from '@/components/layout/StudentTabs';
import { EmptyState } from '@/components/ui/emptystate';
import SearchBar from '@/components/ui/searchbar';
import { BACKLOG_UI } from '@/constants/backlog/uiText';
import { WORK_BOARD_UI } from '@/constants/work-board/uiText';

import { COLUMNS, useBoard } from '../hooks/useBoard';
import { BoardColumn } from './BoardColumn';
import { EmptySprintState } from './EmptySprintState';
import { IssueCard } from './IssueCard';

export default function Board() {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const {
    projectId,
    loadingProjectId,
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
          <div className="ml-auto">
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder={WORK_BOARD_UI.SEARCH_PLACEHOLDER}
              width="w-[320px]"
            />
          </div>
        )}
      </div>

      {!loadingProjectId && !projectId ? (
        <div className="flex flex-1 w-full items-center justify-center p-14 bg-white rounded-[40px] border border-slate-100 shadow-sm shadow-slate-100/30 overflow-hidden min-h-[600px]">
          <EmptyState
            title={BACKLOG_UI.NO_PROJECT_TITLE}
            description={BACKLOG_UI.NO_PROJECT_DESC}
            className="py-10"
          />
        </div>
      ) : !activeSprint && !loading ? (
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

      {openUpdateTask && (
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
      )}
    </div>
  );
}

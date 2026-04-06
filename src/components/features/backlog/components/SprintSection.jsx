'use client';

import { useDroppable } from '@dnd-kit/core';
import dayjs from 'dayjs';
import { MoreVertical, Pencil, Plus, Trash2 } from 'lucide-react';
import React from 'react';

import { productBacklogService } from '@/components/features/backlog/services/product-backlog.service';
import { Button } from '@/components/ui/button';
import { showDeleteConfirm } from '@/components/ui/deleteconfirm';
import { Dropdown } from '@/components/ui/dropdown';
import { BACKLOG_UI } from '@/constants/backlog/uiText';
import { SPRINT_STATUS } from '@/constants/common/enums';

import { ColumnHeaders, WorkItem } from './WorkItem';

export function SprintSection({
  sprint,
  projectId,
  itemOrders,
  handleSprintActionClick,
  handleDeleteSprint,
  handleDeleteWorkItem,
  setSelectedSprintAction,
  setSelectedTask,
  setOpenUpdateTask,
  setOpenUpdateSprint,
  setActiveSprintForTask,
  setOpenCreateTask,
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: sprint.sprintId,
  });

  return (
    <div
      ref={setNodeRef}
      className={`mb-6 rounded-[32px] border bg-white p-6 shadow-sm transition-colors ${
        isOver ? 'border-primary border-dashed bg-primary-surface/50' : 'border-slate-100'
      }`}
    >
      {/* Header */}
      <div className="mb-6 flex items-center pr-1 pl-2">
        <div className="flex items-center gap-3">
          <h3 className="text-[20px] font-bold text-slate-900 tracking-tight">
            {sprint.name || sprint.title}
          </h3>
          {sprint.startDate && sprint.endDate && (
            <div className="flex items-center gap-2 text-slate-400 text-[14px] font-medium pt-1">
              <span>
                {dayjs(sprint.startDate).format('MMM D')} -{' '}
                {dayjs(sprint.endDate).format('MMM D, YYYY')}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1" />

        {/* Dynamic Start/Complete Sprint button based on status */}
        {sprint.status === SPRINT_STATUS.ACTIVE || sprint.status === 'ACTIVE' ? (
          <Button
            onClick={() => handleSprintActionClick(sprint, false)}
            className="flex h-[34px] items-center rounded-full border border-success-border bg-success-surface px-5 text-[13px] font-medium text-success-text shadow-sm transition-colors hover:bg-success-surface/80"
          >
            {BACKLOG_UI.COMPLETE_SPRINT}
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => handleSprintActionClick(sprint, true)}
            className="flex h-[34px] items-center rounded-full border border-slate-200 bg-white px-5 text-[13px] font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
          >
            {BACKLOG_UI.START_SPRINT}
          </Button>
        )}

        {/* More Menu using Dropdown wrapper */}
        <Dropdown
          menu={{
            items: [
              {
                key: 'edit',
                label: (
                  <div className="flex items-center gap-2 py-1">
                    <Pencil className="h-4 w-4 text-blue-600" />
                    <span>{BACKLOG_UI.EDIT_SPRINT || 'Edit Sprint'}</span>
                  </div>
                ),
                onClick: () => {
                  setSelectedSprintAction(sprint);
                  setOpenUpdateSprint(true);
                },
              },
              {
                key: 'delete',
                label: (
                  <div className="flex items-center gap-2 py-1 text-primary">
                    <Trash2 className="h-4 w-4" />
                    <span>{BACKLOG_UI.DELETE_SPRINT || 'Delete Sprint'}</span>
                  </div>
                ),
                onClick: () => {
                  showDeleteConfirm({
                    title: BACKLOG_UI.DELETE_SPRINT || 'Delete Sprint',
                    content:
                      'Are you sure you want to delete this sprint? All items inside will be moved back to the backlog.',
                    onOk: () => handleDeleteSprint(sprint.sprintId),
                    okText: BACKLOG_UI.DELETE || 'Delete',
                    cancelText: BACKLOG_UI.CANCEL || 'Cancel',
                  });
                },
              },
            ],
          }}
        >
          <button className="ml-3 rounded-full p-1.5 text-gray-500 transition-all outline-none hover:bg-gray-100">
            <MoreVertical className="h-4 w-4" />
          </button>
        </Dropdown>
      </div>

      {/* List Container */}
      <ColumnHeaders />
      <div className="min-h-[20px]">
        {(sprint.items || []).map((it) => (
          <WorkItem
            key={it.workItemId || it.id}
            it={it}
            itemOrder={itemOrders[it.workItemId || it.id]}
            onDelete={() => handleDeleteWorkItem?.(it.workItemId || it.id)}
            sprintStartDate={sprint.startDate}
            sprintEndDate={sprint.endDate}
            onClick={async (task) => {
              try {
                const res = await productBacklogService.getWorkItemById(
                  projectId,
                  task.workItemId || task.id
                );
                setSelectedTask(res?.data ? { ...task, ...res.data } : task);
              } catch (e) {
                console.error(e);
                setSelectedTask(task);
              }
              setOpenUpdateTask(true);
            }}
          />
        ))}
        {isOver && (
          <div className="border-primary/30 bg-primary/5 text-primary flex h-16 items-center justify-center rounded-xl border-2 border-dashed text-sm font-medium">
            {BACKLOG_UI.DROP_TO_SPRINT}
          </div>
        )}
      </div>

      {/* Create task under sprint */}
      <div className="mt-4 flex items-center">
        <Button
          onClick={() => {
            setActiveSprintForTask(sprint.sprintId);
            setOpenCreateTask(true);
          }}
          className="flex items-center gap-2 rounded-lg px-4 py-2 font-medium"
        >
          <Plus className="h-4 w-4" />
          <span>{BACKLOG_UI.CREATE_TASK}</span>
        </Button>
      </div>
    </div>
  );
}

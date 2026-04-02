'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';

import { PRIORITY_MAP, TYPE_MAP, WORK_ITEM_PRIORITY } from '@/constants/common/enums';

export function IssueCard({ task, isOverlay }) {
  const getPriorityStyle = (priority) => {
    const val =
      typeof priority === 'string' ? WORK_ITEM_PRIORITY[priority.toUpperCase()] : priority;

    if (val === WORK_ITEM_PRIORITY.HIGH || val === WORK_ITEM_PRIORITY.CRITICAL) {
      return 'bg-danger-surface text-danger';
    }
    if (val === WORK_ITEM_PRIORITY.LOW) return 'bg-success-surface text-success';
    return 'bg-info-surface text-info';
  };

  return (
    <div
      className={`relative flex flex-col gap-3 rounded-[24px] border bg-white p-4 shadow-sm transition-all ${
        isOverlay
          ? 'border-primary border-2 scale-105 cursor-grabbing shadow-xl'
          : 'border-border hover:border-border-hover cursor-grab hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="bg-gray-50 text-gray-400 border-gray-100 rounded-full border px-3 py-1 text-[10px] font-bold uppercase">
          {TYPE_MAP[task.type] || task.type || 'User Story'}
        </div>
      </div>
      <div className="mt-0.5">
        <div className="text-text mb-2 text-[18px] leading-none font-extrabold text-gray-900">
          {task.displayId}
        </div>
        <div
          className="text-muted line-clamp-3 text-[14px] leading-snug font-medium text-gray-600"
          dangerouslySetInnerHTML={{ __html: task.title }}
        />
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${getPriorityStyle(
            task.priority
          )}`}
        >
          {PRIORITY_MAP[task.priority] || task.priority}
        </span>
        {task.points > 0 && (
          <span className="bg-primary-surface text-primary border-primary/20 flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-bold">
            {task.points}
          </span>
        )}
      </div>
      <div className="mt-1 flex items-center">
        <div className="bg-gray-100 text-gray-500 flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold uppercase border border-white shadow-sm">
          {task.assignee?.charAt(0).toUpperCase() || '?'}
        </div>
      </div>
    </div>
  );
}

export function SortableIssueCard({ task, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} className="touch-none" onClick={() => onClick(task)}>
      <div {...attributes} {...listeners}>
        <IssueCard task={task} />
      </div>
    </div>
  );
}

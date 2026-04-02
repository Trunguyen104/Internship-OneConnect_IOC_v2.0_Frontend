'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import React from 'react';

import { SortableIssueCard } from './IssueCard';

export function BoardColumn({ column, tasks, onCardClick }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-3 flex items-center gap-3 px-1">
        <span className="text-text text-[15px] leading-none font-bold text-gray-800">
          {column.title}
        </span>
        <div className="bg-gray-100 border-gray-200 text-gray-500 flex h-6 min-w-[24px] items-center justify-center rounded-full border px-1.5 text-[11px] font-bold shadow-sm">
          {tasks.length}
        </div>
      </div>
      <div className={`${column.underline} mb-5 h-[3px] w-full rounded-full opacity-80`} />
      <div
        ref={setNodeRef}
        className={`flex min-h-[calc(100vh-320px)] flex-col gap-4 rounded-xl transition-colors ${
          isOver ? 'bg-gray-50' : 'bg-transparent'
        }`}
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

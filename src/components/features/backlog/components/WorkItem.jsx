'use client';

import { useDraggable } from '@dnd-kit/core';
import { GripVertical, MoreVertical, Trash2 } from 'lucide-react';
import React from 'react';

import { showDeleteConfirm } from '@/components/ui/deleteconfirm';
import { Dropdown } from '@/components/ui/dropdown';
import { BACKLOG_UI } from '@/constants/backlog/uiText';
import { WORK_ITEM_PRIORITY, WORK_ITEM_STATUS } from '@/constants/common/enums';

const statusToneText = {
  [WORK_ITEM_STATUS.TODO]: 'bg-gray-100 text-muted',
  [WORK_ITEM_STATUS.IN_PROGRESS]: 'bg-info-surface text-info',
  [WORK_ITEM_STATUS.REVIEW]: 'bg-warning-surface text-warning-text border border-warning-border',
  [WORK_ITEM_STATUS.DONE]: 'bg-success-surface text-success',
  [WORK_ITEM_STATUS.CANCELLED]: 'bg-danger-surface text-danger',
  // Legacy string support
  TODO: 'bg-gray-100 text-muted',
  IN_PROGRESS: 'bg-info-surface text-info',
  REVIEW: 'bg-warning-surface text-warning-text border border-warning-border',
  DONE: 'bg-success-surface text-success',
};

const stringToColorTuple = (str) => {
  let hash = 0;
  for (let i = 0; i < (str?.length || 0); i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return { bg: `hsl(${hue}, 70%, 90%)`, text: `hsl(${hue}, 70%, 30%)` };
};

export function WorkItem({ it, itemOrder, onClick, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: it.workItemId || it.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 999 : 1,
      }
    : undefined;

  const currentStatus = it.status?.name || it.status;
  const statusConfig = statusToneText[currentStatus] || statusToneText[WORK_ITEM_STATUS.TODO];

  const getStatusLabel = (s) => {
    if (s === WORK_ITEM_STATUS.TODO || s === 'TODO') return BACKLOG_UI.STATUS_TODO || 'To Do';
    if (s === WORK_ITEM_STATUS.IN_PROGRESS || s === 'IN_PROGRESS')
      return BACKLOG_UI.STATUS_IN_PROGRESS || 'In Progress';
    if (s === WORK_ITEM_STATUS.REVIEW || s === 'REVIEW')
      return BACKLOG_UI.STATUS_REVIEW || 'Review';
    if (s === WORK_ITEM_STATUS.DONE || s === 'DONE') return BACKLOG_UI.STATUS_DONE || 'Done';
    if (s === WORK_ITEM_STATUS.CANCELLED || s === 'CANCELLED')
      return BACKLOG_UI.STATUS_CANCELLED || 'Cancelled';
    return s || BACKLOG_UI.STATUS_TODO || 'To Do';
  };

  const currentPriority = it.priority?.name || it.priority;
  const isHigh =
    currentPriority === WORK_ITEM_PRIORITY.HIGH ||
    currentPriority === 'HIGH' ||
    currentPriority === WORK_ITEM_PRIORITY.CRITICAL;
  const isLow = currentPriority === WORK_ITEM_PRIORITY.LOW || currentPriority === 'LOW';

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onClick?.(it)}
      className={`group mb-2 flex cursor-pointer items-center justify-between rounded-xl border border-transparent bg-white py-3 transition-colors hover:border-gray-100 hover:bg-gray-50/50 ${
        isDragging ? 'border-primary/20 z-50 shadow-lg' : ''
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        style={{ touchAction: 'none' }}
        className="mr-2 flex h-8 w-8 shrink-0 cursor-grab items-center justify-center text-gray-300 hover:text-gray-500 active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" />
      </div>

      <div className="flex flex-1 items-center">
        <div className="text-text w-20 shrink-0 pl-1 text-[13px] font-medium tracking-wide whitespace-nowrap">
          {BACKLOG_UI.ISSUE || 'Issue'} {itemOrder || '-'}
        </div>

        <div className="w-0 min-w-0 flex-1 pr-4">
          <div className="text-text truncate text-[13.5px] font-medium" title={it.title || it.name}>
            {it.title || it.name}
          </div>
        </div>

        <div className="flex w-32 shrink-0 justify-center">
          <span className={`${statusConfig} rounded-lg px-2.5 py-0.5 text-[12px] font-semibold`}>
            {getStatusLabel(currentStatus)}
          </span>
        </div>

        <div className="flex w-32 min-w-0 shrink-0 justify-center px-2">
          {it.epicName ? (
            <span
              className="bg-primary-surface text-primary block w-full truncate rounded-lg px-2.5 py-0.5 text-center text-xs font-semibold"
              title={it.epicName}
            >
              {it.epicName}
            </span>
          ) : (
            <span className="w-full"></span>
          )}
        </div>

        <div className="text-muted w-24 shrink-0 text-center text-[13px] font-medium text-gray-500">
          {it.dueDate ? new Date(it.dueDate).toLocaleDateString('vi-VN') : '-'}
        </div>

        <div className="text-primary w-24 shrink-0 text-center text-[13px] font-bold">
          {it.storyPoint || it.points || '-'}
        </div>

        <div className="flex w-20 shrink-0 justify-center">
          <span
            className={`rounded-lg px-2.5 py-0.5 text-[12px] font-semibold ${isHigh ? 'bg-danger-surface text-danger' : isLow ? 'bg-success-surface text-success' : 'bg-info-surface text-info'}`}
          >
            {isHigh
              ? currentPriority === WORK_ITEM_PRIORITY.CRITICAL
                ? BACKLOG_UI.PRIORITY_CRITICAL || 'Critical'
                : BACKLOG_UI.PRIORITY_HIGH || 'High'
              : isLow
                ? BACKLOG_UI.PRIORITY_LOW || 'Low'
                : BACKLOG_UI.PRIORITY_MEDIUM || 'Medium'}
          </span>
        </div>

        <div className="flex w-12 shrink-0 justify-center">
          <div
            className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold"
            style={{
              backgroundColor: stringToColorTuple(it.assigneeName || 'U').bg,
              color: stringToColorTuple(it.assigneeName || 'U').text,
            }}
          >
            {(it.assigneeName || '?').charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      <div className="flex w-8 shrink-0 justify-center text-gray-400 opacity-50 transition-opacity hover:opacity-100">
        <Dropdown
          menu={{
            items: [
              {
                key: 'delete',
                label: (
                  <div className="flex items-center gap-2 py-1 text-primary font-semibold">
                    <Trash2 className="h-4 w-4" />
                    <span>{BACKLOG_UI.DELETE || 'Delete'}</span>
                  </div>
                ),
                onClick: () => {
                  showDeleteConfirm({
                    title: 'Delete Work Item',
                    content:
                      'Are you sure you want to delete this work item? This action cannot be undone.',
                    onOk: () => onDelete?.(),
                    okText: BACKLOG_UI.DELETE || 'Delete',
                    cancelText: BACKLOG_UI.CANCEL || 'Cancel',
                  });
                },
              },
            ],
          }}
        >
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100"
            aria-label="Work item actions"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </Dropdown>
      </div>
    </div>
  );
}

export function ColumnHeaders() {
  return (
    <div className="mb-2 flex items-center justify-between rounded-lg border-b border-gray-100/50 bg-gray-50/80 px-2 py-2">
      <div className="mr-2 w-8 shrink-0" />

      <div className="flex flex-1 items-center text-gray-500">
        <div className="text-muted w-20 shrink-0 pl-1 text-xs font-semibold tracking-wider whitespace-nowrap uppercase">
          {BACKLOG_UI.ISSUE || 'Issue'}
        </div>
        <div className="text-muted min-w-0 flex-1 truncate text-xs font-semibold tracking-wider whitespace-nowrap uppercase">
          {BACKLOG_UI.FIELD_SUMMARY || 'Summary'}
        </div>
        <div className="text-muted w-32 shrink-0 text-center text-xs font-semibold tracking-wider whitespace-nowrap uppercase">
          {BACKLOG_UI.FIELD_STATUS || 'Status'}
        </div>
        <div className="text-muted w-32 shrink-0 px-2 text-center text-xs font-semibold tracking-wider whitespace-nowrap uppercase">
          {BACKLOG_UI.TYPE_EPIC || 'Epic'}
        </div>
        <div className="text-muted w-24 shrink-0 text-center text-xs font-semibold tracking-wider whitespace-nowrap uppercase">
          {BACKLOG_UI.FIELD_DUE_DATE || 'Due Date'}
        </div>
        <div className="text-muted w-24 shrink-0 text-center text-xs font-semibold tracking-wider whitespace-nowrap uppercase">
          {BACKLOG_UI.FIELD_STORY_POINTS || 'Pts'}
        </div>
        <div className="text-muted w-20 shrink-0 text-center text-xs font-semibold tracking-wider uppercase">
          {BACKLOG_UI.FIELD_PRIORITY || 'Priority'}
        </div>
        <div className="text-muted w-12 shrink-0 text-center text-xs font-semibold tracking-wider uppercase">
          {BACKLOG_UI.FIELD_ASSIGNEE || 'User'}
        </div>
      </div>

      <div className="w-8 shrink-0" />
    </div>
  );
}

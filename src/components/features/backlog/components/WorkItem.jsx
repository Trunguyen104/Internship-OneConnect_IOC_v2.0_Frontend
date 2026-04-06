'use client';

import { useDraggable } from '@dnd-kit/core';
import dayjs from 'dayjs';
import { AlertCircle, GripVertical, MoreVertical, Trash2 } from 'lucide-react';
import React from 'react';

import { showDeleteConfirm } from '@/components/ui/deleteconfirm';
import { Dropdown } from '@/components/ui/dropdown';
import { BACKLOG_UI } from '@/constants/backlog/uiText';
import { WORK_ITEM_PRIORITY, WORK_ITEM_STATUS } from '@/constants/common/enums';

/**
 * Các tông màu chuẩn cho trạng thái (Status) của công việc.
 */
const statusToneText = {
  [WORK_ITEM_STATUS.TODO]: 'bg-slate-100 text-muted',
  [WORK_ITEM_STATUS.IN_PROGRESS]: 'bg-info-surface text-info',
  [WORK_ITEM_STATUS.REVIEW]: 'bg-warning-surface text-warning-text border border-warning-border',
  [WORK_ITEM_STATUS.DONE]: 'bg-success-surface text-success',
  [WORK_ITEM_STATUS.CANCELLED]: 'bg-danger-surface text-danger',
  // Hỗ trợ string cũ
  TODO: 'bg-slate-100 text-muted',
  IN_PROGRESS: 'bg-info-surface text-info',
  REVIEW: 'bg-warning-surface text-warning-text border border-warning-border',
  DONE: 'bg-success-surface text-success',
};

/**
 * Hàm phụ trợ tạo màu Avatar dựa trên tên (để không bị trùng lặp).
 */
const stringToColorTuple = (str) => {
  let hash = 0;
  for (let i = 0; i < (str?.length || 0); i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return { bg: `hsl(${hue}, 70%, 90%)`, text: `hsl(${hue}, 70%, 30%)` };
};

/**
 * Hiển thị một mục công việc (Task/Item) đơn lẻ.
 */
export function WorkItem({ it, itemOrder, onClick, onDelete, sprintStartDate, sprintEndDate }) {
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
    if (s === WORK_ITEM_STATUS.TODO || s === 'TODO') return BACKLOG_UI.STATUS_TODO;
    if (s === WORK_ITEM_STATUS.IN_PROGRESS || s === 'IN_PROGRESS')
      return BACKLOG_UI.STATUS_IN_PROGRESS;
    if (s === WORK_ITEM_STATUS.REVIEW || s === 'REVIEW') return BACKLOG_UI.STATUS_REVIEW;
    if (s === WORK_ITEM_STATUS.DONE || s === 'DONE') return BACKLOG_UI.STATUS_DONE;
    if (s === WORK_ITEM_STATUS.CANCELLED || s === 'CANCELLED') return BACKLOG_UI.STATUS_CANCELLED;
    return s || BACKLOG_UI.STATUS_TODO;
  };

  const currentPriority = it.priority?.name || it.priority;
  const isHigh =
    currentPriority === WORK_ITEM_PRIORITY.HIGH ||
    currentPriority === 'HIGH' ||
    currentPriority === WORK_ITEM_PRIORITY.CRITICAL;
  const isLow = currentPriority === WORK_ITEM_PRIORITY.LOW || currentPriority === 'LOW';

  // Overdue and Range validation logic (Jira style)
  const isDone = currentStatus === WORK_ITEM_STATUS.DONE || currentStatus === 'DONE';
  const dueDate = it.dueDate ? dayjs(it.dueDate) : null;
  const today = dayjs().startOf('day');

  // Quá hạn: Có ngày và ngày đó trước ngày hôm nay
  const isOverdue = dueDate && dueDate.isBefore(today, 'day');

  // Nằm ngoài sprint: Có ngày và ngày đó nằm ngoài dải [start, end] của Sprint
  const isOutsideRange =
    dueDate &&
    sprintStartDate &&
    sprintEndDate &&
    (dueDate.isBefore(dayjs(sprintStartDate), 'day') ||
      dueDate.isAfter(dayjs(sprintEndDate), 'day'));

  // Chỉ hiện cảnh báo đỏ nếu nhiệm vụ CHƯA hoàn thành (không phải DONE)
  const showWarning = !isDone && (isOverdue || isOutsideRange);

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onClick?.(it)}
      className={`group mb-2 flex cursor-pointer items-center justify-between rounded-xl border border-transparent bg-white py-3 transition-colors hover:border-slate-100 hover:bg-slate-50/50 ${
        isDragging ? 'border-primary/20 z-50 shadow-lg' : ''
      }`}
    >
      {/* Nút cầm để kéo (Drag handle) */}
      <div
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        style={{ touchAction: 'none' }}
        className="mr-2 flex h-8 w-8 shrink-0 cursor-grab items-center justify-center text-slate-300 hover:text-slate-500 active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" />
      </div>

      <div className="flex flex-1 items-center">
        {/* Số thứ tự Issue */}
        <div className="text-text w-20 shrink-0 pl-1 text-[13px] font-medium tracking-wide whitespace-nowrap">
          {BACKLOG_UI.ISSUE} {itemOrder || '-'}
        </div>

        {/* Tiêu đề công việc */}
        <div className="w-0 min-w-0 flex-1 pr-4">
          <div className="text-text truncate text-[13.5px] font-bold" title={it.title || it.name}>
            {it.title || it.name}
          </div>
        </div>

        {/* Trạng thái */}
        <div className="hidden w-32 shrink-0 justify-center md:flex">
          <span className={`${statusConfig} rounded-lg px-2.5 py-0.5 text-[12px] font-semibold`}>
            {getStatusLabel(currentStatus)}
          </span>
        </div>

        {/* Epic liên quan */}
        <div className="hidden w-32 min-w-0 shrink-0 justify-center px-2 lg:flex">
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

        {/* Due Date Indicator (Jira style badge) */}
        <div className="flex w-24 shrink-0 justify-center">
          {it.dueDate ? (
            <div
              className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold transition-all ${
                showWarning
                  ? 'bg-red-50 text-red-600 border border-red-200 shadow-sm'
                  : 'bg-slate-50 text-slate-500 border border-slate-200/50'
              }`}
            >
              {showWarning && <AlertCircle className="h-3 w-3" />}
              <span>{dayjs(it.dueDate).format('MMM D')}</span>
            </div>
          ) : (
            <span className="text-slate-300">-</span>
          )}
        </div>

        {/* Story Points */}
        <div className="text-primary hidden w-24 shrink-0 text-center text-[13px] font-bold sm:block">
          {it.storyPoint || it.points || '-'}
        </div>

        {/* Độ ưu tiên */}
        <div className="hidden w-20 shrink-0 justify-center sm:flex">
          <span
            className={`rounded-lg px-2.5 py-0.5 text-[12px] font-semibold ${isHigh ? 'bg-danger-surface text-danger' : isLow ? 'bg-success-surface text-success' : 'bg-info-surface text-info'}`}
          >
            {isHigh
              ? currentPriority === WORK_ITEM_PRIORITY.CRITICAL
                ? BACKLOG_UI.PRIORITY_CRITICAL
                : BACKLOG_UI.PRIORITY_HIGH
              : isLow
                ? BACKLOG_UI.PRIORITY_LOW
                : BACKLOG_UI.PRIORITY_MEDIUM}
          </span>
        </div>

        {/* Avatar người thực hiện */}
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

      {/* Menu thao tác */}
      <div className="flex w-8 shrink-0 justify-center text-slate-400 opacity-50 transition-opacity hover:opacity-100">
        <Dropdown
          menu={{
            items: [
              {
                key: 'delete',
                label: (
                  <div className="flex items-center gap-2 py-1 text-primary font-bold">
                    <Trash2 className="h-4 w-4" />
                    <span>{BACKLOG_UI.DELETE}</span>
                  </div>
                ),
                onClick: (e) => {
                  if (e.domEvent) e.domEvent.stopPropagation();
                  showDeleteConfirm({
                    title: BACKLOG_UI.DELETE_TASK,
                    content: BACKLOG_UI.DELETE_TASK_CONFIRM,
                    onOk: () => onDelete?.(),
                    okText: BACKLOG_UI.DELETE,
                    cancelText: BACKLOG_UI.CANCEL,
                  });
                },
              },
            ],
          }}
        >
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100"
            aria-label="Work item actions"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </Dropdown>
      </div>
    </div>
  );
}

/**
 * Tiêu đề cột của bảng danh sách Item.
 */
export function ColumnHeaders() {
  return (
    <div className="mb-2 flex items-center justify-between rounded-lg border-b border-slate-100 bg-slate-50 px-2 py-2">
      <div className="mr-2 w-8 shrink-0" />

      <div className="flex flex-1 items-center text-slate-400">
        <div className="w-20 shrink-0 pl-1 text-xs font-bold tracking-wider whitespace-nowrap uppercase">
          {BACKLOG_UI.ISSUE}
        </div>
        <div className="min-w-0 flex-1 truncate text-xs font-bold tracking-wider whitespace-nowrap uppercase">
          {BACKLOG_UI.FIELD_SUMMARY}
        </div>
        <div className="hidden w-32 shrink-0 text-center text-xs font-bold tracking-wider whitespace-nowrap uppercase md:block">
          {BACKLOG_UI.FIELD_STATUS}
        </div>
        <div className="hidden w-32 shrink-0 px-2 text-center text-xs font-bold tracking-wider whitespace-nowrap uppercase lg:block">
          {BACKLOG_UI.TYPE_EPIC}
        </div>
        <div className="hidden w-24 shrink-0 text-center text-xs font-bold tracking-wider whitespace-nowrap uppercase md:block">
          {BACKLOG_UI.FIELD_DUE_DATE}
        </div>
        <div className="hidden w-24 shrink-0 text-center text-xs font-bold tracking-wider whitespace-nowrap uppercase sm:block">
          {BACKLOG_UI.FIELD_STORY_POINTS}
        </div>
        <div className="hidden w-20 shrink-0 text-center text-xs font-bold tracking-wider uppercase sm:block">
          {BACKLOG_UI.FIELD_PRIORITY}
        </div>
        <div className="w-12 shrink-0 text-center text-xs font-bold tracking-wider uppercase">
          {BACKLOG_UI.FIELD_ASSIGNEE}
        </div>
      </div>

      <div className="w-8 shrink-0" />
    </div>
  );
}

import dayjs from 'dayjs';
import { AlertCircle } from 'lucide-react';
import React from 'react';

import { DatePicker } from '@/components/ui/datepicker';
import { BACKLOG_UI } from '@/constants/backlog/uiText';
import { WORK_ITEM_PRIORITY, WORK_ITEM_STATUS, WORK_ITEM_TYPE } from '@/constants/common/enums';

import { Select, TextInput } from './TaskFields';

/**
 * Shared Sidebar for Create and Update Task Modals
 */
export function TaskModalSidebar({
  status,
  setStatus,
  type,
  setType,
  epic,
  setEpic,
  epics = [],
  assignee,
  setAssignee,
  priority,
  setPriority,
  dueDate,
  setDueDate,
  dueDateWarning,
  points,
  setPoints,
  members = [],
}) {
  const getStatusLabel = (s) => {
    if (s === WORK_ITEM_STATUS.TODO) return BACKLOG_UI.STATUS_TODO;
    if (s === WORK_ITEM_STATUS.IN_PROGRESS) return BACKLOG_UI.STATUS_IN_PROGRESS;
    if (s === WORK_ITEM_STATUS.REVIEW) return BACKLOG_UI.STATUS_REVIEW;
    if (s === WORK_ITEM_STATUS.DONE) return BACKLOG_UI.STATUS_DONE;
    if (s === WORK_ITEM_STATUS.CANCELLED) return BACKLOG_UI.STATUS_CANCELLED;
    return s;
  };

  const getTypeLabel = (t) => {
    if (t === WORK_ITEM_TYPE.EPIC) return BACKLOG_UI.TYPE_EPIC;
    if (t === WORK_ITEM_TYPE.USER_STORY) return BACKLOG_UI.TYPE_USER_STORY;
    if (t === WORK_ITEM_TYPE.TASK) return BACKLOG_UI.TYPE_TASK;
    if (t === WORK_ITEM_TYPE.SUBTASK) return BACKLOG_UI.TYPE_SUBTASK;
    return t;
  };

  const getPriorityLabel = (p) => {
    if (p === WORK_ITEM_PRIORITY.LOW) return BACKLOG_UI.PRIORITY_LOW;
    if (p === WORK_ITEM_PRIORITY.MEDIUM) return BACKLOG_UI.PRIORITY_MEDIUM;
    if (p === WORK_ITEM_PRIORITY.HIGH) return BACKLOG_UI.PRIORITY_HIGH;
    if (p === WORK_ITEM_PRIORITY.CRITICAL) return BACKLOG_UI.PRIORITY_CRITICAL;
    return p;
  };

  return (
    <div className="flex w-full shrink-0 flex-col lg:w-[360px]">
      <div className="rounded-3xl border border-gray-100 bg-gray-50/20 p-6 shadow-sm ring-1 ring-white/50 backdrop-blur-sm">
        <h3 className="mb-6 text-base font-bold text-gray-800">
          {BACKLOG_UI.DETAILS || 'Details'}
        </h3>

        <div className="flex flex-col gap-5">
          {/* Status */}
          <div className="flex items-center justify-between gap-4">
            <span className="min-w-[130px] text-sm font-medium text-gray-500">
              {BACKLOG_UI.FIELD_STATUS}
              <span className="text-danger"> *</span>
            </span>
            <div className="flex-1 min-w-0">
              <Select
                value={status}
                onChange={setStatus}
                options={Object.values(WORK_ITEM_STATUS)
                  .filter((s) => s !== WORK_ITEM_STATUS.CANCELLED)
                  .map((s) => ({
                    value: s,
                    label: getStatusLabel(s),
                  }))}
              />
            </div>
          </div>

          {/* Type */}
          <div className="flex items-center justify-between gap-4">
            <span className="min-w-[130px] text-sm font-medium text-gray-500">
              {BACKLOG_UI.FIELD_TYPE}
              <span className="text-danger"> *</span>
            </span>
            <div className="flex-1 min-w-0">
              <Select
                value={type}
                onChange={setType}
                options={Object.values(WORK_ITEM_TYPE).map((t) => ({
                  value: t,
                  label: getTypeLabel(t),
                }))}
              />
            </div>
          </div>

          {/* Epic */}
          <div className="flex items-center justify-between gap-4">
            <span className="min-w-[130px] text-sm font-medium text-gray-500">
              {BACKLOG_UI.FIELD_EPIC || 'Epic'}
            </span>
            <div className="flex-1 min-w-0">
              <Select
                value={epic}
                onChange={setEpic}
                placeholder="Epic"
                options={[
                  { value: '', label: 'None' },
                  ...epics.map((e) => ({
                    value: e.id || e.workItemId,
                    label: e.summary || e.title,
                  })),
                ]}
              />
            </div>
          </div>

          {/* Assignee */}
          <div className="flex items-center justify-between gap-4">
            <span className="min-w-[130px] text-sm font-medium text-gray-500">
              {BACKLOG_UI.FIELD_ASSIGNEE}
            </span>
            <div className="flex-1 min-w-0">
              <Select
                value={assignee}
                onChange={setAssignee}
                options={[
                  { value: '', label: 'Unassigned' },
                  ...members.map((m) => ({
                    value: m.id,
                    label: m.fullName,
                  })),
                ]}
              />
            </div>
          </div>

          {/* Priority */}
          <div className="flex items-center justify-between gap-4">
            <span className="min-w-[130px] text-sm font-medium text-gray-500">
              {BACKLOG_UI.FIELD_PRIORITY}
              <span className="text-danger"> *</span>
            </span>
            <div className="flex-1">
              <Select
                value={priority}
                onChange={setPriority}
                options={Object.values(WORK_ITEM_PRIORITY).map((p) => ({
                  value: p,
                  label: getPriorityLabel(p),
                }))}
              />
            </div>
          </div>

          {/* Due Date */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-4">
              <span className="min-w-[130px] text-sm font-medium text-gray-500">
                {BACKLOG_UI.FIELD_DUE_DATE}
              </span>
              <div className="flex-1">
                <DatePicker
                  value={dueDate ? dayjs(dueDate) : null}
                  onChange={(date) => setDueDate(date ? date.toISOString() : null)}
                  placeholder="Select date"
                  className={`w-full rounded-2xl h-10 transition-all ${
                    dueDateWarning ? 'border-red-400 bg-red-50/30' : ''
                  }`}
                />
              </div>
            </div>
            {dueDateWarning && (
              <span className="ml-[134px] flex items-center gap-1.5 text-[12px] font-medium text-red-500 animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle className="size-3.5" />
                {BACKLOG_UI.DUE_DATE_OUTSIDE_SPRINT}
              </span>
            )}
          </div>

          {/* Story Points */}
          <div className="flex items-center justify-between gap-4">
            <span className="min-w-[130px] text-sm font-medium text-gray-500">
              {BACKLOG_UI.FIELD_STORY_POINTS || 'Story Points'}
            </span>
            <div className="flex-1">
              <TextInput
                value={points}
                onChange={setPoints}
                placeholder=""
                className="h-10 rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

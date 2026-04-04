'use client';

import dayjs from 'dayjs';
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
  points,
  setPoints,
  members = [],
}) {
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
            <div className="flex-1">
              <Select
                value={status}
                onChange={setStatus}
                options={Object.values(WORK_ITEM_STATUS)
                  .filter((s) => s !== WORK_ITEM_STATUS.CANCELLED)
                  .map((s) => ({
                    value: s,
                    label: Object.keys(WORK_ITEM_STATUS).find((key) => WORK_ITEM_STATUS[key] === s),
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
            <div className="flex-1">
              <Select
                value={type}
                onChange={setType}
                options={Object.values(WORK_ITEM_TYPE).map((t) => ({
                  value: t,
                  label: Object.keys(WORK_ITEM_TYPE).find((key) => WORK_ITEM_TYPE[key] === t),
                }))}
              />
            </div>
          </div>

          {/* Epic */}
          <div className="flex items-center justify-between gap-4">
            <span className="min-w-[130px] text-sm font-medium text-gray-500">
              {BACKLOG_UI.FIELD_EPIC || 'Epic'}
            </span>
            <div className="flex-1">
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
            <div className="flex-1">
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
                  label: Object.keys(WORK_ITEM_PRIORITY).find(
                    (key) => WORK_ITEM_PRIORITY[key] === p
                  ),
                }))}
              />
            </div>
          </div>

          {/* Due Date */}
          <div className="flex items-center justify-between gap-4">
            <span className="min-w-[130px] text-sm font-medium text-gray-500">
              {BACKLOG_UI.FIELD_DUE_DATE}
            </span>
            <div className="flex-1">
              <DatePicker
                value={dueDate ? dayjs(dueDate) : null}
                onChange={(date) => setDueDate(date ? date.toISOString() : null)}
                placeholder="Select date"
                className="w-full rounded-2xl h-10"
              />
            </div>
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

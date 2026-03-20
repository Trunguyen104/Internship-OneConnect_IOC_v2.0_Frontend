'use client';

import DateInput from '@/components/ui/dateinput';
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
  sprintId,
  setSprintId,
  sprints = [],
  assignee,
  setAssignee,
  priority,
  setPriority,
  dueDate,
  setDueDate,
  points,
  setPoints,
}) {
  return (
    <div className="flex w-full shrink-0 flex-col lg:w-[360px]">
      <div
        className="border-border/50 h-full overflow-y-auto rounded-3xl border bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
        style={{ scrollbarWidth: 'none' }}
      >
        <h3 className="text-text mb-5 text-[17px] font-bold">{BACKLOG_UI.DETAILS || 'Details'}</h3>

        <div className="space-y-5">
          {/* Status */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted min-w-[130px] text-[13.5px] font-semibold">
              {BACKLOG_UI.FIELD_STATUS || 'Status'} <span className="text-danger">*</span>
            </span>
            <div className="flex-1">
              <Select
                value={status}
                onChange={setStatus}
                options={[
                  { value: WORK_ITEM_STATUS.TODO, label: 'To Do' },
                  { value: WORK_ITEM_STATUS.IN_PROGRESS, label: 'In Progress' },
                  { value: WORK_ITEM_STATUS.REVIEW, label: 'Review' },
                  { value: WORK_ITEM_STATUS.DONE, label: 'Done' },
                  { value: WORK_ITEM_STATUS.CANCELLED, label: 'Cancelled' },
                ]}
              />
            </div>
          </div>

          {/* Type */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted min-w-[120px] text-sm font-medium">
              {BACKLOG_UI.FIELD_TYPE || 'Type'} <span className="text-danger">*</span>
            </span>
            <div className="flex-1">
              <Select
                value={type}
                onChange={setType}
                options={[
                  { value: WORK_ITEM_TYPE.EPIC, label: 'Epic' },
                  { value: WORK_ITEM_TYPE.USER_STORY, label: 'User Story' },
                  { value: WORK_ITEM_TYPE.TASK, label: 'Task' },
                  { value: WORK_ITEM_TYPE.SUBTASK, label: 'Subtask' },
                ]}
              />
            </div>
          </div>

          {/* Epic */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted min-w-[120px] text-sm font-medium">
              {BACKLOG_UI.TYPE_EPIC || 'Epic'}
            </span>
            <div className="flex-1">
              <Select
                value={epic}
                onChange={setEpic}
                placeholder={BACKLOG_UI.SELECT || 'Select'}
                options={epics.map((e) => ({
                  value: e.id,
                  label: e.title || e.name || 'Untitled',
                }))}
              />
            </div>
          </div>

          {/* Sprint */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted min-w-[120px] text-sm font-medium">
              {BACKLOG_UI.FIELD_SPRINT || 'Sprint'}
            </span>
            <div className="flex-1">
              <Select
                value={sprintId}
                onChange={setSprintId}
                placeholder={BACKLOG_UI.PLACEHOLDER_SPRINT_OPTIONAL || 'Select Sprint (Optional)'}
                options={sprints.map((s) => ({
                  value: s.sprintId || s.id,
                  label: s.name || s.title || 'Untitled Sprint',
                }))}
              />
            </div>
          </div>

          {/* Assignee */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted min-w-[120px] text-sm font-medium">
              {BACKLOG_UI.FIELD_ASSIGNEE || 'Assignee'}
            </span>
            <div className="flex-1">
              <Select
                value={assignee}
                onChange={setAssignee}
                placeholder={BACKLOG_UI.SELECT || 'Select'}
                options={[
                  { value: 'dev1', label: 'Nguyen Van A' },
                  { value: 'dev2', label: 'Tran Thi B' },
                ]}
              />
            </div>
          </div>

          {/* Priority */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted min-w-[120px] text-sm font-medium">
              {BACKLOG_UI.FIELD_PRIORITY || 'Priority'} <span className="text-danger">*</span>
            </span>
            <div className="flex-1">
              <Select
                value={priority}
                onChange={setPriority}
                options={[
                  { value: WORK_ITEM_PRIORITY.LOW, label: 'Low' },
                  { value: WORK_ITEM_PRIORITY.MEDIUM, label: 'Medium' },
                  { value: WORK_ITEM_PRIORITY.HIGH, label: 'High' },
                  { value: WORK_ITEM_PRIORITY.CRITICAL, label: 'Critical' },
                ]}
              />
            </div>
          </div>

          {/* Due Date */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted min-w-[120px] text-sm font-medium">
              {BACKLOG_UI.FIELD_DUE_DATE || 'Due Date'}
            </span>
            <div className="flex-1">
              <DateInput value={dueDate} onChange={setDueDate} />
            </div>
          </div>

          {/* Story Points */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted min-w-[120px] text-sm font-medium">
              {BACKLOG_UI.FIELD_STORY_POINTS || 'Story Points'}
            </span>
            <div className="flex-1">
              <TextInput value={points} onChange={setPoints} placeholder="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

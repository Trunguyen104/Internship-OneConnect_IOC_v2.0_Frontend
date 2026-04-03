'use client';

import { PlusCircleOutlined } from '@ant-design/icons';
import React, { useMemo, useState } from 'react';

import CompoundModal from '@/components/ui/CompoundModal';
import TiptapEditor from '@/components/ui/tiptapeditor';
import { BACKLOG_UI } from '@/constants/backlog/uiText';
import { WORK_ITEM_PRIORITY, WORK_ITEM_STATUS, WORK_ITEM_TYPE } from '@/constants/common/enums';

import { FieldLabel, TextInput } from './TaskFields';
import { TaskModalSidebar } from './TaskModalSidebar';

export default function CreateTaskModal({
  open,
  onClose,
  onSubmit,
  epics = [],
  sprints = [],
  initialSprintId = '',
  members = [],
}) {
  const [summary, setSummary] = useState('');
  const [desc, setDesc] = useState('');

  const [type, setType] = useState(WORK_ITEM_TYPE.USER_STORY);
  const [status, setStatus] = useState(WORK_ITEM_STATUS.TODO);
  const [assignee, setAssignee] = useState('');
  const [priority, setPriority] = useState(WORK_ITEM_PRIORITY.MEDIUM);

  const [epic, setEpic] = useState('');
  const [sprintId, setSprintId] = useState(initialSprintId || '');
  const [dueDate, setDueDate] = useState('');
  const [points, setPoints] = useState('');

  const canSubmit = useMemo(
    () => summary.trim() && type && status && priority,
    [summary, type, status, priority]
  );

  function reset() {
    setSummary('');
    setDesc('');
    setType(WORK_ITEM_TYPE.USER_STORY);
    setStatus(WORK_ITEM_STATUS.TODO);
    setAssignee('');
    setPriority(WORK_ITEM_PRIORITY.MEDIUM);
    setEpic('');
    setSprintId('');
    setDueDate('');
    setPoints('');
  }

  function handleClose() {
    reset();
    onClose?.();
  }

  function handleSubmit() {
    if (!canSubmit) return;
    onSubmit?.({
      summary: summary.trim(),
      description: desc,
      type,
      status,
      assignee,
      priority,
      epic,
      sprintId,
      dueDate,
      points: points ? Number(points) : null,
    });
    handleClose();
  }

  return (
    <CompoundModal open={open} onCancel={handleClose} width={1200}>
      <CompoundModal.Header
        title={BACKLOG_UI.MODAL_CREATE_TASK}
        subtitle={BACKLOG_UI.MODAL_CREATE_TASK_SUBTITLE}
        icon={<PlusCircleOutlined />}
      />

      <CompoundModal.Content className="px-6">
        <div className="flex flex-col gap-8 lg:flex-row pb-2">
          {/* Left column (Main) */}
          <div className="flex flex-1 flex-col space-y-6">
            {/* Summary */}
            <div className="flex flex-col gap-2">
              <FieldLabel required>{BACKLOG_UI.FIELD_SUMMARY}</FieldLabel>
              <TextInput
                value={summary}
                onChange={setSummary}
                placeholder={BACKLOG_UI.PLACEHOLDER_SUMMARY}
                className="h-11 rounded-xl border-gray-200 bg-gray-50/30 transition-all focus:bg-white focus:shadow-md"
              />
            </div>

            {/* Description */}
            <div className="flex min-h-[400px] flex-1 flex-col gap-2">
              <FieldLabel required>{BACKLOG_UI.FIELD_DESCRIPTION}</FieldLabel>
              <div className="flex-1 rounded-xl border border-gray-100 overflow-hidden bg-gray-50/20 shadow-inner">
                <TiptapEditor
                  value={desc}
                  onChange={setDesc}
                  placeholder={BACKLOG_UI.PLACEHOLDER_DESC}
                />
              </div>
            </div>
          </div>

          {/* Right column (Details sidebar) */}
          <div className="w-full lg:w-[360px]">
            <TaskModalSidebar
              status={status}
              setStatus={setStatus}
              type={type}
              setType={setType}
              epic={epic}
              setEpic={setEpic}
              epics={epics}
              sprintId={sprintId}
              setSprintId={setSprintId}
              sprints={sprints}
              assignee={assignee}
              setAssignee={setAssignee}
              priority={priority}
              setPriority={setPriority}
              dueDate={dueDate}
              setDueDate={setDueDate}
              points={points}
              setPoints={setPoints}
              members={members}
            />
          </div>
        </div>
      </CompoundModal.Content>

      <CompoundModal.Footer
        onCancel={handleClose}
        onConfirm={handleSubmit}
        cancelText={BACKLOG_UI.CANCEL}
        confirmText={BACKLOG_UI.MODAL_CREATE_TASK}
        disabled={!canSubmit}
        className="px-6 py-4"
      />
    </CompoundModal>
  );
}

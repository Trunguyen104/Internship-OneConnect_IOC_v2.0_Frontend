'use client';

import { EditOutlined } from '@ant-design/icons';
import React, { useEffect, useMemo, useState } from 'react';

import CompoundModal from '@/components/ui/compoundmodal';
import TiptapEditor from '@/components/ui/tiptapeditor';
import { BACKLOG_UI } from '@/constants/backlog/uiText';
import { WORK_ITEM_PRIORITY, WORK_ITEM_STATUS, WORK_ITEM_TYPE } from '@/constants/common/enums';

import { FieldLabel, TextInput } from './TaskFields';
import { TaskModalSidebar } from './TaskModalSidebar';

export default function UpdateTaskModal({
  open,
  onClose,
  onSubmit,
  epics = [],
  sprints = [],
  initialData = null,
}) {
  const [summary, setSummary] = useState('');
  const [desc, setDesc] = useState('');

  const [type, setType] = useState(WORK_ITEM_TYPE.USER_STORY);
  const [status, setStatus] = useState(WORK_ITEM_STATUS.TODO);
  const [assignee, setAssignee] = useState('');
  const [priority, setPriority] = useState(WORK_ITEM_PRIORITY.MEDIUM);

  const [epic, setEpic] = useState('');
  const [sprintId, setSprintId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [points, setPoints] = useState('');

  useEffect(() => {
    if (open && initialData) {
      /* eslint-disable react-hooks/set-state-in-effect */
      setSummary(initialData.title || initialData.name || '');
      setDesc(initialData.description || '');

      // Determine mapping for numeric or string types
      const t = initialData.type;
      if (typeof t === 'number') setType(t);
      else if (t === 'Epic') setType(WORK_ITEM_TYPE.EPIC);
      else if (t === 'UserStory') setType(WORK_ITEM_TYPE.USER_STORY);
      else if (t === 'Task') setType(WORK_ITEM_TYPE.TASK);
      else if (t === 'Subtask') setType(WORK_ITEM_TYPE.SUBTASK);
      else setType(WORK_ITEM_TYPE.USER_STORY);

      const st = initialData.status?.name || initialData.status;
      if (typeof st === 'number') setStatus(st);
      else if (st === 'TODO') setStatus(WORK_ITEM_STATUS.TODO);
      else if (st === 'IN_PROGRESS') setStatus(WORK_ITEM_STATUS.IN_PROGRESS);
      else if (st === 'REVIEW') setStatus(WORK_ITEM_STATUS.REVIEW);
      else if (st === 'DONE') setStatus(WORK_ITEM_STATUS.DONE);
      else if (st === 'CANCELLED') setStatus(WORK_ITEM_STATUS.CANCELLED);
      else setStatus(WORK_ITEM_STATUS.TODO);

      setAssignee(initialData.assigneeId || '');

      const pr = initialData.priority?.name || initialData.priority;
      if (typeof pr === 'number') setPriority(pr);
      else if (pr === 'LOW') setPriority(WORK_ITEM_PRIORITY.LOW);
      else if (pr === 'MEDIUM') setPriority(WORK_ITEM_PRIORITY.MEDIUM);
      else if (pr === 'HIGH') setPriority(WORK_ITEM_PRIORITY.HIGH);
      else if (pr === 'CRITICAL') setPriority(WORK_ITEM_PRIORITY.CRITICAL);
      else setPriority(WORK_ITEM_PRIORITY.MEDIUM);

      setEpic(initialData.parentId || '');

      // Determine sprintId
      let sid = initialData.sprintId;
      if (!sid) {
        for (const sp of sprints) {
          if (
            sp.items?.find(
              (i) => (i.workItemId || i.id) === (initialData.workItemId || initialData.id)
            )
          ) {
            sid = sp.sprintId;
            break;
          }
        }
      }
      setSprintId(sid || '');

      if (initialData.dueDate) {
        const date = new Date(initialData.dueDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        setDueDate(`${year}-${month}-${day}`);
      } else {
        setDueDate('');
      }

      setPoints(
        initialData.storyPoint !== undefined && initialData.storyPoint !== null
          ? String(initialData.storyPoint)
          : initialData.points !== undefined && initialData.points !== null
            ? String(initialData.points)
            : ''
      );
      /* eslint-enable react-hooks/set-state-in-effect */
    }
  }, [open, initialData, sprints]);

  const canSubmit = useMemo(
    () => summary.trim() && type && status && priority,
    [summary, type, status, priority]
  );

  function handleClose() {
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
      points: points !== '' ? Number(points) : null,
      id: initialData?.workItemId || initialData?.id,
    });
    onClose?.();
  }

  return (
    <CompoundModal open={open} onCancel={handleClose} width={1200}>
      <CompoundModal.Header
        title={BACKLOG_UI.UPDATE_TASK || 'Cáº­p nháº­t cÃ´ng viá»‡c'}
        subtitle="Chá»‰nh sá»­a chi tiáº¿t cÃ´ng viá»‡c, tráº¡ng thÃ¡i vÃ  lá»™ trÃ¬nh thá»±c hiá»‡n trong dá»± Ã¡n"
        icon={<EditOutlined />}
      />

      <CompoundModal.Content className="px-6">
        <div className="flex flex-col gap-8 lg:flex-row pb-2">
          {/* Left column (Main) */}
          <div className="flex flex-1 flex-col space-y-6">
            {/* Summary */}
            <div className="flex flex-col gap-2">
              <FieldLabel required>{BACKLOG_UI.FIELD_SUMMARY || 'Summary'}</FieldLabel>
              <TextInput
                value={summary}
                onChange={setSummary}
                placeholder={BACKLOG_UI.PLACEHOLDER_SUMMARY || 'Enter summary...'}
                className="h-11 rounded-xl border-gray-200 bg-gray-50/30 transition-all focus:bg-white focus:shadow-md"
              />
            </div>

            {/* Description */}
            <div className="flex min-h-[400px] flex-1 flex-col gap-2">
              <FieldLabel required>{BACKLOG_UI.FIELD_DESCRIPTION || 'Description'}</FieldLabel>
              <div className="flex-1 rounded-xl border border-gray-100 overflow-hidden bg-gray-50/20 shadow-inner">
                <TiptapEditor
                  value={desc}
                  onChange={setDesc}
                  placeholder={
                    BACKLOG_UI.PLACEHOLDER_DESCRIPTION || 'Enter detailed description...'
                  }
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
            />
          </div>
        </div>
      </CompoundModal.Content>

      <CompoundModal.Footer
        onCancel={handleClose}
        onConfirm={handleSubmit}
        cancelText={BACKLOG_UI.CANCEL || 'Cancel'}
        confirmText={BACKLOG_UI.UPDATE || 'Update'}
        disabled={!canSubmit}
        className="px-6 py-4"
      />
    </CompoundModal>
  );
}

'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import TiptapEditor from '@/components/ui/TiptapEditor';
import DateInput from '@/components/ui/DateInput';

import { FieldLabel, TextInput } from './TaskFields';
import { TaskModalSidebar } from './TaskModalSidebar';
import { WORK_ITEM_STATUS, WORK_ITEM_TYPE, WORK_ITEM_PRIORITY } from '@/constants/enums';

export default function CreateTaskModal({
  open,
  onClose,
  onSubmit,
  epics = [],
  sprints = [],
  initialSprintId = '',
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

  useEffect(() => {
    if (open) {
      setSprintId(initialSprintId || '');
    }
  }, [open, initialSprintId]);

  const canSubmit = useMemo(
    () => summary.trim() && type && status && priority,
    [summary, type, status, priority],
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
    reset();
    onClose?.();
  }

  if (!open) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6'>
      {/* Overlay */}
      <button
        type='button'
        aria-label='Đóng modal'
        onClick={handleClose}
        className='absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity'
      />

      {/* Modal Container */}
      <div className='relative flex max-h-[90vh] w-full max-w-[1200px] flex-col rounded-4xl bg-white shadow-2xl'>
        {/* Header */}
        <div className='flex items-center justify-between px-8 pt-8 pb-5'>
          <h2 className='text-[28px] font-bold text-slate-900'>Create Task</h2>
        </div>

        {/* Content Body - 2 Columns */}
        <div
          className='flex flex-1 flex-col overflow-y-auto px-8 pb-3'
          style={{ scrollbarWidth: 'thin' }}
        >
          <div className='flex flex-col gap-8 lg:flex-row'>
            {/* Cột trái (Main) */}
            <div className='flex flex-1 flex-col space-y-6'>
              {/* Tóm tắt */}
              <div>
                <FieldLabel required>Summary</FieldLabel>
                <TextInput value={summary} onChange={setSummary} placeholder='Enter summary...' />
              </div>

              {/* Mô tả */}
              <div className='flex flex-1 flex-col overflow-hidden min-h-[200px]'>
                <FieldLabel required>Description</FieldLabel>
                <div className='flex-1 overflow-y-auto rounded-2xl'>
                  <TiptapEditor
                    value={desc}
                    onChange={setDesc}
                    placeholder='Enter detailed description...'
                  />
                </div>
              </div>
            </div>

            {/* Cột phải (Sidebar Chi tiết) */}
            <TaskModalSidebar 
              status={status} setStatus={setStatus}
              type={type} setType={setType}
              epic={epic} setEpic={setEpic}
              epics={epics}
              sprintId={sprintId} setSprintId={setSprintId}
              sprints={sprints}
              assignee={assignee} setAssignee={setAssignee}
              priority={priority} setPriority={setPriority}
              dueDate={dueDate} setDueDate={setDueDate}
              points={points} setPoints={setPoints}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className='flex items-center justify-between px-8 py-5 gap-4 mt-1 border-t border-slate-100'>
          <button
            type='button'
            onClick={handleClose}
            className='h-[50px] px-10 w-[140px] rounded-full text-[15px] font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors'
          >
            Cancel
          </button>

          <button
            type='button'
            onClick={handleSubmit}
            disabled={!canSubmit}
            className='h-[50px] flex-1 flex items-center justify-center rounded-full bg-[#A32A2A] text-[15px] font-bold text-white transition-colors hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60'
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
}


'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import TiptapEditor from '@/shared/components/TiptapEditor';
import DateInput from '@/shared/components/DateInput';

function FieldLabel({ required, children }) {
  return (
    <div className='mb-[6px] text-sm font-semibold text-slate-700'>
      {children}
      {required ? <span className='text-red-500'> *</span> : null}
    </div>
  );
}

function Select({ value, onChange, options = [], placeholder = 'Select' }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const selectedOption = options.find((op) => op.value === value);

  return (
    <div className='relative w-full' ref={containerRef}>
      <button
        type='button'
        onClick={() => setOpen(!open)}
        className='h-10 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm outline-none flex items-center justify-between hover:border-slate-400 transition-colors focus:border-red-400 focus:ring-1 focus:ring-red-400'
      >
        <span className={value ? 'text-slate-700 font-medium' : 'text-slate-400 font-medium'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7' />
        </svg>
      </button>

      {open && (
        <div className='absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] py-2 overflow-hidden left-0 origin-top'>
          {options.map((op) => {
            const isSelected = value === op.value;
            return (
              <button
                key={op.value}
                type='button'
                onClick={() => {
                  onChange?.(op.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-[14px] transition-colors ${
                  isSelected
                    ? 'bg-red-50 text-[#A32A2A] font-bold'
                    : 'text-slate-600 hover:bg-slate-50 font-medium'
                }`}
              >
                {op.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TextInput({ value, onChange, placeholder = '' }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      className='h-10 w-full rounded-full border border-slate-300 bg-white px-4 text-sm text-slate-700 outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 placeholder:text-slate-400'
    />
  );
}

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

  const [type, setType] = useState('UserStory');
  const [status, setStatus] = useState('TODO');
  const [assignee, setAssignee] = useState('');
  const [priority, setPriority] = useState('MEDIUM');

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
    setType('UserStory');
    setStatus('TODO');
    setAssignee('');
    setPriority('MEDIUM');
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
          <div className='flex h-full flex-col gap-8 lg:flex-row items-stretch'>
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
            <div className='w-full lg:w-[360px] shrink-0 flex flex-col'>
              <div
                className='rounded-3xl bg-white p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] h-full overflow-y-auto'
                style={{ scrollbarWidth: 'none' }}
              >
                <h3 className='mb-5 text-[17px] font-bold text-slate-800'>Details</h3>

                <div className='space-y-5'>
                  {/* Trạng thái */}
                  <div className='flex items-center justify-between gap-4'>
                    <span className='min-w-[130px] text-[13.5px] font-semibold text-slate-600'>
                      Status <span className='text-red-500'>*</span>
                    </span>
                    <div className='flex-1'>
                      <Select
                        value={status}
                        onChange={setStatus}
                        options={[
                          { value: 'TODO', label: 'To Do' },
                          { value: 'IN_PROGRESS', label: 'In Progress' },
                          { value: 'DONE', label: 'Done' },
                        ]}
                      />
                    </div>
                  </div>

                  {/* Loại */}
                  <div className='flex items-center justify-between gap-4'>
                    <span className='min-w-[120px] text-sm font-medium text-slate-600'>
                      Type <span className='text-red-500'>*</span>
                    </span>
                    <div className='flex-1'>
                      <Select
                        value={type}
                        onChange={setType}
                        options={[
                          { value: 'UserStory', label: 'User Story' },
                          { value: 'Task', label: 'Task' },
                          { value: 'Subtask', label: 'Subtask' },
                        ]}
                      />
                    </div>
                  </div>

                  {/* Epic */}
                  <div className='flex items-center justify-between gap-4'>
                    <span className='min-w-[120px] text-sm font-medium text-slate-600'>Epic</span>
                    <div className='flex-1'>
                      <Select
                        value={epic}
                        onChange={setEpic}
                        placeholder='Select'
                        options={epics.map((e) => ({
                          value: e.id,
                          label: e.title || e.name || 'Untitled',
                        }))}
                      />
                    </div>
                  </div>

                  {/* Sprint */}
                  <div className='flex items-center justify-between gap-4'>
                    <span className='min-w-[120px] text-sm font-medium text-slate-600'>Sprint</span>
                    <div className='flex-1'>
                      <Select
                        value={sprintId}
                        onChange={setSprintId}
                        placeholder='Select Sprint (Optional)'
                        options={sprints.map((s) => ({
                          value: s.sprintId || s.id,
                          label: s.name || s.title || 'Untitled Sprint',
                        }))}
                      />
                    </div>
                  </div>

                  {/* Người thực hiện */}
                  <div className='flex items-center justify-between gap-4'>
                    <span className='min-w-[120px] text-sm font-medium text-slate-600'>
                      Assignee
                    </span>
                    <div className='flex-1'>
                      <Select
                        value={assignee}
                        onChange={setAssignee}
                        placeholder='Select'
                        options={[
                          { value: 'dev1', label: 'Nguyen Van A' },
                          { value: 'dev2', label: 'Tran Thi B' },
                        ]}
                      />
                    </div>
                  </div>

                  {/* Độ ưu tiên */}
                  <div className='flex items-center justify-between gap-4'>
                    <span className='min-w-[120px] text-sm font-medium text-slate-600'>
                      Priority <span className='text-red-500'>*</span>
                    </span>
                    <div className='flex-1'>
                      <Select
                        value={priority}
                        onChange={setPriority}
                        options={[
                          { value: 'LOW', label: 'Low' },
                          { value: 'MEDIUM', label: 'Medium' },
                          { value: 'HIGH', label: 'High' },
                        ]}
                      />
                    </div>
                  </div>

                  {/* Ngày hết hạn */}
                  <div className='flex items-center justify-between gap-4'>
                    <span className='min-w-[120px] text-sm font-medium text-slate-600'>
                      Due Date
                    </span>
                    <div className='flex-1'>
                      <DateInput value={dueDate} onChange={setDueDate} />
                    </div>
                  </div>

                  {/* Story Points */}
                  <div className='flex items-center justify-between gap-4'>
                    <span className='min-w-[120px] text-sm font-medium text-slate-600'>
                      Story Points
                    </span>
                    <div className='flex-1'>
                      <TextInput value={points} onChange={setPoints} placeholder='' />
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

'use client';

import { useMemo, useState } from 'react';
import TiptapEditor from '@/shared/components/TiptapEditor';
function FieldLabel({ required, children }) {
  return (
    <div className='mb-2 text-sm font-semibold text-text'>
      {children}
      {required ? <span className='text-primary'> *</span> : null}
    </div>
  );
}

function Select({ value, onChange, options = [], placeholder = 'Chọn' }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className={[
        'h-11 w-full rounded-full border border-border bg-white px-4 text-sm',
        'outline-none focus:border-primary',
      ].join(' ')}
    >
      <option value=''>{placeholder}</option>
      {options.map((op) => (
        <option key={op.value} value={op.value}>
          {op.label}
        </option>
      ))}
    </select>
  );
}

function TextInput({ value, onChange, placeholder = '' }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      className={[
        'h-11 w-full rounded-full border border-border bg-white px-4 text-sm',
        'outline-none focus:border-primary',
      ].join(' ')}
    />
  );
}

function DateInput({ value, onChange }) {
  return (
    <input
      type='date'
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className={[
        'h-11 w-full rounded-full border border-border bg-white px-4 text-sm',
        'outline-none focus:border-primary',
      ].join(' ')}
    />
  );
}

export default function CreateTaskModal({ open, onClose, onSubmit }) {
  const [summary, setSummary] = useState('');
  const [desc, setDesc] = useState('');

  const [type, setType] = useState('USER_STORY');
  const [status, setStatus] = useState('TODO');
  const [assignee, setAssignee] = useState('');
  const [priority, setPriority] = useState('MEDIUM');

  const [epic, setEpic] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [points, setPoints] = useState('');
  const [tag, setTag] = useState('');

  const canSubmit = useMemo(
    () => summary.trim() && type && status && priority,
    [summary, type, status, priority],
  );

  function reset() {
    setSummary('');
    setDesc('');
    setType('USER_STORY');
    setStatus('TODO');
    setAssignee('');
    setPriority('MEDIUM');
    setEpic('');
    setDueDate('');
    setPoints('');
    setTag('');
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
      dueDate,
      points: points ? Number(points) : null,
      tag,
    });
    reset();
    onClose?.();
  }

  if (!open) return null;

  return (
    <div className='fixed inset-0 z-999 flex items-center justify-center p-4'>
      {/* overlay */}
      <button
        type='button'
        aria-label='overlay'
        onClick={handleClose}
        className='absolute inset-0 bg-black/30'
      />

      {/* modal */}
      <div className='relative w-full max-w-[820px] rounded-2xl bg-white shadow-2xl'>
        {/* Header */}
        <div className='px-8 pt-7'>
          <div className='text-center text-3xl font-bold text-text'>Tạo Nhiệm vụ</div>
        </div>

        {/* Body (scroll like ảnh) */}
        <div className='max-h-[68vh] overflow-y-auto px-6 pb-5 pt-5'>
          {/* Tóm tắt */}
          <div className='mb-6'>
            <FieldLabel required>Tóm tắt</FieldLabel>
            <TextInput value={summary} onChange={setSummary} placeholder='Nhập tóm tắt…' />
          </div>

          {/* Mô tả */}
          <div className='mb-6'>
            <FieldLabel>Mô tả</FieldLabel>

            <TiptapEditor
              value={desc}
              onChange={setDesc}
              placeholder='Nhập mô tả...'
              minHeight={160}
            />
          </div>
          {/* Grid 2 cột */}
          <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
            <div>
              <FieldLabel required>Loại</FieldLabel>
              <Select
                value={type}
                onChange={setType}
                options={[
                  { value: 'USER_STORY', label: 'User Story' },
                  { value: 'TASK', label: 'Task' },
                  { value: 'BUG', label: 'Bug' },
                ]}
              />
            </div>

            <div>
              <FieldLabel required>Trạng thái</FieldLabel>
              <Select
                value={status}
                onChange={setStatus}
                options={[
                  { value: 'TODO', label: 'To Do' },
                  { value: 'IN_PROGRESS', label: 'In Progress' },
                  { value: 'IN_REVIEW', label: 'In Review' },
                  { value: 'DONE', label: 'Done' },
                ]}
              />
            </div>

            <div>
              <FieldLabel>Người thực hiện</FieldLabel>
              <Select
                value={assignee}
                onChange={setAssignee}
                options={[
                  { value: 'minh', label: 'Trần Công Minh' },
                  { value: 'phat', label: 'Lê Thuận Phát' },
                  { value: 'bao', label: 'Nguyễn Kim Bảo' },
                ]}
                placeholder='Chọn'
              />
            </div>

            <div>
              <FieldLabel required>Độ ưu tiên</FieldLabel>
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

            {/* Epic full width */}
            <div className='md:col-span-2'>
              <FieldLabel>Epic</FieldLabel>
              <Select
                value={epic}
                onChange={setEpic}
                options={[
                  { value: 'epic1', label: 'Epic 1' },
                  { value: 'epic2', label: 'Epic 2' },
                ]}
                placeholder='Chọn Epic'
              />
            </div>

            <div>
              <FieldLabel>Ngày hết hạn</FieldLabel>
              <DateInput value={dueDate} onChange={setDueDate} />
            </div>

            <div>
              <FieldLabel>Story Points</FieldLabel>
              <TextInput value={points} onChange={setPoints} placeholder='' />
            </div>

            <div className='md:col-span-2'>
              <FieldLabel>Tag</FieldLabel>
              <Select
                value={tag}
                onChange={setTag}
                options={[
                  { value: 'ui', label: 'UI' },
                  { value: 'api', label: 'API' },
                  { value: 'bug', label: 'Bug' },
                ]}
                placeholder='Chọn'
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='flex items-center justify-between gap-4 px-8 pb-7'>
          <button
            type='button'
            onClick={handleClose}
            className='h-12 min-w-[140px] rounded-full bg-[var(--primary-50)] px-6 text-sm font-semibold text-[var(--color-primary)] hover:bg-[var(--primary-100)]'
          >
            Hủy
          </button>

          <button
            type='button'
            onClick={handleSubmit}
            className='
    h-10 flex-1 rounded-full px-6 text-sm font-semibold text-white
    bg-primary hover:bg-primary-hover
  '
          >
            Tạo Nhiệm vụ
          </button>
        </div>
      </div>
    </div>
  );
}

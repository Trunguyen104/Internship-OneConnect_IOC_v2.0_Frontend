'use client';

import { useMemo, useState } from 'react';
import TiptapEditor from '@/components/ui/TiptapEditor';
import DateInput from '@/components/ui/DateInput';

function FieldLabel({ required, children }) {
  return (
    <div className='mb-2 text-sm font-semibold text-text'>
      {children}
      {required ? <span className='text-primary'> *</span> : null}
    </div>
  );
}

function TextInput({ value, onChange, placeholder = '' }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      className='h-11 w-full rounded-2xl border border-border bg-white px-4 text-sm outline-none focus:border-primary'
    />
  );
}

export default function CreateEpicModal({ open, onClose, onSubmit }) {
  const [epicName, setEpicName] = useState('');
  const [desc, setDesc] = useState('');
  const [endDate, setEndDate] = useState('');

  const canSubmit = useMemo(() => epicName.trim() !== '', [epicName]);

  function reset() {
    setEpicName('');
    setDesc('');
    setEndDate('');
  }

  function handleClose() {
    onClose?.();
  }

  function handleSubmit() {
    if (!canSubmit) return;
    onSubmit?.({
      name: epicName.trim(),
      description: desc,
      endDate,
    });
    reset();
    onClose?.();
  }

  if (!open) return null;

  return (
    <div className='fixed inset-0 z-999 flex items-center justify-center p-4 backdrop-blur-sm'>
      {/* overlay */}
      <button
        type='button'
        aria-label='overlay'
        onClick={handleClose}
        className='absolute inset-0 bg-black/40 transition-opacity'
      />

      {/* modal */}
      <div className='relative w-full max-w-[720px] rounded-3xl bg-white shadow-2xl overflow-hidden flex flex-col'>
        <div className='flex flex-col h-full max-h-[85vh]'>
          {/* Header */}
          <div className='px-8 pt-8 pb-4 shrink-0'>
            <div className='text-2xl font-bold text-text'>Create Epic</div>
          </div>

          {/* Body */}
          <div className='flex-1 flex flex-col overflow-y-auto px-8 py-2 space-y-6'>
            {/* Tên Epic */}
            <div>
              <FieldLabel required>Epic Name</FieldLabel>
              <TextInput
                value={epicName}
                onChange={setEpicName}
                placeholder='Enter epic summary...'
              />
            </div>

            {/* Mô tả */}
            <div className='flex flex-1 flex-col overflow-hidden min-h-[250px]'>
              <FieldLabel>Description</FieldLabel>
              <div className='flex-1 overflow-y-auto rounded-2xl'>
                <TiptapEditor value={desc} onChange={setDesc} placeholder='Enter description...' />
              </div>
            </div>

            {/* Ngày kết thúc */}
            <div>
              <FieldLabel>End Date</FieldLabel>
              <div className='w-[200px]'>
                <DateInput value={endDate} onChange={setEndDate} />
              </div>
            </div>
          </div>

          <div className='flex items-center justify-end gap-3 px-8 py-6 shrink-0'>
            <button
              type='button'
              onClick={handleClose}
              className='h-11 rounded-full bg-red-50/50 px-6 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors'
            >
              Cancel
            </button>

            <button
              type='button'
              disabled={!canSubmit}
              onClick={handleSubmit}
              className='h-11 rounded-full px-8 text-sm font-semibold text-white bg-red-700 hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md'
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


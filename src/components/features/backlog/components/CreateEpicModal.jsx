'use client';

import { useMemo, useState } from 'react';
import TiptapEditor from '@/components/ui/TiptapEditor';
import DateInput from '@/components/ui/DateInput';
import { BACKLOG_UI } from '@/constants/backlog/uiText';

function FieldLabel({ required, children }) {
  return (
    <div className='text-text mb-2 text-sm font-semibold'>
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
      className='border-border focus:border-primary h-11 w-full rounded-2xl border bg-white px-4 text-sm outline-none'
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
      <div className='relative flex w-full max-w-[720px] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl'>
        <div className='flex h-full max-h-[85vh] flex-col'>
          {/* Header */}
          <div className='shrink-0 px-8 pt-8 pb-4'>
            <div className='text-text text-2xl font-bold'>{BACKLOG_UI.MODAL_CREATE_EPIC}</div>
          </div>

          {/* Body */}
          <div className='flex flex-1 flex-col space-y-6 overflow-y-auto px-8 py-2'>
            {/* Epic name */}
            <div>
              <FieldLabel required>{BACKLOG_UI.FIELD_EPIC_NAME}</FieldLabel>
              <TextInput
                value={epicName}
                onChange={setEpicName}
                placeholder={BACKLOG_UI.PLACEHOLDER_EPIC_SUMMARY}
              />
            </div>

            {/* Description */}
            <div className='flex min-h-[250px] flex-1 flex-col overflow-hidden'>
              <FieldLabel>{BACKLOG_UI.FIELD_DESCRIPTION}</FieldLabel>
              <div className='flex-1 overflow-y-auto rounded-2xl'>
                <TiptapEditor
                  value={desc}
                  onChange={setDesc}
                  placeholder={BACKLOG_UI.PLACEHOLDER_DESC}
                />
              </div>
            </div>

            {/* End date */}
            <div>
              <FieldLabel>{BACKLOG_UI.FIELD_END_DATE}</FieldLabel>
              <div className='w-[200px]'>
                <DateInput value={endDate} onChange={setEndDate} />
              </div>
            </div>
          </div>

          <div className='flex shrink-0 items-center justify-end gap-3 px-8 py-6'>
            <button
              type='button'
              onClick={handleClose}
              className='bg-primary-50/50 text-primary hover:bg-primary-50 h-11 rounded-full px-6 text-sm font-semibold transition-colors'
            >
              {BACKLOG_UI.CANCEL}
            </button>

            <button
              type='button'
              disabled={!canSubmit}
              onClick={handleSubmit}
              className='bg-primary hover:bg-primary-hover h-11 rounded-full px-8 text-sm font-semibold text-white shadow-md transition-colors disabled:cursor-not-allowed disabled:opacity-50'
            >
              {BACKLOG_UI.CREATE}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

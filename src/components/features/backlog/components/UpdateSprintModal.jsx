'use client';

import { useState, useMemo } from 'react';
import { BACKLOG_UI } from '@/constants/backlog';

function FieldLabel({ required, children }) {
  return (
    <div className='mb-2 text-sm font-semibold text-gray-800'>
      {children}
      {required ? <span className='text-danger'> *</span> : null}
    </div>
  );
}

function TextInput({ value, onChange, placeholder = '', type = 'text', readOnly = false }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      readOnly={readOnly}
      className={`focus:border-primary focus:ring-primary h-11 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm transition-shadow outline-none focus:ring-1 ${readOnly ? 'cursor-not-allowed bg-gray-50 text-gray-500' : ''}`}
    />
  );
}

export default function UpdateSprintModal({ open, sprint, onClose, onSubmit }) {
  const [name, setName] = useState(() => sprint?.name || sprint?.title || '');
  const [goal, setGoal] = useState(() => sprint?.goal || '');

  const canSubmit = useMemo(() => name.trim() !== '', [name]);

  if (!open) return null;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit?.({
      name: name.trim(),
      goal: goal.trim(),
    });
  };

  return (
    <div className='fixed inset-0 z-9999 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm transition-opacity'>
      <div className='relative flex w-full max-w-[600px] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl'>
        <div className='flex h-full max-h-[85vh] flex-col'>
          {/* Header */}
          <div className='shrink-0 px-8 pt-8 pb-4'>
            <div className='text-2xl font-bold text-gray-900'>
              {BACKLOG_UI.EDIT_SPRINT || 'Chỉnh sửa Sprint'}
            </div>
          </div>

          {/* Body */}
          <div className='flex flex-1 flex-col space-y-5 overflow-y-auto px-8 py-2 pb-8'>
            <div>
              <FieldLabel required>{BACKLOG_UI.FIELD_SPRINT_NAME || 'Tên Sprint'}</FieldLabel>
              <TextInput
                value={name}
                onChange={setName}
                placeholder={BACKLOG_UI.PLACEHOLDER_SPRINT_NAME || 'VD: Sprint 1'}
              />
            </div>

            <div className='flex flex-1 flex-col'>
              <FieldLabel>{BACKLOG_UI.FIELD_SPRINT_GOAL || 'Mục tiêu Sprint'}</FieldLabel>
              <textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder={
                  BACKLOG_UI.PLACEHOLDER_SPRINT_GOAL || 'Nhập mục tiêu Sprint (tùy chọn)'
                }
                className='focus:border-primary focus:ring-primary min-h-[120px] w-full resize-none rounded-2xl border border-gray-200 bg-white p-4 text-sm transition-shadow outline-none focus:ring-1'
              />
            </div>
          </div>

          {/* Footer */}
          <div className='flex shrink-0 items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/50 px-8 py-5'>
            <button
              onClick={onClose}
              className='h-11 rounded-full border border-gray-200 bg-white px-6 font-bold text-gray-600 transition-colors hover:bg-gray-50'
            >
              {BACKLOG_UI.CANCEL}
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className='bg-primary hover:bg-primary-hover h-11 rounded-full px-8 font-bold text-white transition-opacity disabled:opacity-50'
            >
              {BACKLOG_UI.UPDATE || 'Cập nhật'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

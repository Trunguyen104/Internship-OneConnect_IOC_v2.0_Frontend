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
            <div className='text-2xl font-bold text-text'>Tạo Epic</div>
          </div>

          {/* Body */}
          <div className='flex-1 overflow-y-auto px-8 py-2 space-y-6'>
            {/* Tên Epic */}
            <div>
              <FieldLabel required>Tên Epic</FieldLabel>
              <TextInput
                value={epicName}
                onChange={setEpicName}
                placeholder='Nhập tóm tắt Epic...'
              />
            </div>

            {/* Mô tả */}
            <div>
              <FieldLabel>Mô tả</FieldLabel>
              <TiptapEditor
                value={desc}
                onChange={setDesc}
                placeholder='Nhập mô tả...'
                minHeight={200}
              />
            </div>

            {/* Ngày kết thúc */}
            <div>
              <div className='mb-2 text-sm font-semibold text-text'>Ngày kết thúc</div>
              <div className='relative inline-block'>
                {/* Visual Button */}
                <button
                  type='button'
                  className='inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <rect x='3' y='4' width='18' height='18' rx='2' ry='2'></rect>
                    <line x1='16' y1='2' x2='16' y2='6'></line>
                    <line x1='8' y1='2' x2='8' y2='6'></line>
                    <line x1='3' y1='10' x2='21' y2='10'></line>
                  </svg>
                  {endDate ? new Date(endDate).toLocaleDateString('vi-VN') : 'Chọn ngày'}
                </button>
                {/* Hidden Date Input acting as picker */}
                <input
                  type='date'
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className='flex items-center justify-end gap-3 px-8 py-6 shrink-0'>
            <button
              type='button'
              onClick={handleClose}
              className='h-11 rounded-full bg-red-50/50 px-6 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors'
            >
              Hủy
            </button>

            <button
              type='button'
              disabled={!canSubmit}
              onClick={handleSubmit}
              className='h-11 rounded-full px-8 text-sm font-semibold text-white bg-red-700 hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md'
            >
              Tạo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

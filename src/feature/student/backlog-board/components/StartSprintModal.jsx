'use client';

import { useState, useMemo, useEffect } from 'react';

function FieldLabel({ required, children }) {
  return (
    <div className='mb-2 text-sm font-semibold text-gray-800'>
      {children}
      {required ? <span className='text-red-500'> *</span> : null}
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
      className={`h-11 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none focus:border-red-800 focus:ring-1 focus:ring-red-800 transition-shadow ${readOnly ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
    />
  );
}

export default function StartSprintModal({ open, sprint, issueCount, onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (open && sprint) {
      setName(sprint.name || sprint.title || '');
      setGoal(sprint.goal || '');

      if (sprint.startDate) {
        setStartDate(new Date(sprint.startDate).toISOString().split('T')[0]);
      } else {
        // Default to today
        setStartDate(new Date().toISOString().split('T')[0]);
      }

      if (sprint.endDate) {
        setEndDate(new Date(sprint.endDate).toISOString().split('T')[0]);
      } else {
        // Default to 2 weeks from today
        const twoWeeks = new Date();
        twoWeeks.setDate(twoWeeks.getDate() + 14);
        setEndDate(twoWeeks.toISOString().split('T')[0]);
      }
    }
  }, [open, sprint]);

  const canSubmit = useMemo(
    () => name.trim() !== '' && startDate && endDate,
    [name, startDate, endDate],
  );

  if (!open) return null;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit?.({
      name: name.trim(),
      goal: goal.trim(),
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
    });
  };

  return (
    <div className='fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm bg-black/40 transition-opacity'>
      <div className='relative w-full max-w-[600px] rounded-3xl bg-white shadow-2xl overflow-hidden flex flex-col'>
        <div className='flex flex-col h-full max-h-[85vh]'>
          {/* Header */}
          <div className='px-8 pt-8 pb-4 shrink-0'>
            <div className='text-2xl font-bold text-gray-900'>Bắt đầu Sprint</div>
            <div className='text-sm text-gray-500 mt-2 font-medium'>
              {issueCount} issue sẽ được gộp vào sprint này
            </div>
          </div>

          {/* Body */}
          <div className='flex-1 flex flex-col overflow-y-auto px-8 py-2 space-y-5 pb-8'>
            <div>
              <FieldLabel required>Tên Sprint</FieldLabel>
              <TextInput value={name} onChange={setName} placeholder='VD: Sprint 1' />
            </div>

            <div className='flex gap-4'>
              <div className='flex-1'>
                <FieldLabel required>Ngày bắt đầu</FieldLabel>
                <TextInput type='date' value={startDate} onChange={setStartDate} />
              </div>
              <div className='flex-1'>
                <FieldLabel required>Ngày kết thúc</FieldLabel>
                <TextInput type='date' value={endDate} onChange={setEndDate} />
              </div>
            </div>

            <div className='flex flex-col flex-1'>
              <FieldLabel>Mục tiêu Sprint</FieldLabel>
              <textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder='Nhập mục tiêu Sprint (tùy chọn)'
                className='min-h-[120px] w-full rounded-2xl border border-gray-200 bg-white p-4 text-sm outline-none focus:border-red-800 focus:ring-1 focus:ring-red-800 transition-shadow resize-none'
              />
            </div>
          </div>

          {/* Footer */}
          <div className='flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/50 px-8 py-5 shrink-0'>
            <button
              onClick={onClose}
              className='h-11 px-6 rounded-full font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors'
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className='h-11 px-8 rounded-full bg-[#A32A2A] font-bold text-white transition-opacity disabled:opacity-50 hover:bg-red-800'
            >
              Bắt đầu Sprint
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

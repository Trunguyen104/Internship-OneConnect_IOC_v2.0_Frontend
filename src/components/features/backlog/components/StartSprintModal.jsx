'use client';

import { useState, useMemo } from 'react';
import { BACKLOG_UI } from '@/constants/backlog/uiText';

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

export default function StartSprintModal({ open, sprint, issueCount, onClose, onSubmit }) {
  const initialData = useMemo(() => {
    if (!sprint) return { name: '', goal: '', startDate: '', endDate: '' };
    const sName = sprint.name || sprint.title || '';
    const sGoal = sprint.goal || '';
    const sStart = sprint.startDate
      ? new Date(sprint.startDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];

    let sEnd = '';
    if (sprint.endDate) {
      sEnd = new Date(sprint.endDate).toISOString().split('T')[0];
    } else {
      const twoWeeks = new Date();
      twoWeeks.setDate(twoWeeks.getDate() + 14);
      sEnd = twoWeeks.toISOString().split('T')[0];
    }

    return { name: sName, goal: sGoal, startDate: sStart, endDate: sEnd };
  }, [sprint]);

  const [name, setName] = useState(initialData.name);
  const [goal, setGoal] = useState(initialData.goal);
  const [startDate, setStartDate] = useState(initialData.startDate);
  const [endDate, setEndDate] = useState(initialData.endDate);

  const [prevInitialData, setPrevInitialData] = useState(initialData);
  if (initialData !== prevInitialData) {
    setPrevInitialData(initialData);
    setName(initialData.name);
    setGoal(initialData.goal);
    setStartDate(initialData.startDate);
    setEndDate(initialData.endDate);
  }

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
      startDate: startDate,
      endDate: endDate,
    });
  };

  return (
    <div className='fixed inset-0 z-9999 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm transition-opacity'>
      <div className='relative flex w-full max-w-[600px] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl'>
        <div className='flex h-full max-h-[85vh] flex-col'>
          {/* Header */}
          <div className='shrink-0 px-8 pt-8 pb-4'>
            <div className='text-2xl font-bold text-gray-900'>{BACKLOG_UI.START_SPRINT}</div>
            <div className='mt-2 text-sm font-medium text-gray-500'>
              {issueCount} {issueCount === 1 ? 'issue' : 'issues'} will be included in this sprint
            </div>
          </div>

          {/* Body */}
          <div className='flex flex-1 flex-col space-y-5 overflow-y-auto px-8 py-2 pb-8'>
            <div>
              <FieldLabel required>{BACKLOG_UI.FIELD_SPRINT_NAME}</FieldLabel>
              <TextInput
                value={name}
                onChange={setName}
                placeholder={BACKLOG_UI.PLACEHOLDER_SPRINT_NAME || 'e.g. Sprint 1'}
              />
            </div>

            <div className='flex gap-4'>
              <div className='flex-1'>
                <FieldLabel required>{BACKLOG_UI.FIELD_START_DATE}</FieldLabel>
                <TextInput type='date' value={startDate} onChange={setStartDate} />
              </div>
              <div className='flex-1'>
                <FieldLabel required>{BACKLOG_UI.FIELD_END_DATE}</FieldLabel>
                <TextInput type='date' value={endDate} onChange={setEndDate} />
              </div>
            </div>

            <div className='flex flex-1 flex-col'>
              <FieldLabel>{BACKLOG_UI.FIELD_SPRINT_GOAL}</FieldLabel>
              <textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder={BACKLOG_UI.PLACEHOLDER_SPRINT_GOAL}
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
              {BACKLOG_UI.START_SPRINT}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

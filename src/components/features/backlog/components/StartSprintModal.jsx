'use client';

import { PlayCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';

import CompoundModal from '@/components/ui/CompoundModal';
import { DatePicker } from '@/components/ui/datepicker';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BACKLOG_UI } from '@/constants/backlog/uiText';
import { UI_TEXT } from '@/lib/UI_Text';

function FieldLabel({ required, children }) {
  return (
    <div className="text-[13px] font-bold tracking-wide text-text/80 uppercase mb-2 ml-1">
      {children}
      {required ? <span className="text-rose-500">{UI_TEXT.BACKLOG.ASTERISK_SPACE}</span> : null}
    </div>
  );
}

export default function StartSprintModal({ open, sprint, issueCount, onClose, onSubmit }) {
  const initialData = useMemo(() => {
    if (!sprint) return { name: '', goal: '', startDate: null, endDate: null };
    const sName = sprint.name || sprint.title || '';
    const sGoal = sprint.goal || '';
    const sStart = sprint.startDate ? dayjs(sprint.startDate) : dayjs();

    let sEnd = null;
    if (sprint.endDate) {
      sEnd = dayjs(sprint.endDate);
    } else {
      sEnd = dayjs().add(14, 'day');
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
    [name, startDate, endDate]
  );

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit?.({
      name: name.trim(),
      goal: goal.trim(),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
  };

  return (
    <CompoundModal open={open} onCancel={onClose} width={640}>
      <CompoundModal.Header
        title={BACKLOG_UI.START_SPRINT}
        subtitle={`${issueCount} ${issueCount === 1 ? UI_TEXT.BACKLOG.ISSUE : UI_TEXT.BACKLOG.ISSUES} ${UI_TEXT.BACKLOG.INCLUDED_IN_SPRINT}`}
        icon={<PlayCircleOutlined />}
      />

      <CompoundModal.Content className="px-6">
        <div className="flex flex-col space-y-6 pb-2">
          {/* Sprint Name */}
          <div className="flex flex-col">
            <FieldLabel required>{BACKLOG_UI.FIELD_SPRINT_NAME}</FieldLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={BACKLOG_UI.PLACEHOLDER_SPRINT_NAME || 'e.g. Sprint 1'}
              className="h-11 rounded-xl border-gray-200 bg-gray-50/30 transition-all focus:bg-white focus:shadow-md"
            />
          </div>

          {/* Dates */}
          <div className="flex gap-4">
            <div className="flex flex-1 flex-col">
              <FieldLabel required>{BACKLOG_UI.FIELD_START_DATE}</FieldLabel>
              <DatePicker
                value={startDate}
                onChange={setStartDate}
                format="YYYY-MM-DD"
                placeholder={BACKLOG_UI.PLACEHOLDER_START_DATE || 'Select start date'}
                className="h-11 rounded-xl border-gray-200 bg-gray-50/30 transition-all focus:bg-white focus:shadow-md w-full"
              />
            </div>
            <div className="flex flex-1 flex-col">
              <FieldLabel required>{BACKLOG_UI.FIELD_END_DATE}</FieldLabel>
              <DatePicker
                value={endDate}
                onChange={setEndDate}
                format="YYYY-MM-DD"
                placeholder={BACKLOG_UI.PLACEHOLDER_END_DATE || 'Select end date'}
                className="h-11 rounded-xl border-gray-200 bg-gray-50/30 transition-all focus:bg-white focus:shadow-md w-full"
              />
            </div>
          </div>

          {/* Sprint Goal */}
          <div className="flex flex-col">
            <FieldLabel>{BACKLOG_UI.FIELD_SPRINT_GOAL}</FieldLabel>
            <Textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder={BACKLOG_UI.PLACEHOLDER_SPRINT_GOAL}
              className="min-h-[140px] rounded-xl border-gray-200 bg-gray-50/30 transition-all focus:bg-white focus:shadow-md"
            />
          </div>
        </div>
      </CompoundModal.Content>

      <CompoundModal.Footer
        onCancel={onClose}
        onConfirm={handleSubmit}
        cancelText={BACKLOG_UI.CANCEL}
        confirmText={BACKLOG_UI.START_SPRINT}
        disabled={!canSubmit}
        className="px-6 py-4"
      />
    </CompoundModal>
  );
}

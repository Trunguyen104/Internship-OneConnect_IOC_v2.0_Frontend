'use client';

import { DatePicker, Input } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import CompoundModal from '@/components/ui/CompoundModal';
import { EVALUATION_UI } from '@/constants/evaluation/evaluation';

export default function CycleDialog({
  open,
  onOpenChange,
  onSave,
  initialData = null,
  termDates = null,
}) {
  const { LABELS, BUTTONS } = EVALUATION_UI;
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    status: initialData?.status ?? 1, // Default Pending
  });

  const handleSave = async () => {
    const success = await onSave(formData);
    if (success) {
      onOpenChange(false);
    }
  };

  const disabledStartDate = (current) => {
    if (!termDates) return false;
    return (
      current &&
      (current.isBefore(dayjs(termDates.startDate), 'day') ||
        current.isAfter(dayjs(termDates.endDate), 'day'))
    );
  };

  const disabledEndDate = (current) => {
    if (!termDates) {
      if (formData.startDate) {
        return current && current.isBefore(dayjs(formData.startDate), 'day');
      }
      return false;
    }

    const termStart = dayjs(termDates.startDate);
    const termEnd = dayjs(termDates.endDate);
    const cycleStart = formData.startDate ? dayjs(formData.startDate) : termStart;

    return current && (current.isBefore(cycleStart, 'day') || current.isAfter(termEnd, 'day'));
  };

  return (
    <CompoundModal
      title={initialData ? BUTTONS.EDIT : BUTTONS.CREATE_CYCLE}
      open={open}
      onCancel={() => onOpenChange(false)}
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {BUTTONS.CANCEL}
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {BUTTONS.SAVE}
          </Button>
        </div>
      }
    >
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold">{LABELS.CYCLE_NAME}</label>
          <Input
            placeholder={LABELS.CYCLE_NAME}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">{LABELS.START_DATE}</label>
            <DatePicker
              className="w-full"
              value={formData.startDate ? dayjs(formData.startDate) : null}
              disabledDate={disabledStartDate}
              getPopupContainer={(trigger) => trigger.parentElement}
              onChange={(date) => {
                const now = dayjs();
                const iso = date
                  ? date.hour(now.hour()).minute(now.minute()).second(now.second()).toISOString()
                  : '';
                setFormData({ ...formData, startDate: iso });
              }}
              format="DD/MM/YYYY"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">{LABELS.END_DATE}</label>
            <DatePicker
              className="w-full"
              value={formData.endDate ? dayjs(formData.endDate) : null}
              disabledDate={disabledEndDate}
              getPopupContainer={(trigger) => trigger.parentElement}
              onChange={(date) => {
                const now = dayjs();
                const iso = date
                  ? date.hour(now.hour()).minute(now.minute()).second(now.second()).toISOString()
                  : '';
                setFormData({ ...formData, endDate: iso });
              }}
              format="DD/MM/YYYY"
            />
          </div>
        </div>
      </div>
    </CompoundModal>
  );
}

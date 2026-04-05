'use client';

import { CalendarOutlined, EditOutlined } from '@ant-design/icons';
import { DatePicker, Input } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';

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
      open={open}
      onCancel={() => onOpenChange(false)}
      width={500}
      className="premium-modal"
    >
      <CompoundModal.Header
        icon={<CalendarOutlined />}
        title={initialData ? BUTTONS.EDIT : BUTTONS.CREATE_CYCLE}
        subtitle={LABELS.CYCLE_TITLE}
      />

      <div className="space-y-6 pt-6 pb-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Cycle Name Section */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-muted/60 uppercase tracking-widest ml-1 flex items-center gap-2">
            <EditOutlined className="text-[12px]" />
            {LABELS.CYCLE_NAME}
          </label>
          <Input
            placeholder={LABELS.CYCLE_NAME}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            size="large"
            className="h-12 rounded-xl border-gray-100 bg-gray-50/30 font-bold text-sm focus:bg-white transition-all hover:border-primary/30"
          />
        </div>

        {/* Date Range Section */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted/60 uppercase tracking-widest ml-1 flex items-center gap-2">
              {LABELS.START_DATE}
            </label>
            <DatePicker
              className="w-full h-12 rounded-xl border-gray-100 bg-gray-50/30 font-bold text-sm transition-all hover:bg-white hover:border-primary/30"
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
              placeholder={LABELS.PICK_START}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted/60 uppercase tracking-widest ml-1 flex items-center gap-2">
              {LABELS.END_DATE}
            </label>
            <DatePicker
              className="w-full h-12 rounded-xl border-gray-100 bg-gray-50/30 font-bold text-sm transition-all hover:bg-white hover:border-primary/30"
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
              placeholder={LABELS.PICK_END}
            />
          </div>
        </div>
      </div>

      <CompoundModal.Footer
        onCancel={() => onOpenChange(false)}
        onSubmit={handleSave}
        cancelText={BUTTONS.CANCEL}
        confirmText={BUTTONS.SAVE}
      />
    </CompoundModal>
  );
}

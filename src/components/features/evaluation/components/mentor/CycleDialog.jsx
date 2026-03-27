'use client';

import { DatePicker, Input } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import CompoundModal from '@/components/ui/compoundmodal';
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
      title={
        <div className="flex flex-col gap-1 pr-10">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
            {LABELS.CYCLE_TITLE}
          </span>
          <span className="text-xl font-black text-text tracking-tight">
            {initialData ? BUTTONS.EDIT : BUTTONS.CREATE_CYCLE}
          </span>
        </div>
      }
      open={open}
      onCancel={() => onOpenChange(false)}
      footer={
        <div className="flex justify-end gap-3 p-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-full h-11 px-8 font-black uppercase tracking-widest text-[11px] border-gray-200 transition-all hover:bg-white active:scale-95"
          >
            {BUTTONS.CANCEL}
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            className="rounded-full h-11 px-10 font-black uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            {BUTTONS.SAVE}
          </Button>
        </div>
      }
    >
      <div className="space-y-8 py-8 px-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="space-y-2.5">
          <span className="text-[10px] font-black text-muted/50 uppercase tracking-widest ml-1 leading-none">
            {LABELS.CYCLE_NAME}
          </span>
          <Input
            placeholder={LABELS.CYCLE_NAME}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="h-12 rounded-2xl border-none! bg-gray-50/50 shadow-sm font-bold text-sm focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all"
          />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2.5">
            <span className="text-[10px] font-black text-muted/50 uppercase tracking-widest ml-1 leading-none">
              {LABELS.START_DATE}
            </span>
            <DatePicker
              className="w-full h-12 rounded-2xl border-none! bg-gray-50/50 shadow-sm font-bold text-sm [&_.ant-picker-input]:font-bold transition-all hover:bg-white focus:bg-white focus:ring-4 focus:ring-primary/5"
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
              suffixIcon={null}
            />
          </div>
          <div className="space-y-2.5">
            <span className="text-[10px] font-black text-muted/50 uppercase tracking-widest ml-1 leading-none">
              {LABELS.END_DATE}
            </span>
            <DatePicker
              className="w-full h-12 rounded-2xl border-none! bg-gray-50/50 shadow-sm font-bold text-sm [&_.ant-picker-input]:font-bold transition-all hover:bg-white focus:bg-white focus:ring-4 focus:ring-primary/5"
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
              suffixIcon={null}
            />
          </div>
        </div>
      </div>
    </CompoundModal>
  );
}

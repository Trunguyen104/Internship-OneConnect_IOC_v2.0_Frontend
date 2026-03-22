'use client';

import React, { useState, useEffect } from 'react';
import CompoundModal from '@/components/ui/CompoundModal';
import { Button } from '@/components/ui/button';
import { Input } from 'antd';
import DateInput from '@/components/ui/dateinput';
import { EVALUATION_UI } from '@/constants/evaluation/evaluation';

export default function CycleDialog({ open, onOpenChange, onSave, initialData = null }) {
  const { LABELS, BUTTONS } = EVALUATION_UI;
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
  });

  const handleSave = async () => {
    const success = await onSave(formData);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <CompoundModal
      title={initialData ? BUTTONS.EDIT : BUTTONS.CREATE_CYCLE}
      open={open}
      onClose={() => onOpenChange(false)}
      footer={
        <div className='flex justify-end gap-3'>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            {BUTTONS.CANCEL}
          </Button>
          <Button variant='primary' onClick={handleSave}>
            {BUTTONS.SAVE}
          </Button>
        </div>
      }
    >
      <div className='space-y-4 py-4'>
        <div className='space-y-2'>
          <label className='text-sm font-semibold'>{LABELS.CYCLE_NAME}</label>
          <Input
            placeholder={LABELS.CYCLE_NAME}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <label className='text-sm font-semibold'>{LABELS.START_DATE}</label>
            <DateInput
              value={formData.startDate}
              onChange={(val) => setFormData({ ...formData, startDate: val })}
            />
          </div>
          <div className='space-y-2'>
            <label className='text-sm font-semibold'>{LABELS.END_DATE}</label>
            <DateInput
              value={formData.endDate}
              onChange={(val) => setFormData({ ...formData, endDate: val })}
            />
          </div>
        </div>
      </div>
    </CompoundModal>
  );
}

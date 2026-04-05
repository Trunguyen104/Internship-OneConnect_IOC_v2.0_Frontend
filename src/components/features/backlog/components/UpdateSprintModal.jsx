'use client';

import { EditOutlined } from '@ant-design/icons';
import React, { useMemo, useState } from 'react';

import CompoundModal from '@/components/ui/CompoundModal';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BACKLOG_UI } from '@/constants/backlog/uiText';

function FieldLabel({ required, children }) {
  return (
    <div className="text-[13px] font-bold tracking-wide text-text/80 uppercase mb-2 ml-1">
      {children}
      {required ? <span className="text-rose-500"> *</span> : null}
    </div>
  );
}

export default function UpdateSprintModal({ open, sprint, onClose, onSubmit }) {
  const [name, setName] = useState(() => sprint?.name || sprint?.title || '');
  const [goal, setGoal] = useState(() => sprint?.goal || '');

  const canSubmit = useMemo(() => name.trim() !== '', [name]);

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit?.({
      name: name.trim(),
      goal: goal.trim(),
    });
  };

  return (
    <CompoundModal open={open} onCancel={onClose} width={600}>
      <CompoundModal.Header
        title={BACKLOG_UI.EDIT_SPRINT || 'Edit Sprint'}
        subtitle={BACKLOG_UI.MODAL_UPDATE_SPRINT_SUBTITLE}
        icon={<EditOutlined />}
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

          {/* Sprint Goal */}
          <div className="flex flex-col">
            <FieldLabel>{BACKLOG_UI.FIELD_SPRINT_GOAL}</FieldLabel>
            <Textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder={BACKLOG_UI.PLACEHOLDER_SPRINT_GOAL}
              className="min-h-[160px] rounded-xl border-gray-200 bg-gray-50/30 transition-all focus:bg-white focus:shadow-md"
            />
          </div>
        </div>
      </CompoundModal.Content>

      <CompoundModal.Footer
        onCancel={onClose}
        onConfirm={handleSubmit}
        cancelText={BACKLOG_UI.CANCEL}
        confirmText={BACKLOG_UI.UPDATE || 'Update'}
        disabled={!canSubmit}
        className="px-6 py-4"
      />
    </CompoundModal>
  );
}

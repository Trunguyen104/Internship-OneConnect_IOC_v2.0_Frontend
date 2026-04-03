'use client';

import { FlagOutlined } from '@ant-design/icons';
import React, { useMemo, useState } from 'react';

import CompoundModal from '@/components/ui/CompoundModal';
import { Input } from '@/components/ui/input';
import TiptapEditor from '@/components/ui/tiptapeditor';
import { BACKLOG_UI } from '@/constants/backlog/uiText';

function FieldLabel({ required, children }) {
  return (
    <div className="text-[13px] font-bold tracking-wide text-text/80 uppercase mb-2 ml-1">
      {children}
      {required ? <span className="text-rose-500"> *</span> : null}
    </div>
  );
}

export default function CreateEpicModal({ open, onClose, onSubmit }) {
  const [epicName, setEpicName] = useState('');
  const [desc, setDesc] = useState('');

  const canSubmit = useMemo(() => epicName.trim() !== '', [epicName]);

  function reset() {
    setEpicName('');
    setDesc('');
  }

  function handleClose() {
    onClose?.();
  }

  function handleSubmit() {
    if (!canSubmit) return;
    onSubmit?.({
      name: epicName.trim(),
      description: desc,
    });
    reset();
    onClose?.();
  }

  return (
    <CompoundModal open={open} onCancel={handleClose} width={700}>
      <CompoundModal.Header
        title={BACKLOG_UI.MODAL_CREATE_EPIC}
        subtitle="Thiết lập các mục tiêu lớn và lộ trình dài hạn cho dự án"
        icon={<FlagOutlined />}
      />

      <CompoundModal.Content className="px-6">
        <div className="flex flex-col space-y-8 pb-2">
          {/* Epic name */}
          <div className="flex flex-col">
            <FieldLabel required>{BACKLOG_UI.FIELD_EPIC_NAME}</FieldLabel>
            <Input
              value={epicName}
              onChange={(e) => setEpicName(e.target.value)}
              placeholder={BACKLOG_UI.PLACEHOLDER_EPIC_SUMMARY}
              className="h-11 rounded-xl border-gray-200 bg-gray-50/30 transition-all focus:bg-white focus:shadow-md"
            />
          </div>

          {/* Description */}
          <div className="flex min-h-[250px] flex-col">
            <FieldLabel>{BACKLOG_UI.FIELD_DESCRIPTION}</FieldLabel>
            <div className="flex-1 rounded-xl border border-gray-100 overflow-hidden bg-gray-50/20 shadow-inner">
              <TiptapEditor
                value={desc}
                onChange={setDesc}
                placeholder={BACKLOG_UI.PLACEHOLDER_DESC}
              />
            </div>
          </div>
        </div>
      </CompoundModal.Content>

      <CompoundModal.Footer
        onCancel={handleClose}
        onConfirm={handleSubmit}
        cancelText={BACKLOG_UI.CANCEL}
        confirmText={BACKLOG_UI.CREATE}
        disabled={!canSubmit}
        className="px-6 py-4"
      />
    </CompoundModal>
  );
}

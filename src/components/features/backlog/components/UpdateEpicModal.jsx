'use client';

import { EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';

import CompoundModal from '@/components/ui/CompoundModal';
import { DatePicker } from '@/components/ui/datepicker';
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

export default function UpdateEpicModal({ open, onClose, onSubmit, initialData }) {
  const [epicName, setEpicName] = useState(() => initialData?.title || initialData?.name || '');
  const [desc, setDesc] = useState(() => initialData?.description || '');
  const [endDate, setEndDate] = useState(() => initialData?.endDate || '');

  const canSubmit = useMemo(() => epicName.trim() !== '', [epicName]);

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
  }

  return (
    <CompoundModal open={open} onCancel={handleClose} width={800}>
      <CompoundModal.Header
        title={`${BACKLOG_UI.UPDATE || 'Cập nhật'} ${BACKLOG_UI.TYPE_EPIC || 'Epic'}`}
        subtitle="Chỉnh sửa thông tin chi tiết và thời hạn hoàn thành cho mục tiêu lớn"
        icon={<EditOutlined />}
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
          <div className="flex min-h-[400px] flex-col">
            <FieldLabel>{BACKLOG_UI.FIELD_DESCRIPTION}</FieldLabel>
            <div className="flex-1 rounded-xl border border-gray-100 overflow-hidden bg-gray-50/20 shadow-inner">
              <TiptapEditor
                value={desc}
                onChange={setDesc}
                placeholder={BACKLOG_UI.PLACEHOLDER_DESC}
              />
            </div>
          </div>

          {/* End date */}
          <div className="flex flex-col">
            <FieldLabel>{BACKLOG_UI.FIELD_END_DATE}</FieldLabel>
            <div className="w-[320px]">
              <DatePicker
                value={endDate ? dayjs(endDate) : null}
                onChange={(date) => setEndDate(date ? date.toISOString() : '')}
                format="YYYY-MM-DD"
                placeholder="Chọn ngày kết thúc"
                className="h-11 rounded-xl border-gray-200 bg-gray-50/30 transition-all focus:bg-white focus:shadow-md"
              />
            </div>
          </div>
        </div>
      </CompoundModal.Content>

      <CompoundModal.Footer
        onCancel={handleClose}
        onConfirm={handleSubmit}
        cancelText={BACKLOG_UI.CANCEL || 'Cancel'}
        confirmText={BACKLOG_UI.UPDATE || 'Update'}
        disabled={!canSubmit}
        className="px-6 py-4"
      />
    </CompoundModal>
  );
}

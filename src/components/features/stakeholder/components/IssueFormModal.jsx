'use client';

import { PlusCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { Input, Select } from 'antd';
import React, { memo } from 'react';

import { Button } from '@/components/ui/button';
import CompoundModal from '@/components/ui/CompoundModal';
import { ISSUE_UI } from '@/constants/stakeholderIssue/uiText';

const IssueFormModal = memo(function IssueFormModal({
  isOpen,
  onClose,
  form,
  setForm,
  stakeholders,
  onSave,
}) {
  const { FORM, BUTTON, TABLE } = ISSUE_UI;

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <CompoundModal open={isOpen} onCancel={onClose} width={560}>
      <CompoundModal.Header
        title={FORM.ADD_TITLE}
        subtitle={ISSUE_UI.SUBTITLE || 'Ghi nhận và quản lý các vấn đề phát sinh từ bên liên quan'}
        icon={<PlusCircleOutlined />}
      />

      <CompoundModal.Content>
        <div className="space-y-6 py-2">
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold tracking-wide text-text/80 uppercase">
              {TABLE.TITLE} <span className="text-rose-500">*</span>
            </label>
            <Input
              placeholder={FORM.TITLE_PLACEHOLDER}
              value={form.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="h-11 rounded-xl border-gray-200 bg-gray-50/30 transition-all focus:bg-white focus:shadow-md"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold tracking-wide text-text/80 uppercase">
              {TABLE.STAKEHOLDER} <span className="text-rose-500">*</span>
            </label>
            <Select
              placeholder={FORM.STAKEHOLDER_PLACEHOLDER}
              value={form.stakeholderId || undefined}
              onChange={(val) => handleInputChange('stakeholderId', val)}
              className="h-11 w-full !rounded-xl"
              options={stakeholders.map((s) => ({
                value: s.id,
                label: s.name,
              }))}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold tracking-wide text-text/80 uppercase">
              {TABLE.DESCRIPTION}
            </label>
            <Input.TextArea
              rows={4}
              placeholder={FORM.DESCRIPTION_PLACEHOLDER}
              value={form.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="rounded-xl border-gray-200 bg-gray-50/30 transition-all focus:bg-white focus:shadow-md py-3"
            />
          </div>
        </div>
      </CompoundModal.Content>

      <CompoundModal.Footer>
        <div className="flex w-full items-center justify-end gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            className="h-11 rounded-2xl px-8 font-black tracking-tight text-muted/60 transition-all hover:bg-gray-100 hover:text-text active:scale-95"
          >
            {BUTTON.CANCEL}
          </Button>
          <Button
            onClick={onSave}
            className="h-11 rounded-2xl bg-primary px-8 font-black tracking-tight text-white shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] hover:bg-primary/90 active:scale-95"
          >
            <SaveOutlined className="mr-2" />
            {BUTTON.SAVE}
          </Button>
        </div>
      </CompoundModal.Footer>
    </CompoundModal>
  );
});

export default IssueFormModal;

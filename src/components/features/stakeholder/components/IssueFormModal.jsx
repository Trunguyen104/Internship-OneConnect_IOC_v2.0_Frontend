'use client';

import { PlusCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Select, Space, Typography } from 'antd';
import React, { memo } from 'react';

import { ISSUE_UI } from '@/constants/stakeholderIssue/uiText';

const { TextArea } = Input;
const { Text } = Typography;

const IssueFormModal = memo(function IssueFormModal({
  isOpen,
  onClose,
  form,
  setForm,
  stakeholders,
  onSave,
}) {
  const { FORM, BUTTON, TABLE } = ISSUE_UI;

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      title={
        <Space className="mb-2">
          <PlusCircleOutlined className="text-primary" />
          <span>{FORM.ADD_TITLE}</span>
        </Space>
      }
      width={520}
      centered
      destroyOnHidden
    >
      <div className="mt-4 space-y-5">
        <div className="flex flex-col gap-1.5">
          <Text strong>
            {TABLE.TITLE} <span className="text-danger">*</span>
          </Text>
          <Input
            placeholder={FORM.TITLE_PLACEHOLDER}
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Text strong>
            {TABLE.STAKEHOLDER} <span className="text-danger">*</span>
          </Text>
          <Select
            placeholder={FORM.STAKEHOLDER_PLACEHOLDER}
            value={form.stakeholderId || undefined}
            onChange={(val) => setForm((prev) => ({ ...prev, stakeholderId: val }))}
            className="w-full"
            options={stakeholders.map((s) => ({
              value: s.id,
              label: s.name,
            }))}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Text strong>{TABLE.DESCRIPTION}</Text>
          <TextArea
            rows={4}
            placeholder={FORM.DESCRIPTION_PLACEHOLDER}
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button onClick={onClose}>{BUTTON.CANCEL}</Button>
          <Button type="primary" onClick={onSave} icon={<SaveOutlined />}>
            {BUTTON.SAVE}
          </Button>
        </div>
      </div>
    </Modal>
  );
});

export default IssueFormModal;

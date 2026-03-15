'use client';

import React, { memo } from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import { ISSUE_UI } from '@/constants/stakeholderIssue/uiText';

const { TextArea } = Input;

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
      onOk={onSave}
      title={FORM.ADD_TITLE}
      okText={BUTTON.SAVE}
      cancelText={BUTTON.CANCEL}
      width={500}
      centered
    >
      <Form layout='vertical'>
        <Form.Item label={TABLE.TITLE} required>
          <Input
            placeholder={FORM.TITLE_PLACEHOLDER}
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          />
        </Form.Item>

        <Form.Item label={TABLE.STAKEHOLDER} required>
          <Select
            placeholder={FORM.STAKEHOLDER_PLACEHOLDER}
            value={form.stakeholderId || undefined}
            onChange={(val) => setForm((prev) => ({ ...prev, stakeholderId: val }))}
            options={stakeholders.map((s) => ({
              value: s.id,
              label: s.name,
            }))}
          />
        </Form.Item>

        <Form.Item label={TABLE.DESCRIPTION}>
          <TextArea
            rows={4}
            placeholder={FORM.DESCRIPTION_PLACEHOLDER}
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default IssueFormModal;

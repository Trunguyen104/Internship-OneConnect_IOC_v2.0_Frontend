'use client';

import React, { memo } from 'react';
import { Modal, Form, Input, Select, Divider, Space, Button, Typography } from 'antd';
import {
  WarningOutlined,
  UserOutlined,
  FileTextOutlined,
  SolutionOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { ISSUE_UI } from '@/constants/stakeholderIssue/uiText';

const { Text, Title } = Typography;

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
      width={520}
      centered
      destroyOnClose
      className='modal-custom'
    >
      <div className='mb-6 flex flex-col items-center gap-3 text-center'>
        <div className='bg-primary/10 flex size-14 items-center justify-center rounded-2xl'>
          <WarningOutlined className='text-primary text-3xl' />
        </div>
        <div>
          <Title level={4} className='text-text mb-1'>
            {FORM.ADD_TITLE}
          </Title>
          <Text className='text-muted text-xs italic'>
            Ghi nhận vấn đề mới phát sinh từ phía người liên quan
          </Text>
        </div>
      </div>

      <Divider className='border-border m-0' />

      <div className='mt-8 space-y-5 px-2'>
        {/* Title */}
        <div className='space-y-1'>
          <label className='text-text text-sm font-semibold'>
            {TABLE.TITLE} <span className='text-danger'>*</span>
          </label>
          <Input
            prefix={<FileTextOutlined className='text-muted' />}
            placeholder={FORM.TITLE_PLACEHOLDER}
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            className='h-11 rounded-xl transition-all'
          />
        </div>

        {/* Stakeholder */}
        <div className='space-y-1'>
          <label className='text-text text-sm font-semibold'>
            {TABLE.STAKEHOLDER} <span className='text-danger'>*</span>
          </label>
          <Select
            suffixIcon={<UserOutlined className='text-muted' />}
            placeholder={FORM.STAKEHOLDER_PLACEHOLDER}
            value={form.stakeholderId || undefined}
            onChange={(val) => setForm((prev) => ({ ...prev, stakeholderId: val }))}
            className='h-11 w-full'
            options={stakeholders.map((s) => ({ value: s.id, label: s.name }))}
          />
        </div>

        {/* Description */}
        <div className='space-y-1'>
          <label className='text-text text-sm font-semibold'>{TABLE.DESCRIPTION}</label>
          <Input.TextArea
            rows={4}
            placeholder={FORM.DESCRIPTION_PLACEHOLDER}
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            className='rounded-xl transition-all'
          />
        </div>

        <Space className='mt-8 flex w-full justify-end gap-3 pb-2'>
          <Button
            onClick={onClose}
            className='border-border h-11 rounded-xl px-8 font-semibold transition-all hover:bg-slate-50'
          >
            {BUTTON.CANCEL}
          </Button>

          <Button
            type='primary'
            onClick={onSave}
            icon={<SaveOutlined />}
            className='bg-primary h-11 rounded-xl border-none px-8 font-semibold shadow-md transition-all hover:scale-105 active:scale-95'
          >
            {BUTTON.SAVE}
          </Button>
        </Space>
      </div>
    </Modal>
  );
});

export default IssueFormModal;

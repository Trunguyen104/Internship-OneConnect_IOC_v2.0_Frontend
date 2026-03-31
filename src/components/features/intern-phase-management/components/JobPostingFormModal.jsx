'use client';

import { InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, DatePicker, Drawer, Form, Input, InputNumber } from 'antd';
import React from 'react';

import { INTERN_PHASE_MANAGEMENT } from '@/constants/intern-phase-management/intern-phase';

export default function JobPostingFormModal({ visible, onCancel, phase }) {
  const [form] = Form.useForm();
  const { JOB_POSTING } = INTERN_PHASE_MANAGEMENT;

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('Creating job posting (Placeholder):', { ...values, internPhaseId: phase?.id });
      onCancel();
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Drawer
      title={
        <div className="flex items-center gap-2">
          <PlusOutlined className="text-primary" />
          <span className="font-bold text-slate-800">{JOB_POSTING.TITLE_ADD}</span>
        </div>
      }
      open={visible}
      onClose={onCancel}
      width={700}
      size="large"
      zIndex={1100}
      className="job-posting-form-drawer"
      footer={
        <div className="flex justify-between px-4 py-2 bg-slate-50">
          <Button onClick={onCancel}>{JOB_POSTING.CANCEL_BTN}</Button>
          <Button type="primary" onClick={handleSubmit} className="bg-primary">
            {JOB_POSTING.PUBLISH_BTN}
          </Button>
        </div>
      }
    >
      <div className="rounded-lg bg-info-surface border border-info-surface p-3 mb-6 text-xs text-info italic flex items-start gap-2">
        <InfoCircleOutlined className="mt-0.5" />
        <span>{JOB_POSTING.MOCK_NOTICE}</span>
      </div>

      <Form form={form} layout="vertical" requiredMark="optional" className="px-4">
        <Form.Item label={JOB_POSTING.LABEL.PHASE} initialValue={phase?.name}>
          <Input disabled className="bg-slate-50 font-semibold" />
        </Form.Item>

        <Form.Item name="title" label={JOB_POSTING.LABEL.TITLE} rules={[{ required: true }]}>
          <Input placeholder={JOB_POSTING.PLACEHOLDER.TITLE} />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="deadline"
            label={JOB_POSTING.LABEL.DEADLINE}
            rules={[{ required: true }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item name="capacity" label={JOB_POSTING.LABEL.SLOTS} rules={[{ required: true }]}>
            <InputNumber min={1} className="w-full" />
          </Form.Item>
        </div>

        <Form.Item name="description" label={JOB_POSTING.LABEL.DESCRIPTION}>
          <Input.TextArea rows={6} placeholder={JOB_POSTING.PLACEHOLDER.DESCRIPTION} />
        </Form.Item>
      </Form>
    </Drawer>
  );
}

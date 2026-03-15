'use client';

import React from 'react';
import { Modal, Form, Input, Select, Button, Typography, Space } from 'antd';
import { TeamOutlined, EditOutlined } from '@ant-design/icons';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

const { Title } = Typography;

export function CreateGroupModal({ open, onCancel, onFinish }) {
  const [form] = Form.useForm();
  const { CREATE } = INTERNSHIP_MANAGEMENT_UI.GROUP_MANAGEMENT.MODALS;

  const handleCancel = () => {
    onCancel();
    form.resetFields();
  };

  const handleFinish = (values) => {
    onFinish(values);
    form.resetFields();
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={520}
      destroyOnHidden
      className='modal-custom'
    >
      <div className='mb-6 flex flex-col items-center gap-2 text-center'>
        <div className='bg-primary/10 flex size-14 items-center justify-center rounded-2xl'>
          <TeamOutlined className='text-primary text-3xl' />
        </div>
        <Title level={4} className='text-text mt-2 mb-0'>
          {CREATE.TITLE}
        </Title>
      </div>

      <Form form={form} layout='vertical' onFinish={handleFinish} className='space-y-4'>
        <Form.Item
          label={<span className='text-text font-semibold'>{CREATE.NAME_LABEL}</span>}
          name='name'
          rules={[{ required: true, message: CREATE.NAME_REQUIRED }]}
        >
          <Input
            prefix={<EditOutlined className='text-muted' />}
            placeholder={CREATE.NAME_PLACEHOLDER}
            className='bg-surface border-border h-11 rounded-xl'
          />
        </Form.Item>

        <Form.Item
          label={<span className='text-text font-semibold'>{CREATE.TRACK_LABEL}</span>}
          name='track'
          initialValue='FRONTEND'
          rules={[{ required: true, message: CREATE.TRACK_REQUIRED }]}
        >
          <Select
            className='h-11 w-full rounded-xl'
            options={[
              { label: CREATE.TRACK_OPTIONS.FRONTEND, value: 'FRONTEND' },
              { label: CREATE.TRACK_OPTIONS.BACKEND, value: 'BACKEND' },
              { label: CREATE.TRACK_OPTIONS.MOBILE, value: 'MOBILE' },
              { label: CREATE.TRACK_OPTIONS.DESIGN, value: 'DESIGN' },
            ]}
          />
        </Form.Item>

        <Space className='mt-8 flex w-full justify-end gap-3'>
          <Button
            onClick={handleCancel}
            className='border-border h-11 rounded-xl px-6 font-semibold transition-all hover:bg-slate-50'
          >
            Hủy bỏ
          </Button>

          <Button
            type='primary'
            htmlType='submit'
            className='bg-primary h-11 rounded-xl border-none px-6 font-semibold shadow-md transition-all hover:scale-105 active:scale-95'
          >
            {CREATE.SUBMIT}
          </Button>
        </Space>
      </Form>
    </Modal>
  );
}

'use client';

import React from 'react';
import { Modal, Form, Input, Select } from 'antd';

export function CreateGroupModal({ open, onCancel, onFinish }) {
  const [form] = Form.useForm();

  return (
    <Modal
      title='Create New Internship Group'
      open={open}
      centered
      destroyOnHidden
      okText='Create Group'
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
      onOk={() => form.submit()}
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={(values) => {
          onFinish(values);
          form.resetFields();
        }}
      >
        <Form.Item
          label='Group Name'
          name='name'
          rules={[{ required: true, message: 'Please enter group name' }]}
        >
          <Input placeholder='e.g., Web Frontend A' />
        </Form.Item>

        <Form.Item
          label='Track'
          name='track'
          initialValue='FRONTEND'
          rules={[{ required: true, message: 'Please select track' }]}
        >
          <Select
            options={[
              { label: 'Frontend', value: 'FRONTEND' },
              { label: 'Backend', value: 'BACKEND' },
              { label: 'Mobile', value: 'MOBILE' },
              { label: 'UI/UX Design', value: 'DESIGN' },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

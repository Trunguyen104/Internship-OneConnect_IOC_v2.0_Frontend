'use client';

import React from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { PROJECT_UI } from '@/constants/project/uiText';
import { RESOURCE_TYPES } from '@/constants/project/resourceTypes';

import { PROJECT_MESSAGES } from '@/constants/project/messages';

export default function ProjectResourceEditModal({ visible, onCancel, onUpdate, form, loading }) {
  return (
    <Modal
      title={PROJECT_UI.TITLE.EDIT_RESOURCE}
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      okText={PROJECT_UI.BUTTON.UPDATE}
      cancelText={PROJECT_UI.BUTTON.CANCEL}
      forceRender
    >
      <Form form={form} layout='vertical' onFinish={onUpdate}>
        <Form.Item
          name='resourceName'
          label={PROJECT_UI.FORM.RESOURCE_NAME}
          rules={[{ required: true, message: PROJECT_MESSAGES.ERROR.RESOURCE_NAME_REQUIRED }]}
        >
          <Input placeholder={PROJECT_UI.PLACEHOLDER.RESOURCE_NAME} />
        </Form.Item>

        <Form.Item
          name='resourceType'
          label={PROJECT_UI.FORM.RESOURCE_TYPE}
          rules={[{ required: true, message: PROJECT_MESSAGES.ERROR.RESOURCE_TYPE_REQUIRED }]}
        >
          <Select options={RESOURCE_TYPES} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

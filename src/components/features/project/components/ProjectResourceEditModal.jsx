'use client';

import { Form, Input, Modal, Select } from 'antd';
import React from 'react';

import { PROJECT_MESSAGES } from '@/constants/project/messages';
import { RESOURCE_TYPES } from '@/constants/project/resourceTypes';
import { PROJECT_UI } from '@/constants/project/uiText';

export default function ProjectResourceEditModal({ visible, onCancel, onUpdate, form, loading }) {
  return (
    <Modal
      title={
        <span className="text-lg font-black tracking-tight">{PROJECT_UI.TITLE.EDIT_RESOURCE}</span>
      }
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      okText={PROJECT_UI.BUTTON.UPDATE}
      cancelText={PROJECT_UI.BUTTON.CANCEL}
      centered
      className="modern-modal"
      width={480}
    >
      <Form form={form} layout="vertical" onFinish={onUpdate} className="pt-4">
        <Form.Item
          name="resourceName"
          label={
            <span className="text-[11px] font-black tracking-widest text-gray-400 uppercase">
              {PROJECT_UI.FORM.RESOURCE_NAME}
            </span>
          }
          rules={[{ required: true, message: PROJECT_MESSAGES.ERROR.RESOURCE_NAME_REQUIRED }]}
        >
          <Input
            placeholder={PROJECT_UI.PLACEHOLDER.RESOURCE_NAME}
            className="h-11 rounded-xl border-gray-100 font-bold"
          />
        </Form.Item>

        <Form.Item
          name="resourceType"
          label={
            <span className="text-[11px] font-black tracking-widest text-gray-400 uppercase">
              {PROJECT_UI.FORM.RESOURCE_TYPE}
            </span>
          }
          rules={[{ required: true, message: PROJECT_MESSAGES.ERROR.RESOURCE_TYPE_REQUIRED }]}
        >
          <Select options={RESOURCE_TYPES} className="h-11 modern-select" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

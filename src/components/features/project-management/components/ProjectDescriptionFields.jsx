'use client';

import { Form, Input } from 'antd';
import React from 'react';

const { TextArea } = Input;

export default function ProjectDescriptionFields({ FORM }) {
  return (
    <>
      <Form.Item
        name="description"
        label={FORM.LABEL?.DESCRIPTION}
        rules={[{ required: true, message: FORM.VALIDATION?.DESC_REQUIRED || 'Required' }]}
      >
        <TextArea rows={6} placeholder={FORM.PLACEHOLDER?.DESCRIPTION} />
      </Form.Item>

      <Form.Item
        name="requirements"
        label={FORM.LABEL?.REQUIREMENTS}
        rules={[{ required: true, message: FORM.VALIDATION?.REQ_REQUIRED || 'Required' }]}
      >
        <TextArea rows={4} placeholder={FORM.PLACEHOLDER?.REQUIREMENTS} />
      </Form.Item>

      <Form.Item name="deliverables" label={FORM.LABEL?.DELIVERABLES}>
        <TextArea rows={3} placeholder={FORM.PLACEHOLDER?.DELIVERABLES} />
      </Form.Item>
    </>
  );
}

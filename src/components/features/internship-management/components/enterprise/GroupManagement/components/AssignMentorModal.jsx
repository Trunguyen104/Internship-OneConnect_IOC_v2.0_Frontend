'use client';

import React, { useEffect } from 'react';
import { Modal, Form, Select, Input } from 'antd';
import { MOCK_MENTORS, MOCK_PROJECTS } from '../constants/groupData';

export function AssignMentorModal({ open, group, onCancel, onFinish }) {
  const [form] = Form.useForm();
  const isChangingMentor = !!group?.mentorId;

  useEffect(() => {
    if (group) {
      form.setFieldsValue({
        mentorId: group.mentorId,
      });
    }
  }, [group]);

  return (
    <Modal
      title={isChangingMentor ? 'Change Group Mentor' : 'Assign Group Mentor'}
      open={open}
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
      onOk={() => form.submit()}
      centered
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
          label='Select Mentor'
          name='mentorId'
          rules={[{ required: true, message: 'Please select a mentor' }]}
        >
          <Select
            options={MOCK_MENTORS.map((m) => ({
              label: `${m.name} (${m.role})`,
              value: m.id,
            }))}
          />
        </Form.Item>

        <Form.Item
          label='Assign Project'
          name='projectId'
          rules={[{ required: true, message: 'Please select a project' }]}
        >
          <Select
            options={MOCK_PROJECTS.map((p) => ({
              label: p.name,
              value: p.id,
            }))}
          />
        </Form.Item>

        {isChangingMentor && (
          <Form.Item
            label='Reason for Change'
            name='reason'
            rules={[{ required: true, message: 'Please provide a reason' }]}
          >
            <Input.TextArea placeholder='Why are you changing the mentor?' />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}

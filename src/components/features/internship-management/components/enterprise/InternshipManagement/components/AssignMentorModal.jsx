'use client';

import React, { useEffect } from 'react';
import { Modal, Form, Select, Input, Button, Typography, Space } from 'antd';

import { UserOutlined, SearchOutlined, ProjectOutlined } from '@ant-design/icons';

import { MOCK_MENTORS } from '../constants/internshipData';

const { Title, Text } = Typography;

const AssignMentorModal = ({ open, student, onCancel, onConfirm }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) form.resetFields();
  }, [open, form]);

  const onFinish = (values) => {
    if (student) {
      onConfirm(student.id, values.mentorId, values.project);
    }
  };

  return (
    <Modal open={open} onCancel={onCancel} footer={null} width={560} destroyOnClose>
      <Space direction='vertical' size='middle' style={{ width: '100%' }}>
        {/* Header */}
        <div>
          <Title level={4} style={{ marginBottom: 4 }}>
            Assign Mentor & Project
          </Title>

          <Space>
            <UserOutlined />
            <Text type='secondary'>
              Student: <Text strong>{student?.fullName}</Text>
            </Text>
          </Space>
        </div>

        {/* Form */}
        <Form form={form} layout='vertical' onFinish={onFinish}>
          <Form.Item
            label='Select Mentor'
            name='mentorId'
            rules={[{ required: true, message: 'Please select a mentor' }]}
          >
            <Select
              showSearch
              placeholder='Search mentor'
              prefix={<SearchOutlined />}
              options={MOCK_MENTORS.map((m) => ({
                label: `${m.name} - ${m.role}`,
                value: m.id,
              }))}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>

          <Form.Item
            label='Project Name / Position'
            name='project'
            rules={[{ required: true, message: 'Please enter project name' }]}
          >
            <Input prefix={<ProjectOutlined />} placeholder='Enter project name or role' />
          </Form.Item>

          <Space style={{ width: '100%', justifyContent: 'flex-end', marginTop: 16 }}>
            <Button onClick={onCancel}>Cancel</Button>

            <Button type='primary' htmlType='submit'>
              Assign Mentor
            </Button>
          </Space>
        </Form>
      </Space>
    </Modal>
  );
};

export default AssignMentorModal;

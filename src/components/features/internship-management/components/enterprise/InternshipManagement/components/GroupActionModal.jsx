'use client';

import React, { useEffect } from 'react';
import { Modal, Form, Select, Input, Button, Typography, Space, Divider } from 'antd';

import { MOCK_GROUPS } from '../constants/internshipData';

const { Title, Text } = Typography;

const GroupActionModal = ({ open, student, type, onCancel, onConfirm }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) form.resetFields();
  }, [open, form]);

  return (
    <Modal open={open} onCancel={onCancel} footer={null} width={560} destroyOnClose>
      <Space direction='vertical' size='middle' style={{ width: '100%' }}>
        {/* Header */}
        <div>
          <Title level={4} style={{ marginBottom: 4 }}>
            {type === 'ADD' ? 'Add to Existing Group' : 'Change Student Group'}
          </Title>

          <Text type='secondary'>
            Student: <Text strong>{student?.fullName}</Text>
          </Text>
        </div>

        <Divider style={{ margin: 0 }} />

        {/* Form */}
        <Form form={form} layout='vertical' onFinish={onConfirm}>
          <Form.Item
            label='Select Target Group'
            name='groupId'
            rules={[{ required: true, message: 'Please select a group' }]}
          >
            <Select
              showSearch
              placeholder='Search groups'
              options={MOCK_GROUPS.map((g) => ({
                label: `${g.name} — ${g.mentor} — ${g.project} — ${g.memberCount} students`,
                value: g.id,
              }))}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>

          {type === 'CHANGE' && (
            <Form.Item
              label='Reason for Change'
              name='reason'
              rules={[{ required: true, message: 'Please enter a reason' }]}
            >
              <Input.TextArea rows={4} placeholder='Reason for switching groups...' />
            </Form.Item>
          )}

          <Space
            style={{
              width: '100%',
              justifyContent: 'flex-end',
              marginTop: 16,
            }}
          >
            <Button onClick={onCancel}>Cancel</Button>

            <Button type='primary' htmlType='submit'>
              Confirm {type === 'ADD' ? 'Add' : 'Change'}
            </Button>
          </Space>
        </Form>
      </Space>
    </Modal>
  );
};

export default GroupActionModal;

'use client';

import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Row, Col, Typography, Space } from 'antd';
import { UserOutlined, IdcardOutlined, MailOutlined } from '@ant-design/icons';

const { Title } = Typography;

const AddStudentModal = ({ open, onCancel, onSave }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) form.resetFields();
  }, [open, form]);

  return (
    <Modal open={open} onCancel={onCancel} footer={null} width={560} destroyOnClose>
      <Title level={4}>Add New Student</Title>

      <Form form={form} layout='vertical' onFinish={onSave}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label='Full Name'
              name='fullName'
              rules={[{ required: true, message: 'Please enter full name' }]}
            >
              <Input prefix={<UserOutlined />} placeholder='e.g. Alex Sterling' />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label='Student ID'
              name='studentId'
              rules={[{ required: true, message: 'Please enter student ID' }]}
            >
              <Input prefix={<IdcardOutlined />} placeholder='e.g. SV001' />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label='Email Address'
          name='email'
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Invalid email' },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder='e.g. alex.s@university.edu' />
        </Form.Item>

        <Form.Item
          label='Major'
          name='major'
          rules={[{ required: true, message: 'Please select major' }]}
        >
          <Select
            placeholder='Select Major'
            options={[
              { label: 'Computer Science', value: 'Computer Science' },
              { label: 'Software Engineering', value: 'Software Engineering' },
              { label: 'Data Science', value: 'Data Science' },
              { label: 'UX Design', value: 'UX Design' },
            ]}
          />
        </Form.Item>

        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button onClick={onCancel}>Cancel</Button>

          <Button type='primary' htmlType='submit'>
            Save Student
          </Button>
        </Space>
      </Form>
    </Modal>
  );
};

export default AddStudentModal;

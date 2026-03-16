'use client';

import React, { useEffect } from 'react';
import { Modal, Form, Select, Input, Button, Typography, Space } from 'antd';

import { UserOutlined, SearchOutlined, ProjectOutlined } from '@ant-design/icons';

import { MOCK_MENTORS } from '../constants/internshipData';

const { Title, Text } = Typography;

import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

const AssignMentorModal = ({ open, student, onCancel, onConfirm }) => {
  const [form] = Form.useForm();
  const { ASSIGN } = INTERNSHIP_MANAGEMENT_UI.INTERNSHIP_LIST.MODALS;

  useEffect(() => {
    if (!open) form.resetFields();
  }, [open, form]);

  const onFinish = (values) => {
    if (student) {
      onConfirm(student.id, values.mentorId, values.project);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      width={560}
      destroyOnHidden
      className='modal-custom'
    >
      <Space orientation='vertical' size='large' className='w-full'>
        {/* Header */}
        <div className='mb-2'>
          <Title level={4} className='text-text mb-2'>
            {ASSIGN.TITLE}
          </Title>

          <Space className='text-muted flex items-center gap-2'>
            <UserOutlined className='text-primary' />
            <Text className='text-muted'>
              {ASSIGN.STUDENT_LABEL}{' '}
              <Text className='text-text font-bold'>{student?.fullName}</Text>
            </Text>
          </Space>
        </div>

        {/* Form */}
        <Form form={form} layout='vertical' onFinish={onFinish} className='space-y-4'>
          <Form.Item
            label={<span className='text-text font-semibold'>{ASSIGN.MENTOR_LABEL}</span>}
            name='mentorId'
            rules={[{ required: true, message: ASSIGN.MENTOR_REQUIRED }]}
          >
            <Select
              showSearch
              placeholder={ASSIGN.MENTOR_PLACEHOLDER}
              prefix={<SearchOutlined className='text-muted' />}
              className='h-11 w-full rounded-xl'
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
            label={<span className='text-text font-semibold'>{ASSIGN.PROJECT_LABEL}</span>}
            name='project'
            rules={[{ required: true, message: ASSIGN.PROJECT_REQUIRED }]}
          >
            <Input
              prefix={<ProjectOutlined className='text-muted' />}
              placeholder={ASSIGN.PROJECT_PLACEHOLDER}
              className='bg-surface border-border h-11 rounded-xl'
            />
          </Form.Item>

          <Space className='mt-8 flex w-full justify-end gap-3'>
            <Button
              onClick={onCancel}
              className='border-border h-11 rounded-xl px-6 font-semibold transition-all hover:bg-slate-50'
            >
              {ASSIGN.CANCEL}
            </Button>

            <Button
              type='primary'
              htmlType='submit'
              className='bg-primary h-11 rounded-xl border-none px-6 font-semibold shadow-md transition-all hover:scale-105 active:scale-95'
            >
              {ASSIGN.SUBMIT}
            </Button>
          </Space>
        </Form>
      </Space>
    </Modal>
  );
};

export default AssignMentorModal;

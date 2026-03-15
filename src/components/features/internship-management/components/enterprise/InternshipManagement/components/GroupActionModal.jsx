'use client';

import React, { useEffect } from 'react';
import { Modal, Form, Select, Input, Button, Typography, Space, Divider } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { MOCK_GROUPS } from '../constants/internshipData';

const { Title, Text } = Typography;

const GroupActionModal = ({ open, student, type, onCancel, onConfirm }) => {
  const [form] = Form.useForm();
  const { GROUP_ACTION } = INTERNSHIP_MANAGEMENT_UI.INTERNSHIP_LIST.MODALS;

  useEffect(() => {
    if (!open) form.resetFields();
  }, [open, form]);

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      width={560}
      destroyOnClose
      className='modal-custom'
    >
      <Space direction='vertical' size='large' className='w-full'>
        {/* Header */}
        <div className='mb-2'>
          <Title level={4} className='text-text mb-2'>
            {type === 'ADD' ? GROUP_ACTION.TITLE_ADD : GROUP_ACTION.TITLE_CHANGE}
          </Title>

          <Space className='text-muted flex items-center gap-2'>
            <UserOutlined className='text-primary' />
            <Text className='text-muted'>
              {GROUP_ACTION.STUDENT_LABEL}{' '}
              <span className='text-text font-bold'>{student?.fullName}</span>
            </Text>
          </Space>
        </div>

        <Divider className='m-0' />

        {/* Form */}
        <Form form={form} layout='vertical' onFinish={onConfirm} className='space-y-4'>
          <Form.Item
            label={<span className='text-text font-semibold'>{GROUP_ACTION.GROUP_LABEL}</span>}
            name='groupId'
            rules={[{ required: true, message: GROUP_ACTION.GROUP_REQUIRED }]}
          >
            <Select
              showSearch
              placeholder={GROUP_ACTION.GROUP_PLACEHOLDER}
              className='h-11 w-full rounded-xl'
              options={MOCK_GROUPS.map((g) => ({
                label: `${g.name} — ${g.mentor} — ${g.project} — ${g.memberCount} ${GROUP_ACTION.STUDENTS_SUFFIX}`,
                value: g.id,
              }))}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>

          {type === 'CHANGE' && (
            <Form.Item
              label={<span className='text-text font-semibold'>{GROUP_ACTION.REASON_LABEL}</span>}
              name='reason'
              rules={[{ required: true, message: GROUP_ACTION.REASON_REQUIRED }]}
            >
              <Input.TextArea
                rows={4}
                placeholder={GROUP_ACTION.REASON_PLACEHOLDER}
                className='bg-surface border-border rounded-xl'
              />
            </Form.Item>
          )}

          <Space className='mt-8 flex w-full justify-end gap-3'>
            <Button
              onClick={onCancel}
              className='border-border h-11 rounded-xl px-6 font-semibold transition-all hover:bg-slate-50'
            >
              {GROUP_ACTION.CANCEL}
            </Button>

            <Button
              type='primary'
              htmlType='submit'
              className='bg-primary h-11 rounded-xl border-none px-6 font-semibold shadow-md transition-all hover:scale-105 active:scale-95'
            >
              {type === 'ADD' ? GROUP_ACTION.SUBMIT_ADD : GROUP_ACTION.SUBMIT_CHANGE}
            </Button>
          </Space>
        </Form>
      </Space>
    </Modal>
  );
};

export default GroupActionModal;

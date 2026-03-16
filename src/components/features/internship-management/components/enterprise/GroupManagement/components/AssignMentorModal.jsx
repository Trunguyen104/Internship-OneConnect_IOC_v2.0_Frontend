'use client';

import React, { useEffect } from 'react';
import { Modal, Form, Select, Input, Button, Typography, Space, Divider } from 'antd';
import { UserOutlined, ProjectOutlined, SearchOutlined, MessageOutlined } from '@ant-design/icons';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { MOCK_MENTORS, MOCK_PROJECTS } from '../constants/groupData';

const { Title, Text } = Typography;

export function AssignMentorModal({ open, group, onCancel, onFinish }) {
  const [form] = Form.useForm();
  const { ASSIGN } = INTERNSHIP_MANAGEMENT_UI.GROUP_MANAGEMENT.MODALS;
  const isChangingMentor = !!group?.mentorId;

  useEffect(() => {
    if (group) {
      form.setFieldsValue({
        mentorId: group.mentorId,
        projectId: group.project?.id || group.projectId,
      });
    }
  }, [group, form]);

  const handleFinish = (values) => {
    onFinish(values);
    form.resetFields();
  };

  const handleCancel = () => {
    onCancel();
    form.resetFields();
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={560}
      destroyOnHidden
      className='modal-custom'
    >
      <Space orientation='vertical' size='large' className='w-full'>
        {/* Header */}
        <div className='flex flex-col items-center gap-3 text-center'>
          <div
            className={`flex size-14 items-center justify-center rounded-2xl ${
              isChangingMentor ? 'bg-primary/10' : 'bg-primary/10'
            }`}
          >
            <UserOutlined className='text-primary text-3xl' />
          </div>
          <div className='mb-2'>
            <Title level={4} className='text-text mb-1'>
              {isChangingMentor ? ASSIGN.TITLE_CHANGE : ASSIGN.TITLE_ASSIGN}
            </Title>
            <Text className='text-muted'>
              Nhóm: <Text className='text-text font-bold'>{group?.name}</Text>
            </Text>
          </div>
        </div>

        <Divider className='border-border m-0' />

        {/* Form */}
        <Form form={form} layout='vertical' onFinish={handleFinish} className='space-y-4'>
          <Form.Item
            label={<span className='text-text font-semibold'>{ASSIGN.MENTOR_LABEL}</span>}
            name='mentorId'
            rules={[{ required: true, message: ASSIGN.MENTOR_REQUIRED }]}
          >
            <Select
              showSearch
              placeholder={ASSIGN.MENTOR_LABEL}
              prefix={<SearchOutlined className='text-muted ml-1' />}
              className='h-11 w-full rounded-xl'
              options={MOCK_MENTORS.map((m) => ({
                label: `${m.name} — ${m.role}`,
                value: m.id,
              }))}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>

          <Form.Item
            label={<span className='text-text font-semibold'>{ASSIGN.PROJECT_LABEL}</span>}
            name='projectId'
            rules={[{ required: true, message: ASSIGN.PROJECT_REQUIRED }]}
          >
            <Select
              showSearch
              placeholder={ASSIGN.PROJECT_LABEL}
              prefix={<ProjectOutlined className='text-muted ml-1' />}
              className='h-11 w-full rounded-xl'
              options={MOCK_PROJECTS.map((p) => ({
                label: p.name,
                value: p.id,
              }))}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>

          {isChangingMentor && (
            <Form.Item
              label={<span className='text-text font-semibold'>{ASSIGN.REASON_LABEL}</span>}
              name='reason'
              rules={[{ required: true, message: ASSIGN.REASON_REQUIRED }]}
            >
              <Input.TextArea
                placeholder={ASSIGN.REASON_PLACEHOLDER}
                prefix={<MessageOutlined className='text-muted whitespace-nowrap' />}
                className='bg-surface border-border rounded-xl px-4 py-3'
                rows={4}
              />
            </Form.Item>
          )}

          <Space className='mt-8 flex w-full justify-end gap-3'>
            <Button
              onClick={handleCancel}
              className='border-border h-11 rounded-xl px-6 font-semibold transition-all hover:bg-slate-50'
            >
              Hủy bỏ
            </Button>

            <Button
              type='primary'
              htmlType='submit'
              className='bg-primary h-11 rounded-xl border-none px-6 font-semibold shadow-md transition-all hover:scale-105 active:scale-95'
            >
              Xác nhận
            </Button>
          </Space>
        </Form>
      </Space>
    </Modal>
  );
}

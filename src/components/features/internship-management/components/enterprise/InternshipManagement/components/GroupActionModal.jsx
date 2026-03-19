'use client';

import React, { useEffect } from 'react';
import { Form, Select, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import CompoundModal from '@/components/ui/CompoundModal';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { MOCK_GROUPS } from '../constants/internshipData';

const GroupActionModal = ({ open, student, type, onCancel, onConfirm }) => {
  const [form] = Form.useForm();
  const { GROUP_ACTION } = INTERNSHIP_MANAGEMENT_UI.INTERNSHIP_LIST.MODALS;

  useEffect(() => {
    if (!open) form.resetFields();
  }, [open, form]);

  return (
    <CompoundModal open={open} onCancel={onCancel} width={560} destroyOnHidden>
      <CompoundModal.Header
        icon={<UserOutlined />}
        title={type === 'ADD' ? GROUP_ACTION.TITLE_ADD : GROUP_ACTION.TITLE_CHANGE}
        subtitle={
          <div className='flex items-center gap-2'>
            <span className='opacity-70'>{GROUP_ACTION.STUDENT_LABEL}</span>
            <span className='text-text font-bold'>{student?.fullName}</span>
          </div>
        }
      />

      <Form
        form={form}
        layout='vertical'
        onFinish={onConfirm}
        className='p-6 pt-8'
        requiredMark={false}
      >
        <Form.Item
          label={
            <span className='text-text text-xs font-bold tracking-wider uppercase'>
              {GROUP_ACTION.GROUP_LABEL}
            </span>
          }
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
            label={
              <span className='text-text text-xs font-bold tracking-wider uppercase'>
                {GROUP_ACTION.REASON_LABEL}
              </span>
            }
            name='reason'
            rules={[{ required: true, message: GROUP_ACTION.REASON_REQUIRED }]}
          >
            <Input.TextArea
              rows={4}
              placeholder={GROUP_ACTION.REASON_PLACEHOLDER}
              className='bg-surface border-border rounded-xl px-4 py-3'
            />
          </Form.Item>
        )}

        <CompoundModal.Footer
          cancelText={GROUP_ACTION.CANCEL}
          submitText={type === 'ADD' ? GROUP_ACTION.SUBMIT_ADD : GROUP_ACTION.SUBMIT_CHANGE}
          onCancel={onCancel}
          onSubmit={() => form.submit()}
          className='mt-8 pt-6'
        />
      </Form>
    </CompoundModal>
  );
};

export default GroupActionModal;

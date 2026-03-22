'use client';

import { ProjectOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Form, Input, Select } from 'antd';
import React, { useEffect } from 'react';

import CompoundModal from '@/components/ui/CompoundModal';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

import { MOCK_MENTORS } from '../constants/internshipData';

const AssignMentorModal = ({ open, student, onCancel, onConfirm }) => {
  const [form] = Form.useForm();
  const { ASSIGN } = INTERNSHIP_MANAGEMENT_UI.INTERNSHIP_LIST.MODALS;

  useEffect(() => {
    if (open) form.resetFields();
  }, [open, form]);

  const onFinish = (values) => {
    if (student) {
      onConfirm(student.id, values.mentorId, values.project);
    }
  };

  return (
    <CompoundModal open={open} onCancel={onCancel} width={560} destroyOnHidden>
      <CompoundModal.Header
        icon={<UserOutlined />}
        title={ASSIGN.TITLE}
        subtitle={
          <div className="flex items-center gap-2">
            <span className="opacity-70">{ASSIGN.STUDENT_LABEL}</span>
            <span className="text-text font-bold">{student?.studentFullName}</span>
          </div>
        }
      />

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="p-6 pt-8"
        requiredMark={false}
      >
        <Form.Item
          label={
            <span className="text-text text-xs font-bold tracking-wider uppercase">
              {ASSIGN.MENTOR_LABEL}
            </span>
          }
          name="mentorId"
          rules={[{ required: true, message: ASSIGN.MENTOR_REQUIRED }]}
        >
          <Select
            showSearch
            placeholder={ASSIGN.MENTOR_PLACEHOLDER}
            className="h-11 w-full rounded-xl"
            suffixIcon={<SearchOutlined className="text-muted" />}
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
          label={
            <span className="text-text text-xs font-bold tracking-wider uppercase">
              {ASSIGN.PROJECT_LABEL}
            </span>
          }
          name="project"
          rules={[{ required: true, message: ASSIGN.PROJECT_REQUIRED }]}
        >
          <Input
            prefix={<ProjectOutlined className="text-muted" />}
            placeholder={ASSIGN.PROJECT_PLACEHOLDER}
            className="bg-surface border-border h-11 rounded-xl"
          />
        </Form.Item>

        <CompoundModal.Footer
          cancelText={ASSIGN.CANCEL}
          submitText={ASSIGN.SUBMIT}
          onCancel={onCancel}
          onSubmit={() => form.submit()}
          className="mt-8 pt-6"
        />
      </Form>
    </CompoundModal>
  );
};

export default AssignMentorModal;

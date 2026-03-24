'use client';

import { ProjectOutlined, UserOutlined } from '@ant-design/icons';
import { Form, Input, Select, Spin } from 'antd';
import React, { useEffect, useState } from 'react';

import CompoundModal from '@/components/ui/CompoundModal';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

import { EnterpriseMentorService } from '../services/enterprise-mentor.service';

const AssignMentorModal = ({ open, student, onCancel, onConfirm }) => {
  const [form] = Form.useForm();
  const { ASSIGN } = INTERNSHIP_MANAGEMENT_UI.INTERNSHIP_LIST.MODALS;
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      form.resetFields();
      if (student?.mentorId) {
        form.setFieldsValue({
          mentorId: student.mentorId,
          projectName: student.projectName,
        });
      }
      fetchMentors();
    }
  }, [open, student, form]);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const res = await EnterpriseMentorService.getMentors();
      const items = res?.data || [];
      setMentors(
        items.map((m) => ({
          label: `${m.fullName} (${m.email})`,
          value: m.id || m.mentorId,
        }))
      );
    } catch (err) {
      console.error('Failed to fetch mentors:', err);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = (values) => {
    if (student) {
      onConfirm(student.id, values);
    }
  };

  return (
    <CompoundModal open={open} onCancel={onCancel} width={560} destroyOnHidden closable={false}>
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
        className="px-8 py-6"
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
            loading={loading}
            options={mentors}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            notFoundContent={loading ? <Spin size="small" /> : null}
          />
        </Form.Item>

        <Form.Item
          label={
            <span className="text-text text-xs font-bold tracking-wider uppercase">
              {ASSIGN.PROJECT_LABEL}
            </span>
          }
          name="projectName"
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
          confirmText={ASSIGN.SUBMIT}
          onCancel={onCancel}
          onConfirm={() => form.submit()}
        />
      </Form>
    </CompoundModal>
  );
};

export default AssignMentorModal;

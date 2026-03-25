'use client';

import { UserOutlined } from '@ant-design/icons';
import { Form, Select, Spin } from 'antd';
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
  }, [open]);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const res = await EnterpriseMentorService.getMentors();
      const items = res?.data?.items || res?.items || res?.data || [];
      setMentors(
        (Array.isArray(items) ? items : []).map((m) => ({
          label: `${m.fullName || m.name || ''} (${m.email || ''})`,
          value: String(m.id || m.mentorId || m.userId),
        }))
      );
    } catch (err) {
      // Silent error
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
            placeholder={ASSIGN.MENTOR_PLACEHOLDER}
            className="h-11 w-full rounded-xl"
            loading={loading}
            options={mentors}
            showSearch
            optionFilterProp="label"
            notFoundContent={loading ? <Spin size="small" /> : null}
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

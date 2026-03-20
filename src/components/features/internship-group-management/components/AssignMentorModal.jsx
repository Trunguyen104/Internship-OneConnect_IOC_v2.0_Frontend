import { ProjectOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Form, Input, Select } from 'antd';
import React, { memo, useEffect } from 'react';

import CompoundModal from '@/components/ui/CompoundModal';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

import { MOCK_MENTORS, MOCK_PROJECTS } from '../constants/groupData';

export const AssignMentorModal = memo(({ open, group, onCancel, onFinish }) => {
  const [form] = Form.useForm();
  const { ASSIGN } = INTERNSHIP_MANAGEMENT_UI.GROUP_MANAGEMENT.MODALS;
  const isChangingMentor = !!group?.mentorId;

  useEffect(() => {
    if (open) {
      if (group) {
        form.setFieldsValue({
          mentorId: group.mentorId,
          projectId: group.project?.id || group.projectId,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, group, form]);

  const handleFinish = (values) => {
    onFinish(values);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <CompoundModal open={open} onCancel={handleCancel} width={560} destroyOnHidden>
      <CompoundModal.Header
        icon={<UserOutlined />}
        title={isChangingMentor ? ASSIGN.TITLE_CHANGE : ASSIGN.TITLE_ASSIGN}
        subtitle={
          <div className="flex items-center gap-1.5">
            <span className="opacity-70">{ASSIGN.GROUP_LABEL}</span>
            <span className="text-text font-bold">{group?.name}</span>
          </div>
        }
      />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
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
            placeholder={ASSIGN.MENTOR_LABEL}
            suffixIcon={<SearchOutlined className="text-muted" />}
            className="h-11 w-full rounded-xl"
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
          label={
            <span className="text-text text-xs font-bold tracking-wider uppercase">
              {ASSIGN.PROJECT_LABEL}
            </span>
          }
          name="projectId"
          rules={[{ required: true, message: ASSIGN.PROJECT_REQUIRED }]}
        >
          <Select
            showSearch
            placeholder={ASSIGN.PROJECT_LABEL}
            suffixIcon={<ProjectOutlined className="text-muted" />}
            className="h-11 w-full rounded-xl"
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
            label={
              <span className="text-text text-xs font-bold tracking-wider uppercase">
                {ASSIGN.REASON_LABEL}
              </span>
            }
            name="reason"
            rules={[{ required: true, message: ASSIGN.REASON_REQUIRED }]}
          >
            <Input.TextArea
              placeholder={ASSIGN.REASON_PLACEHOLDER}
              className="bg-surface border-border rounded-xl px-4 py-3"
              rows={4}
            />
          </Form.Item>
        )}

        <CompoundModal.Footer
          cancelText={ASSIGN.CANCEL}
          confirmText={ASSIGN.CONFIRM}
          onCancel={handleCancel}
          onConfirm={() => form.submit()}
          className="mt-8 pt-6"
        />
      </Form>
    </CompoundModal>
  );
});

AssignMentorModal.displayName = 'AssignMentorModal';

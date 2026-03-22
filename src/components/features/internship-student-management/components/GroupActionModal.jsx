'use client';

import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Form, Input, Select } from 'antd';
import React, { useEffect } from 'react';

import CompoundModal from '@/components/ui/CompoundModal';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

import { useEnterpriseGroups } from '../../internship-group-management/hooks/useEnterpriseGroups';

const GroupActionModal = ({ open, students = [], type, onCancel, onConfirm }) => {
  const [form] = Form.useForm();
  const { GROUP_ACTION } = INTERNSHIP_MANAGEMENT_UI.INTERNSHIP_LIST.MODALS;

  useEffect(() => {
    if (open) form.resetFields();
  }, [open, form]);

  const { data: activeGroups, loading: fetchingGroups } = useEnterpriseGroups({
    termId: students[0]?.termId, // Use the first student's termId, mock will fall back if undefined
    filters: { status: 1 }, // Changed from 0 to 1 based on backend validation error
    pagination: { current: 1, pageSize: 100 }, // Fetch a large chunk for dropdown
    search: '',
  });

  const currentGroupIds = React.useMemo(() => {
    return students.map((s) => s.groupId).filter(Boolean);
  }, [students]);

  return (
    <CompoundModal open={open} onCancel={onCancel} width={560} destroyOnHidden>
      <CompoundModal.Header
        icon={<UserOutlined />}
        title={type === 'ADD' ? GROUP_ACTION.TITLE_ADD : GROUP_ACTION.TITLE_CHANGE}
        subtitle={
          <div className="flex items-center gap-2">
            <span className="opacity-70">{GROUP_ACTION.STUDENT_LABEL}</span>
            <span className="text-text font-bold">
              {students.length === 1
                ? students[0]?.studentFullName || students[0]?.fullName
                : `${students.length} ${GROUP_ACTION.STUDENTS_SELECTED}`}
            </span>
          </div>
        }
      />

      <Form
        form={form}
        layout="vertical"
        onFinish={onConfirm}
        className="p-6 pt-8"
        requiredMark={false}
      >
        <Form.Item
          label={
            <span className="text-text text-xs font-bold tracking-wider uppercase">
              {GROUP_ACTION.GROUP_LABEL}
            </span>
          }
          name="groupId"
          rules={[{ required: true, message: GROUP_ACTION.GROUP_REQUIRED }]}
        >
          <Select
            showSearch
            placeholder={GROUP_ACTION.GROUP_PLACEHOLDER}
            className="h-11 w-full rounded-xl"
            suffixIcon={<SearchOutlined className="text-muted" />}
            loading={fetchingGroups}
            options={activeGroups.map((g) => {
              const isCurrent = currentGroupIds.includes(g.id);
              const groupLabel = `${g.name}${GROUP_ACTION.SEPARATOR}${g.mentorName || GROUP_ACTION.NO_MENTOR}${GROUP_ACTION.SEPARATOR}${g.memberCount}${GROUP_ACTION.SPACE}${GROUP_ACTION.STUDENTS_SUFFIX}`;
              return {
                label: (
                  <div className="flex justify-between items-center w-full">
                    <span>{groupLabel}</span>
                    {isCurrent && (
                      <span className="bg-gray-100 text-muted px-2 py-0.5 rounded text-[10px] uppercase font-bold">
                        {GROUP_ACTION.CURRENT_GROUP}
                      </span>
                    )}
                  </div>
                ),
                value: g.id,
                disabled: isCurrent,
              };
            })}
            filterOption={(input, option) => {
              // Extract text from the complex label object for filtering
              const labelText = activeGroups.find((g) => g.id === option.value)?.name || '';
              return labelText.toLowerCase().includes(input.toLowerCase());
            }}
          />
        </Form.Item>

        {type === 'CHANGE' && (
          <Form.Item
            label={
              <span className="text-text text-xs font-bold tracking-wider uppercase">
                {GROUP_ACTION.REASON_LABEL}
              </span>
            }
            name="reason"
            rules={[{ required: true, message: GROUP_ACTION.REASON_REQUIRED }]}
          >
            <Input.TextArea
              rows={4}
              placeholder={GROUP_ACTION.REASON_PLACEHOLDER}
              className="bg-surface border-border rounded-xl px-4 py-3"
            />
          </Form.Item>
        )}

        <CompoundModal.Footer
          cancelText={GROUP_ACTION.CANCEL}
          submitText={type === 'ADD' ? GROUP_ACTION.SUBMIT_ADD : GROUP_ACTION.SUBMIT_CHANGE}
          onCancel={onCancel}
          onSubmit={() => form.submit()}
          className="mt-8 pt-6"
        />
      </Form>
    </CompoundModal>
  );
};

export default GroupActionModal;

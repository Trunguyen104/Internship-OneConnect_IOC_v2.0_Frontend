'use client';

import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Form, Select } from 'antd';
import React, { useEffect } from 'react';

import CompoundModal from '@/components/ui/CompoundModal';
import { showDeleteConfirm } from '@/components/ui/deleteconfirm';
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

  const handleFinish = (values) => {
    if (type === 'CHANGE') {
      const newGroup = activeGroups.find((g) => g.id === values.groupId);
      const oldGroupNames = Array.from(new Set(students.map((s) => s.groupName))).join(', ');
      const studentNames =
        students.length === 1
          ? students[0]?.studentFullName || students[0]?.fullName
          : `${students.length} ${GROUP_ACTION.STUDENTS_SELECTED}`;

      showDeleteConfirm({
        title: GROUP_ACTION.CHANGE_CONFIRM_TITLE,
        content: GROUP_ACTION.CHANGE_CONFIRM_CONTENT.replace('{student}', studentNames)
          .replace('{oldGroup}', oldGroupNames || 'N/A')
          .replace('{newGroup}', newGroup?.name || 'New Group'),
        okText: GROUP_ACTION.SUBMIT_CHANGE,
        type: 'warning',
        onOk: () => onConfirm(values),
      });
    } else {
      onConfirm(values);
    }
  };

  return (
    <CompoundModal open={open} onCancel={onCancel} width={500} destroyOnHidden footer={null}>
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
        onFinish={handleFinish}
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
            notFoundContent={
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <span className="text-muted text-xs font-medium mb-1">
                  {GROUP_ACTION.EMPTY_STATE}
                </span>
                <span className="text-[10px] text-muted opacity-60">
                  {GROUP_ACTION.EMPTY_SUGGESTION}
                </span>
              </div>
            }
            options={activeGroups.map((g) => {
              const isCurrent = currentGroupIds.includes(g.id);
              const mentor = g.mentorName || GROUP_ACTION.NO_MENTOR;
              const count = `${g.memberCount}${GROUP_ACTION.SPACE}${GROUP_ACTION.STUDENTS_SUFFIX}`;
              const groupLabel = `${g.name}${GROUP_ACTION.SEPARATOR}${mentor}${GROUP_ACTION.SEPARATOR}${count}`;
              return {
                label: (
                  <div className="flex justify-between items-center w-full">
                    <span>{groupLabel}</span>
                    {isCurrent && (
                      <span className="bg-gray-100 text-muted rounded px-2 py-0.5 text-[10px] font-bold uppercase">
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
              const group = activeGroups.find((g) => g.id === option.value);
              const searchStr = `${group?.name || ''} ${group?.mentorName || ''}`.toLowerCase();
              return searchStr.includes(input.toLowerCase());
            }}
          />
          {type === 'CHANGE' &&
            activeGroups.length > 0 &&
            activeGroups.every((g) => currentGroupIds.includes(g.id)) && (
              <div className="mt-2 text-[11px] font-medium text-danger">
                {GROUP_ACTION.ONLY_GROUP_ERROR}
              </div>
            )}
        </Form.Item>

        <CompoundModal.Footer
          cancelText={GROUP_ACTION.CANCEL}
          submitText={type === 'ADD' ? GROUP_ACTION.SUBMIT_ADD : GROUP_ACTION.SUBMIT_CHANGE}
          onCancel={onCancel}
          onSubmit={() => form.submit()}
          className="mt-8 pt-6"
          submitDisabled={
            activeGroups.length === 0 ||
            (type === 'CHANGE' && activeGroups.every((g) => currentGroupIds.includes(g.id)))
          }
        />
        {activeGroups.length === 0 && !fetchingGroups && (
          <div className="mt-4 rounded-xl bg-orange-50/50 p-4 border border-orange-100 italic text-[11px] text-orange-600 leading-relaxed">
            {GROUP_ACTION.EMPTY_SUGGESTION}
          </div>
        )}
      </Form>
    </CompoundModal>
  );
};

export default GroupActionModal;

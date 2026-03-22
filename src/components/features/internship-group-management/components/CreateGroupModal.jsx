import { EditOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Form, Input, Select, Typography } from 'antd';
import React, { memo, useEffect } from 'react';

import CompoundModal from '@/components/ui/CompoundModal';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

const { Text } = Typography;

export const CreateGroupModal = memo(
  ({
    open,
    group = null,
    initialStudents = [],
    students = [],
    loadingStudents = false,
    onCancel,
    onFinish,
  }) => {
    const [form] = Form.useForm();
    const { CREATE } = INTERNSHIP_MANAGEMENT_UI.GROUP_MANAGEMENT.MODALS;
    const isEdit = !!group;

    useEffect(() => {
      if (open) {
        form.resetFields();
        if (isEdit) {
          form.setFieldsValue({
            name: group.name,
            track: group.track?.toUpperCase() || 'FRONTEND',
          });
        } else if (initialStudents.length > 0) {
          form.setFieldsValue({
            name: `Nhóm ${Math.floor(Math.random() * 1000)}`,
            studentIds: initialStudents.map((s) => s.id),
          });
        }
      }
    }, [open, form, group, isEdit, initialStudents]);

    const handleCancel = () => {
      onCancel();
    };

    const handleFinish = (values) => {
      const payload = { ...values };
      // backend expects studentIds for creation
      onFinish(payload);
      form.resetFields();
    };

    const studentOptions = students.map((s) => ({
      label: (
        <div className="flex items-center gap-2 py-1">
          <Avatar size="small" src={s.avatar} icon={<UserOutlined />} />
          <div className="flex flex-col leading-tight">
            <Text className="text-xs font-bold">
              {s.studentFullName || s.name || s.fullName || 'Unknown Student'}
            </Text>
            <Text className="text-muted text-[10px] uppercase opacity-60">
              {s.studentCode || s.code || 'No Code'} {'\u2022'} {s.major || 'No Major'}
            </Text>
          </div>
        </div>
      ),
      value: s.id || s.applicationId,
      searchValue: `${s.studentFullName || ''} ${s.name || ''} ${s.studentCode || ''}`,
    }));

    return (
      <CompoundModal open={open} onCancel={handleCancel} width={580} destroyOnHidden>
        <CompoundModal.Header
          icon={<TeamOutlined />}
          title={isEdit ? CREATE.TITLE_EDIT : CREATE.TITLE}
          subtitle={isEdit ? CREATE.SUBTITLE_EDIT : CREATE.SUBTITLE}
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
                {CREATE.NAME_LABEL}
              </span>
            }
            name="name"
            rules={[{ required: true, message: CREATE.NAME_REQUIRED }]}
          >
            <Input
              prefix={<EditOutlined className="text-muted" />}
              placeholder={CREATE.NAME_PLACEHOLDER}
              className="bg-surface border-border h-11 rounded-xl"
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label={
                <span className="text-text text-xs font-bold tracking-wider uppercase">
                  {CREATE.TRACK_LABEL}
                </span>
              }
              name="track"
              initialValue="FRONTEND"
              rules={[{ required: true, message: CREATE.TRACK_REQUIRED }]}
            >
              <Select
                className="h-11 w-full rounded-xl"
                options={[
                  { label: CREATE.TRACK_OPTIONS.FRONTEND, value: 'FRONTEND' },
                  { label: CREATE.TRACK_OPTIONS.BACKEND, value: 'BACKEND' },
                  { label: CREATE.TRACK_OPTIONS.MOBILE, value: 'MOBILE' },
                  { label: CREATE.TRACK_OPTIONS.DESIGN, value: 'DESIGN' },
                ]}
              />
            </Form.Item>

            {!isEdit && (
              <Form.Item
                label={
                  <span className="text-text text-xs font-bold tracking-wider uppercase">
                    {CREATE.STUDENTS_LABEL}
                  </span>
                }
                name="studentIds"
                rules={[{ required: true, message: CREATE.STUDENTS_REQUIRED }]}
              >
                <Select
                  mode="multiple"
                  placeholder={CREATE.STUDENTS_PLACEHOLDER}
                  className="min-h-11 w-full rounded-xl"
                  loading={loadingStudents}
                  options={studentOptions}
                  optionFilterProp="searchValue"
                  maxTagCount="responsive"
                  disabled={initialStudents.length > 0}
                />
              </Form.Item>
            )}
          </div>

          <CompoundModal.Footer
            cancelText={CREATE.CANCEL}
            confirmText={isEdit ? CREATE.SUBMIT_EDIT : CREATE.SUBMIT}
            onCancel={handleCancel}
            onConfirm={() => form.submit()}
            className="mt-8 pt-6"
          />
        </Form>
      </CompoundModal>
    );
  }
);
CreateGroupModal.displayName = 'CreateGroupModal';

export default CreateGroupModal;

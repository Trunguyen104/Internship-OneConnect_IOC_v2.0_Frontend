import { EditOutlined, TeamOutlined } from '@ant-design/icons';
import { Form, Input, Select } from 'antd';
import React, { memo, useEffect } from 'react';

import CompoundModal from '@/components/ui/CompoundModal';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

export const CreateGroupModal = memo(({ open, onCancel, onFinish }) => {
  const [form] = Form.useForm();
  const { CREATE } = INTERNSHIP_MANAGEMENT_UI.GROUP_MANAGEMENT.MODALS;

  useEffect(() => {
    if (open) form.resetFields();
  }, [open, form]);

  const handleCancel = () => {
    onCancel();
  };

  const handleFinish = (values) => {
    onFinish(values);
    form.resetFields();
  };

  return (
    <CompoundModal open={open} onCancel={handleCancel} width={560} destroyOnHidden>
      <CompoundModal.Header
        icon={<TeamOutlined />}
        title={CREATE.TITLE}
        subtitle={CREATE.SUBTITLE}
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

        <CompoundModal.Footer
          cancelText={CREATE.CANCEL}
          confirmText={CREATE.SUBMIT}
          onCancel={handleCancel}
          onConfirm={() => form.submit()}
          className="mt-8 pt-6"
        />
      </Form>
    </CompoundModal>
  );
});
CreateGroupModal.displayName = 'CreateGroupModal';

export default CreateGroupModal;

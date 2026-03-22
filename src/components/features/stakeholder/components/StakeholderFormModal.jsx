'use client';

import { EditOutlined, SaveOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Select, Space, Typography } from 'antd';
import React, { memo } from 'react';

import { STAKEHOLDER_UI } from '@/constants/stakeholder/uiText';

const { Text } = Typography;

const StakeholderFormModal = memo(function StakeholderFormModal({
  isOpen,
  onClose,
  editingId,
  form,
  setForm,
  errors,
  setErrors,
  onSave,
}) {
  const {
    FIELD_NAME,
    FIELD_EMAIL,
    FIELD_ROLE,
    FIELD_PHONE,
    FIELD_DESC,
    PLACEHOLDER_NAME,
    PLACEHOLDER_EMAIL,
    PLACEHOLDER_PHONE,
    PLACEHOLDER_DESC,
    ROLE_SELECT,
    ROLE_MENTOR,
    ROLE_SUPERVISOR,
    ROLE_LECTURER,
    ROLE_MEMBER,
    CANCEL,
    UPDATE,
    SAVE,
    MODAL_EDIT,
    MODAL_ADD,
  } = STAKEHOLDER_UI;

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={520}
      centered
      destroyOnHidden
      title={
        <Space className="mb-2">
          {editingId ? (
            <EditOutlined className="text-primary" />
          ) : (
            <UserOutlined className="text-primary" />
          )}
          <span>{editingId ? MODAL_EDIT : MODAL_ADD}</span>
        </Space>
      }
    >
      <div className="mt-4 space-y-4">
        <div className="flex flex-col gap-1.5">
          <Text strong>
            {FIELD_NAME} <span className="text-danger">*</span>
          </Text>
          <Input
            placeholder={PLACEHOLDER_NAME}
            value={form.name}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, name: e.target.value }));
              if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
            }}
            status={errors.name ? 'error' : ''}
          />
          {errors.name && (
            <Text type="danger" className="text-xs">
              {errors.name}
            </Text>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <Text strong>
            {FIELD_EMAIL} <span className="text-danger">*</span>
          </Text>
          <Input
            placeholder={PLACEHOLDER_EMAIL}
            value={form.email}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, email: e.target.value }));
              if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
            }}
            status={errors.email ? 'error' : ''}
          />
          {errors.email && (
            <Text type="danger" className="text-xs">
              {errors.email}
            </Text>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Text strong>{FIELD_ROLE}</Text>
            <Select
              placeholder={ROLE_SELECT}
              value={form.role || undefined}
              onChange={(val) => {
                setForm((prev) => ({ ...prev, role: val }));
                if (errors.role) setErrors((prev) => ({ ...prev, role: null }));
              }}
              status={errors.role ? 'error' : ''}
              className="w-full"
              options={[
                { value: 'Mentor', label: ROLE_MENTOR },
                { value: 'Supervisor', label: ROLE_SUPERVISOR },
                { value: 'Lecturer', label: ROLE_LECTURER },
                { value: 'Team Member', label: ROLE_MEMBER },
              ]}
            />
            {errors.role && (
              <Text type="danger" className="text-xs">
                {errors.role}
              </Text>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Text strong>{FIELD_PHONE}</Text>
            <Input
              placeholder={PLACEHOLDER_PHONE}
              value={form.phoneNumber}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9+\-().\s]/g, '');
                setForm((prev) => ({ ...prev, phoneNumber: val }));
                if (errors.phoneNumber) setErrors((prev) => ({ ...prev, phoneNumber: null }));
              }}
              status={errors.phoneNumber ? 'error' : ''}
            />
            {errors.phoneNumber && (
              <Text type="danger" className="text-xs">
                {errors.phoneNumber}
              </Text>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Text strong>{FIELD_DESC}</Text>
          <Input.TextArea
            rows={3}
            placeholder={PLACEHOLDER_DESC}
            value={form.description}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, description: e.target.value }));
              if (errors.description) setErrors((prev) => ({ ...prev, description: null }));
            }}
            status={errors.description ? 'error' : ''}
          />
          {errors.description && (
            <Text type="danger" className="text-xs">
              {errors.description}
            </Text>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button onClick={onClose}>{CANCEL}</Button>
          <Button type="primary" onClick={onSave} icon={<SaveOutlined />}>
            {editingId ? UPDATE : SAVE}
          </Button>
        </div>
      </div>
    </Modal>
  );
});

export default StakeholderFormModal;

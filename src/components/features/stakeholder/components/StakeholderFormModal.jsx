'use client';

import React, { memo } from 'react';
import { Modal, Form, Input, Select, Divider, Space, Button, Typography } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  SolutionOutlined,
  TagOutlined,
  SaveOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { STAKEHOLDER_UI } from '@/constants/stakeholder/uiText';

const { Text, Title } = Typography;

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
  // We'll use the form data directly since it's managed by the hook
  // but we'll apply Ant Design's visual style.
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
      destroyOnClose
      className='modal-custom'
    >
      <div className='mb-6 flex flex-col items-center gap-3 text-center'>
        <div className='bg-primary/10 flex size-14 items-center justify-center rounded-2xl'>
          {editingId ? (
            <EditOutlined className='text-primary text-3xl' />
          ) : (
            <UserOutlined className='text-primary text-3xl' />
          )}
        </div>
        <div>
          <Title level={4} className='text-text mb-1'>
            {editingId ? MODAL_EDIT : MODAL_ADD}
          </Title>
          <Text className='text-muted text-xs italic'>
            {editingId
              ? 'Cập nhật thông tin chi tiết người liên quan'
              : 'Thêm mới người liên quan vào danh sách theo dõi'}
          </Text>
        </div>
      </div>

      <Divider className='border-border m-0' />

      <div className='mt-8 space-y-5 px-2'>
        {/* Manual Form since the hook manages the state */}
        <div className='space-y-4'>
          {/* Name */}
          <div className='space-y-1'>
            <label className='text-text text-sm font-semibold'>
              {FIELD_NAME} <span className='text-danger'>*</span>
            </label>
            <Input
              prefix={<UserOutlined className='text-muted' />}
              placeholder={PLACEHOLDER_NAME}
              value={form.name}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, name: e.target.value }));
                if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
              }}
              status={errors.name ? 'error' : ''}
              className='h-11 rounded-xl transition-all'
            />
            {errors.name && (
              <Text type='danger' className='ml-1 text-[10px]'>
                {errors.name}
              </Text>
            )}
          </div>

          {/* Email */}
          <div className='space-y-1'>
            <label className='text-text text-sm font-semibold'>
              {FIELD_EMAIL} <span className='text-danger'>*</span>
            </label>
            <Input
              prefix={<MailOutlined className='text-muted' />}
              placeholder={PLACEHOLDER_EMAIL}
              value={form.email}
              disabled={!!editingId}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, email: e.target.value }));
                if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
              }}
              status={errors.email ? 'error' : ''}
              className='h-11 rounded-xl transition-all'
            />
            {errors.email && (
              <Text type='danger' className='ml-1 text-[10px]'>
                {errors.email}
              </Text>
            )}
          </div>

          <div className='grid grid-cols-2 gap-4'>
            {/* Role */}
            <div className='space-y-1'>
              <label className='text-text text-sm font-semibold'>{FIELD_ROLE}</label>
              <Select
                suffixIcon={<TagOutlined className='text-muted' />}
                placeholder={ROLE_SELECT}
                value={form.role || undefined}
                onChange={(val) => {
                  setForm((prev) => ({ ...prev, role: val }));
                  if (errors.role) setErrors((prev) => ({ ...prev, role: null }));
                }}
                status={errors.role ? 'error' : ''}
                className='h-11 w-full'
                options={[
                  { value: 'Mentor', label: ROLE_MENTOR },
                  { value: 'Supervisor', label: ROLE_SUPERVISOR },
                  { value: 'Lecturer', label: ROLE_LECTURER },
                  { value: 'Team Member', label: ROLE_MEMBER },
                ]}
              />
              {errors.role && (
                <Text type='danger' className='ml-1 text-[10px]'>
                  {errors.role}
                </Text>
              )}
            </div>

            {/* Phone */}
            <div className='space-y-1'>
              <label className='text-text text-sm font-semibold'>{FIELD_PHONE}</label>
              <Input
                prefix={<PhoneOutlined className='text-muted' />}
                placeholder={PLACEHOLDER_PHONE}
                value={form.phoneNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9+\-().\s]/g, '');
                  setForm((prev) => ({ ...prev, phoneNumber: val }));
                  if (errors.phoneNumber) setErrors((prev) => ({ ...prev, phoneNumber: null }));
                }}
                status={errors.phoneNumber ? 'error' : ''}
                className='h-11 rounded-xl transition-all'
              />
              {errors.phoneNumber && (
                <Text type='danger' className='ml-1 text-[10px]'>
                  {errors.phoneNumber}
                </Text>
              )}
            </div>
          </div>

          {/* Description */}
          <div className='space-y-1'>
            <label className='text-text text-sm font-semibold'>{FIELD_DESC}</label>
            <Input.TextArea
              rows={3}
              placeholder={PLACEHOLDER_DESC}
              value={form.description}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, description: e.target.value }));
                if (errors.description) setErrors((prev) => ({ ...prev, description: null }));
              }}
              status={errors.description ? 'error' : ''}
              className='rounded-xl transition-all'
            />
            {errors.description && (
              <Text type='danger' className='ml-1 text-[10px]'>
                {errors.description}
              </Text>
            )}
          </div>
        </div>

        <Space className='mt-8 flex w-full justify-end gap-3 pb-2'>
          <Button
            onClick={onClose}
            className='border-border h-11 rounded-xl px-8 font-semibold transition-all hover:bg-slate-50'
          >
            {CANCEL}
          </Button>

          <Button
            type='primary'
            onClick={onSave}
            icon={<SaveOutlined />}
            className='bg-primary h-11 rounded-xl border-none px-8 font-semibold shadow-md transition-all hover:scale-105 active:scale-95'
          >
            {editingId ? UPDATE : SAVE}
          </Button>
        </Space>
      </div>
    </Modal>
  );
});

export default StakeholderFormModal;

'use client';

import { SaveOutlined, UserOutlined } from '@ant-design/icons';
import { Input, Select } from 'antd';
import React, { memo } from 'react';

import { Button } from '@/components/ui/button';
import CompoundModal from '@/components/ui/compoundmodal';
import { STAKEHOLDER_UI } from '@/constants/stakeholder/uiText';

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

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  return (
    <CompoundModal open={isOpen} onCancel={onClose} width={560}>
      <CompoundModal.Header
        title={editingId ? MODAL_EDIT : MODAL_ADD}
        subtitle={STAKEHOLDER_UI.SUBTITLE || 'Quáº£n lÃ½ thÃ´ng tin bÃªn liÃªn quan trong dá»± Ã¡n'}
        icon={<UserOutlined />}
      />

      <CompoundModal.Content>
        <div className="space-y-6 py-2">
          {/* Name & Email Group */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold tracking-wide text-text/80 uppercase">
                {FIELD_NAME} <span className="text-rose-500">*</span>
              </label>
              <Input
                placeholder={PLACEHOLDER_NAME}
                value={form.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                status={errors.name ? 'error' : ''}
                className="h-11 rounded-xl border-gray-200 bg-gray-50/30 transition-all focus:bg-white focus:shadow-md"
              />
              {errors.name && (
                <span className="text-xs font-semibold text-rose-500">{errors.name}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold tracking-wide text-text/80 uppercase">
                {FIELD_EMAIL} <span className="text-rose-500">*</span>
              </label>
              <Input
                placeholder={PLACEHOLDER_EMAIL}
                value={form.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                status={errors.email ? 'error' : ''}
                className="h-11 rounded-xl border-gray-200 bg-gray-50/30 transition-all focus:bg-white focus:shadow-md"
              />
              {errors.email && (
                <span className="text-xs font-semibold text-rose-500">{errors.email}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold tracking-wide text-text/80 uppercase">
                {FIELD_ROLE}
              </label>
              <Select
                placeholder={ROLE_SELECT}
                value={form.role || undefined}
                onChange={(val) => handleInputChange('role', val)}
                status={errors.role ? 'error' : ''}
                className="h-11 w-full !rounded-xl"
                options={[
                  { value: 'Mentor', label: ROLE_MENTOR },
                  { value: 'Supervisor', label: ROLE_SUPERVISOR },
                  { value: 'Lecturer', label: ROLE_LECTURER },
                  { value: 'Team Member', label: ROLE_MEMBER },
                ]}
              />
              {errors.role && (
                <span className="text-xs font-semibold text-rose-500">{errors.role}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold tracking-wide text-text/80 uppercase">
                {FIELD_PHONE}
              </label>
              <Input
                placeholder={PLACEHOLDER_PHONE}
                value={form.phoneNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9+\-().\s]/g, '');
                  handleInputChange('phoneNumber', val);
                }}
                status={errors.phoneNumber ? 'error' : ''}
                className="h-11 rounded-xl border-gray-200 bg-gray-50/30 transition-all focus:bg-white focus:shadow-md"
              />
              {errors.phoneNumber && (
                <span className="text-xs font-semibold text-rose-500">{errors.phoneNumber}</span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold tracking-wide text-text/80 uppercase">
              {FIELD_DESC}
            </label>
            <Input.TextArea
              rows={3}
              placeholder={PLACEHOLDER_DESC}
              value={form.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              status={errors.description ? 'error' : ''}
              className="rounded-xl border-gray-200 bg-gray-50/30 transition-all focus:bg-white focus:shadow-md py-3"
            />
            {errors.description && (
              <span className="text-xs font-semibold text-rose-500">{errors.description}</span>
            )}
          </div>
        </div>
      </CompoundModal.Content>

      <CompoundModal.Footer>
        <div className="flex w-full items-center justify-end gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            className="h-11 rounded-2xl px-8 font-black tracking-tight text-muted/60 transition-all hover:bg-gray-100 hover:text-text active:scale-95"
          >
            {CANCEL}
          </Button>
          <Button
            onClick={onSave}
            className="h-11 rounded-2xl bg-primary px-8 font-black tracking-tight text-white shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] hover:bg-primary/90 active:scale-95"
          >
            <SaveOutlined className="mr-2" />
            {editingId ? UPDATE : SAVE}
          </Button>
        </div>
      </CompoundModal.Footer>
    </CompoundModal>
  );
});

export default StakeholderFormModal;

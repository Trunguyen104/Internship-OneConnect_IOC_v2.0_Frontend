'use client';

import { Input, Select } from 'antd';

import Modal from '@/components/ui/Modal';
import { UI_TEXT } from '@/lib/UI_Text';

export default function AdminUserCreateModal({
  open,
  onCancel,
  onOk,
  confirmLoading,
  createForm,
  setCreateForm,
  roleOptions,
  unitRequired,
}) {
  return (
    <Modal open={open} onCancel={onCancel}>
      <Modal.Header>
        <Modal.Title>{UI_TEXT.ADMIN_USERS.CREATE_TITLE}</Modal.Title>
      </Modal.Header>

      <Modal.Content>
        <Input
          placeholder={UI_TEXT.ADMIN_USERS.FULL_NAME_PLACEHOLDER}
          value={createForm.fullName}
          onChange={(e) => setCreateForm((p) => ({ ...p, fullName: e.target.value }))}
        />
        <Input
          placeholder={UI_TEXT.ADMIN_USERS.EMAIL_PLACEHOLDER}
          value={createForm.email}
          onChange={(e) => setCreateForm((p) => ({ ...p, email: e.target.value }))}
        />
        <Select
          value={createForm.role}
          onChange={(v) => setCreateForm((p) => ({ ...p, role: v }))}
          options={roleOptions}
          className="w-full"
        />
        <Input
          placeholder={UI_TEXT.ADMIN_USERS.PHONE_PLACEHOLDER}
          value={createForm.phoneNumber}
          onChange={(e) => setCreateForm((p) => ({ ...p, phoneNumber: e.target.value }))}
        />
        <Input
          placeholder={
            unitRequired(createForm.role)
              ? UI_TEXT.COMMON.UNIT_ID_REQUIRED
              : UI_TEXT.COMMON.UNIT_ID_OPTIONAL
          }
          value={createForm.unitId}
          onChange={(e) => setCreateForm((p) => ({ ...p, unitId: e.target.value }))}
        />
        <div className="text-xs text-slate-500">{UI_TEXT.ADMIN_USERS.UNIT_SELECTION_HINT}</div>
      </Modal.Content>

      <Modal.Footer>
        <Modal.Actions
          onCancel={onCancel}
          onOk={onOk}
          cancelText={UI_TEXT.BUTTON.CANCEL}
          okText={UI_TEXT.BUTTON.CREATE}
          confirmLoading={confirmLoading}
        />
      </Modal.Footer>
    </Modal>
  );
}

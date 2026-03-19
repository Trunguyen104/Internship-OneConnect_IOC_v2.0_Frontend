'use client';

import Modal from '@/components/ui/Modal';
import { Input, Select } from 'antd';

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
        <Modal.Title>Create admin user</Modal.Title>
      </Modal.Header>

      <Modal.Content>
        <Input
          placeholder='Full name'
          value={createForm.fullName}
          onChange={(e) => setCreateForm((p) => ({ ...p, fullName: e.target.value }))}
        />
        <Input
          placeholder='Email'
          value={createForm.email}
          onChange={(e) => setCreateForm((p) => ({ ...p, email: e.target.value }))}
        />
        <Select
          value={createForm.role}
          onChange={(v) => setCreateForm((p) => ({ ...p, role: v }))}
          options={roleOptions}
          className='w-full'
        />
        <Input
          placeholder='Phone number (optional)'
          value={createForm.phoneNumber}
          onChange={(e) => setCreateForm((p) => ({ ...p, phoneNumber: e.target.value }))}
        />
        <Input
          placeholder={
            unitRequired(createForm.role)
              ? 'UnitId (required for selected role)'
              : 'UnitId (optional)'
          }
          value={createForm.unitId}
          onChange={(e) => setCreateForm((p) => ({ ...p, unitId: e.target.value }))}
        />
        <div className='text-xs text-slate-500'>
          Unit selection datasource is not available in FE code yet. Enter a UnitId GUID if
          required.
        </div>
      </Modal.Content>

      <Modal.Footer>
        <Modal.Actions
          onCancel={onCancel}
          onOk={onOk}
          cancelText='Cancel'
          okText='Create'
          confirmLoading={confirmLoading}
        />
      </Modal.Footer>
    </Modal>
  );
}

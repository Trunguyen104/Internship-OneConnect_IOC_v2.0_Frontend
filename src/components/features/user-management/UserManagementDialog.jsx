'use client';

import { Drawer } from 'antd';
import { useState } from 'react';

import { UI_TEXT } from '@/lib/UI_Text';

import UserManagementForm from './UserManagementForm';

export default function UserManagementDialog({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  controlled = false,
  userId,
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlled ? controlledOpen : internalOpen;
  const setOpen = controlled ? setControlledOpen : setInternalOpen;
  const isEdit = !!userId;

  return (
    <Drawer
      title={
        <div className="flex flex-col gap-1">
          <span className="text-lg font-black tracking-tight text-slate-900">
            {isEdit ? UI_TEXT.USER_MANAGEMENT.UPDATE_PROFILE : UI_TEXT.USER_MANAGEMENT.ADD}
          </span>
          <span className="text-xs font-medium text-slate-400">
            {isEdit
              ? UI_TEXT.USER_MANAGEMENT.UPDATE_INFO
              : UI_TEXT.USER_MANAGEMENT.CREATE_DESCRIPTION}
          </span>
        </div>
      }
      open={open}
      onClose={() => setOpen(false)}
      size={560}
      styles={{
        header: { borderBottom: '1px solid #f8fafc', padding: '24px' },
        body: { padding: '24px' },
      }}
      footer={null}
      destroyOnClose
    >
      <UserManagementForm
        userId={userId}
        onSuccess={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      />
    </Drawer>
  );
}

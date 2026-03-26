'use client';

import { Dropdown } from 'antd';
import { List, LockKeyhole, Trash2, UserPen } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { UI_TEXT } from '@/lib/UI_Text';

import UserManagementDeleteModal from './modal/UserManagementDeleteModal';
import UserManagementResetPasswordModal from './modal/UserManagementResetPasswordModal';
import UserManagementUpdateModal from './modal/UserManagementUpdateModal';

export default function UserManagementAction({ user }) {
  const [open, setOpen] = useState({ isOpen: false, modal: null });
  const [selectedUser, setSelectedUser] = useState(null);

  const handleEdit = (newModal) => {
    setSelectedUser(user);
    setOpen({
      isOpen: !!newModal,
      modal: newModal,
    });
  };

  const menuItems = [
    {
      key: 'edit',
      label: (
        <div className="flex items-center gap-4 py-1.5 pr-8">
          <div className="rounded-xl bg-blue-50/50 p-2.5">
            <UserPen className="size-4 text-blue-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-tight text-text">
              {UI_TEXT.USER_MANAGEMENT.UPDATE_PROFILE}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted/60">
              {UI_TEXT.USER_MANAGEMENT.UPDATE_INFO}
            </span>
          </div>
        </div>
      ),
      onClick: () => handleEdit('edit'),
    },
    {
      key: 'reset',
      label: (
        <div className="flex items-center gap-4 py-1.5 pr-8">
          <div className="rounded-xl bg-emerald-50/50 p-2.5">
            <LockKeyhole className="size-4 text-emerald-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-tight text-text">
              {UI_TEXT.USER_MANAGEMENT.RESET_PASSWORD}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted/60">
              {UI_TEXT.USER_MANAGEMENT.ACCOUNT_SECURITY}
            </span>
          </div>
        </div>
      ),
      onClick: () => handleEdit('reset'),
    },
    {
      type: 'divider',
    },
    {
      key: 'delete',
      danger: true,
      label: (
        <div className="flex items-center gap-4 py-1.5 pr-8">
          <div className="rounded-xl bg-rose-50/50 p-2.5">
            <Trash2 className="size-4 text-rose-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-tight text-rose-600">
              {UI_TEXT.USER_MANAGEMENT.DELETE_TITLE}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400">
              {UI_TEXT.USER_MANAGEMENT.LOSS_ACCESS_HINT}
            </span>
          </div>
        </div>
      ),
      onClick: () => handleEdit('delete'),
    },
  ];

  return (
    <>
      <Dropdown
        menu={{ items: menuItems }}
        trigger={['click']}
        placement="bottomRight"
        classNames={{ root: 'premium-dropdown' }}
      >
        <Button
          size="icon"
          variant="ghost"
          className="h-10 w-10 rounded-2xl text-muted transition-all hover:bg-white hover:shadow-xl active:scale-95 border border-transparent hover:border-gray-100"
        >
          <List className="size-5" />
        </Button>
      </Dropdown>

      <UserManagementUpdateModal
        open={open.isOpen && open.modal === 'edit'}
        onToggle={() => handleEdit(null)}
        userId={selectedUser?.userId}
      />

      <UserManagementResetPasswordModal
        open={open.isOpen && open.modal === 'reset'}
        onToggle={() => handleEdit(null)}
        userId={selectedUser?.userId || ''}
        email={selectedUser?.email}
      />

      <UserManagementDeleteModal
        open={open.isOpen && open.modal === 'delete'}
        onToggle={() => handleEdit(null)}
        userId={selectedUser?.userId || ''}
        label={selectedUser?.fullName || selectedUser?.email}
      />
    </>
  );
}

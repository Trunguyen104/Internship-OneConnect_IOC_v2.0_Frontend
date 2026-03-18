'use client';

import { List, LockKeyhole, Trash2, UserPen } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UI_TEXT } from '@/lib/UI_Text';

import AdminUserDeleteModal from './modal/AdminUserDeleteModal';
import AdminUserUpdateModal from './modal/AdminUserUpdateModal';
import AdminUserResetPasswordModal from './modal/AdminUserResetPasswordModal';

export default function AdminUsersAction({ user }) {
  const [open, setOpen] = useState({ isOpen: false, modal: null });
  const [selectedUser, setSelectedUser] = useState(null);

  const handleEdit = (newModal) => {
    setSelectedUser(user);
    setOpen((prev) => ({
      isOpen: prev.isOpen ? false : true,
      modal: newModal,
    }));
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size='icon'
            variant='ghost'
            className='h-8 w-8 rounded-lg text-slate-400 transition-colors hover:bg-slate-200/50 hover:text-slate-600'
          >
            <List className='size-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56 rounded-2xl border-slate-100 p-1.5 shadow-2xl' align='end' sideOffset={8}>
          <DropdownMenuItem onClick={() => handleEdit('edit')} className='rounded-xl p-2.5'>
            <div className='rounded-lg bg-blue-50 p-2'>
              <UserPen className='size-4 text-blue-600' />
            </div>
            <div className='flex flex-col'>
              <span>{UI_TEXT.ADMIN_USERS.UPDATE_PROFILE}</span>
              <span className='text-xs text-slate-400'>{UI_TEXT.ADMIN_USERS.UPDATE_INFO}</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => handleEdit('reset')} className='rounded-xl p-2.5'>
            <div className='rounded-lg bg-emerald-50 p-2'>
              <LockKeyhole className='size-4 text-emerald-600' />
            </div>
            <div className='flex flex-col'>
              <span className='text-sm font-semibold'>{UI_TEXT.ADMIN_USERS.RESET_PASSWORD}</span>
              <span className='text-[10px] uppercase tracking-tight text-slate-400'>{UI_TEXT.ADMIN_USERS.ACCOUNT_SECURITY}</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator className='my-1.5 mx-2' />

          <DropdownMenuItem variant='destructive' onClick={() => handleEdit('delete')} className='rounded-xl p-2.5'>
            <div className='rounded-lg bg-rose-50 p-2'>
              <Trash2 className='size-4 text-rose-600' />
            </div>
            <div className='flex flex-col'>
              <span className='text-sm font-semibold'>{UI_TEXT.ADMIN_USERS.DELETE}</span>
              <span className='text-[10px] uppercase tracking-tight text-rose-400'>{UI_TEXT.ADMIN_USERS.REMOVE_FROM_SYSTEM}</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AdminUserUpdateModal
        open={open.isOpen && open.modal === 'edit'}
        onToggle={() => handleEdit(null)}
        userId={selectedUser?.userId}
      />

      <AdminUserResetPasswordModal
        open={open.isOpen && open.modal === 'reset'}
        onToggle={() => handleEdit(null)}
        userId={selectedUser?.userId || ''}
        email={selectedUser?.email}
      />

      <AdminUserDeleteModal
        open={open.isOpen && open.modal === 'delete'}
        onToggle={() => handleEdit(null)}
        userId={selectedUser?.userId || ''}
        label={selectedUser?.fullName || selectedUser?.email}
      />
    </>
  );
}


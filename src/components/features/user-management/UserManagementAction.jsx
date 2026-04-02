'use client';

import { Drawer, Dropdown } from 'antd';
import { AlertTriangle, LockKeyhole, MoreVertical, Trash2, UserPen } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { UI_TEXT } from '@/lib/UI_Text';
import { useToast } from '@/providers/ToastProvider';
import { userManagementService } from '@/services/user-management.service';
import { useAdminUsersStore } from '@/store/useAdminUsersStore';

import UserManagementDialog from './UserManagementDialog';

/**
 * Inline Action Components to reduce file fluff.
 */

function ResetPasswordDrawer({ open, userId, email, onClose }) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (open) {
      setReason('');
      setBusy(false);
    }
  }, [open]);

  const doReset = async () => {
    if (!userId) return;
    const trimmed = reason.trim();
    if (trimmed.length < 10) return toast.error(UI_TEXT.USER_MANAGEMENT.REASON_SHORT);
    setBusy(true);
    try {
      await userManagementService.resetPassword(userId, trimmed);
      toast.success(UI_TEXT.USER_MANAGEMENT.RESET_SUCCESS);
      useAdminUsersStore.increment();
      onClose();
    } catch (err) {
      toast.error(err?.message || UI_TEXT.USER_MANAGEMENT.RESET_FAILED);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Drawer
      title={
        <div className="flex flex-col gap-1">
          <span className="text-lg font-black tracking-tight text-text">
            {UI_TEXT.USER_MANAGEMENT.RESET_PASSWORD}
          </span>
          <span className="text-xs font-medium text-slate-400">
            {UI_TEXT.USER_MANAGEMENT.RESET_SUBTITLE}
          </span>
        </div>
      }
      open={open}
      onClose={onClose}
      width={480}
      headerStyle={{ borderBottom: '1px solid var(--slate-100, #f1f5f9)', padding: '24px' }}
      bodyStyle={{ padding: '24px' }}
      footer={
        <div className="flex justify-end gap-3 border-t border-gray-50 p-6 bg-white">
          <Button
            variant="ghost"
            className="rounded-full h-11 px-6 font-bold text-muted/60 hover:text-text transition-colors"
            onClick={onClose}
          >
            {UI_TEXT.BUTTON.CANCEL || UI_TEXT.COMMON.CANCEL}
          </Button>
          <Button
            onClick={doReset}
            disabled={busy}
            className="bg-primary hover:bg-primary/90 min-w-[140px] rounded-full h-11 font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-105 active:scale-95 transition-all text-white"
          >
            {busy ? <Spinner className="mr-2 h-4 w-4" /> : UI_TEXT.USER_MANAGEMENT.RESET_PASSWORD}
          </Button>
        </div>
      }
      destroyOnClose
    >
      <div className="space-y-6 flex flex-col h-full">
        <div className="flex flex-col gap-2 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
          <span className="text-[11px] font-black uppercase tracking-widest text-muted/60">
            {UI_TEXT.USER_MANAGEMENT.TARGET_ACCOUNT}
          </span>
          <span className="text-sm font-bold text-slate-800">{email || UI_TEXT.COMMON.MINUS}</span>
        </div>

        <div className="space-y-3 flex-1">
          <label className="text-[11px] font-black uppercase tracking-widest text-muted/60 ml-1">
            {UI_TEXT.USER_MANAGEMENT.REASON}
          </label>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={UI_TEXT.USER_MANAGEMENT.REASON_DESCRIPTION}
            className="min-h-[160px] rounded-2xl bg-gray-50/30 border-gray-100 focus:bg-white transition-colors p-4 text-sm resize-none"
          />
          <p className="text-[11px] font-medium text-slate-400 ml-1">
            {UI_TEXT.USER_MANAGEMENT.REASON_HINT}
          </p>
        </div>
      </div>
    </Drawer>
  );
}

function DeleteDrawer({ open, userId, label, onClose }) {
  const toast = useToast();
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      setConfirmed(false);
      setBusy(false);
    }
  }, [open]);

  const doDelete = async () => {
    setBusy(true);
    try {
      await userManagementService.delete(userId);
      toast.success(UI_TEXT.COMMON.DELETE_SUCCESS);
      useAdminUsersStore.increment();
      onClose();
    } catch (err) {
      toast.error(err?.message || UI_TEXT.COMMON.ERROR);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Drawer
      title={
        <div className="flex flex-col gap-1">
          <span className="text-lg font-black tracking-tight text-rose-600">
            {UI_TEXT.USER_MANAGEMENT.DELETE_SURE || UI_TEXT.BUTTON.DELETE}
          </span>
          <span className="text-xs font-medium text-slate-400">
            {UI_TEXT.USER_MANAGEMENT.DELETE_IRREVERSIBLE}
          </span>
        </div>
      }
      open={open}
      onClose={onClose}
      width={480}
      headerStyle={{ borderBottom: '1px solid var(--slate-100, #f1f5f9)', padding: '24px' }}
      bodyStyle={{ padding: '24px' }}
      footer={
        <div className="flex justify-end gap-3 border-t border-gray-50 p-6 bg-white">
          <Button
            variant="ghost"
            className="rounded-full h-11 px-6 font-bold text-muted/60 hover:text-text transition-colors"
            onClick={onClose}
          >
            {UI_TEXT.BUTTON.CANCEL}
          </Button>
          <Button
            onClick={doDelete}
            disabled={!confirmed || busy}
            className="bg-rose-500 hover:bg-rose-600 min-w-[140px] rounded-full h-11 font-black uppercase tracking-widest shadow-lg shadow-rose-500/20 hover:shadow-xl hover:scale-105 active:scale-95 transition-all text-white disabled:opacity-50"
          >
            {busy ? <Spinner className="mr-2 h-4 w-4" /> : UI_TEXT.BUTTON.DELETE}
          </Button>
        </div>
      }
      destroyOnClose
    >
      <div className="space-y-6 flex flex-col h-full">
        <div className="flex flex-col gap-2 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
          <span className="text-[11px] font-black uppercase tracking-widest text-muted/60">
            {UI_TEXT.USER_MANAGEMENT.USER}
          </span>
          <span className="text-sm font-bold text-slate-800">{label || UI_TEXT.COMMON.MINUS}</span>
        </div>

        <div className="rounded-2xl border border-rose-100 bg-rose-50/30 p-4 text-[13px] font-medium leading-relaxed text-rose-900/80 flex gap-3">
          <AlertTriangle className="size-5 text-rose-500 shrink-0 mt-0.5" />
          <span>
            {UI_TEXT.USER_MANAGEMENT.DELETE_CONFIRM}{' '}
            <span className="font-black text-rose-600">{label}</span>
            {UI_TEXT.COMMON.QUESTION}
          </span>
        </div>

        <div className="flex-1" />

        <div
          className={`group flex cursor-pointer items-start gap-4 p-4 rounded-2xl border transition-all duration-300 ${confirmed ? 'border-rose-200 bg-rose-50/50 shadow-sm' : 'border-gray-100 bg-gray-50/50 hover:bg-white'}`}
          onClick={() => setConfirmed(!confirmed)}
        >
          <div className="mt-0.5">
            <Checkbox checked={confirmed} onCheckedChange={setConfirmed} />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[13px] font-black tracking-tight text-text">
              {UI_TEXT.USER_MANAGEMENT.CONFIRM_ACCOUNT_DELETE}
            </span>
            <p className="text-[11px] font-medium leading-relaxed text-muted/60">
              {UI_TEXT.USER_MANAGEMENT.CONFIRM_DELETE_TEXT}
            </p>
          </div>
        </div>
      </div>
    </Drawer>
  );
}

export default function UserManagementAction({ user, currentUserId }) {
  const [open, setOpen] = useState({ isOpen: false, modal: null });

  const closeAll = () => setOpen({ isOpen: false, modal: null });

  const targetUserId = user?.userId || user?.UserId;
  const isSelf = !!(
    currentUserId &&
    targetUserId &&
    String(targetUserId) === String(currentUserId)
  );

  const menuItems = [
    {
      key: 'edit',
      label: (
        <div className="flex items-center gap-4 pr-8">
          <div className="rounded-xl bg-blue-50/50 p-2.5">
            <UserPen className="size-4 text-blue-600" />
          </div>
          <span className="text-sm font-black tracking-tight">
            {UI_TEXT.USER_MANAGEMENT.UPDATE_PROFILE}
          </span>
        </div>
      ),
      onClick: () => setOpen({ isOpen: true, modal: 'edit' }),
    },
    {
      key: 'reset',
      label: (
        <div className="flex items-center gap-4 pr-8">
          <div className="rounded-xl bg-emerald-50/50 p-2.5">
            <LockKeyhole className="size-4 text-emerald-600" />
          </div>
          <span className="text-sm font-black tracking-tight">
            {UI_TEXT.USER_MANAGEMENT.RESET_PASSWORD}
          </span>
        </div>
      ),
      onClick: () => setOpen({ isOpen: true, modal: 'reset' }),
    },
    { type: 'divider' },
    ...(isSelf
      ? []
      : [
          {
            key: 'delete',
            label: (
              <div className="flex items-center gap-4 pr-8">
                <div className="rounded-xl bg-rose-50/50 p-2.5">
                  <Trash2 className="size-4 text-rose-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black tracking-tight text-rose-600">
                    {UI_TEXT.BUTTON.DELETE}
                  </span>
                </div>
              </div>
            ),
            onClick: () => setOpen({ isOpen: true, modal: 'delete' }),
          },
        ]),
  ];

  return (
    <>
      <Dropdown
        menu={{ items: menuItems }}
        trigger={['click']}
        placement="bottomRight"
        classNames={{ root: 'premium-dropdown' }}
      >
        <button className="flex h-8 w-8 items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
          <MoreVertical className="size-4" />
        </button>
      </Dropdown>

      <UserManagementDialog
        open={open.isOpen && open.modal === 'edit'}
        onOpenChange={closeAll}
        userId={user?.userId || user?.UserId}
        controlled
      />
      <ResetPasswordDrawer
        open={open.isOpen && open.modal === 'reset'}
        onClose={closeAll}
        userId={user?.userId || user?.UserId}
        email={user?.email || user?.Email}
      />
      <DeleteDrawer
        open={open.isOpen && open.modal === 'delete'}
        onClose={closeAll}
        userId={user?.userId || user?.UserId}
        label={user?.fullName || user?.FullName || user?.email || user?.Email}
      />
    </>
  );
}

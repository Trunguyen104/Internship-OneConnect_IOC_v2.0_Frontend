'use client';

import { Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import CompoundModal from '@/components/ui/compoundmodal';
import { UI_TEXT } from '@/lib/UI_Text';
import { useToast } from '@/providers/ToastProvider';
import { useAdminUsersStore } from '@/store/useAdminUsersStore';

import { userManagementService } from '../user-management.service';

export default function UserManagementDeleteModal({ open, userId, label, onToggle }) {
  const toast = useToast();
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      setConfirmed(false);
      setBusy(false);
    }
  }, [open]);

  const doDelete = async (e) => {
    e.preventDefault();
    if (!confirmed) {
      toast.error('Please confirm delete.');
      return;
    }
    if (!userId) return;

    setBusy(true);
    try {
      await userManagementService.delete(userId);
      toast.success('Deleted user');
      useAdminUsersStore.increment();
      onToggle?.(false);
    } catch (err) {
      toast.error(err?.data?.message || err?.message || 'Delete failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <CompoundModal open={open} onCancel={() => onToggle?.(false)} width={400}>
      <CompoundModal.Header
        icon={<Trash2 className="size-5" />}
        title={UI_TEXT.USER_MANAGEMENT.DELETE}
        subtitle={UI_TEXT.USER_MANAGEMENT.DELETE_HINT}
        type="danger"
      />

      <CompoundModal.Content className="space-y-6">
        <div className="rounded-2xl border border-rose-100 bg-rose-50/30 p-4 text-[13px] font-medium leading-relaxed text-rose-900/80">
          {UI_TEXT.USER_MANAGEMENT.DELETE_BTN}{' '}
          <span className="font-black text-rose-600">{label || UI_TEXT.COMMON.MINUS}</span>
          {UI_TEXT.COMMON.QUESTION}
        </div>

        <div
          className={`group flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all duration-300 ${confirmed ? 'border-rose-200 bg-rose-50/50 shadow-sm' : 'border-gray-100 bg-gray-50/50 hover:bg-white'}`}
          onClick={() => setConfirmed(!confirmed)}
        >
          <div className="mt-0.5">
            <Checkbox checked={confirmed} onCheckedChange={setConfirmed} />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[13px] font-black tracking-tight text-text">
              {UI_TEXT.USER_MANAGEMENT.CONFIRM_DELETE}
            </span>
            <p className="text-[11px] font-medium leading-relaxed text-muted/60">
              {UI_TEXT.USER_MANAGEMENT.LOSS_ACCESS_HINT}
            </p>
          </div>
        </div>
      </CompoundModal.Content>

      <CompoundModal.Footer
        onCancel={() => onToggle?.(false)}
        onConfirm={doDelete}
        confirmText={UI_TEXT.BUTTON.DELETE}
        loading={busy}
        danger
        disabled={!confirmed}
      />
    </CompoundModal>
  );
}

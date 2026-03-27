'use client';

import React, { useEffect, useState } from 'react';

import CompoundModal from '@/components/ui/compoundmodal';
import { Textarea } from '@/components/ui/textarea';
import { UI_TEXT } from '@/lib/UI_Text';
import { useToast } from '@/providers/ToastProvider';
import { useAdminUsersStore } from '@/store/useAdminUsersStore';

import { userManagementService } from '../user-management.service';

export default function UserManagementResetPasswordModal({ open, userId, email, onToggle }) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (open) setReason('');
  }, [open]);

  const doReset = async (e) => {
    e.preventDefault();
    if (!userId) return;
    const trimmed = reason.trim();
    if (trimmed.length < 10) {
      toast.error('Reason must be at least 10 characters');
      return;
    }
    if (trimmed.length > 500) {
      toast.error('Reason must be at most 500 characters');
      return;
    }

    setBusy(true);
    try {
      await userManagementService.resetPassword(userId, trimmed);
      toast.success('Password reset email queued');
      useAdminUsersStore.increment();
      onToggle?.(false);
    } catch (err) {
      toast.error(err?.data?.message || err?.message || 'Reset password failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <CompoundModal open={open} onCancel={() => onToggle?.(false)} width={420}>
      <CompoundModal.Header
        title={UI_TEXT.USER_MANAGEMENT.RESET_PASSWORD}
        subtitle={UI_TEXT.USER_MANAGEMENT.ACCOUNT_SECURITY}
      />

      <CompoundModal.Content className="space-y-6">
        <CompoundModal.InfoBox
          label={UI_TEXT.USER_MANAGEMENT.TARGET}
          value={email || UI_TEXT.COMMON.MINUS}
        />

        <div className="space-y-2">
          <label
            htmlFor="reason"
            className="text-[11px] font-black uppercase tracking-widest text-muted/60"
          >
            {UI_TEXT.USER_MANAGEMENT.REASON}
          </label>
          <Textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason (10..500 chars)"
            className="min-h-[120px] rounded-2xl border-gray-100 bg-gray-50/50 p-4 transition-all focus:border-primary/30 focus:bg-white"
          />
        </div>
      </CompoundModal.Content>

      <CompoundModal.Footer
        onCancel={() => onToggle?.(false)}
        onConfirm={doReset}
        confirmText={UI_TEXT.USER_MANAGEMENT.RESET_PASSWORD}
        loading={busy}
      />
    </CompoundModal>
  );
}

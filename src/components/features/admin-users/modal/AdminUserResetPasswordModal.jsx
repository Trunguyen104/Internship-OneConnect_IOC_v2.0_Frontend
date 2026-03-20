'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { UI_TEXT } from '@/lib/UI_Text';
import { useToast } from '@/providers/ToastProvider';
import { useAdminUsersStore } from '@/store/useAdminUsersStore';

import { adminUsersService } from '../adminUsers.service';

export default function AdminUserResetPasswordModal({ open, userId, email, onToggle }) {
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
      await adminUsersService.resetPassword(userId, trimmed);
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
    <Dialog open={open} onOpenChange={onToggle}>
      <DialogContent aria-describedby={undefined} className="sm:max-w-sm">
        <form onSubmit={doReset}>
          <DialogHeader>
            <DialogTitle>{UI_TEXT.ADMIN_USERS.RESET_PASSWORD}</DialogTitle>
            <DialogDescription>{UI_TEXT.ADMIN_USERS.ACCOUNT_SECURITY}</DialogDescription>
          </DialogHeader>

          <FieldGroup className="mt-4 gap-4">
            <Field>
              <FieldLabel>{UI_TEXT.ADMIN_USERS.TARGET}</FieldLabel>
              <div className="rounded-md border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                {email || UI_TEXT.COMMON.MINUS}
              </div>
            </Field>

            <Field>
              <FieldLabel htmlFor="reason">{UI_TEXT.ADMIN_USERS.REASON}</FieldLabel>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason (10..500 chars)"
              />
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                {UI_TEXT.BUTTON.CLOSE}
              </Button>
            </DialogClose>
            <Button type="submit" disabled={busy}>
              {UI_TEXT.ADMIN_USERS.RESET_PASSWORD}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

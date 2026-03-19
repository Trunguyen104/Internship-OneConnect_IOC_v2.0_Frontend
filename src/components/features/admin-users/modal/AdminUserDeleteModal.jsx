'use client';

import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field } from '@/components/ui/field';
import { UI_TEXT } from '@/lib/UI_Text';
import { useToast } from '@/providers/ToastProvider';
import { useAdminUsersStore } from '@/store/useAdminUsersStore';

import { adminUsersService } from '../adminUsers.service';

export default function AdminUserDeleteModal({ open, userId, label, onToggle }) {
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
      await adminUsersService.delete(userId);
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
    <Dialog open={open} onOpenChange={onToggle}>
      <DialogContent aria-describedby={undefined} className='sm:max-w-sm'>
        <form onSubmit={doDelete}>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2 text-xl font-bold'>
              <Trash2 className='h-6 w-6 text-rose-600' />
              {UI_TEXT.ADMIN_USERS.DELETE}
            </DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>

          <div className='mt-4 space-y-3'>
            <div className='text-sm text-slate-700'>
              Delete <b>{label || '-'}</b>?
            </div>

            <Field orientation='horizontal' className='gap-3'>
              <Checkbox checked={confirmed} onCheckedChange={setConfirmed} />
              <div className='space-y-1'>
                <span className='text-sm font-semibold'>Confirm delete</span>
                <p className='text-xs text-slate-500'>User will lose access to the system.</p>
              </div>
            </Field>
          </div>

          <DialogFooter className='mt-4'>
            <DialogClose asChild>
              <Button type='button' variant='outline'>
                {UI_TEXT.BUTTON.CLOSE}
              </Button>
            </DialogClose>
            <Button type='submit' disabled={busy || !confirmed} variant='destructive'>
              {UI_TEXT.BUTTON.DELETE}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

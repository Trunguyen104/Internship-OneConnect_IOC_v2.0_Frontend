'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UI_TEXT } from '@/lib/UI_Text';

import AdminUsersForm from './AdminUsersForm';

export default function AdminUsersDialog({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  controlled = false,
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlled ? controlledOpen : internalOpen;
  const setOpen = controlled ? setControlledOpen : setInternalOpen;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!controlled && (
        <DialogTrigger asChild>
          <Button className='bg-primary hover:bg-primary-hover ml-auto flex shrink-0 cursor-pointer items-center gap-2 rounded-full px-5 py-2 text-sm font-medium text-white shadow-sm transition-all active:scale-95'>
            <span>{UI_TEXT.ADMIN_USERS.ADD}</span>
            <Plus className='size-4' />
          </Button>
        </DialogTrigger>
      )}

      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className='text-center text-xl font-semibold md:text-3xl'>
            {UI_TEXT.ADMIN_USERS.ADD}
          </DialogTitle>
        </DialogHeader>
        <AdminUsersForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}


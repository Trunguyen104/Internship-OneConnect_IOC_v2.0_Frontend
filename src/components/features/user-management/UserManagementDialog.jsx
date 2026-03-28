'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import CompoundModal from '@/components/ui/CompoundModal';
import { UI_TEXT } from '@/lib/UI_Text';

import UserManagementForm from './UserManagementForm';

export default function UserManagementDialog({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  controlled = false,
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlled ? controlledOpen : internalOpen;
  const setOpen = controlled ? setControlledOpen : setInternalOpen;

  return (
    <>
      {!controlled ? (
        <Button
          onClick={() => setOpen(true)}
          className="bg-primary hover:bg-primary-hover ml-auto flex shrink-0 cursor-pointer items-center gap-2 rounded-full px-5 py-2 text-sm font-medium text-white shadow-sm transition-all active:scale-95"
        >
          <span>{UI_TEXT.USER_MANAGEMENT.ADD}</span>
          <Plus className="size-4" />
        </Button>
      ) : null}

      <CompoundModal open={open} onCancel={() => setOpen(false)} width={560}>
        <CompoundModal.Header
          title={UI_TEXT.USER_MANAGEMENT.ADD}
          subtitle={UI_TEXT.USER_MANAGEMENT.CREATE_DESCRIPTION}
        />

        <CompoundModal.Content className="mt-4 overflow-y-auto pb-8">
          <UserManagementForm onSuccess={() => setOpen(false)} onCancel={() => setOpen(false)} />
        </CompoundModal.Content>
      </CompoundModal>
    </>
  );
}

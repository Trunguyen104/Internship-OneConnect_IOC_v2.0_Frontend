'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
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

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="flex flex-col p-4 sm:max-w-[560px]">
          <SheetHeader className="mt-2 text-center">
            <SheetTitle className="text-3xl">{UI_TEXT.USER_MANAGEMENT.ADD}</SheetTitle>
            <SheetDescription>{UI_TEXT.USER_MANAGEMENT.CREATE_DESCRIPTION}</SheetDescription>
          </SheetHeader>

          <div className="mt-4 min-h-0 flex-1 overflow-y-auto pb-8">
            <UserManagementForm onSuccess={() => setOpen(false)} onCancel={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

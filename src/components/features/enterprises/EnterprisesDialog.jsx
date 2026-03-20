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

import EnterprisesForm from './EnterprisesForm';

export default function EnterprisesDialog({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  controlled = false,
  enterprise = null,
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlled ? controlledOpen : internalOpen;
  const setOpen = controlled ? setControlledOpen : setInternalOpen;
  const isEdit = !!enterprise;

  return (
    <>
      {!controlled ? (
        <Button
          onClick={() => setOpen(true)}
          className="group flex h-12 items-center justify-center gap-2 rounded-full border-none bg-slate-900 px-8 font-bold text-white shadow-xl shadow-slate-200/50 transition-all outline-none hover:bg-slate-800 hover:shadow-slate-300/60 active:scale-95"
        >
          <div className="rounded-full bg-white/10 p-1.5 transition-transform duration-500 group-hover:rotate-180">
            <Plus className="h-4 w-4 text-white" />
          </div>
          Onboard Enterprise
        </Button>
      ) : null}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="flex flex-col p-4 sm:max-w-[640px]">
          <SheetHeader className="mt-2 text-center">
            <SheetTitle className="text-3xl">
              {isEdit ? 'Update Enterprise' : 'Create Enterprise'}
            </SheetTitle>
            <SheetDescription>
              {isEdit
                ? `Editing enterprise profile for ${enterprise?.name || 'enterprise'}.`
                : 'Create a new enterprise account and metadata.'}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-4 min-h-0 flex-1 overflow-y-auto pb-8">
            <EnterprisesForm
              enterprise={enterprise}
              onSuccess={() => setOpen(false)}
              onCancel={() => setOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

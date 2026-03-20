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

import UniversitiesForm from './UniversitiesForm';

export default function UniversitiesDialog({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  controlled = false,
  university = null,
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlled ? controlledOpen : internalOpen;
  const setOpen = controlled ? setControlledOpen : setInternalOpen;
  const isEdit = !!university;

  return (
    <>
      {!controlled ? (
        <Button
          onClick={() => setOpen(true)}
          className="bg-primary group flex h-11 items-center justify-center gap-2 rounded-full px-6 font-semibold text-white shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-600 hover:shadow-indigo-200 active:scale-95"
        >
          <div className="rounded-full bg-white/20 p-1 transition-transform duration-300 group-hover:rotate-90">
            <Plus className="h-4 w-4 text-white" />
          </div>
          Create University
        </Button>
      ) : null}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="flex flex-col p-4 sm:max-w-[560px]">
          <SheetHeader className="mt-2 text-center">
            <SheetTitle className="text-3xl">
              {isEdit ? 'Update University' : 'Create University'}
            </SheetTitle>
            <SheetDescription>
              {isEdit
                ? `Editing university profile for ${university?.name || 'university'}.`
                : 'Add a new educational partner to the ecosystem.'}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-4 min-h-0 flex-1 overflow-y-auto pb-8">
            <UniversitiesForm
              university={university}
              onSuccess={() => setOpen(false)}
              onCancel={() => setOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

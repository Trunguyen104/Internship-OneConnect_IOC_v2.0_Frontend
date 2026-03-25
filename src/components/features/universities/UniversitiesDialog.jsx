'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import CompoundModal from '@/components/ui/CompoundModal';
import { UI_TEXT } from '@/lib/UI_Text';

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
          className="bg-primary group flex h-11 items-center justify-center gap-2 rounded-full px-6 font-semibold text-white shadow-lg transition-all active:scale-95"
        >
          <Plus className="size-4" />
          {UI_TEXT.UNIVERSITIES.CREATE}
        </Button>
      ) : null}

      <CompoundModal open={open} onCancel={() => setOpen(false)} width={560}>
        <CompoundModal.Header
          title={isEdit ? UI_TEXT.UNIVERSITIES.UPDATE : UI_TEXT.UNIVERSITIES.CREATE}
          subtitle={
            isEdit
              ? `Editing profile for ${university?.name || 'university'}.`
              : 'Add a new educational partner to the ecosystem.'
          }
        />

        <CompoundModal.Content className="pt-4">
          <UniversitiesForm
            university={university}
            onSuccess={() => setOpen(false)}
            onCancel={() => setOpen(false)}
          />
        </CompoundModal.Content>
      </CompoundModal>
    </>
  );
}

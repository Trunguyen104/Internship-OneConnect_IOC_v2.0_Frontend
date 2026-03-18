'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { CardDescription } from '@/components/ui/Card';
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
    <Dialog open={open} onOpenChange={setOpen}>
      {!controlled && (
        <DialogTrigger asChild>
          <Button
            className='h-11 rounded-full bg-primary font-semibold text-white shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-600 hover:shadow-indigo-200 active:scale-95 px-6 flex items-center justify-center gap-2 group'
          >
            <div className='bg-white/20 p-1 rounded-full group-hover:rotate-90 transition-transform duration-300'>
              <Plus className='h-4 w-4 text-white' />
            </div>
            Create University
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className='max-w-2xl bg-white border border-slate-100 shadow-2xl rounded-3xl p-8 gap-0 overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-indigo-50/20 via-white to-white pointer-events-none' />
        <div className='relative z-10'>
          <DialogHeader className='flex flex-col gap-2 mb-8'>
            <DialogTitle className='text-2xl font-bold tracking-tight text-slate-900'>
              {isEdit ? 'Update University Profile' : 'Add New Educational Partner'}
            </DialogTitle>
            <DialogDescription className='text-slate-500 font-medium'>
              {isEdit
                ? `Modifying information for ${university.name}. Please ensure all details are verified.`
                : 'Input official information for the new university. This will allow students from this institution to join the platform.'}
            </DialogDescription>
          </DialogHeader>
          <UniversitiesForm
            university={university}
            onSuccess={() => setOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

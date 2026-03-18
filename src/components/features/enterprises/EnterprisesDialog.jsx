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
    <Dialog open={open} onOpenChange={setOpen}>
      {!controlled && (
        <DialogTrigger asChild>
          <Button
            className='h-12 rounded-full bg-slate-900 font-bold text-white shadow-xl shadow-slate-200/50 transition-all hover:bg-slate-800 hover:shadow-slate-300/60 active:scale-95 px-8 flex items-center justify-center gap-2 group border-none outline-none'
          >
            <div className='bg-white/10 p-1.5 rounded-full group-hover:rotate-180 transition-transform duration-500'>
              <Plus className='h-4 w-4 text-white' />
            </div>
            Onboard Enterprise
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className='max-w-3xl bg-white border border-slate-100 shadow-2xl rounded-[3rem] p-10 gap-0 overflow-hidden outline-none'>
        <div className='absolute inset-0 bg-gradient-to-tr from-slate-50/20 via-white to-white pointer-events-none' />
        <div className='relative z-10'>
          <DialogHeader className='flex flex-col gap-2 mb-10'>
            <DialogTitle className='text-3xl font-black tracking-tight text-slate-900'>
              {isEdit ? 'Elevate Enterprise Meta-Data' : 'Strategic Partnership Initialization'}
            </DialogTitle>
            <DialogDescription className='text-slate-500 font-bold text-lg leading-relaxed'>
              {isEdit
                ? `Redefining organizational identity for ${enterprise.name}. Ensure accuracy for internship alignment.`
                : 'Establish a new corporate entity within the ecosystem to enable internship placements and HR connectivity.'}
            </DialogDescription>
          </DialogHeader>
          <EnterprisesForm
            enterprise={enterprise}
            onSuccess={() => setOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

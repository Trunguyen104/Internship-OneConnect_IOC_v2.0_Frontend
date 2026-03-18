'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { UI_TEXT } from '@/lib/UI_Text';
import { useToast } from '@/providers/ToastProvider';
import { useUniversitiesStore } from '@/store/useUniversitiesStore';
import { universityService } from '@/services/university.service';
import LogoUploader from '@/components/ui/LogoUploader';

export default function UniversitiesForm({ university, onSuccess }) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [logoUrl, setLogoUrl] = useState(university?.logoUrl || '');
  const isEdit = !!university;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: String(formData.get('name') || '').trim(),
      code: String(formData.get('code') || '').trim(),
      address: String(formData.get('address') || '').trim(),
      logoUrl: logoUrl.trim() || undefined,
    };

    if (!payload.name || !payload.code) {
      setError('Name and Code are required');
      setLoading(false);
      return;
    }

    try {
      setError('');
      if (isEdit) {
        await universityService.update(university.universityId, { ...payload, universityId: university.universityId });
        toast.success(`Updated ${payload.name}`);
      } else {
        await universityService.create(payload);
        toast.success(`Created ${payload.name}`);
      }
      useUniversitiesStore.increment();
      onSuccess?.();
    } catch (err) {
      setError(err?.data?.message || err?.message || 'Submit failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-6 max-w-2xl mx-auto'>
      <div className='flex justify-center mb-6'>
        <LogoUploader 
          value={logoUrl} 
          onChange={setLogoUrl} 
          size={160} 
          label="University Logo" 
          folder="Universities"
        />
      </div>

      <FieldGroup className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <Field className='md:col-span-2'>
          <FieldLabel htmlFor='name'>University Name</FieldLabel>
          <Input id='name' name='name' defaultValue={university?.name} required placeholder='Enter official name' className='rounded-xl h-12 shadow-inner border-slate-200 focus:ring-primary/20' />
        </Field>

        <Field>
          <FieldLabel htmlFor='code'>University Code</FieldLabel>
          <Input id='code' name='code' defaultValue={university?.code} required placeholder='EX: BK-HN' className='rounded-xl h-11 border-slate-200' />
        </Field>

        <Field className='md:col-span-2'>
          <FieldLabel htmlFor='address'>Address</FieldLabel>
          <Input id='address' name='address' defaultValue={university?.address} required placeholder='Enter headquarters address' className='rounded-xl h-11 border-slate-200' />
        </Field>
      </FieldGroup>

      {error && (
        <div className='rounded-xl bg-rose-50 p-4 text-center text-sm font-semibold text-rose-600 border border-rose-100 flex items-center justify-center gap-2'>
          <div className='h-2 w-2 rounded-full bg-rose-600 animate-pulse' />
          {error}
        </div>
      )}

      <div className='flex justify-end gap-3 pt-6 border-t border-slate-100'>
        <DialogClose asChild>
          <Button type='button' variant='ghost' className='rounded-full h-11 px-6 font-semibold bg-slate-50 hover:bg-slate-100 text-slate-500'>
            Cancel
          </Button>
        </DialogClose>
        <Button type='submit' disabled={loading} className='min-w-[140px] rounded-full h-11 px-8 font-semibold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all active:scale-[0.98]'>
          {loading ? <Spinner className='mr-2' /> : isEdit ? 'Update Changes' : 'Create University'}
        </Button>
      </div>
    </form>
  );
}

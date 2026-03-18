'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/providers/ToastProvider';
import { useEnterprisesStore } from '@/store/useEnterprisesStore';
import { enterpriseService } from '@/services/enterprise.service';
import LogoUploader from '@/components/ui/LogoUploader';

export default function EnterprisesForm({ enterprise, onSuccess }) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [logoUrl, setLogoUrl] = useState(enterprise?.logoUrl || '');
  const [backgroundUrl, setBackgroundUrl] = useState(enterprise?.backgroundUrl || '');
  const isEdit = !!enterprise;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: String(formData.get('name') || '').trim(),
      taxCode: String(formData.get('taxCode') || '').trim() || undefined,
      industry: String(formData.get('industry') || '').trim() || undefined,
      description: String(formData.get('description') || '').trim() || undefined,
      address: String(formData.get('address') || '').trim() || undefined,
      website: String(formData.get('website') || '').trim() || undefined,
      logoUrl: logoUrl.trim() || undefined,
      backgroundUrl: backgroundUrl.trim() || undefined,
    };

    if (!payload.name) {
      setError('Enterprise name is required');
      setLoading(false);
      return;
    }

    try {
      setError('');
      if (isEdit) {
        await enterpriseService.update(enterprise.enterpriseId || enterprise.id, { ...payload, enterpriseId: enterprise.enterpriseId || enterprise.id });
        toast.success(`Updated ${payload.name}`);
      } else {
        await enterpriseService.create(payload);
        toast.success(`Created ${payload.name}`);
      }
      useEnterprisesStore.increment();
      onSuccess?.();
    } catch (err) {
      setError(err?.data?.message || err?.message || 'Form submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-6 pb-2 mx-auto max-w-2xl'>
      <div className='flex gap-6 justify-center items-end mb-4'>
        <div className='flex flex-col items-center gap-2'>
          <span className='text-[11px] font-bold uppercase tracking-widest text-slate-400'>Brand Logo</span>
          <LogoUploader 
            value={logoUrl} 
            onChange={setLogoUrl} 
            size={100} 
            label="Logo" 
            folder="Enterprises"
          />
        </div>
        <div className='flex flex-col items-center gap-2'>
          <span className='text-[11px] font-bold uppercase tracking-widest text-slate-400'>Cover Image</span>
          <LogoUploader 
            value={backgroundUrl} 
            onChange={setBackgroundUrl} 
            size={180} 
            label="Background" 
            folder="Enterprises/Backgrounds"
          />
        </div>
      </div>

      <FieldGroup className='grid grid-cols-1 gap-5 md:grid-cols-2'>
        <Field className='md:col-span-2'>
          <FieldLabel htmlFor='name'>Enterprise Name</FieldLabel>
          <Input id='name' name='name' defaultValue={enterprise?.name} required placeholder='Official commercial name' className='rounded-xl h-12 border-slate-200' />
        </Field>

        <Field>
          <FieldLabel htmlFor='taxCode'>Tax Identification Number</FieldLabel>
          <Input id='taxCode' name='taxCode' defaultValue={enterprise?.taxCode} placeholder='Tax Code' className='rounded-xl h-11 border-slate-200' />
        </Field>

        <Field>
          <FieldLabel htmlFor='industry'>Industry Section</FieldLabel>
          <Input id='industry' name='industry' defaultValue={enterprise?.industry} placeholder='E.g., Software Development' className='rounded-xl h-11 border-slate-200' />
        </Field>

        <Field className='md:col-span-2'>
          <FieldLabel htmlFor='description'>Company Description</FieldLabel>
          <Textarea id='description' name='description' defaultValue={enterprise?.description} placeholder='Brief company overview...' className='rounded-xl min-h-[100px] border-slate-200 resize-none' />
        </Field>

        <Field className='md:col-span-2'>
          <FieldLabel htmlFor='address'>Headquarters Address</FieldLabel>
          <Input id='address' name='address' defaultValue={enterprise?.address} placeholder='Full registered address' className='rounded-xl h-11 border-slate-200' />
        </Field>

        <Field className='md:col-span-2'>
          <FieldLabel htmlFor='website'>Corporate Website</FieldLabel>
          <Input id='website' name='website' defaultValue={enterprise?.website} placeholder='https://example.com' className='rounded-xl h-11 border-slate-200 text-primary' />
        </Field>
      </FieldGroup>

      {error && (
        <div className='rounded-xl bg-rose-50 p-4 border border-rose-100 text-center text-sm font-semibold text-rose-600 animate-in slide-in-from-top-1'>
          {error}
        </div>
      )}

      <div className='flex justify-end gap-3 pt-6 border-t border-slate-100 mt-2'>
        <DialogClose asChild>
          <Button type='button' variant='ghost' className='rounded-full h-11 px-8 bg-slate-50 text-slate-500 font-bold hover:bg-slate-100'>
            Cancel
          </Button>
        </DialogClose>
        <Button type='submit' disabled={loading} className='min-w-[160px] rounded-full h-11 px-8 font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all'>
          {loading ? <Spinner className='mr-2' /> : isEdit ? 'Save Changes' : 'Initialize Enterprise'}
        </Button>
      </div>
    </form>
  );
}

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/providers/ToastProvider';
import { useUniversitiesStore } from '@/store/useUniversitiesStore';
import { universityService } from '@/services/university.service';
import LogoUploader from '@/components/ui/logouploader';

export default function UniversitiesForm({ university, onSuccess, onCancel }) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
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
    };

    const nextErrors = {};
    if (!payload.name) nextErrors.name = 'University name is required';
    if (!payload.code) nextErrors.code = 'University code is required';
    if (!payload.address) nextErrors.address = 'Address is required';
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      setLoading(false);
      return;
    }

    try {
      setFormError('');
      if (isEdit) {
        await universityService.update(university.universityId, {
          ...payload,
          logoUrl: logoUrl.trim() || undefined,
          universityId: university.universityId,
        });
        toast.success(`Updated ${payload.name}`);
      } else {
        await universityService.create(payload);
        toast.success(`Created ${payload.name}`);
      }
      useUniversitiesStore.increment();
      onSuccess?.();
    } catch (err) {
      setFormError(err?.data?.message || err?.message || 'Submit failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='mx-auto flex max-w-2xl flex-col gap-6'>
      {isEdit && (
        <div className='mb-6 flex justify-center'>
          <LogoUploader
            value={logoUrl}
            onChange={setLogoUrl}
            size={160}
            label='University Logo'
            folder='Universities'
          />
        </div>
      )}

      <FieldGroup className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <Field className='md:col-span-2'>
          <FieldLabel htmlFor='name'>University Name</FieldLabel>
          <Input
            id='name'
            name='name'
            defaultValue={university?.name}
            required
            placeholder='Enter official name'
            className='focus:ring-primary/20 h-12 rounded-xl border-slate-200 shadow-inner'
            error={errors.name}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor='code'>University Code</FieldLabel>
          <Input
            id='code'
            name='code'
            defaultValue={university?.code}
            required
            placeholder='EX: BK-HN'
            className='h-11 rounded-xl border-slate-200'
            error={errors.code}
          />
        </Field>

        <Field className='md:col-span-2'>
          <FieldLabel htmlFor='address'>Address</FieldLabel>
          <Input
            id='address'
            name='address'
            defaultValue={university?.address}
            required
            placeholder='Enter headquarters address'
            className='h-11 rounded-xl border-slate-200'
            error={errors.address}
          />
        </Field>
      </FieldGroup>

      {formError && (
        <div className='flex items-center justify-center gap-2 rounded-xl border border-rose-100 bg-rose-50 p-4 text-center text-sm font-semibold text-rose-600'>
          <div className='h-2 w-2 animate-pulse rounded-full bg-rose-600' />
          {formError}
        </div>
      )}

      <div className='flex justify-end gap-3 border-t border-slate-100 pt-6'>
        <Button
          type='button'
          variant='ghost'
          className='h-11 rounded-full bg-slate-50 px-6 font-semibold text-slate-500 hover:bg-slate-100'
          onClick={() => onCancel?.()}
        >
          Cancel
        </Button>
        <Button
          type='submit'
          disabled={loading}
          className='bg-primary hover:bg-primary/90 shadow-primary/20 h-11 min-w-[140px] rounded-full px-8 font-semibold text-white shadow-lg transition-all active:scale-[0.98]'
        >
          {loading ? <Spinner className='mr-2' /> : isEdit ? 'Update Changes' : 'Create University'}
        </Button>
      </div>
    </form>
  );
}

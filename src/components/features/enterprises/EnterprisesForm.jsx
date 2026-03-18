'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/providers/ToastProvider';
import { useEnterprisesStore } from '@/store/useEnterprisesStore';
import { enterpriseService } from '@/services/enterprise.service';
import LogoUploader from '@/components/ui/logouploader';

export default function EnterprisesForm({ enterprise, onSuccess, onCancel }) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
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
    };

    const nextErrors = {};
    if (!payload.name) nextErrors.name = 'Enterprise name is required';
    if (payload.website && !/^https?:\/\/.+/i.test(payload.website))
      nextErrors.website = 'Website must start with http:// or https://';
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      setLoading(false);
      return;
    }

    try {
      setFormError('');
      if (isEdit) {
        await enterpriseService.update(enterprise.enterpriseId || enterprise.id, {
          ...payload,
          logoUrl: logoUrl.trim() || undefined,
          backgroundUrl: backgroundUrl.trim() || undefined,
          enterpriseId: enterprise.enterpriseId || enterprise.id,
        });
        toast.success(`Updated ${payload.name}`);
      } else {
        await enterpriseService.create(payload);
        toast.success(`Created ${payload.name}`);
      }
      useEnterprisesStore.increment();
      onSuccess?.();
    } catch (err) {
      setFormError(err?.data?.message || err?.message || 'Form submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='mx-auto flex max-w-2xl flex-col gap-6 pb-2'>
      {isEdit && (
        <div className='mb-4 flex items-end justify-center gap-6'>
          <div className='flex flex-col items-center gap-2'>
            <span className='text-[11px] font-bold tracking-widest text-slate-400 uppercase'>
              Brand Logo
            </span>
            <LogoUploader
              value={logoUrl}
              onChange={setLogoUrl}
              size={100}
              label='Logo'
              folder='Enterprises'
            />
          </div>
          <div className='flex flex-col items-center gap-2'>
            <span className='text-[11px] font-bold tracking-widest text-slate-400 uppercase'>
              Cover Image
            </span>
            <LogoUploader
              value={backgroundUrl}
              onChange={setBackgroundUrl}
              size={180}
              label='Background'
              folder='Enterprises/Backgrounds'
            />
          </div>
        </div>
      )}

      <FieldGroup className='grid grid-cols-1 gap-5 md:grid-cols-2'>
        <Field className='md:col-span-2'>
          <FieldLabel htmlFor='name'>Enterprise Name</FieldLabel>
          <Input
            id='name'
            name='name'
            defaultValue={enterprise?.name}
            required
            placeholder='Official commercial name'
            className='h-12 rounded-xl border-slate-200'
            error={errors.name}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor='taxCode'>Tax Identification Number</FieldLabel>
          <Input
            id='taxCode'
            name='taxCode'
            defaultValue={enterprise?.taxCode}
            placeholder='Tax Code'
            className='h-11 rounded-xl border-slate-200'
          />
        </Field>

        <Field>
          <FieldLabel htmlFor='industry'>Industry Section</FieldLabel>
          <Input
            id='industry'
            name='industry'
            defaultValue={enterprise?.industry}
            placeholder='E.g., Software Development'
            className='h-11 rounded-xl border-slate-200'
          />
        </Field>

        <Field className='md:col-span-2'>
          <FieldLabel htmlFor='description'>Company Description</FieldLabel>
          <Textarea
            id='description'
            name='description'
            defaultValue={enterprise?.description}
            placeholder='Brief company overview...'
            className='min-h-[100px] resize-none rounded-xl border-slate-200'
          />
        </Field>

        <Field className='md:col-span-2'>
          <FieldLabel htmlFor='address'>Headquarters Address</FieldLabel>
          <Input
            id='address'
            name='address'
            defaultValue={enterprise?.address}
            placeholder='Full registered address'
            className='h-11 rounded-xl border-slate-200'
          />
        </Field>

        <Field className='md:col-span-2'>
          <FieldLabel htmlFor='website'>Corporate Website</FieldLabel>
          <Input
            id='website'
            name='website'
            defaultValue={enterprise?.website}
            placeholder='https://example.com'
            className='text-primary h-11 rounded-xl border-slate-200'
            error={errors.website}
          />
        </Field>
      </FieldGroup>

      {formError && (
        <div className='animate-in slide-in-from-top-1 rounded-xl border border-rose-100 bg-rose-50 p-4 text-center text-sm font-semibold text-rose-600'>
          {formError}
        </div>
      )}

      <div className='mt-2 flex justify-end gap-3 border-t border-slate-100 pt-6'>
        <Button
          type='button'
          variant='ghost'
          className='h-11 rounded-full bg-slate-50 px-8 font-bold text-slate-500 hover:bg-slate-100'
          onClick={() => onCancel?.()}
        >
          Cancel
        </Button>
        <Button
          type='submit'
          disabled={loading}
          className='bg-primary hover:bg-primary/90 shadow-primary/20 h-11 min-w-[160px] rounded-full px-8 font-bold text-white shadow-lg transition-all'
        >
          {loading ? (
            <Spinner className='mr-2' />
          ) : isEdit ? (
            'Save Changes'
          ) : (
            'Initialize Enterprise'
          )}
        </Button>
      </div>
    </form>
  );
}

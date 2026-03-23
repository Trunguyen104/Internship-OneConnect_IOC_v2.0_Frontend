'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import LogoUploader from '@/components/ui/logouploader';
import { Spinner } from '@/components/ui/spinner';
import { UI_TEXT } from '@/lib/UI_Text';
import { useToast } from '@/providers/ToastProvider';
import { universityService } from '@/services/university.service';
import { useUniversitiesStore } from '@/store/useUniversitiesStore';

export default function UniversitiesForm({ university, onSuccess, onCancel }) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [logoUrl, setLogoUrl] = useState(university?.logoUrl || '');
  const isEdit = !!university;

  const validate = (payload) => {
    const nextErrors = {};
    if (!payload.name)
      nextErrors.name = UI_TEXT.UNIVERSITIES.NAME_REQUIRED || 'University name is required';
    if (!payload.code)
      nextErrors.code = UI_TEXT.UNIVERSITIES.CODE_REQUIRED || 'University code is required';
    if (!payload.address)
      nextErrors.address = UI_TEXT.UNIVERSITIES.ADDRESS_REQUIRED || 'Address is required';
    return nextErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: String(formData.get('name') || '').trim(),
      code: String(formData.get('code') || '').trim(),
      address: String(formData.get('address') || '').trim(),
    };

    const nextErrors = validate(payload);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setLoading(false);
      return;
    }

    try {
      if (isEdit) {
        await universityService.update(university.universityId, {
          ...payload,
          logoUrl: logoUrl.trim() || undefined,
          universityId: university.universityId,
        });
        toast.success(UI_TEXT.COMMON.UPDATE_SUCCESS || `Updated ${payload.name}`);
      } else {
        await universityService.create(payload);
        toast.success(UI_TEXT.COMMON.CREATE_SUCCESS || `Created ${payload.name}`);
      }

      useUniversitiesStore.increment();
      onSuccess?.();
    } catch (err) {
      setFormError(err);
      if (err.data?.validationErrors) {
        const backendErrors = {};
        Object.entries(err.data.validationErrors).forEach(([field, msgs]) => {
          backendErrors[field] = Array.isArray(msgs) ? msgs[0] : msgs;
        });
        setErrors(backendErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-2xl flex-col gap-6">
      {isEdit && (
        <div className="mb-6 flex justify-center">
          <LogoUploader
            value={logoUrl}
            onChange={setLogoUrl}
            size={160}
            label="University Logo"
            folder="Universities"
          />
        </div>
      )}

      <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field className="md:col-span-2">
          <FieldLabel htmlFor="name">{UI_TEXT.UNIVERSITIES.NAME}</FieldLabel>
          <Input
            id="name"
            name="name"
            defaultValue={university?.name}
            required
            placeholder="Enter official name"
            className="focus:ring-primary/20 h-12 rounded-xl border-slate-200 shadow-inner"
            error={errors.name}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="code">{UI_TEXT.UNIVERSITIES.CODE}</FieldLabel>
          <Input
            id="code"
            name="code"
            defaultValue={university?.code}
            required
            placeholder="EX: BK-HN"
            className="h-11 rounded-xl border-slate-200"
            error={errors.code}
          />
        </Field>

        <Field className="md:col-span-2">
          <FieldLabel htmlFor="address">{UI_TEXT.UNIVERSITIES.ADDRESS}</FieldLabel>
          <Input
            id="address"
            name="address"
            defaultValue={university?.address}
            required
            placeholder="Enter headquarters address"
            className="h-11 rounded-xl border-slate-200"
            error={errors.address}
          />
        </Field>
      </FieldGroup>

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">
        <Button
          type="button"
          variant="ghost"
          className="h-11 rounded-full bg-slate-50 px-6 font-semibold text-slate-500 hover:bg-slate-100"
          onClick={() => onCancel?.()}
        >
          {UI_TEXT.BUTTON.CANCEL}
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-primary hover:bg-primary/90 shadow-primary/20 h-11 min-w-[140px] rounded-full px-8 font-semibold text-white shadow-lg transition-all active:scale-[0.98]"
        >
          {loading ? (
            <Spinner className="mr-2" />
          ) : isEdit ? (
            UI_TEXT.BUTTON.SAVE_CHANGES
          ) : (
            UI_TEXT.UNIVERSITIES.CREATE
          )}
        </Button>
      </div>
    </form>
  );
}

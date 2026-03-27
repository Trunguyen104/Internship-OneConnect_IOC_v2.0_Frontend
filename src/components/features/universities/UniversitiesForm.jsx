'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
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
        toast.success(UI_TEXT.COMMON.UPDATE_SUCCESS);
      } else {
        await universityService.create(payload);
        toast.success(UI_TEXT.COMMON.CREATE_SUCCESS);
      }

      useUniversitiesStore.increment();
      onSuccess?.();
    } catch (err) {
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-6">
        <LogoUploader
          value={logoUrl}
          onChange={setLogoUrl}
          size={120}
          label={UI_TEXT.UNIVERSITIES.LOGO_LABEL}
          folder="Universities"
        />
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted/40 text-center">
          {UI_TEXT.UNIVERSITIES.IDENTITY}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-1">
        <div className="md:col-span-2 space-y-2">
          <label className="text-[11px] font-black uppercase tracking-widest text-muted/60 pl-1">
            {UI_TEXT.UNIVERSITIES.NAME}
          </label>
          <Input
            name="name"
            defaultValue={university?.name}
            placeholder={UI_TEXT.UNIVERSITIES.NAME_PLACEHOLDER}
            className="h-12 rounded-2xl border-gray-100 bg-gray-50/50 px-5 transition-all focus:border-primary/30 focus:bg-white"
            error={errors.name}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-widest text-muted/60 pl-1">
            {UI_TEXT.UNIVERSITIES.CODE}
          </label>
          <Input
            name="code"
            defaultValue={university?.code}
            placeholder={UI_TEXT.UNIVERSITIES.CODE_PLACEHOLDER}
            className="h-12 rounded-2xl border-gray-100 bg-gray-50/50 px-5 transition-all focus:border-primary/30 focus:bg-white"
            error={errors.code}
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="text-[11px] font-black uppercase tracking-widest text-muted/60 pl-1">
            {UI_TEXT.UNIVERSITIES.ADDRESS}
          </label>
          <Input
            name="address"
            defaultValue={university?.address}
            placeholder={UI_TEXT.UNIVERSITIES.ADDRESS_PLACEHOLDER}
            className="h-12 rounded-2xl border-gray-100 bg-gray-50/50 px-5 transition-all focus:border-primary/30 focus:bg-white"
            error={errors.address}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-gray-50">
        <Button
          type="button"
          variant="ghost"
          className="h-12 rounded-full px-8 font-black uppercase tracking-widest text-[11px] text-muted transition-all hover:bg-gray-100"
          onClick={() => onCancel?.()}
        >
          {UI_TEXT.BUTTON.CANCEL}
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-primary/90 h-12 min-w-[160px] rounded-full px-10 text-[11px] font-black uppercase tracking-widest text-white shadow-lg transition-all hover:bg-primary active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? (
            <Spinner className="size-4" />
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

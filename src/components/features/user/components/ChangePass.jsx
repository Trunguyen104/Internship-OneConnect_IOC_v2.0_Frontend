'use client';

import { useState } from 'react';

import { changePassword } from '@/components/features/auth/services/auth.service';
import Button from '@/components/ui/button';
import { Field, FieldGroup } from '@/components/ui/field';
import Input from '@/components/ui/input';
import { PROFILE_UI } from '@/constants/user/uiText';
import { useToast } from '@/providers/ToastProvider';

export default function ChangePass({ onClose }) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const validate = () => {
    const newErrors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
    let isValid = true;

    if (!form.currentPassword) {
      newErrors.currentPassword = PROFILE_UI.CHANGE_PASSWORD.ERROR.REQUIRED_CURRENT;
      isValid = false;
    }

    const hasUppercase = /[A-Z]/.test(form.newPassword);
    const hasLowercase = /[a-z]/.test(form.newPassword);
    const hasDigit = /[0-9]/.test(form.newPassword);
    const hasSpecial = /[\W_]/.test(form.newPassword);
    const isMinLength = form.newPassword.length >= 8;

    if (!form.newPassword) {
      newErrors.newPassword = PROFILE_UI.CHANGE_PASSWORD.ERROR.REQUIRED_NEW;
      isValid = false;
    } else if (!(isMinLength && hasUppercase && hasLowercase && hasDigit && hasSpecial)) {
      newErrors.newPassword = PROFILE_UI.CHANGE_PASSWORD.ERROR.STRENGTH_REQUIREMENTS;
      isValid = false;
    }

    if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = PROFILE_UI.CHANGE_PASSWORD.ERROR.MATCH;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await changePassword(form);
      toast.success(PROFILE_UI.CHANGE_PASSWORD.SUCCESS);
      if (onClose) onClose();
    } catch (data) {
      if (data.validationErrors) {
        const backendErrors = {};
        Object.entries(data.validationErrors).forEach(([field, msgs]) => {
          backendErrors[field] = Array.isArray(msgs) ? msgs[0] : msgs;
        });
        setErrors((prev) => ({ ...prev, ...backendErrors }));
      } else {
        toast.error(data.message || PROFILE_UI.CHANGE_PASSWORD.ERROR.FAILED);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FieldGroup>
          <Field>
            <Input
              label={PROFILE_UI.CHANGE_PASSWORD.CURRENT_PASSWORD}
              name="currentPassword"
              type="password"
              value={form.currentPassword}
              onChange={handleChange}
              error={errors.currentPassword}
              required
              placeholder={PROFILE_UI.PLACEHOLDERS.PASSWORD}
              className="h-12 bg-slate-50/50 border-slate-200 focus:bg-white transition-all rounded-xl"
            />
          </Field>

          <Field>
            <Input
              label={PROFILE_UI.CHANGE_PASSWORD.NEW_PASSWORD}
              name="newPassword"
              type="password"
              value={form.newPassword}
              onChange={handleChange}
              error={errors.newPassword}
              required
              placeholder={PROFILE_UI.PLACEHOLDERS.PASSWORD}
              className="h-12 bg-slate-50/50 border-slate-200 focus:bg-white transition-all rounded-xl"
            />
          </Field>

          <Field>
            <Input
              label={PROFILE_UI.CHANGE_PASSWORD.CONFIRM_PASSWORD}
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
              placeholder={PROFILE_UI.PLACEHOLDERS.PASSWORD}
              className="h-12 bg-slate-50/50 border-slate-200 focus:bg-white transition-all rounded-xl"
            />
          </Field>
        </FieldGroup>

        <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="rounded-xl h-12 px-6 font-bold text-slate-500 hover:text-slate-700"
          >
            {PROFILE_UI.BUTTONS.CANCEL}
          </Button>
          <Button
            type="submit"
            variant="default"
            loading={loading}
            className="px-10 h-12 rounded-xl font-bold shadow-lg shadow-primary/20"
          >
            {PROFILE_UI.CHANGE_PASSWORD.SUBMIT}
          </Button>
        </div>
      </form>
    </div>
  );
}

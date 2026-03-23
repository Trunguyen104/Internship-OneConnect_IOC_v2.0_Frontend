'use client';

import { useState } from 'react';

import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import { Field, FieldGroup } from '@/components/ui/field';
import Input from '@/components/ui/input';
import { PROFILE_UI } from '@/constants/user/uiText';
import { useToast } from '@/providers/ToastProvider';

export default function ChangePass() {
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
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        toast.success(PROFILE_UI.CHANGE_PASSWORD.SUCCESS);
        setForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        // Handle validation errors from backend
        if (data.validationErrors) {
          const backendErrors = {};
          Object.entries(data.validationErrors).forEach(([field, msgs]) => {
            // Map common backend field names if different (e.g. CurrentPassword -> currentPassword)
            // GlobalExceptionHandler already camelCases them.
            backendErrors[field] = Array.isArray(msgs) ? msgs[0] : msgs;
          });
          setErrors((prev) => ({ ...prev, ...backendErrors }));
        } else {
          toast.error(data.message || PROFILE_UI.CHANGE_PASSWORD.ERROR.FAILED);
        }
      }
    } catch {
      toast.error(PROFILE_UI.CHANGE_PASSWORD.ERROR.GENERAL);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{PROFILE_UI.CHANGE_PASSWORD.TITLE}</h1>
        <p className="mt-1 text-sm text-slate-500">{PROFILE_UI.CHANGE_PASSWORD.HINT}</p>
      </div>

      <Card className="min-h-0">
        <form onSubmit={handleSubmit}>
          <Card.Content className="p-6">
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
                  placeholder="********"
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
                  placeholder="********"
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
                  placeholder="********"
                />
              </Field>
            </FieldGroup>
          </Card.Content>

          <Card.Footer className="border-t border-slate-100 p-6">
            <Button type="submit" variant="destructive" loading={loading} className="px-8">
              {PROFILE_UI.CHANGE_PASSWORD.SUBMIT}
            </Button>
          </Card.Footer>
        </form>
      </Card>
    </div>
  );
}

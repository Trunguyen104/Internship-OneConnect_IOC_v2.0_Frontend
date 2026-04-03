'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { resetPassword } from '@/components/features/auth/services/auth.service';
import Input from '@/components/ui/input';
import { AUTH_MESSAGES, AUTH_UI } from '@/constants/auth/uiText';

export default function ResetPasswordPage({ token }) {
  const [form, setForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors({});
    setApiError('');
  };

  const validate = () => {
    const newErrors = {};

    if (!form.newPassword) {
      newErrors.newPassword = AUTH_MESSAGES.VALIDATION.PASSWORD_REQUIRED;
    } else if (form.newPassword.length < 8) {
      newErrors.newPassword = AUTH_MESSAGES.VALIDATION.PASSWORD_MIN_LENGTH;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/.test(form.newPassword)) {
      newErrors.newPassword = AUTH_MESSAGES.VALIDATION.PASSWORD_COMPLEXITY;
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = AUTH_MESSAGES.VALIDATION.CONFIRM_PASSWORD_REQUIRED;
    } else if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = AUTH_MESSAGES.VALIDATION.PASSWORDS_DO_NOT_MATCH;
    }

    if (!token) {
      setApiError(AUTH_MESSAGES.ERROR.RESET_TOKEN_MISSING);
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      setIsLoading(true);
      setApiError('');

      try {
        await resetPassword({
          token,
          newPassword: form.newPassword,
          confirmPassword: form.confirmPassword,
        });
        setSuccess(true);
      } catch (err) {
        setApiError(err.message || AUTH_MESSAGES.ERROR.API_RESET_FAILED);
        setSuccess(false);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <Image
        src="/assets/images/logo.svg"
        alt={AUTH_UI.LABELS.LOGO}
        width={180}
        height={45}
        className="mx-auto mb-6"
      />

      <h1 className="mb-4 text-center text-4xl font-bold text-black">
        {AUTH_UI.RESET_PASSWORD.TITLE}
      </h1>
      <p className="mb-6 text-center text-gray-500">{AUTH_UI.RESET_PASSWORD.DESC}</p>

      {success ? (
        <div className="text-center">
          <p className="text-success mb-4 font-medium text-green-600">
            {AUTH_UI.RESET_PASSWORD.SUCCESS_TEXT}
          </p>

          <Link href="/login" className="font-semibold text-(--primary-700) hover:underline">
            {AUTH_UI.FORGOT_PASSWORD.BACK_TO_LOGIN}
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              label={AUTH_UI.LABELS.NEW_PASSWORD}
              name="newPassword"
              type="password"
              value={form.newPassword}
              onChange={handleChange}
              placeholder={AUTH_UI.LABELS.PASSWORD_PLACEHOLDER}
              error={errors.newPassword}
            />
          </div>

          <div className="mb-6">
            <Input
              label={AUTH_UI.LABELS.CONFIRM_PASSWORD}
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder={AUTH_UI.LABELS.PASSWORD_PLACEHOLDER}
              error={errors.confirmPassword}
            />
          </div>

          {apiError && (
            <p className="mb-4 text-center text-sm text-(--color-danger) text-red-500">
              {apiError}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading || !token}
            className={`mt-2 h-11 w-full cursor-pointer rounded-xl font-semibold text-white ${
              isLoading || !token
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-(--color-primary) hover:bg-(--color-primary-hover)'
            }`}
          >
            {isLoading ? AUTH_UI.RESET_PASSWORD.BUTTON_LOADING : AUTH_UI.RESET_PASSWORD.BUTTON}
          </button>

          <div className="mt-4 text-center text-sm">
            <Link href="/login" className="font-medium text-(--primary-700) hover:underline">
              {AUTH_UI.FORGOT_PASSWORD.BACK_TO_LOGIN}
            </Link>
          </div>
        </form>
      )}
    </>
  );
}

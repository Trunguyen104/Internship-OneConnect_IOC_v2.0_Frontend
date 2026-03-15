'use client';

import Card from '@/components/ui/Card';
import { useState } from 'react';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useToast } from '@/providers/ToastProvider';
import { PROFILE_UI } from '@/constants/user/uiText';

export default function ChangePass() {
  const toast = useToast();

  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const isStrongPassword =
    form.newPassword.length >= 8 &&
    /[A-Z]/.test(form.newPassword) &&
    /[0-9]/.test(form.newPassword);

  const isValid =
    form.currentPassword && isStrongPassword && form.newPassword === form.confirmPassword;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
        credentials: 'include',
      });

      const text = await res.text();

      if (res.ok) {
        toast.success(PROFILE_UI.CHANGE_PASSWORD.SUCCESS);
        setForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        toast.error(text || PROFILE_UI.CHANGE_PASSWORD.ERROR.FAILED);
      }
    } catch {
      toast.error(PROFILE_UI.CHANGE_PASSWORD.ERROR.GENERAL);
    }
  };

  return (
    <>
      <div className='mb-5'>
        <h1 className='text-text text-2xl font-bold'>{PROFILE_UI.CHANGE_PASSWORD.TITLE}</h1>
        <label className='text-muted text-sm'>{PROFILE_UI.CHANGE_PASSWORD.HINT}</label>
      </div>
      <Card>
        <div className='space-y-8'>
          <div className='w-full space-y-6'>
            <PasswordField
              label={PROFILE_UI.CHANGE_PASSWORD.CURRENT_PASSWORD}
              name='currentPassword'
              value={form.currentPassword}
              onChange={handleChange}
              show={show.current}
              onToggle={() => setShow({ ...show, current: !show.current })}
            />

            <PasswordField
              label={PROFILE_UI.CHANGE_PASSWORD.NEW_PASSWORD}
              name='newPassword'
              value={form.newPassword}
              onChange={handleChange}
              show={show.new}
              onToggle={() => setShow({ ...show, new: !show.new })}
            />

            <PasswordField
              label={PROFILE_UI.CHANGE_PASSWORD.CONFIRM_PASSWORD}
              name='confirmPassword'
              value={form.confirmPassword}
              onChange={handleChange}
              show={show.confirm}
              onToggle={() => setShow({ ...show, confirm: !show.confirm })}
              error={
                form.confirmPassword && form.newPassword !== form.confirmPassword
                  ? PROFILE_UI.CHANGE_PASSWORD.ERROR.MATCH
                  : ''
              }
            />
          </div>

          <div className='border-border flex items-center justify-end border-t pt-6'>
            <button
              onClick={handleSubmit}
              disabled={!isValid}
              className={`h-10 cursor-pointer rounded-full px-10 font-semibold transition ${
                isValid
                  ? 'bg-danger hover:bg-danger/90 text-white'
                  : 'bg-danger/20 cursor-not-allowed text-white'
              }`}
            >
              {PROFILE_UI.CHANGE_PASSWORD.SUBMIT}
            </button>
          </div>
        </div>
      </Card>
    </>
  );
}

function PasswordField({ label, name, value, onChange, show, onToggle, hint, error }) {
  return (
    <div className='space-y-1'>
      <label className='text-text mb-4 text-sm font-semibold'>
        {label} <span className='text-danger'>*</span>
      </label>

      <div className='relative mt-2'>
        <input
          name={name}
          value={value}
          onChange={onChange}
          type={show ? 'text' : 'password'}
          className={`border-border h-11 w-full rounded-xl border pl-5 ${error ? 'border-danger' : 'border-border'} focus:ring-primary focus:border-primary transition outline-none focus:ring-2`}
        />

        <button
          type='button'
          onClick={onToggle}
          className='text-muted hover:text-text absolute top-1/2 right-4 -translate-y-1/2 transition'
        >
          {show ? <EyeInvisibleOutlined /> : <EyeOutlined />}
        </button>
      </div>

      {hint && <p className='text-muted text-xs'>{hint}</p>}
      {error && <p className='text-danger text-xs'>{error}</p>}
    </div>
  );
}

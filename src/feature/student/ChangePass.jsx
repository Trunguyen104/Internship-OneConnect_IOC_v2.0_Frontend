'use client';

import Card from '@/shared/components/Card';
import { useState } from 'react';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
// import { ToastProvider } from '@/providers/ToastProvider';
import { useToast } from '@/providers/ToastProvider';

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
        toast.success('Password changed successfully');
        setForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        toast.error(text || 'Failed to change password');
      }
    } catch {
      toast.error('An error occurred');
    }
  };

  return (
    <>
      <div className='mb-5'>
        <h1 className='text-2xl font-bold text-slate-900'>Change Password</h1>
        <label className='text-sm'>Reset your password to protect your account.</label>
      </div>
      <Card>
        <div className='space-y-8'>
          <div className='space-y-6 w-full'>
            <PasswordField
              label='Current Password'
              name='currentPassword'
              value={form.currentPassword}
              onChange={handleChange}
              show={show.current}
              onToggle={() => setShow({ ...show, current: !show.current })}
            />

            <PasswordField
              label='New Password'
              name='newPassword'
              value={form.newPassword}
              onChange={handleChange}
              show={show.new}
              onToggle={() => setShow({ ...show, new: !show.new })}
            />

            <PasswordField
              label='Confirm Password'
              name='confirmPassword'
              value={form.confirmPassword}
              onChange={handleChange}
              show={show.confirm}
              onToggle={() => setShow({ ...show, confirm: !show.confirm })}
              error={
                form.confirmPassword && form.newPassword !== form.confirmPassword
                  ? 'Passwords do not match'
                  : ''
              }
            />
          </div>

          <div className='pt-6 border-t flex justify-end items-center'>
            <button
              onClick={handleSubmit}
              disabled={!isValid}
              className={`h-10 px-10 rounded-full font-semibold transition cursor-pointer
  ${
    isValid ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-red-200 text-white cursor-not-allowed'
  }`}
            >
              Change Password
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
      <label className='text-sm font-semibold text-slate-700 mb-4'>
        {label} <span className='text-red-500'>*</span>
      </label>

      <div className='relative mt-2'>
        <input
          name={name}
          value={value}
          onChange={onChange}
          type={show ? 'text' : 'password'}
          className={`
            w-full h-11 pl-5 rounded-xl border
            ${error ? 'border-red-400' : 'border-slate-300'}
            focus:ring-2 focus:ring-primary
            focus:border-primary
            outline-none transition
          `}
        />

        <button
          type='button'
          onClick={onToggle}
          className='absolute right-4 top-1/2 -translate-y-1/2
                     text-slate-400 hover:text-slate-600 transition'
        >
          {show ? <EyeInvisibleOutlined /> : <EyeOutlined />}
        </button>
      </div>

      {hint && <p className='text-xs text-slate-500'>{hint}</p>}
      {error && <p className='text-xs text-red-500'>{error}</p>}
    </div>
  );
}

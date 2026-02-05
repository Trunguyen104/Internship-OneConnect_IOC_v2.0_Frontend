'use client';

import Card from '@/shared/components/Card';
import { useState } from 'react';

export default function ChangePass() {
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

  return (
    <>
      <div>
        <h1 className='text-2xl font-bold text-slate-900'>Thay đổi mật khẩu</h1>
        <p className='text-sm text-slate-500'>Đặt lại mật khẩu để bảo vệ tài khoản của bạn</p>
      </div>
      <Card>
        {/* Header */}

        <div className='max-w-3xl space-y-8'>
          {/* Form */}
          <div className='space-y-6'>
            <PasswordField
              label='Mật khẩu hiện tại'
              name='currentPassword'
              value={form.currentPassword}
              onChange={handleChange}
              show={show.current}
              onToggle={() => setShow({ ...show, current: !show.current })}
            />

            <PasswordField
              label='Mật khẩu mới'
              name='newPassword'
              value={form.newPassword}
              onChange={handleChange}
              show={show.new}
              onToggle={() => setShow({ ...show, new: !show.new })}
              hint='Ít nhất 8 ký tự, gồm chữ hoa và số'
            />

            <PasswordField
              label='Nhập lại mật khẩu'
              name='confirmPassword'
              value={form.confirmPassword}
              onChange={handleChange}
              show={show.confirm}
              onToggle={() => setShow({ ...show, confirm: !show.confirm })}
              error={
                form.confirmPassword && form.newPassword !== form.confirmPassword
                  ? 'Mật khẩu không khớp'
                  : ''
              }
            />
          </div>

          {/* Footer */}
          <div className='pt-6 border-t flex justify-between items-center'>
            <div className='text-sm text-slate-500 space-y-1'>
              <p>
                Ngày tạo tài khoản: <b>22/12/2025</b>
              </p>
              <p>
                Đăng nhập gần nhất: <b>02/02/2026 · 21:11</b>
              </p>
            </div>

            <button
              disabled={!isValid}
              className={`h-11 px-10 rounded-full font-semibold transition
              ${
                isValid
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-red-200 text-white cursor-not-allowed'
              }`}
            >
              Đổi mật khẩu
            </button>
          </div>
        </div>
      </Card>
    </>
  );
}

/* ===== Password Field ===== */

function PasswordField({ label, name, value, onChange, show, onToggle, hint, error }) {
  return (
    <div className='space-y-1'>
      <label className='text-sm font-semibold text-slate-700'>
        {label} <span className='text-red-500'>*</span>
      </label>

      <div className='relative'>
        <span className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400'>🔒</span>

        <input
          name={name}
          value={value}
          onChange={onChange}
          type={show ? 'text' : 'password'}
          className='w-full h-11 pl-11 pr-11 rounded-xl border border-slate-300
                     focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none'
        />

        <button
          type='button'
          onClick={onToggle}
          className='absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600'
        >
          {show ? '🙈' : '👁️'}
        </button>
      </div>

      {hint && <p className='text-xs text-slate-500'>{hint}</p>}
      {error && <p className='text-xs text-red-500'>{error}</p>}
    </div>
  );
}

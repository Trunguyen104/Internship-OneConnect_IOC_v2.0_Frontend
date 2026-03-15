'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Input from '@/components/ui/Input';
import { login } from '@/components/features/auth/services/authService';
import { setAccessToken } from '@/components/features/auth/services/authStorage';
import { useRouter } from 'next/navigation';
import { useToast } from '@/providers/ToastProvider';
import { jwtDecode } from 'jwt-decode';
import Link from 'next/link';

export default function LoginPage() {
  const toast = useToast();

  const [form, setForm] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const router = useRouter();

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!form.password.trim()) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const token = await login(form);

      if (form.rememberMe) {
        localStorage.setItem('rememberEmail', form.email);
        localStorage.setItem('rememberPassword', form.password);
      } else {
        localStorage.removeItem('rememberEmail');
        localStorage.removeItem('rememberPassword');
      }

      setAccessToken(token, form.rememberMe);

      setAccessToken(token, form.rememberMe);

      try {
        const decoded = jwtDecode(token);
        console.log('Decoded Token:', decoded);

        // .NET Identity typically puts roles here:
        const roleClaim =
          decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
          decoded.role ||
          decoded.Role;

        // Ensure roleClaim is an array if multiple roles exist, or just check the string
        const roles = Array.isArray(roleClaim) ? roleClaim : [roleClaim];

        const isEnterprise = roles.some(
          (r) =>
            r === '4' || r === '5' || r === 4 || r === 5 || r === 'EnterpriseAdmin' || r === 'HR',
        );

        if (isEnterprise) {
          toast.success('Đăng nhập thành công (HR/Enterprise)');
          router.push('/dashboard');
          return;
        }
      } catch (err) {
        console.warn('Failed to decode token for role routing', err);
      }

      toast.success('Đăng nhập thành công');
      router.push('/internship-groups');
    } catch (err) {
      setErrors({ password: err.message });
      toast.error('Đăng nhập thất bại');
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors({});
  };
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberEmail');
    const savedPassword = localStorage.getItem('rememberPassword');

    if (savedEmail && savedPassword) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        email: savedEmail,
        password: savedPassword,
        rememberMe: true,
      });
    }
  }, []);
  return (
    <div
      className='h-screen w-full overflow-hidden'
      style={{
        background:
          'radial-gradient(circle at top left, rgb(254, 202, 202) 0%, rgb(255, 255, 255) 65%)',
      }}
    >
      <div className='grid h-full w-full grid-cols-1 lg:grid-cols-2'>
        {/* LEFT */}
        <div className='flex items-center justify-center px-4 lg:pr-1'>
          <div className='w-full max-w-125'>
            <Image
              src='/assets/images/logo.svg'
              alt='IOC Logo'
              width={200}
              height={60}
              className='mx-auto mb-8 block'
            />

            <p className='mb-4 text-center text-4xl font-bold text-black'>Đăng nhập</p>
            <p className='mb-8 text-center text-gray-500'>
              Chào mừng quay trở lại! Hãy nhập thông tin đăng nhập của bạn
            </p>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <div className='relative'>
                  <Input
                    label='Email'
                    name='email'
                    type='email'
                    value={form.email}
                    onChange={handleChange}
                    placeholder='name@university.edu'
                    error={errors.email}
                  />

                  <Input
                    label='Mật khẩu'
                    name='password'
                    type='password'
                    value={form.password}
                    onChange={handleChange}
                    error={errors.password}
                  />
                </div>
              </div>

              <div className='flex items-center justify-between'>
                <label className='flex cursor-pointer items-center gap-2 text-sm'>
                  <input
                    type='checkbox'
                    name='rememberMe'
                    checked={form.rememberMe}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        rememberMe: e.target.checked,
                      }))
                    }
                  />
                  Ghi nhớ đăng nhập
                </label>
                <Link
                  href='forgot-password'
                  className='flex cursor-pointer text-sm text-(--primary-700) hover:underline'
                >
                  Quên mật khẩu?
                </Link>
              </div>

              <button
                type='submit'
                className='h-11 w-full cursor-pointer rounded-xl bg-(--color-primary) font-semibold text-white hover:bg-(--color-primary-hover)'
              >
                Đăng nhập
              </button>
            </form>

            <div className='mt-4 text-center text-sm text-gray-500'>
              © 2026 Internship OneConnect
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className='hidden items-center justify-center p-8 lg:flex'>
          <div className='flex h-full max-h-[90vh] w-full max-w-175 flex-col items-center justify-between rounded-4xl bg-(--color-danger) px-10 py-12 shadow-xl'>
            <div className='text-center text-white'>
              <h2 className='mb-4 text-4xl font-extrabold'>Internship OneConnect</h2>
              <p className='mx-auto max-w-105 text-sm text-white/80'>
                Tham gia chương trình thực tập để học hỏi từ các chuyên gia, rèn luyện kỹ năng thực
                tế và chuẩn bị vững vàng cho sự nghiệp tương lai.
              </p>
            </div>

            <Image
              src='/assets/images/bg.png'
              alt='Mascot'
              width={400}
              height={400}
              className='rounded-xl object-contain'
            />
          </div>
        </div>
      </div>
    </div>
  );
}

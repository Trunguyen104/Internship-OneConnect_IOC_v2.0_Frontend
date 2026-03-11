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
      className='w-full h-screen overflow-hidden'
      style={{
        background:
          'radial-gradient(circle at top left, rgb(254, 202, 202) 0%, rgb(255, 255, 255) 65%)',
      }}
    >
      <div className='grid grid-cols-1 lg:grid-cols-2 w-full h-full'>
        {/* LEFT */}
        <div className='flex items-center justify-center px-4 lg:pr-1'>
          <div className='w-full max-w-125'>
            <Image
              src='/assets/images/logo.svg'
              alt='IOC Logo'
              width={200}
              height={60}
              className='block mx-auto mb-8'
            />

            <p className='text-center font-bold text-4xl text-black mb-4'>Đăng nhập</p>
            <p className='text-center text-gray-500 mb-8'>
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

              <div className='flex justify-between items-center'>
                <label className='flex items-center gap-2 text-sm cursor-pointer'>
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
                  className='flex text-sm hover:underline text-(--primary-700) cursor-pointer'
                >
                  Quên mật khẩu?
                </Link>
              </div>

              <button
                type='submit'
                className='cursor-pointer w-full h-11 rounded-xl text-white font-semibold  bg-(--color-primary) hover:bg-(--color-primary-hover)'
              >
                Đăng nhập
              </button>
            </form>

            <div className='text-center text-gray-500 text-sm mt-4'>
              © 2026 Internship OneConnect
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className='hidden lg:flex items-center justify-center p-8'>
          <div className='w-full max-w-175 h-full max-h-[90vh] rounded-4xl px-10 py-12 flex flex-col items-center justify-between shadow-xl bg-(--color-danger)'>
            <div className='text-center text-white'>
              <h2 className='text-4xl font-extrabold mb-4'>Internship OneConnect</h2>
              <p className='text-white/80 text-sm max-w-105 mx-auto'>
                Tham gia chương trình thực tập để học hỏi từ các chuyên gia, rèn luyện kỹ năng thực
                tế và chuẩn bị vững vàng cho sự nghiệp tương lai.
              </p>
            </div>

            <Image
              src='/assets/images/bg.png'
              alt='Mascot'
              width={400}
              height={400}
              className='object-contain rounded-xl'
            />
          </div>
        </div>
      </div>
    </div>
  );
}


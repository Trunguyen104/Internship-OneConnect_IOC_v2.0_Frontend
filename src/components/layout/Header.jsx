'use client';

import { useRouter } from 'next/navigation';
import { BellOutlined, UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { Dropdown, Avatar } from 'antd';
import { logout } from '@/components/features/auth/services/authService';
import { clearAuth } from '@/components/features/auth/services/authStorage';
import { useToast } from '@/providers/ToastProvider';

export default function Header() {
  const router = useRouter();

  const toast = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      clearAuth();
      toast.success('Logout successfully');
    } finally {
      router.refresh();
      router.push('/login');
    }
  };
  const avatarMenu = {
    items: [
      { key: 'profile', icon: <UserOutlined />, label: 'Profile' },
      { key: 'settings', icon: <SettingOutlined />, label: 'Settings' },
      { type: 'divider' },
      { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', danger: true },
    ],
    onClick: async ({ key }) => {
      if (key === 'profile') router.push('/student/profile');
      if (key === 'settings') router.push('/settings');

      if (key === 'logout') handleLogout();
    },
  };
  return (
    <header className='sticky top-0 z-50 flex h-16 items-center justify-end border-b border-slate-200 bg-gray-50 px-6'>
      <div className='flex items-center gap-4'>
        <button className='flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300'>
          <BellOutlined className='text-lg text-gray-700' />
        </button>

        <Dropdown menu={avatarMenu} trigger={['click']} placement='bottomRight'>
          <Avatar
            size={36}
            style={{ backgroundColor: '#e5e7eb', color: '#374151' }}
            icon={<UserOutlined className='text-lg' />}
          />
        </Dropdown>
      </div>
    </header>
  );
}

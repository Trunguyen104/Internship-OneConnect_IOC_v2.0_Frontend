'use client';

import { useRouter } from 'next/navigation';
import { BellOutlined, UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { Dropdown, Avatar } from 'antd';
import { logout } from '@/services/authService';
import { clearAuth } from '@/services/authStorage';
import { useToast } from '@/providers/ToastProvider';

export default function Header() {
  const router = useRouter();

  const toast = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      clearAuth();
      toast.success('Đăng xuất thành công');
    } finally {
      router.refresh();
      router.push('/login');
    }
  };
  const avatarMenu = {
    items: [
      { key: 'profile', icon: <UserOutlined />, label: 'Thông tin cá nhân' },
      { key: 'settings', icon: <SettingOutlined />, label: 'Cài đặt' },
      { type: 'divider' },
      { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất', danger: true },
    ],
    onClick: async ({ key }) => {
      if (key === 'profile') router.push('/student/profile');
      if (key === 'settings') router.push('/settings');

      if (key === 'logout') handleLogout();
    },
  };
  return (
    <header className='sticky top-0 h-16 bg-gray-50 border-b border-slate-200 px-6 flex items-center justify-end'>
      <div className='flex items-center gap-4'>
        <button className='w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300'>
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

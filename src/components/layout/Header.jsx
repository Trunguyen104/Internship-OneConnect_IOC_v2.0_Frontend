'use client';

import { BellOutlined, LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown } from 'antd';
import { ChevronDown } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { logout } from '@/components/features/auth/services/authService';
import { clearAuth } from '@/components/features/auth/services/authStorage';
import { userService } from '@/components/features/user/services/userService';
import { useToast } from '@/providers/ToastProvider';

export default function Header() {
  const [userInfo, setUserInfo] = useState(null);
  const router = useRouter();
  const params = useParams();
  const internshipGroupId = params?.internshipGroupId;
  const toast = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await userService.getMe();
        setUserInfo(res?.data || res);
      } catch (err) {
        console.error('Failed to fetch user header profile:', err);
      }
    };
    fetchUser();
  }, []);

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
      {
        key: 'user-info',
        label: (
          <div className="flex flex-col px-1 pb-1">
            <span className="text-sm font-bold text-slate-800">
              {userInfo?.fullName || userInfo?.FullName || 'Người dùng'}
            </span>
            <span className="text-xs text-slate-500">{userInfo?.email || userInfo?.Email}</span>
          </div>
        ),
        disabled: true,
      },
      { type: 'divider' },
      { key: 'profile', icon: <UserOutlined />, label: 'Profile' },
      { key: 'settings', icon: <SettingOutlined />, label: 'Settings' },
      { type: 'divider' },
      { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', danger: true },
    ],
    onClick: async ({ key }) => {
      if (key === 'profile') {
        const returnTo = internshipGroupId ? `/internship-groups/${internshipGroupId}/space` : null;
        const query = returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : '';
        router.push(`/profile${query}`);
      }
      if (key === 'settings') router.push('/settings');

      if (key === 'logout') handleLogout();
    },
  };
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-end border-b border-slate-200 bg-gray-50 px-6">
      <div className="flex items-center gap-4">
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300">
          <BellOutlined className="text-lg text-gray-700" />
        </button>

        <Dropdown
          menu={avatarMenu}
          trigger={['click']}
          placement="bottomRight"
          classNames={{ root: 'min-w-[180px]' }}
        >
          <div className="flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white p-1 pr-3 transition-all hover:bg-slate-50">
            <Avatar
              size={28}
              src={userInfo?.avatarUrl || userInfo?.AvatarUrl}
              style={{ backgroundColor: '#dc2626', color: '#ffffff' }}
              icon={<UserOutlined />}
            >
              {!(userInfo?.avatarUrl || userInfo?.AvatarUrl) &&
                (userInfo?.fullName || userInfo?.FullName || 'U').charAt(0).toUpperCase()}
            </Avatar>
            <span className="hidden text-sm font-semibold text-slate-700 md:block">
              {(userInfo?.fullName || userInfo?.FullName || 'U').split(' ').pop()}
            </span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </div>
        </Dropdown>
      </div>
    </header>
  );
}

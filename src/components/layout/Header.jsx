'use client';

import {
  FileTextOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { Avatar, Dropdown } from 'antd';
import { ChevronDown } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { clearAuth } from '@/components/features/auth/lib/auth-storage';
import { logout } from '@/components/features/auth/services/auth.service';
import NotificationBell from '@/components/features/notifications/components/NotificationBell';
import { userService } from '@/components/features/user/services/user.service';
import { usePageHeader } from '@/providers/PageHeaderProvider';
import { useToast } from '@/providers/ToastProvider';
import { useLayoutStore } from '@/store/useLayoutStore';

export default function Header() {
  const [userInfo, setUserInfo] = useState(null);
  const router = useRouter();
  const params = useParams();
  const groupId = params?.groupId || params?.internshipGroupId;
  const toast = useToast();
  const { isSidebarCollapsed } = useLayoutStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await userService.getMe();
        setUserInfo(res?.data || res);
      } catch (err) {
        if (err?.status === 401 || err?.silent) return;
        console.error('Failed to fetch user header profile:', err);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      clearAuth();
      queryClient.clear();
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
      { key: 'my-applications', icon: <FileTextOutlined />, label: 'My Applications' },
      { type: 'divider' },
      { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', danger: true },
    ],
    onClick: async ({ key }) => {
      if (key === 'profile') {
        const returnTo = groupId ? `/internship-groups/${groupId}/space` : null;
        const query = returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : '';
        router.push(`/profile${query}`);
      }
      if (key === 'my-applications') router.push('/my-applications');
      if (key === 'settings') router.push('/settings');

      if (key === 'logout') handleLogout();
    },
  };

  const { headerConfig } = usePageHeader();

  return (
    <header
      className={`sticky top-0 z-50 flex h-[70px] min-h-[70px] max-h-[70px] flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white transition-all duration-300 ${isSidebarCollapsed ? 'px-12 2xl:px-16' : 'px-6'}`}
    >
      <div className="flex items-center gap-6">
        <button
          onClick={() => useLayoutStore.toggleSidebar()}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
          title={isSidebarCollapsed ? 'Show Sidebar' : 'Hide Sidebar'}
        >
          {isSidebarCollapsed ? (
            <MenuUnfoldOutlined className="text-xl" />
          ) : (
            <MenuFoldOutlined className="text-xl" />
          )}
        </button>

        {headerConfig.title && (
          <div className="hidden flex-col justify-center gap-0.5 border-l border-slate-200 pl-6 lg:flex">
            <h1 className="text-lg font-black tracking-tight text-slate-900 leading-none">
              {headerConfig.title}
            </h1>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <NotificationBell />

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

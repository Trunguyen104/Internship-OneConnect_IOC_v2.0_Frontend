'use client';

import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown } from 'antd';
import { Activity, Building2, CalendarDays, ChevronDown, Home } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { clearAuth } from '@/components/features/auth/lib/auth-storage';
import { logout } from '@/components/features/auth/services/auth.service';
import NotificationBell from '@/components/features/notifications/components/NotificationBell';
import { userService } from '@/components/features/user/services/user.service';
import { useToast } from '@/providers/ToastProvider';

const NAV_TABS = [
  { key: '/school/home', label: 'Home', icon: Home },
  { key: '/school/terms', label: 'Terms', icon: CalendarDays },
  { key: '/school/activity', label: 'Activity', icon: Activity },
  { key: '/school/enterprises', label: 'Enterprises', icon: Building2 },
];

export default function SchoolTopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const toast = useToast();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    userService
      .getMe()
      .then((res) => setUserInfo(res?.data || res))
      .catch((err) => {
        if (err?.status !== 401) console.error(err);
      });
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      clearAuth();
      toast.success('Logout successfully');
    } finally {
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
    onClick: ({ key }) => {
      if (key === 'profile') router.push('/profile');
      if (key === 'settings') router.push('/admin/settings');
      if (key === 'logout') handleLogout();
    },
  };

  return (
    <header className="sticky top-0 z-50 flex h-[64px] min-h-[64px] flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
      {/* LEFT — Logo */}
      <div className="flex items-center gap-8">
        <Link href="/school/home" className="relative flex h-8 w-28 items-center">
          <Image
            src="/assets/images/logo.svg"
            alt="IOC Logo"
            fill
            className="object-contain"
            priority
          />
        </Link>

        {/* TAB NAV */}
        <nav className="flex items-center gap-1">
          {NAV_TABS.map(({ key, label, icon: Icon }) => {
            const isActive = pathname === key || pathname.startsWith(key + '/');
            return (
              <Link
                key={key}
                href={key}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* RIGHT — Notifications + Avatar */}
      <div className="flex items-center gap-3">
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

'use client';

import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Avatar, Dropdown } from 'antd';
import { Briefcase, ChevronDown, FileText, Home } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';

import NotificationBell from '@/components/features/notifications/components/NotificationBell';
import { userService } from '@/components/features/user/services/user.service';
import { USER_ROLE } from '@/constants/user-management/enums';
import { useInternshipStatus } from '@/hooks/useInternshipStatus';
import { useLogout } from '@/hooks/useLogout';

export default function StudentTopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout: handleLogout } = useLogout();
  const { isEnrolled, isPlaced, hasCv, hasActiveApp } = useInternshipStatus();

  const { data: userInfo } = useQuery({
    queryKey: ['me'],
    queryFn: () => userService.getMe().then((res) => res?.data || res),
    staleTime: 0, // Always verify user identity on mount
  });

  const userRoleId = userInfo?.roleId || userInfo?.roleID || Number(userInfo?.role);

  const navTabs = useMemo(() => {
    const tabs = [{ key: '/student/home', label: 'Home', icon: Home }];

    tabs.push({ key: '/student/jobs', label: 'Jobs', icon: Briefcase });

    // Logic: My Applications (Student Only)
    // Sidebar logic: isEnrolled && (hasActiveApp || isPlaced)
    if (userRoleId === USER_ROLE.STUDENT && isEnrolled && (hasActiveApp || isPlaced)) {
      tabs.push({ key: '/my-applications', label: 'My Applications', icon: FileText });
    }

    return tabs;
  }, [isEnrolled, isPlaced, hasCv, hasActiveApp, userRoleId]);

  const avatarMenu = {
    items: [
      {
        key: 'user-info',
        label: (
          <div className="flex flex-col px-1 pb-1">
            <span className="text-sm font-bold text-slate-800">
              {userInfo?.fullName || userInfo?.FullName || 'Student'}
            </span>
            <span className="text-xs text-slate-500">{userInfo?.email || userInfo?.Email}</span>
          </div>
        ),
        disabled: true,
      },
      { type: 'divider' },
      { key: 'profile', icon: <UserOutlined />, label: 'Profile' },
      { type: 'divider' },
      { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', danger: true },
    ],
    onClick: ({ key }) => {
      if (key === 'profile') router.push('/profile');
      if (key === 'logout') handleLogout();
    },
  };

  return (
    <header className="sticky top-0 z-50 flex h-[64px] min-h-[64px] shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
      <div className="flex items-center gap-8">
        <Link href="/student/home" className="relative flex h-8 w-28 items-center cursor-pointer">
          <Image
            src="/assets/images/logo.svg"
            alt="Logo"
            fill
            className="object-contain"
            priority
          />
        </Link>

        <nav className="flex items-center gap-1">
          {navTabs.map(({ key, label, icon: Icon }) => {
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

      <div className="flex items-center gap-3">
        <NotificationBell />
        <Dropdown
          menu={avatarMenu}
          trigger={['click']}
          placement="bottomRight"
          classNames={{ root: 'min-w-[180px]' }}
        >
          <div className="flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white p-1 pr-3 transition-all hover:bg-slate-50">
            <Avatar size={28} src={userInfo?.avatarUrl} icon={<UserOutlined />}>
              {!userInfo?.avatarUrl && (userInfo?.fullName || 'S').charAt(0).toUpperCase()}
            </Avatar>
            <span className="hidden text-sm font-semibold text-slate-700 md:block">
              {(userInfo?.fullName || 'Student').split(' ').pop()}
            </span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </div>
        </Dropdown>
      </div>
    </header>
  );
}

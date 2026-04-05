'use client';

import { BankOutlined, LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown } from 'antd';
import {
  AlertOctagon,
  Briefcase,
  ChevronDown,
  ClipboardCheck,
  FileText,
  FolderGit2,
  GraduationCap,
  Home,
  Layers,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import NotificationBell from '@/components/features/notifications/components/NotificationBell';
import { userService } from '@/components/features/user/services/user.service';
import { useLogout } from '@/hooks/useLogout';

const ALL_NAV_TABS = [
  { key: '/company/home', label: 'Home', icon: Home },
  { key: '/company/phases', label: 'Phases', icon: Layers },
  { key: '/company/internships', label: 'Internships', icon: Users },
  { key: '/company/universities', label: 'Universities', icon: GraduationCap },
  { key: '/company/jobs', label: 'Jobs', icon: Briefcase },
];

const MENTOR_NAV_TABS = [
  { key: '/company/home', label: 'Home', icon: Home },
  { key: '/company/projects', label: 'Projects', icon: FolderGit2 },
  { key: '/company/evaluation', label: 'Evaluation', icon: ClipboardCheck },
  { key: '/company/violation', label: 'Violations', icon: AlertOctagon },
];

export default function CompanyTopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null);

  const roleId = userInfo?.roleId || userInfo?.roleID || Number(userInfo?.role);
  const isMentor = roleId === 6;
  const isEnterpriseManager = [4, 5, 6].includes(roleId);

  const navTabs = useMemo(() => {
    if (isMentor) return MENTOR_NAV_TABS;

    const tabs = [...ALL_NAV_TABS];
    if ([4, 5].includes(roleId)) {
      tabs.push({
        key: '/company/applications',
        label: 'Applications',
        icon: FileText,
      });
    }
    return tabs;
  }, [isMentor, roleId]);

  useEffect(() => {
    userService
      .getMe()
      .then((res) => setUserInfo(res?.data || res))
      .catch((err) => {
        if (err?.status !== 401) console.error(err);
      });
  }, []);

  const { logout: handleLogout } = useLogout();

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
      ...(isEnterpriseManager
        ? [{ key: 'my-company', icon: <BankOutlined />, label: 'My Company' }]
        : []),
      { key: 'settings', icon: <SettingOutlined />, label: 'Settings' },
      { type: 'divider' },
      { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', danger: true },
    ],
    onClick: ({ key }) => {
      if (key === 'profile') router.push('/profile');
      if (key === 'my-company') router.push('/company/my-company');
      if (key === 'settings') router.push('/settings');
      if (key === 'logout') handleLogout();
    },
  };

  // Determine if current path is within a phase workspace (show Back button instead of tabs)
  const isPhaseWorkspace = /^\/company\/phases\/[^/]+/.test(pathname);

  return (
    <header className="sticky top-0 z-50 flex h-[64px] min-h-[64px] shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
      {/* LEFT — Logo + Tabs */}
      <div className="flex items-center gap-8">
        <Link href="/company/home" className="relative flex h-8 w-28 items-center">
          <Image
            src="/assets/images/logo.svg"
            alt="IOC Logo"
            fill
            className="object-contain"
            priority
          />
        </Link>

        {!isPhaseWorkspace && (
          <nav className="flex items-center gap-1">
            {navTabs.map(({ key, label, icon: Icon }) => {
              const isActive = pathname === key || pathname.startsWith(key + '/');
              return (
                <Link
                  key={key}
                  href={key}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-orange-50 text-orange-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {Icon ? <Icon className="size-4" /> : null}
                  {label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>

      {/* RIGHT */}
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

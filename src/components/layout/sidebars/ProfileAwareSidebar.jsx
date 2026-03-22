'use client';

import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { usePathname } from 'next/navigation';

import BaseSidebar from '../BaseSidebar';

export default function ProfileAwareSidebar({
  defaultMenus,
  profilePrefix = '/profile',
  profileMenus,
  profileBackButton,
  defaultActiveStrategy = 'prefix',
  profileActiveStrategy = 'exact',
  className = '',
}) {
  const pathname = usePathname();

  const normalizedProfilePrefix = profilePrefix || '/profile';
  const isProfile = pathname.startsWith(normalizedProfilePrefix);

  const resolvedProfileMenus = profileMenus || [
    { icon: <UserOutlined />, label: 'Profile', href: normalizedProfilePrefix },
    {
      icon: <LockOutlined />,
      label: 'Change Password',
      href: `${normalizedProfilePrefix}/change-password`,
    },
  ];

  const menus = isProfile ? resolvedProfileMenus : defaultMenus;
  const backButton = isProfile ? profileBackButton : null;

  return (
    <BaseSidebar
      menus={menus}
      backButton={backButton}
      activeStrategy={isProfile ? profileActiveStrategy : defaultActiveStrategy}
      className={className}
    />
  );
}

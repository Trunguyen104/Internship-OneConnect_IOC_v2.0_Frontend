'use client';

import { ApartmentOutlined, BankOutlined, TeamOutlined } from '@ant-design/icons';

import ProfileAwareSidebar from './sidebars/ProfileAwareSidebar';

const superAdminMenu = [
  { icon: <TeamOutlined />, label: 'Admin Users', href: '/admin-users' },
  { icon: <BankOutlined />, label: 'Universities', href: '/universities' },
  { icon: <ApartmentOutlined />, label: 'Enterprises', href: '/enterprises' },
];

export default function SidebarSuperAdmin() {
  return (
    <ProfileAwareSidebar
      defaultMenus={superAdminMenu}
      profilePrefix="/profile"
      profileBackButton={{
        href: '/admin-users',
        label: 'Back',
        className: 'text-primary hover:text-primary-hover',
      }}
    />
  );
}

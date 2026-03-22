'use client';

import { ApartmentOutlined, BankOutlined, TeamOutlined } from '@ant-design/icons';

import ProfileAwareSidebar from './sidebars/ProfileAwareSidebar';

const superAdminMenu = [
  { icon: <TeamOutlined />, label: 'User Management', href: '/user-management' },
  { icon: <BankOutlined />, label: 'Universities', href: '/universities' },
  { icon: <ApartmentOutlined />, label: 'Enterprises', href: '/enterprises' },
];

export default function SidebarSuperAdmin() {
  return (
    <ProfileAwareSidebar
      defaultMenus={superAdminMenu}
      profilePrefix="/profile"
      profileBackButton={{
        href: '/user-management',
        label: 'Back',
        className: 'text-primary hover:text-primary-hover',
      }}
    />
  );
}

'use client';

import { AppstoreOutlined, AuditOutlined } from '@ant-design/icons';

import ProfileAwareSidebar from './sidebars/ProfileAwareSidebar';

const enterpriseMenu = [
  { icon: <AppstoreOutlined />, label: 'Dashboard', href: '/dashboard' },
  { icon: <AuditOutlined />, label: 'Evaluation Management', href: '/evaluation' },
];

export default function EnterpriseSidebar() {
  return (
    <ProfileAwareSidebar
      defaultMenus={enterpriseMenu}
      profilePrefix="/profile"
      profileBackButton={{
        href: '/dashboard',
        label: 'Back',
        className: 'text-primary hover:text-primary-hover',
      }}
    />
  );
}

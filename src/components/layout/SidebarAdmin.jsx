'use client';

import { CalendarOutlined, DashboardOutlined, TeamOutlined } from '@ant-design/icons';

import ProfileAwareSidebar from './sidebars/ProfileAwareSidebar';

const adminMenu = [
  { icon: <DashboardOutlined />, label: 'Dashboard', href: '/admin-dashboard' },
  { icon: <CalendarOutlined />, label: 'Internship Terms', href: '/internship-terms' },
  { icon: <TeamOutlined />, label: 'Enrollments', href: '/enrollments' },
];

export default function SidebarAdmin() {
  return (
    <ProfileAwareSidebar
      defaultMenus={adminMenu}
      profilePrefix="/profile"
      profileBackButton={{
        href: '/admin-dashboard',
        label: 'Back',
        className: 'text-primary hover:text-primary-hover',
      }}
    />
  );
}

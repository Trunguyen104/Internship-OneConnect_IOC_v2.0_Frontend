'use client';

import {
  BankOutlined,
  CalendarOutlined,
  DashboardOutlined,
  SolutionOutlined,
  TeamOutlined,
} from '@ant-design/icons';

import ProfileAwareSidebar from './sidebars/ProfileAwareSidebar';

const enterpriseMenu = [
  { icon: <DashboardOutlined />, label: 'Dashboard', href: '/dashboard' },
  {
    icon: <BankOutlined />,
    label: 'My Company',
    href: '/company-profile',
  },
  {
    icon: <CalendarOutlined />,
    label: 'Active Terms',
    href: '/active-terms',
  },
  {
    icon: <SolutionOutlined />,
    label: 'Internship Students',
    href: '/internship-student-management',
  },
  {
    icon: <TeamOutlined />,
    label: 'Internship Groups',
    href: '/internship-group-management',
  },
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

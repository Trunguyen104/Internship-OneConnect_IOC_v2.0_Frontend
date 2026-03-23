'use client';

import { BankOutlined, DashboardOutlined, SolutionOutlined, TeamOutlined } from '@ant-design/icons';

import ProfileAwareSidebar from './sidebars/ProfileAwareSidebar';

const enterpriseMenu = [
  { icon: <DashboardOutlined />, label: 'Dashboard', href: '/dashboard' },
  {
    icon: <BankOutlined />,
    label: 'My Company',
    href: '/company-profile',
  },
  {
    icon: <SolutionOutlined />,
    label: 'Internship Students',
    href: '/internship-student-management',
  },
  {
    icon: <SolutionOutlined />,
    label: 'Internship Groups',
    href: '/internship-group-management',
  },
  {
    icon: <TeamOutlined />,
    label: 'Staff Management',
    href: '/staff-management',
  },

  {
    icon: <TeamOutlined />,
    label: 'Evaluation Management',
    href: '/evaluation',
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

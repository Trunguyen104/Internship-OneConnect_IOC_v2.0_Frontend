'use client';

import {
  BankOutlined,
  CalendarOutlined,
  DashboardOutlined,
  ProjectOutlined,
  SolutionOutlined,
  TeamOutlined,
  WarningOutlined,
} from '@ant-design/icons';

import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

import ProfileAwareSidebar from './sidebars/ProfileAwareSidebar';

const enterpriseMenu = [
  { icon: <DashboardOutlined />, label: 'Dashboard', href: '/dashboard' },
  {
    icon: <CalendarOutlined />,
    label: 'Active Term',
    href: '/active-internship-terms',
  },
  {
    icon: <BankOutlined />,
    label: 'My Company',
    href: '/company-profile',
  },
  {
    icon: <SolutionOutlined />,
    label: 'Internship Management',
    href: '/internship-management',
  },
  {
    icon: <WarningOutlined />,
    label: INTERNSHIP_MANAGEMENT_UI.ENTERPRISE.VIOLATION_REPORT.TITLE,
    href: '/violation-reports',
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

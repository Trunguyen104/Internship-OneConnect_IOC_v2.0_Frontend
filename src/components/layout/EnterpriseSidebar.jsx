'use client';

import {
  BankOutlined,
  CalendarOutlined,
  DashboardOutlined,
  SolutionOutlined,
  TeamOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import React, { useMemo } from 'react';

import { useProfile } from '@/components/features/user/hooks/useProfile';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { USER_ROLE } from '@/constants/user-management/enums';

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
    role: [USER_ROLE.MENTOR],
  },
  {
    icon: <TeamOutlined />,
    label: 'Staff Management',
    href: '/staff-management',
  },

  {
    icon: <SolutionOutlined />,
    label: 'Application',
    href: '/applications',
  },
  {
    icon: <TeamOutlined />,
    label: 'Evaluation Management',
    href: '/evaluation',
  },
];

export default function EnterpriseSidebar() {
  const { userInfo } = useProfile();
  const userRole = userInfo?.role ?? userInfo?.Role;

  const filteredMenu = useMemo(() => {
    return enterpriseMenu.filter((item) => {
      if (!item.role) return true;
      return item.role.includes(userRole);
    });
  }, [userRole]);

  return (
    <ProfileAwareSidebar
      defaultMenus={filteredMenu}
      profilePrefix="/profile"
      profileBackButton={{
        href: '/dashboard',
        label: 'Back',
        className: 'text-primary hover:text-primary-hover',
      }}
    />
  );
}

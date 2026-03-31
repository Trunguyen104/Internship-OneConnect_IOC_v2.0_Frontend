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
    icon: <CalendarOutlined />,
    label: 'Intern Phases',
    href: '/intern-phase-management',
  },
  {
    icon: <SolutionOutlined />,
    label: 'Internship Management',
    href: '/internship-management',
  },
  {
    icon: <ProjectOutlined />,
    label: 'Project Management',
    href: '/projects',
  },
  {
    icon: <WarningOutlined />,
    label: INTERNSHIP_MANAGEMENT_UI.ENTERPRISE.VIOLATION_REPORT.TITLE,
    href: '/violation-reports',
    role: [USER_ROLE.MENTOR, USER_ROLE.ENTERPRISE_ADMIN, USER_ROLE.HR],
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

  const filteredMenu = useMemo(() => {
    const rawRole = userInfo?.roleId || userInfo?.RoleId || userInfo?.role || userInfo?.Role;
    const roleId = rawRole ? Number(rawRole) : null;
    const roleName = String(
      userInfo?.roleName || userInfo?.RoleName || userInfo?.role || userInfo?.Role || ''
    ).toLowerCase();

    return enterpriseMenu.filter((item) => {
      if (!item.role) return true;

      const allowedRoles = item.role || [];

      // 1. Check numeric match
      if (roleId && allowedRoles.includes(roleId)) return true;

      // 2. Check string match (if IDs are strings)
      if (rawRole && allowedRoles.map(String).includes(String(rawRole))) return true;

      // 3. Fallback: check role name strings for common enterprise roles
      if (roleName.includes('mentor') && allowedRoles.includes(USER_ROLE.MENTOR)) return true;
      if (
        (roleName.includes('enterprise') || roleName.includes('admin')) &&
        allowedRoles.includes(USER_ROLE.ENTERPRISE_ADMIN)
      )
        return true;
      if (roleName.includes('hr') && allowedRoles.includes(USER_ROLE.HR)) return true;

      return false;
    });
  }, [userInfo]);

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

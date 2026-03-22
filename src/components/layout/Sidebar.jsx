'use client';

import {
  AppstoreOutlined,
  BarChartOutlined,
  LockOutlined,
  ProjectOutlined,
  ShopOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { useParams, usePathname } from 'next/navigation';
import React, { useMemo } from 'react';

import BaseSidebar from './BaseSidebar';

export default function Sidebar() {
  const pathname = usePathname();
  const params = useParams();
  const internshipGroupId = params?.internshipGroupId;

  const basePath = useMemo(
    () => (internshipGroupId ? `/internship-groups/${internshipGroupId}` : '/internship-groups'),
    [internshipGroupId]
  );

  const studentMenu = useMemo(
    () => [
      { icon: <AppstoreOutlined />, label: 'Space', href: `${basePath}/space` },
      {
        icon: <BarChartOutlined />,
        label: 'General Information',
        href: `${basePath}/general-info`,
      },
      { icon: <ProjectOutlined />, label: 'Project', href: `${basePath}/project` },
      { icon: <TeamOutlined />, label: 'Students', href: `${basePath}/studentlist` },
      { icon: <VideoCameraOutlined />, label: 'Daily Report', href: `${basePath}/daily-report` },
      { icon: <UploadOutlined />, label: 'Evaluation', href: `${basePath}/evaluate` },
      { icon: <UserOutlined />, label: 'Stakeholders', href: `${basePath}/stakeholder` },
      { icon: <ShopOutlined />, label: 'Violations', href: `${basePath}/violation` },
    ],
    [basePath]
  );

  const profileMenu = useMemo(
    () => [
      { icon: <UserOutlined />, label: 'Profile', href: `${basePath}/profile` },
      {
        icon: <LockOutlined />,
        label: 'Change Password',
        href: `${basePath}/profile/change-password`,
      },
    ],
    [basePath]
  );

  const isProfile = pathname.startsWith(`${basePath}/profile`);
  const menus = isProfile ? profileMenu : studentMenu;

  const getBackButton = () => {
    if (isProfile) {
      return {
        href: `${basePath}/space`,
        label: 'Back',
        className: 'text-primary hover:text-primary-hover text-xs font-black',
      };
    }
    if (pathname !== '/internship-groups') {
      return {
        href: '/internship-groups',
        label: 'Back to previous page',
      };
    }
    return null;
  };

  return <BaseSidebar menus={menus} backButton={getBackButton()} />;
}

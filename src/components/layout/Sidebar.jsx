'use client';

import React, { useMemo } from 'react';
import { useParams, usePathname } from 'next/navigation';
import {
  AppstoreOutlined,
  BarChartOutlined,
  TeamOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  UserOutlined,
  ShopOutlined,
  LockOutlined,
  ProjectOutlined,
} from '@ant-design/icons';
import BaseSidebar from './BaseSidebar';

export default function Sidebar() {
  const pathname = usePathname();
  const params = useParams();
  const internshipGroupId = params?.internshipGroupId;

  const basePath = useMemo(
    () => (internshipGroupId ? `/internship-groups/${internshipGroupId}` : ''),
    [internshipGroupId],
  );

  const studentMenu = useMemo(() => {
    const prefix = internshipGroupId
      ? `/internship-groups/${internshipGroupId}`
      : '/internship-groups';
    return [
      { icon: <AppstoreOutlined />, label: 'Space', href: `${prefix}/space` },
      {
        icon: <BarChartOutlined />,
        label: 'General Information',
        href: `${prefix}/general-info`,
      },
      { icon: <ProjectOutlined />, label: 'Project', href: `${prefix}/project` },
      { icon: <TeamOutlined />, label: 'Students', href: `${prefix}/studentlist` },
      { icon: <VideoCameraOutlined />, label: 'Daily Report', href: `${prefix}/daily-report` },
      { icon: <UploadOutlined />, label: 'Evaluation', href: `${prefix}/evaluate` },
      { icon: <UserOutlined />, label: 'Stakeholders', href: `${prefix}/stakeholder` },
      { icon: <ShopOutlined />, label: 'Violations', href: `${prefix}/violation` },
    ];
  }, [internshipGroupId]);

  const profileMenu = useMemo(
    () => [
      { icon: <UserOutlined />, label: 'Profile', href: `${basePath || ''}/profile` },
      {
        icon: <LockOutlined />,
        label: 'Change Password',
        href: `${basePath || ''}/profile/change-password`,
      },
    ],
    [basePath],
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

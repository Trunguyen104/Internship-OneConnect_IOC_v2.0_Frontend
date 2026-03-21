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
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import React, { useMemo } from 'react';

import BaseSidebar from './BaseSidebar';

export default function Sidebar() {
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  const internshipGroupId = params?.internshipGroupId;
  const returnTo = searchParams?.get('returnTo');

  const basePath = useMemo(
    () => (internshipGroupId ? `/internship-groups/${internshipGroupId}` : ''),
    [internshipGroupId]
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

  const profileMenu = useMemo(() => {
    const computedReturnTo =
      returnTo || (internshipGroupId ? `/internship-groups/${internshipGroupId}/space` : null);

    const query = computedReturnTo ? `?returnTo=${encodeURIComponent(computedReturnTo)}` : '';

    return [
      { icon: <UserOutlined />, label: 'Profile', href: `/profile${query}` },
      {
        icon: <LockOutlined />,
        label: 'Change Password',
        href: `/profile/change-password${query}`,
      },
    ];
  }, [internshipGroupId, returnTo]);

  const isProfile = pathname.startsWith('/profile');
  const menus = isProfile ? profileMenu : studentMenu;

  const getBackButton = () => {
    if (isProfile) {
      if (returnTo) {
        return {
          href: returnTo,
          label: 'Back',
          className: 'text-primary hover:text-primary-hover text-xs font-black',
        };
      }
      if (!internshipGroupId) {
        return {
          href: '/internship-groups',
          label: 'Back',
          className: 'text-primary hover:text-primary-hover text-xs font-black',
        };
      }
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

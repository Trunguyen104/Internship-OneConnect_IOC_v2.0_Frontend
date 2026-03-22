'use client';

import { CalendarOutlined, DashboardOutlined, TeamOutlined } from '@ant-design/icons';
import React from 'react';

import BaseSidebar from './BaseSidebar';

const adminMenu = [
  { icon: <DashboardOutlined />, label: 'Dashboard', href: '/admin-dashboard' },
  { icon: <CalendarOutlined />, label: 'Internship Terms', href: '/internship-terms' },
  { icon: <TeamOutlined />, label: 'Enrollments', href: '/enrollments' },
];

export default function SidebarAdmin() {
  return <BaseSidebar menus={adminMenu} activeStrategy="prefix" />;
}

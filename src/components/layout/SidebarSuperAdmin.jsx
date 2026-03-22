'use client';

import { TeamOutlined, BankOutlined, ApartmentOutlined } from '@ant-design/icons';
import BaseSidebar from './BaseSidebar';

const superAdminMenu = [
  { icon: <TeamOutlined />, label: 'Admin Users', href: '/admin-users' },
  { icon: <BankOutlined />, label: 'Universities', href: '/universities' },
  { icon: <ApartmentOutlined />, label: 'Enterprises', href: '/enterprises' },
];

export default function SidebarSuperAdmin() {
  return <BaseSidebar menus={superAdminMenu} activeStrategy='prefix' />;
}

'use client';

import { Spin } from 'antd';
import { useEffect, useState } from 'react';

import { userService } from '@/components/features/user/services/user.service';
import EnterpriseSidebar from '@/components/layout/EnterpriseSidebar';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import SidebarAdmin from '@/components/layout/SidebarAdmin';
import SidebarSuperAdmin from '@/components/layout/SidebarSuperAdmin';
import { USER_ROLE } from '@/constants/common/enums';

export default function ProfileLayout({ children }) {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await userService.getMe();
        const userData = res?.data || res;
        setRole(userData?.role);
      } catch (error) {
        console.error('Failed to fetch user for profile layout:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const renderSidebar = () => {
    const normalizedRole = String(role).toLowerCase();

    // Enterprise roles check
    if (
      role === USER_ROLE.ENTERPRISE_ADMIN ||
      role === USER_ROLE.HR ||
      role === USER_ROLE.MENTOR ||
      normalizedRole === 'enterpriseadmin' ||
      normalizedRole === 'hr' ||
      normalizedRole === 'mentor'
    ) {
      return <EnterpriseSidebar />;
    }

    // Super Admin roles check
    if (
      role === USER_ROLE.SUPER_ADMIN ||
      role === USER_ROLE.MODERATOR ||
      normalizedRole === 'superadmin' ||
      normalizedRole === 'super_admin' ||
      normalizedRole === 'moderator'
    ) {
      return <SidebarSuperAdmin />;
    }

    // School Admin roles check
    if (role === USER_ROLE.SCHOOL_ADMIN || normalizedRole === 'schooladmin') {
      return <SidebarAdmin />;
    }

    // Default to student sidebar (Sidebar)
    return <Sidebar />;
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Spin size="large" description="Initializing profile layout..." />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {renderSidebar()}
      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-gray-50 p-6 2xl:px-10">
          <div className="mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col 2xl:max-w-[2200px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

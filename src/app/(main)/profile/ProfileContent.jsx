'use client';

import { Spin } from 'antd';
import { useEffect, useState } from 'react';

import EnterpriseProfileContainer from '@/components/features/company-profile/components/EnterpriseProfileContainer';
import ProfilePage from '@/components/features/user/components/ProfilePage';
import { userService } from '@/components/features/user/services/userService';
import { USER_ROLE } from '@/constants/common/enums';

/**
 * ProfileContent dynamically renders the appropriate profile component
 * based on the user's role.
 */
export default function ProfileContent() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await userService.getMe();
        const userData = res?.data || res;

        // Normalize role to string or enum value
        const rawRole = userData?.role;
        setRole(rawRole);
      } catch (error) {
        console.error('Failed to fetch user role:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRole();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spin size="large" description="Loading profile..." />
      </div>
    );
  }

  // Enterprise roles list (normalized comparison)
  const isEnterpriseRole =
    role === USER_ROLE.ENTERPRISE_ADMIN ||
    role === USER_ROLE.HR ||
    role === USER_ROLE.MENTOR ||
    String(role).toLowerCase() === 'enterpriseadmin' ||
    String(role).toLowerCase() === 'hr' ||
    String(role).toLowerCase() === 'mentor';

  if (isEnterpriseRole) {
    return <EnterpriseProfileContainer />;
  }

  // Student and Administration roles use the generic ProfilePage
  // ProfilePage is already designed to be somewhat generic but focused on User Info + Skills
  return <ProfilePage />;
}

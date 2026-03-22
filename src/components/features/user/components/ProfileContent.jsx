'use client';

import { Spin } from 'antd';
import { useEffect, useState } from 'react';

import EnterpriseProfileContainer from '@/components/features/company-profile/components/EnterpriseProfileContainer';
import ProfilePage from '@/components/features/user/components/ProfilePage';
import { userService } from '@/components/features/user/services/userService';
import { USER_ROLE } from '@/constants/common/enums';

export default function ProfileContent() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await userService.getMe();
        const userData = res?.data || res;
        setRole(userData?.role);
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

  const normalizedRole = String(role).toLowerCase();
  const isEnterpriseRole = [
    USER_ROLE.ENTERPRISE_ADMIN,
    USER_ROLE.HR,
    USER_ROLE.MENTOR,
    'enterpriseadmin',
    'hr',
    'mentor',
  ].includes(normalizedRole);

  if (isEnterpriseRole) {
    return <EnterpriseProfileContainer />;
  }

  return <ProfilePage />;
}

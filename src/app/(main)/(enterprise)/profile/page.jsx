'use client';

import { Spin } from 'antd';
import { useEffect, useState } from 'react';

import EnterpriseProfileContainer from '@/components/features/company-profile/components/EnterpriseProfileContainer';
import ProfilePage from '@/components/features/user/components/ProfilePage';
import { userService } from '@/components/features/user/services/userService';

export default function GeneralProfilePage() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await userService.getMe();
        const user = res?.data || res;
        setRole(user?.role);
      } catch (err) {
        console.error('Failed to fetch role info', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRole();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  // EnterpriseAdmin = 4, HR = 5 in backend enum (UserRole.cs)
  // Check both number and string representations just in case
  const isEnterpriseRole = role === 'EnterpriseAdmin' || role === 4 || role === 'HR' || role === 5;

  return (
    <div className="w-full">
      {isEnterpriseRole ? <EnterpriseProfileContainer /> : <ProfilePage />}
    </div>
  );
}

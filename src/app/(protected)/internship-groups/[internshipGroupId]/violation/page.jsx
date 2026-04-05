'use client';

import React from 'react';

import ViolationPage from '@/components/features/violation/components/ViolationPage';
import ViolationManagement from '@/components/features/violation-reports/components';
import { USER_ROLE } from '@/constants/user-management/enums';
import { useAuthStore } from '@/store/useAuthStore';

export default function Page() {
  const user = useAuthStore((state) => state.user);
  const role = Number(user?.role);

  const isManagement = [USER_ROLE.MENTOR, USER_ROLE.HR, USER_ROLE.ENTERPRISE_ADMIN].includes(role);

  if (isManagement) {
    return <ViolationManagement />;
  }

  return <ViolationPage />;
}

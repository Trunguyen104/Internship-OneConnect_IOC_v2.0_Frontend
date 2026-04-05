'use client';

import { useParams } from 'next/navigation';
import React from 'react';

import EvaluationPage from '@/components/features/evaluation/components/EvaluationPage';
import EvaluationContainer from '@/components/features/evaluation/components/mentor/EvaluationContainer';
import { USER_ROLE } from '@/constants/user-management/enums';
import { useAuthStore } from '@/store/useAuthStore';

export default function Page() {
  const { internshipGroupId } = useParams();
  const user = useAuthStore((state) => state.user);
  const role = Number(user?.role);

  const isManagement = [USER_ROLE.MENTOR, USER_ROLE.HR, USER_ROLE.ENTERPRISE_ADMIN].includes(role);

  if (isManagement) {
    return <EvaluationContainer targetGroupId={internshipGroupId} />;
  }

  return <EvaluationPage />;
}

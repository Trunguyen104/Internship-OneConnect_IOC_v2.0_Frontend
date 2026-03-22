'use client';

import { InfoCircleOutlined } from '@ant-design/icons';

import { ENTERPRISE_PROFILE_UI } from '@/constants/company-profile/uiText';

import { ProfileDescription } from './ProfileDescription';
import { ProfileSectionCard } from './ProfileSectionCard';

export function ProfileOverviewCard({ profile }) {
  return (
    <ProfileSectionCard
      title={ENTERPRISE_PROFILE_UI.ENTERPRISE.OVERVIEW}
      icon={<InfoCircleOutlined />}
    >
      <ProfileDescription profile={profile} />
    </ProfileSectionCard>
  );
}

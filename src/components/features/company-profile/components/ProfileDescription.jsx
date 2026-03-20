'use client';

import { memo } from 'react';
import { Typography } from 'antd';
import { Plus } from 'lucide-react';
import { ENTERPRISE_PROFILE_UI } from '@/constants/company-profile/uiText';
import { EmptyState } from '@/components/ui/atoms';

const { Paragraph } = Typography;

export const ProfileDescription = memo(function ProfileDescription({ profile, onEdit }) {
  if (!profile?.description) {
    return (
      <EmptyState
        title={ENTERPRISE_PROFILE_UI.ENTERPRISE.NO_DESCRIPTION}
        description={ENTERPRISE_PROFILE_UI.ENTERPRISE.ADD_OVERVIEW_HINT}
        minHeightClassName='min-h-[260px]'
      />
    );
  }

  return (
    <Paragraph className='text-muted !mb-0 whitespace-pre-wrap'>{profile.description}</Paragraph>
  );
});

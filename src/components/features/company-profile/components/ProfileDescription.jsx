'use client';

import { memo } from 'react';

import { EmptyState } from '@/components/ui/atoms';
import { ENTERPRISE_PROFILE_UI } from '@/constants/company-profile/uiText';

// Unused Typography parts removed

export const ProfileDescription = memo(function ProfileDescription({ profile }) {
  if (!profile?.description) {
    return (
      <EmptyState
        title={ENTERPRISE_PROFILE_UI.ENTERPRISE.NO_DESCRIPTION}
        description={ENTERPRISE_PROFILE_UI.ENTERPRISE.ADD_OVERVIEW_HINT}
        minHeightClassName="min-h-[300px]"
      />
    );
  }

  return (
    <div className="prose prose-slate max-w-none">
      <p className="text-base leading-loose text-text/80 whitespace-pre-wrap font-medium">
        {profile.description}
      </p>
    </div>
  );
});

import Image from 'next/image';
import React from 'react';

import Badge from '@/components/ui/badge';
import { PROFILE_UI } from '@/constants/user/uiText';

export default function ProfileHeader({ userInfo, avatarUrl }) {
  const finalAvatarUrl =
    avatarUrl || userInfo?.avatarUrl || userInfo?.AvatarUrl || '/assets/images/default-avatar.png';

  return (
    <div className="border-border flex items-center gap-6 border-b pb-6">
      <Image src={finalAvatarUrl} alt="Avatar" width={100} height={100} className="rounded-full" />

      <div className="flex-1">
        <div className="flex items-center gap-3">
          <h2 className="text-text text-2xl font-bold">
            {userInfo?.fullName || userInfo?.FullName || PROFILE_UI.AVATAR.DEFAULT_NAME}
          </h2>
          <Badge variant="primary" className="rounded-full px-3 py-1 text-xs">
            {PROFILE_UI.ROLE_LABELS[userInfo?.role || userInfo?.Role] ||
              userInfo?.role ||
              userInfo?.Role ||
              '—'}
          </Badge>
        </div>
        <p className="text-muted mt-1 text-sm font-medium">{userInfo?.email || userInfo?.Email}</p>
      </div>
    </div>
  );
}

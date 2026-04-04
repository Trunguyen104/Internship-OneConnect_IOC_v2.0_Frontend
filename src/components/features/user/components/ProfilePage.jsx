'use client';

import { useProfile } from '../hooks/useProfile';
import ProfileInfo from './ProfileInfo';

export default function ProfilePage() {
  const profile = useProfile();

  return (
    <section className="space-y-6">
      <ProfileInfo
        userInfo={profile.userInfo}
        loadingUser={profile.loadingUser}
        updatingProfile={profile.updatingProfile}
        avatarUrl={profile.avatarUrl}
        onAvatarChange={profile.setAvatarUrl}
        isEditModalOpen={profile.isEditModalOpen}
        setIsEditModalOpen={profile.setIsEditModalOpen}
        onSaveProfile={profile.updateProfile}
        onDownloadCV={profile.handleDownloadCV}
      />
    </section>
  );
}

'use client';

import { useState } from 'react';

import { useProfile } from '@/components/features/user/hooks/useProfile';
import Modal from '@/components/ui/modal';
import { PROFILE_UI } from '@/constants/user/uiText';

import ChangePass from './ChangePass';
import ProfileDetails from './ProfileDetails';
import ProfileEditModal from './ProfileEditModal';
import ProfileHeader from './ProfileHeader';

export default function ProfilePage() {
  const { userInfo, loadingUser, avatarUrl, setAvatarUrl, updateProfile } = useProfile();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChangePassOpen, setIsChangePassOpen] = useState(false);

  const handleDownloadCV = () => {
    const cvUrl = userInfo?.cvUrl || userInfo?.CvUrl;
    if (cvUrl) {
      window.open(cvUrl, '_blank');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Profile Identity Card (Header) */}
      <ProfileHeader
        userInfo={userInfo}
        avatarUrl={avatarUrl}
        onAvatarChange={setAvatarUrl}
        onEditClick={() => setIsEditModalOpen(true)}
        onChangePassClick={() => setIsChangePassOpen(true)}
      />

      {/* Profile Detailed Info Grid */}
      <ProfileDetails
        userInfo={userInfo}
        loadingUser={loadingUser}
        onDownloadCV={handleDownloadCV}
      />

      {/* Modal: Edit Profile Information */}
      <ProfileEditModal
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        userInfo={userInfo}
        onSave={updateProfile}
      />

      {/* Modal: Change Password */}
      <Modal
        open={isChangePassOpen}
        onCancel={() => setIsChangePassOpen(false)}
        title={null}
        width={500}
      >
        <div className="p-4">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {PROFILE_UI.CHANGE_PASSWORD.TITLE}
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              {PROFILE_UI.CHANGE_PASSWORD.HINT}
            </p>
          </div>
          <ChangePass onClose={() => setIsChangePassOpen(false)} />
        </div>
      </Modal>
    </div>
  );
}

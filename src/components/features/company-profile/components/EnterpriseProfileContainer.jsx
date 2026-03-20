'use client';

import { App } from 'antd';
import { useCallback, useEffect } from 'react';

import { ENTERPRISE_PROFILE_UI } from '@/constants/company-profile/uiText';

import { useEnterpriseProfile } from '../hooks/useEnterpriseProfile';
import { EnterpriseProfile } from './EnterpriseProfile';
import EnterpriseProfileEditDrawer from './EnterpriseProfileEditDrawer';
import { ProfileEmpty, ProfileLoading } from './ProfileEmpty';

export default function EnterpriseProfileContainer() {
  const { message } = App.useApp();
  const {
    loading,
    saving,
    profile,
    isEditOpen,
    error,
    saveProfile,
    openEdit,
    closeEdit,
    refetch,
    canEdit,
  } = useEnterpriseProfile();

  useEffect(() => {
    if (!error) return;
    message.error(error?.message || ENTERPRISE_PROFILE_UI.LOADING_ERROR);
  }, [error, message]);

  const handleSave = useCallback(
    async (updatedData) => {
      const result = await saveProfile(updatedData);
      if (result.ok) {
        message.success(ENTERPRISE_PROFILE_UI.UPDATE_SUCCESS);
        closeEdit();
      } else {
        message.error(result.error?.message || ENTERPRISE_PROFILE_UI.UPDATE_ERROR);
      }
    },
    [closeEdit, message, saveProfile]
  );

  const handleRetry = useCallback(async () => {
    const result = await refetch();
    if (!result.ok) message.error(result.error?.message || ENTERPRISE_PROFILE_UI.LOADING_ERROR);
  }, [message, refetch]);

  const handleLogoChange = useCallback(
    async (file) => {
      const result = await saveProfile({ ...profile, logoUrl: file });
      if (result.ok) {
        message.success(ENTERPRISE_PROFILE_UI.UPDATE_SUCCESS);
      } else {
        message.error(result.error?.message || ENTERPRISE_PROFILE_UI.UPDATE_ERROR);
      }
    },
    [message, profile, saveProfile]
  );

  const handleBannerChange = useCallback(
    async (file) => {
      const result = await saveProfile({ ...profile, backgroundUrl: file });
      if (result.ok) {
        message.success(ENTERPRISE_PROFILE_UI.UPDATE_SUCCESS);
      } else {
        message.error(result.error?.message || ENTERPRISE_PROFILE_UI.UPDATE_ERROR);
      }
    },
    [message, profile, saveProfile]
  );

  if (loading) return <ProfileLoading />;
  if (!profile) return <ProfileEmpty onRetry={handleRetry} />;

  return (
    <>
      <EnterpriseProfile
        profile={profile}
        onEdit={canEdit ? openEdit : null}
        onLogoChange={canEdit ? handleLogoChange : null}
        onBannerChange={canEdit ? handleBannerChange : null}
      />
      <EnterpriseProfileEditDrawer
        open={isEditOpen}
        saving={saving}
        profile={profile}
        onClose={closeEdit}
        onSave={handleSave}
      />
    </>
  );
}

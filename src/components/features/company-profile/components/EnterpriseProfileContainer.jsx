'use client';

import { useCallback, useEffect } from 'react';

import { ENTERPRISE_PROFILE_UI } from '@/constants/company-profile/uiText';
import { useToast } from '@/providers/ToastProvider';

import { useEnterpriseProfile } from '../hooks/useEnterpriseProfile';
import { EnterpriseProfile } from './EnterpriseProfile';
import EnterpriseProfileEditDrawer from './EnterpriseProfileEditDrawer';
import { ProfileEmpty, ProfileLoading } from './ProfileEmpty';

export default function EnterpriseProfileContainer() {
  const toast = useToast();
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
    toast.error(error?.message || ENTERPRISE_PROFILE_UI.LOADING_ERROR);
  }, [error, toast]);

  const handleSave = useCallback(
    async (updatedData) => {
      const result = await saveProfile(updatedData);
      if (result.ok) {
        toast.success(ENTERPRISE_PROFILE_UI.UPDATE_SUCCESS);
        closeEdit();
      } else {
        toast.error(result.error?.message || ENTERPRISE_PROFILE_UI.UPDATE_ERROR);
      }
    },
    [closeEdit, toast, saveProfile]
  );

  const handleRetry = useCallback(async () => {
    const result = await refetch();
    if (!result.ok) toast.error(result.error?.message || ENTERPRISE_PROFILE_UI.LOADING_ERROR);
  }, [toast, refetch]);

  const handleLogoChange = useCallback(
    async (file) => {
      const result = await saveProfile({ ...profile, logoUrl: file });
      if (result.ok) {
        toast.success(ENTERPRISE_PROFILE_UI.UPDATE_SUCCESS);
      } else {
        toast.error(result.error?.message || ENTERPRISE_PROFILE_UI.UPDATE_ERROR);
      }
    },
    [toast, profile, saveProfile]
  );

  const handleBannerChange = useCallback(
    async (file) => {
      const result = await saveProfile({ ...profile, backgroundUrl: file });
      if (result.ok) {
        toast.success(ENTERPRISE_PROFILE_UI.UPDATE_SUCCESS);
      } else {
        toast.error(result.error?.message || ENTERPRISE_PROFILE_UI.UPDATE_ERROR);
      }
    },
    [toast, profile, saveProfile]
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

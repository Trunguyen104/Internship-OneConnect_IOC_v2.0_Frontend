'use client';

import { useCallback, useEffect, useState } from 'react';

import { userService } from '@/components/features/user/services/userService';
import { USER_ROLE } from '@/constants/common/enums';
import { mediaService } from '@/services/media.service';

import { getEnterpriseById, updateEnterpriseProfile } from '../services/enterpriseProfile.service';

function normalizeProfileResponse(response) {
  if (response?.data?.data) return response.data.data;
  if (response?.success && response?.data) return response.data;
  if (response?.data?.items && Array.isArray(response.data.items))
    return response.data.items[0] ?? null;
  return response?.data ?? response ?? null;
}

function normalizeEnterpriseProfile(profile) {
  if (!profile || typeof profile !== 'object') return profile;

  const normalized = { ...profile };

  if (normalized.taxCode == null) {
    normalized.taxCode = profile.taxcode ?? profile.tax_code ?? profile.taxCODE ?? null;
  }

  if (normalized.enterpriseId == null) {
    normalized.enterpriseId = profile.enterpriseID ?? profile.enterprise_id ?? null;
  }

  return normalized;
}

function toUpdatablePayload(values, profile) {
  const payload = {
    name: values?.name ?? '',
    description: values?.description ?? '',
    industry: values?.industry ?? '',
    address: values?.address ?? '',
    website: values?.website ?? '',
  };

  const nextTaxCode = values?.taxCode ?? profile?.taxCode;
  if (nextTaxCode) payload.taxCode = nextTaxCode;

  const nextLogoUrl = values?.logoUrl;
  if (nextLogoUrl && nextLogoUrl !== profile?.logoUrl && !String(nextLogoUrl).startsWith('data:')) {
    payload.logoUrl = nextLogoUrl;
  }

  const nextBackgroundUrl = values?.backgroundUrl;
  if (
    nextBackgroundUrl &&
    nextBackgroundUrl !== profile?.backgroundUrl &&
    !String(nextBackgroundUrl).startsWith('data:')
  ) {
    payload.backgroundUrl = nextBackgroundUrl;
  }

  if (profile?.rowVersion !== undefined && profile?.rowVersion !== null) {
    payload.rowVersion = profile.rowVersion;
  }

  return payload;
}

export function useEnterpriseProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);

      const meResponse = await userService.getMe();
      const meData = meResponse?.data || meResponse;

      if (meData?.role) {
        setUserRole(meData.role);
      }

      const enterpriseId = meData?.enterpriseId || meData?.enterprise_id || meData?.enterpriseID;

      if (!enterpriseId) {
        throw new Error('Unable to find enterprise ID for the current user');
      }

      const response = await getEnterpriseById(enterpriseId);

      const profileData = normalizeEnterpriseProfile(normalizeProfileResponse(response));
      if (!profileData) throw new Error('Profile data format is invalid');
      setProfile(profileData);

      setError(null);
      return { ok: true, data: profileData, error: null };
    } catch (error) {
      setError(error);
      return { ok: false, data: null, error };
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile(true);
  }, [fetchProfile]);

  const openEdit = useCallback(() => setIsEditOpen(true), []);
  const closeEdit = useCallback(() => setIsEditOpen(false), []);

  const saveProfile = useCallback(
    async (values) => {
      if (!profile) return { ok: false, error: new Error('No profile loaded') };

      try {
        setSaving(true);
        const enterpriseId = profile?.enterpriseId || profile?.id;
        if (!enterpriseId) throw new Error('Missing enterpriseId');

        let logoUrl = values?.logoUrl;
        let backgroundUrl = values?.backgroundUrl;

        // Upload logo if it's a File
        if (logoUrl instanceof File) {
          const uploadRes = await mediaService.uploadImage(logoUrl, 'Enterprises');
          if (uploadRes?.success && uploadRes?.data) {
            logoUrl = uploadRes.data;
          } else {
            throw new Error('Failed to upload logo');
          }
        }

        // Upload background if it's a File
        if (backgroundUrl instanceof File) {
          const uploadRes = await mediaService.uploadImage(backgroundUrl, 'Enterprises');
          if (uploadRes?.success && uploadRes?.data) {
            backgroundUrl = uploadRes.data;
          } else {
            throw new Error('Failed to upload background');
          }
        }

        const payload = toUpdatablePayload({ ...values, logoUrl, backgroundUrl }, profile);
        const updateResponse = await updateEnterpriseProfile(enterpriseId, payload);

        const updatedFromResponse = normalizeEnterpriseProfile(
          normalizeProfileResponse(updateResponse)
        );
        if (updatedFromResponse) {
          setProfile((prev) => {
            if (!prev) return updatedFromResponse;
            if (updatedFromResponse.taxCode == null && prev.taxCode != null) {
              return { ...updatedFromResponse, taxCode: prev.taxCode };
            }
            return updatedFromResponse;
          });
        }

        const refresh = await fetchProfile(false);
        if (!refresh.ok) throw refresh.error;
        return { ok: true, error: null };
      } catch (error) {
        return { ok: false, error };
      } finally {
        setSaving(false);
      }
    },
    [fetchProfile, profile]
  );

  const refetch = useCallback(() => fetchProfile(true), [fetchProfile]);

  return {
    loading,
    saving,
    profile,
    isEditOpen,
    error,
    openEdit,
    closeEdit,
    saveProfile,
    refetch,
    fetchProfile,
    canEdit: userRole !== USER_ROLE.HR,
  };
}

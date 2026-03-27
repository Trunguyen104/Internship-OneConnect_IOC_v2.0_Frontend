'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

import { userService } from '@/components/features/user/services/user.service';
import { USER_ROLE } from '@/constants/common/enums';
import { mediaService } from '@/services/media.service';

import { getEnterpriseById, updateEnterpriseProfile } from '../services/enterprise-profile.service';

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
    normalized.taxCode =
      profile.taxcode ?? profile.tax_code ?? profile.taxCODE ?? profile.TaxCode ?? null;
  }

  if (normalized.enterpriseId == null) {
    normalized.enterpriseId =
      profile.enterpriseID ?? profile.enterprise_id ?? profile.EnterpriseId ?? null;
  }

  if (normalized.logoUrl == null) {
    normalized.logoUrl = profile.LogoUrl ?? null;
  }

  if (normalized.backgroundUrl == null) {
    normalized.backgroundUrl =
      profile.BackgroundUrl ?? profile.backgroundUrl1 ?? profile.BackgroundUrl1 ?? null;
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
  if (nextLogoUrl && !String(nextLogoUrl).startsWith('data:')) {
    payload.logoUrl = nextLogoUrl;
  }

  const nextBackgroundUrl = values?.backgroundUrl;
  if (nextBackgroundUrl && !String(nextBackgroundUrl).startsWith('data:')) {
    payload.backgroundUrl = nextBackgroundUrl;
  }

  if (profile?.rowVersion !== undefined && profile?.rowVersion !== null) {
    payload.rowVersion = profile.rowVersion;
  }

  return payload;
}

export function useEnterpriseProfile() {
  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // 1. Fetch User Role & Enterprise Profile
  const {
    data: profileResult = { profile: null, userRole: null },
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['enterprise-profile-context'],
    queryFn: async () => {
      try {
        const meResponse = await userService.getMe();
        const meData = meResponse?.data || meResponse;
        const userRole = meData?.role || null;
        const enterpriseId = meData?.enterpriseId || meData?.enterprise_id || meData?.enterpriseID;

        if (!enterpriseId) {
          throw new Error('Unable to find enterprise ID for the current user');
        }

        const enterpriseResponse = await getEnterpriseById(enterpriseId);
        const profile = normalizeEnterpriseProfile(normalizeProfileResponse(enterpriseResponse));

        if (!profile) throw new Error('Profile data format is invalid');

        return { profile, userRole };
      } catch (err) {
        throw err;
      }
    },
    staleTime: 10 * 60 * 1000,
  });

  const { profile, userRole } = profileResult;

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
        await updateEnterpriseProfile(enterpriseId, payload);

        await refetch();
        return { ok: true, error: null };
      } catch (err) {
        return { ok: false, error: err };
      } finally {
        setSaving(false);
      }
    },
    [profile, refetch]
  );

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
    fetchProfile: refetch, // Aliased for compatibility
    canEdit: userRole !== USER_ROLE.HR,
  };
}

'use client';

import { useState, useEffect } from 'react';
import { message } from 'antd';
import { enterpriseService } from '@/components/features/dashboard/services/enterprise.service';
import { EnterpriseProfile } from './EnterpriseProfile';
import { PROFILE_UI } from '@/constants/user/uiText';

export default function EnterpriseProfileContainer() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await enterpriseService.getEnterpriseHRProfile();
      // Handle wrapped API responses
      // It might be { isSuccess: true, data: { ... } }
      // OR { isSuccess: true, data: { items: [ { ... } ] } }
      let profileData = null;
      if (data?.data?.items && Array.isArray(data.data.items)) {
        profileData = data.data.items[0];
      } else {
        profileData = data?.data || data;
      }

      console.log('Extracted Profile Data:', profileData);
      setProfile(profileData);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      message.error(error.message || PROFILE_UI.LOADING_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updatedData) => {
    try {
      setSaving(true);
      // Construct payload taking care of optimistic locking
      const payload = {
        name: updatedData.name,
        description: updatedData.description,
        website: updatedData.website,
        headquater: updatedData.headquater, // as per typical namings, check backend API specifics, assume same from GET
        industry: updatedData.industry,
        // taxCode is disabled/read-only usually not updated or ignored
        rowVersion: profile.rowVersion,
      };

      await enterpriseService.updateEnterpriseProfile(profile.id, payload);
      message.success(PROFILE_UI.UPDATE_SUCCESS);
      setEditMode(false);
      fetchProfile(); // refresh data to get latest rowVersion
    } catch (error) {
      console.error('Failed to update profile:', error);
      message.error(error.message || PROFILE_UI.UPDATE_ERROR);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className='p-8 text-center'>
        <div className='border-primary/20 border-t-primary inline-block h-8 w-8 animate-spin rounded-full border-4'></div>
        <p className='text-muted mt-2 text-sm'>{PROFILE_UI.LOADING}</p>
      </div>
    );
  }

  if (!profile) {
    return <div className='text-muted p-8 text-center'>{PROFILE_UI.EMPTY.NO_DATA}</div>;
  }

  return (
    <EnterpriseProfile
      profile={profile}
      editMode={editMode}
      onEdit={() => setEditMode(true)}
      onCancel={() => setEditMode(false)}
      onSave={handleSave}
      isSaving={saving}
    />
  );
}

'use client';

import { useState, useEffect } from 'react';
import { message } from 'antd';
import { enterpriseService } from '@/components/features/dashboard/services/enterprise.service';
import { EnterpriseProfile } from './EnterpriseProfile';

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

      console.log("Extracted Profile Data:", profileData);
      setProfile(profileData);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      message.error(error.message || 'Failed to load profile data');
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
      message.success('Profile updated successfully');
      setEditMode(false);
      fetchProfile(); // refresh data to get latest rowVersion
    } catch (error) {
      console.error('Failed to update profile:', error);
      message.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className='p-8 text-center'>
        <div className='animate-spin inline-block w-8 h-8 rounded-full border-4 border-t-red-700 border-red-200'></div>
      </div>
    );
  }

  if (!profile) {
    return <div className='p-8 text-center text-gray-500'>No profile data found.</div>;
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


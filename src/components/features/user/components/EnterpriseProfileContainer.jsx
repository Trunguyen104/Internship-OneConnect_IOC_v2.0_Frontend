'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button, Empty, Spin, message } from 'antd';
import { HistoryOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { enterpriseService } from '@/components/features/dashboard/services/enterprise.service';
import { EnterpriseProfile } from './EnterpriseProfile';
import { PROFILE_UI } from '@/constants/user/uiText';

function toEllipsis(value) {
  if (!value) return value;
  return value.replace('...', '…');
}

/**
 * EnterpriseProfileContainer
 * Handles data fetching and business logic for the Enterprise Profile feature.
 * Follows Vercel React Best Practices for data fetching and state management.
 */
export default function EnterpriseProfileContainer() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // Fetch profile data with error handling and normalization
  const fetchProfile = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);

      const response = await enterpriseService.getEnterpriseHRProfile();

      // Normalize response according to API structure
      let profileData = null;
      if (response?.data?.items && Array.isArray(response.data.items)) {
        profileData = response.data.items[0];
      } else {
        profileData = response?.data || response;
      }

      if (!profileData) {
        throw new Error('Profile data format is invalid');
      }

      setProfile(profileData);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      message.error(error.message || PROFILE_UI.LOADING_ERROR);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSave = async (updatedData) => {
    try {
      setSaving(true);

      const payload = {
        ...updatedData,
        // rowVersion is critical for optimistic concurrency control if backend requires it
        rowVersion: profile?.rowVersion,
      };

      await enterpriseService.updateEnterpriseProfile(
        profile?.enterpriseId || profile?.id,
        payload,
      );

      message.success(PROFILE_UI.UPDATE_SUCCESS);
      setEditMode(false);
      // Refresh data to get latest updates and rowVersion
      await fetchProfile(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      message.error(error.message || PROFILE_UI.UPDATE_ERROR);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className='flex min-h-[400px] items-center justify-center p-12'>
        <Spin size='large' tip={toEllipsis(PROFILE_UI.LOADING)} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className='m-8 rounded-3xl border border-dashed border-gray-200 bg-white p-10'>
        <Empty description={PROFILE_UI.EMPTY.NO_DATA}>
          <Button onClick={() => fetchProfile()}>Try Again</Button>
        </Empty>
      </div>
    );
  }

  return (
    <EnterpriseProfile
      profile={profile}
      editMode={editMode}
      onEdit={() => setEditMode(true)}
      onCancel={() => setEditMode(false)}
      onSave={handleSave}
      isSaving={saving}
    >
      <EnterpriseProfile.Banner />
      <EnterpriseProfile.Identity />

      <EnterpriseProfile.Content>
        <EnterpriseProfile.Main>
          <EnterpriseProfile.Card
            title={PROFILE_UI.ENTERPRISE.OVERVIEW}
            icon={<InfoCircleOutlined />}
          >
            <EnterpriseProfile.Description />
          </EnterpriseProfile.Card>
          <EnterpriseProfile.Card
            title={PROFILE_UI.ENTERPRISE.ACTIVITIES}
            icon={<HistoryOutlined />}
          >
            <EnterpriseProfile.Activities />
          </EnterpriseProfile.Card>
        </EnterpriseProfile.Main>

        <EnterpriseProfile.Sidebar>
          <EnterpriseProfile.Card title={PROFILE_UI.ENTERPRISE.INFO} icon={<InfoCircleOutlined />}>
            <EnterpriseProfile.InfoPanel />
          </EnterpriseProfile.Card>
        </EnterpriseProfile.Sidebar>
      </EnterpriseProfile.Content>
    </EnterpriseProfile>
  );
}

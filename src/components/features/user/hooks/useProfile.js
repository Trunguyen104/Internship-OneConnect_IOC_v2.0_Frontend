'use client';

import { useCallback, useEffect, useState } from 'react';

import { userService } from '@/components/features/user/services/user.service';
import { useToast } from '@/providers/ToastProvider';
import { mediaService } from '@/services/media.service';
import { downloadBlob } from '@/utils/common/fileUtils';

export function useProfile() {
  const toast = useToast();
  const [userInfo, setUserInfo] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [cvUrl, setCvUrl] = useState(null);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchMe = useCallback(
    async (silent = false) => {
      try {
        if (!silent) setLoadingUser(true);
        const res = await userService.getMe();
        const userData = res?.data || res;
        if (userData) {
          setUserInfo(userData);
          const aUrl = userData.avatarUrl || userData.AvatarUrl;
          if (aUrl) setAvatarUrl(aUrl);
          const cUrl = userData.cvUrl || userData.CvUrl;
          if (cUrl) setCvUrl(cUrl);
        }
      } catch (err) {
        console.error('Failed to fetch user info', err);
        toast.error('Failed to load profile information');
      } finally {
        if (!silent) setLoadingUser(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const updateProfile = async (data) => {
    try {
      setUpdatingProfile(true);
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (
          key !== 'avatarFile' &&
          key !== 'cvFile' &&
          data[key] !== undefined &&
          data[key] !== null
        ) {
          formData.append(key, data[key]);
        }
      });

      const fileToUpload = data.avatarFile || (avatarUrl instanceof File ? avatarUrl : null);
      if (fileToUpload instanceof File) {
        try {
          const uploadRes = await mediaService.uploadImage(fileToUpload, 'Users');
          const newUrl = uploadRes?.data ?? (typeof uploadRes === 'string' ? uploadRes : null);
          if (newUrl) {
            formData.set('avatarUrl', newUrl);
            if (avatarUrl instanceof File) setAvatarUrl(newUrl);
          }
        } catch (uploadErr) {
          console.error('Avatar upload failed', uploadErr);
          toast.error('Failed to upload avatar to server');
          return false;
        }
      }

      if (data.cvFile instanceof File) {
        formData.append('cvFile', data.cvFile);
      } else if (data.cvUrl) {
        formData.append('cvUrl', data.cvUrl);
      }

      await userService.updateMe(formData);
      toast.success('Update successful');
      await fetchMe(true);
      return true;
    } catch (err) {
      console.error('Failed to update profile', err);
      toast.error('Failed to update profile information');
      return false;
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleDownloadCV = async () => {
    if (!cvUrl) return;

    try {
      const downloadToastKey = toast.info('Downloading CV...', { duration: 0 });
      const blob = await userService.downloadCV();

      if (!blob || blob.size === 0) {
        throw new Error('File is empty');
      }

      const extension = cvUrl.split('?')[0].split('.').pop()?.toLowerCase() || 'pdf';
      const defaultFilename = `CV_${userInfo?.fullName?.replace(/\s+/g, '_') || 'Profile'}.${extension}`;

      downloadBlob(blob, defaultFilename);
      toast.dismiss(downloadToastKey);
      toast.success('Download complete');
    } catch (err) {
      console.error('Download CV error:', err);
      toast.error('Could not download CV. Please try again later.');
    }
  };

  return {
    userInfo,
    loadingUser,
    avatarUrl,
    setAvatarUrl,
    cvUrl,
    setCvUrl,
    updateProfile,
    updatingProfile,
    handleDownloadCV,
    isEditModalOpen,
    setIsEditModalOpen,
  };
}

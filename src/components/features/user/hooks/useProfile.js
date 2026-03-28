'use client';

import { useCallback, useEffect, useState } from 'react';

import { userService } from '@/components/features/user/services/user.service';
import { showDeleteConfirm } from '@/components/ui/deleteconfirm';
import { useToast } from '@/providers/ToastProvider';
import { mediaService } from '@/services/media.service';
import { downloadBlob } from '@/utils/common/fileUtils';

export function useProfile() {
  const toast = useToast();
  const [userInfo, setUserInfo] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [cvUrl, setCvUrl] = useState(null);

  const [skills, setSkills] = useState([
    { name: 'HTML', level: 'Advanced' },
    { name: 'CSS', level: 'Advanced' },
    { name: 'React', level: 'Intermediate' },
    { name: 'Tailwind CSS' },
    { name: 'Git' },
    { name: 'Next.js' },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', level: '' });
  const [skillError, setSkillError] = useState('');

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', level: '' });

  const fetchMe = useCallback(async () => {
    try {
      setLoadingUser(true);
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
      setLoadingUser(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const handleAddSkill = () => {
    if (!newSkill.name.trim()) {
      setSkillError('Please enter a skill name');
      return;
    }

    const exists = skills.some((s) => s.name.toLowerCase() === newSkill.name.trim().toLowerCase());

    if (exists) {
      setSkillError('Skill already exists');
      return;
    }

    setSkills((prev) => [...prev, newSkill]);
    setNewSkill({ name: '', level: '' });
    setSkillError('');
    setShowAddForm(false);
    toast.success(
      'Skills added successfully',
      `${newSkill.name}${newSkill.level ? ` (${newSkill.level})` : ''}`
    );
  };

  const handleDeleteSelected = () => {
    showDeleteConfirm({
      title: 'Delete Skills',
      content: `Are you sure you want to delete ${selectedSkills.length} selected skills?`,
      onOk: () => {
        const count = selectedSkills.length;
        setSkills((prev) => prev.filter((s) => !selectedSkills.includes(s.name)));
        setSelectedSkills([]);
        // setSelectMode(false); // Check if this was correct, last time it was there but maybe not defined here
        toast.success('Skills deleted successfully', `Removed ${count} skills`);
      },
    });
  };

  const updateProfile = async (data) => {
    try {
      setLoadingUser(true);

      const formData = new FormData();

      // 1. Handle regular profile data
      Object.keys(data).forEach((key) => {
        // Skip files that we handle separately or null values that might break backend if not careful
        if (
          key !== 'avatarFile' &&
          key !== 'cvFile' &&
          data[key] !== undefined &&
          data[key] !== null
        ) {
          formData.append(key, data[key]);
        }
      });

      // 2. Handle Avatar (Keep current client-side logic for consistency if preferred,
      // but here we just pass the URL or upload it first)
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

      // 3. Handle CV (Directly pass the File to backend via FormData)
      if (data.cvFile instanceof File) {
        formData.append('cvFile', data.cvFile);
      } else if (data.cvUrl) {
        formData.append('cvUrl', data.cvUrl);
      }

      // 4. Submit update
      await userService.updateMe(formData);
      toast.success('Update successful');
      await fetchMe();
      return true;
    } catch (err) {
      console.error('Failed to update profile', err);
      toast.error('Failed to update profile information');
      return false;
    } finally {
      setLoadingUser(false);
    }
  };

  const handleDownloadCV = async () => {
    if (!cvUrl) return;

    try {
      setLoadingUser(true);
      const blob = await userService.downloadCV();

      if (!blob || blob.size === 0) {
        throw new Error('File is empty');
      }

      // Try to get extension from current cvUrl
      const extension = cvUrl.split('?')[0].split('.').pop()?.toLowerCase() || 'pdf';
      const defaultFilename = `CV_${userInfo?.fullName?.replace(/\s+/g, '_') || 'Profile'}.${extension}`;

      downloadBlob(blob, defaultFilename);
    } catch (err) {
      console.error('Download CV error:', err);
      toast.error('Could not download CV. Please try again later.');
    } finally {
      setLoadingUser(false);
    }
  };

  return {
    userInfo,
    loadingUser,
    avatarUrl,
    setAvatarUrl,
    cvUrl,
    setCvUrl,
    skills,
    showAddForm,
    setShowAddForm,
    newSkill,
    setNewSkill,
    skillError,
    setSkillError,
    editMode,
    setEditMode,
    editingSkill,
    setEditingSkill,
    editForm,
    setEditForm,
    handleAddSkill,
    handleDeleteSelected,
    setSelectedSkills,
    updateProfile,
    handleDownloadCV, // Added
    isEditModalOpen: editMode,
    setIsEditModalOpen: setEditMode,
  };
}

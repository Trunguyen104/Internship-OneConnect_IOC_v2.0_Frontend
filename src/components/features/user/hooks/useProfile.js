'use client';

import { useCallback, useEffect, useState } from 'react';

import { userService } from '@/components/features/user/services/userService';
import { showDeleteConfirm } from '@/components/ui/deleteconfirm';
import { useToast } from '@/providers/ToastProvider';

export function useProfile() {
  const toast = useToast();
  const [userInfo, setUserInfo] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState(null);

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
      if (res?.data) {
        setUserInfo(res.data);
        if (res.data.avatarUrl) setAvatarUrl(res.data.avatarUrl);
      } else if (res) {
        setUserInfo(res);
        if (res.avatarUrl) setAvatarUrl(res.avatarUrl);
      }
    } catch (err) {
      console.error('Failed to fetch user info', err);
      toast.error('Lỗi khi tải thông tin cá nhân');
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
        setSelectMode(false);
        toast.success('Skills deleted successfully', `Removed ${count} skills`);
      },
    });
  };

  return {
    userInfo,
    loadingUser,
    avatarUrl,
    setAvatarUrl,
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
    updateProfile: async (data) => {
      try {
        setLoadingUser(true);
        await userService.updateMe(data);
        toast.success('Cập nhật thành công');
        await fetchMe();
        return true;
      } catch (err) {
        console.error('Failed to update profile', err);
        toast.error('Lỗi khi cập nhật thông tin cá nhân');
        return false;
      } finally {
        setLoadingUser(false);
      }
    },
    isEditModalOpen: editMode,
    setIsEditModalOpen: setEditMode,
  };
}

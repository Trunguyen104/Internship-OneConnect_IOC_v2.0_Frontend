'use client';

import StudentPageHeader from '@/components/layout/StudentPageHeader';
import { USER_ROLE } from '@/constants/common/enums';

import { useProfile } from '../hooks/useProfile';
import ProfileInfo from './ProfileInfo';
import SkillList from './SkillList';

export default function ProfilePage() {
  const profile = useProfile();

  const skillProps = {
    skills: profile.skills,
    showAddForm: profile.showAddForm,
    setShowAddForm: profile.setShowAddForm,
    newSkill: profile.newSkill,
    setNewSkill: profile.setNewSkill,
    skillError: profile.skillError,
    setSkillError: profile.setSkillError,
    editMode: profile.editMode,
    setEditMode: profile.setEditMode,
    editingSkill: profile.editingSkill,
    setEditingSkill: profile.setEditingSkill,
    editForm: profile.editForm,
    setEditForm: profile.setEditForm,
    handleAddSkill: profile.handleAddSkill,
    handleDeleteSelected: profile.handleDeleteSelected,
    updateSkill: profile.updateSkill,
    deleteSkill: profile.deleteSkill,
    selectMode: profile.selectMode,
    selectedSkills: profile.selectedSkills,
  };

  return (
    <section className="space-y-6">
      <StudentPageHeader hidden />

      <ProfileInfo
        userInfo={profile.userInfo}
        loadingUser={profile.loadingUser}
        avatarUrl={profile.avatarUrl}
        onAvatarChange={profile.setAvatarUrl}
        isEditModalOpen={profile.isEditModalOpen}
        setIsEditModalOpen={profile.setIsEditModalOpen}
        onSaveProfile={profile.updateProfile}
        onDownloadCV={profile.handleDownloadCV}
      />

      {[USER_ROLE.STUDENT, 'student'].includes(String(profile.userInfo?.role).toLowerCase()) && (
        <SkillList {...skillProps} />
      )}
    </section>
  );
}

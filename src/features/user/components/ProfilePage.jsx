'use client';

import { useProfile } from './hooks/useProfile';
import ProfileInfo from './components/ProfileInfo';
import SkillList from './components/SkillList';

export default function ProfilePage() {
  const {
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
    updateSkill,
    deleteSkill,
    selectMode,
    selectedSkills,
  } = useProfile();

  return (
    <section className='animate-in fade-in space-y-6 duration-700'>
      <ProfileInfo
        userInfo={userInfo}
        loadingUser={loadingUser}
        avatarUrl={avatarUrl}
        onAvatarChange={setAvatarUrl}
      />

      <SkillList
        skills={skills}
        showAddForm={showAddForm}
        setShowAddForm={setShowAddForm}
        newSkill={newSkill}
        setNewSkill={setNewSkill}
        skillError={skillError}
        setSkillError={setSkillError}
        editMode={editMode}
        setEditMode={setEditMode}
        editingSkill={editingSkill}
        setEditingSkill={setEditingSkill}
        editForm={editForm}
        setEditForm={setEditForm}
        handleAddSkill={handleAddSkill}
        handleDeleteSelected={handleDeleteSelected}
        updateSkill={updateSkill}
        deleteSkill={deleteSkill}
        selectMode={selectMode}
        selectedSkills={selectedSkills}
      />
    </section>
  );
}


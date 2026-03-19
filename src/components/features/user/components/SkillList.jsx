'use client';

// import Card from '@/components/shared/Card';
import SkillTag from './SkillTag';
import SkillAddForm from './SkillAddForm';
import SkillEditModal from './SkillEditModal';
import { Button, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Card from '@/components/ui/card';
import { PROFILE_UI } from '@/constants/user/uiText';

export default function SkillList({
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
}) {
  return (
    <>
      <h1 className='text-text mt-7 text-2xl font-bold'>{PROFILE_UI.SKILLS.TITLE}</h1>

      <Card>
        <div className='flex min-h-[400px] flex-col'>
          {(skills.length === 0 || showAddForm) && (
            <SkillAddForm
              newSkill={newSkill}
              setNewSkill={setNewSkill}
              skillError={skillError}
              setSkillError={setSkillError}
              handleAddSkill={handleAddSkill}
            />
          )}

          <div className='flex items-center justify-between'>
            <label className='text-xl font-medium italic'>{PROFILE_UI.SKILLS.YOUR_SKILLS}</label>

            {skills.length > 0 && (
              <div className='flex items-center gap-4'>
                {selectMode && selectedSkills.length > 0 && (
                  <Button danger type='primary' onClick={handleDeleteSelected}>
                    {PROFILE_UI.BUTTONS.DELETE} ({selectedSkills.length})
                  </Button>
                )}
              </div>
            )}
          </div>

          <Space wrap size={12} className='mt-5'>
            {skills.map((skill) => (
              <SkillTag
                key={skill.id}
                skill={skill}
                editMode={editMode}
                onEdit={(skill) => {
                  setEditingSkill(skill.id);
                  setEditForm(skill);
                }}
              />
            ))}

            {!editMode && !showAddForm && (
              <Button icon={<PlusOutlined />} onClick={() => setShowAddForm(true)}>
                {PROFILE_UI.BUTTONS.ADD}
              </Button>
            )}
          </Space>

          <div className='mt-auto flex justify-end pt-6'>
            <Button
              type='primary'
              danger
              style={{ minWidth: 120 }}
              onClick={() => {
                setEditMode(!editMode);
                setEditingSkill(null);
              }}
            >
              {editMode ? PROFILE_UI.BUTTONS.DONE : PROFILE_UI.BUTTONS.EDIT}
            </Button>
          </div>
        </div>
      </Card>

      <SkillEditModal
        editingSkill={editingSkill}
        editForm={editForm}
        setEditForm={setEditForm}
        setEditingSkill={setEditingSkill}
        updateSkill={updateSkill}
        deleteSkill={deleteSkill}
      />
    </>
  );
}

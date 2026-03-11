'use client';

import Card from '@/components/shared/Card';

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
      <h1 className='mt-7 text-2xl font-bold text-slate-900'>Skills</h1>

      <Card>
        <div className='flex min-h-[400px] flex-col'>
          {(skills.length === 0 || showAddForm) && (
            <div>
              <div className='flex flex-col gap-4 rounded-lg border border-slate-200 bg-slate-50 p-6 md:flex-row md:items-end'>
                <div className='flex-1'>
                  <label className='mb-1 block text-sm font-medium text-slate-600'>
                    Skill
                    <span className='ml-2 text-xs text-slate-400'>({newSkill.name.length}/30)</span>
                  </label>
                  <input
                    value={newSkill.name}
                    maxLength={30}
                    onChange={(e) => {
                      setNewSkill({ ...newSkill, name: e.target.value });
                      if (skillError) setSkillError('');
                    }}
                    placeholder='VD: React, Java, SQL'
                    className='w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none'
                  />
                </div>

                <div className='w-full md:w-48'>
                  <label className='mb-1 block text-sm font-medium text-slate-600'>Level</label>
                  <select
                    value={newSkill.level}
                    onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
                    className='w-full cursor-pointer rounded-md border border-slate-300 px-3 py-2 text-sm'
                  >
                    <option value=''>Không bắt buộc</option>
                    <option value='Beginner'>Beginner</option>
                    <option value='Intermediate'>Intermediate</option>
                    <option value='Advanced'>Advanced</option>
                  </select>
                </div>

                <button
                  onClick={handleAddSkill}
                  className='h-10 cursor-pointer rounded-full bg-red-600 px-6 text-sm font-semibold text-white hover:bg-red-700'
                >
                  Add
                </button>
              </div>

              <div className='mt-1 min-h-5'>
                {skillError && <p className='text-sm text-red-600'>{skillError}</p>}
              </div>
            </div>
          )}

          <div className='flex items-center justify-between'>
            <label className='text-xl font-medium italic'>Your Skills</label>

            {skills.length > 0 && (
              <div className='flex items-center gap-4'>
                {selectMode && selectedSkills.length > 0 && (
                  <button
                    onClick={handleDeleteSelected}
                    className='rounded-full bg-red-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-700'
                  >
                    Delete ({selectedSkills.length})
                  </button>
                )}
              </div>
            )}
          </div>

          <div className='mt-5 flex flex-wrap gap-3'>
            {skills.map((skill) => (
              <div key={skill.name} className='flex items-center gap-2'>
                <div
                  onClick={() => {
                    if (!editMode) return;
                    setEditingSkill(skill.name);
                    setEditForm(skill);
                  }}
                  className={`group flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${editMode ? 'cursor-pointer border-red-200 hover:bg-red-100' : 'border-slate-200 bg-white text-slate-700'} `}
                >
                  <span>{skill.name}</span>
                  {skill.level && (
                    <span className='rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500'>
                      {skill.level}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {!editMode && !showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className='cursor-pointer rounded-full border border-dashed border-red-400 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50'
              >
                + Add
              </button>
            )}
          </div>

          <div className='mt-auto flex justify-end pt-6'>
            <button
              onClick={() => {
                setEditMode(!editMode);
                setEditingSkill(null);
              }}
              className='min-w-[120px] cursor-pointer rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700'
            >
              {editMode ? 'Done' : 'Edit'}
            </button>
          </div>
        </div>
      </Card>

      {editingSkill && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm'
          onClick={() => setEditingSkill(null)}
        >
          <div
            className='animate-fadeIn w-full max-w-md rounded-2xl bg-white p-6 shadow-xl'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='mb-6'>
              <h2 className='text-lg font-semibold text-slate-900'>Edit</h2>
            </div>

            <div className='space-y-4'>
              <div>
                <label className='mb-1 block text-sm font-medium text-slate-600'>Skill Name</label>
                <input
                  value={editForm.name}
                  maxLength={30}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className='w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none'
                />
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-slate-600'>Level</label>
                <select
                  value={editForm.level || ''}
                  onChange={(e) => setEditForm({ ...editForm, level: e.target.value })}
                  className='w-full rounded-md border border-slate-300 px-3 py-2 text-sm'
                >
                  <option value=''>Không bắt buộc</option>
                  <option value='Beginner'>Beginner</option>
                  <option value='Intermediate'>Intermediate</option>
                  <option value='Advanced'>Advanced</option>
                </select>
              </div>
            </div>

            <div className='mt-8 flex items-center justify-between'>
              <button
                onClick={() => deleteSkill(editingSkill)}
                className='cursor-pointer text-sm font-medium text-red-600 hover:underline'
              >
                Delete
              </button>

              <div className='flex gap-3'>
                <button
                  onClick={() => setEditingSkill(null)}
                  className='cursor-pointer rounded-full bg-slate-200 px-5 py-2 text-sm font-semibold hover:bg-slate-300'
                >
                  Cancel
                </button>

                <button
                  onClick={updateSkill}
                  className='cursor-pointer rounded-full bg-red-600 px-6 py-2 text-sm font-semibold text-white hover:bg-red-700'
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

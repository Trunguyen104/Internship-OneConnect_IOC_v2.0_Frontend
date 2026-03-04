'use client';

import AvatarUploader from '@/shared/components/AvatarUploader';
import Card from '@/shared/components/Card';
import { useState, useEffect } from 'react';
import { useToast } from '@/providers/ToastProvider';
import { userService } from '@/services/userService';

export default function PersonalInfo() {
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

  const [selectMode, setSelectMode] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', level: '' });

  const handleDeleteSelected = () => {
    const count = selectedSkills.length;

    setSkills((prev) => prev.filter((s) => !selectedSkills.includes(s.name)));
    setSelectedSkills([]);
    setSelectMode(false);

    toast.success('Skills deleted successfully', `Removed ${count} skills`);
  };

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
      `${newSkill.name}${newSkill.level ? ` (${newSkill.level})` : ''}`,
    );
  };
  const [skillError, setSkillError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function fetchMe() {
      try {
        setLoadingUser(true);
        const res = await userService.getMe();
        if (mounted) {
          if (res?.data) {
            setUserInfo(res.data);
            if (res.data.avatarUrl) setAvatarUrl(res.data.avatarUrl);
          } else if (res) {
            setUserInfo(res);
            if (res.avatarUrl) setAvatarUrl(res.avatarUrl);
          }
        }
      } catch (err) {
        console.error('Failed to fetch user info', err);
        if (mounted) toast.error('Lỗi khi tải thông tin cá nhân');
      } finally {
        if (mounted) setLoadingUser(false);
      }
    }

    fetchMe();
    return () => {
      mounted = false;
    };
  }, [toast]);

  return (
    <section className='space-y-6'>
      <h1 className='text-2xl font-bold text-slate-900'>Personal Information</h1>

      <Card>
        <div className='flex items-center gap-6 border-b border-slate-200 pb-6'>
          <AvatarUploader
            value={avatarUrl}
            onChange={setAvatarUrl}
            fullName={userInfo?.fullName || 'Người dùng'}
          />

          <div>
            <h2 className='text-lg font-bold text-slate-900'>Avatar</h2>
            <p className='mt-1 text-sm text-slate-500'>
              JPG, PNG format, under 2MB, recommended size: 1200x1200px
            </p>
          </div>

          <div className='flex gap-2 ml-50 mt-15'>
            <button className='rounded-full cursor-pointer bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700'>
              Edit
            </button>
            <button className='rounded-full cursor-pointer bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700'>
              Upload CV
            </button>
          </div>
        </div>

        <div className='pt-6'>
          {loadingUser ? (
            <div className='text-sm text-slate-500'>Đang tải thông tin cá nhân...</div>
          ) : (
            <div className='grid grid-cols-1 gap-x-12 gap-y-6 md:grid-cols-4'>
              <InfoItem label='Full Name' value={userInfo?.fullName || '—'} />
              <InfoItem label='Email' value={userInfo?.email || '—'} />
              <InfoItem label='Phone' value={userInfo?.phoneNumber || '—'} />
              <InfoItem label='Role'>
                <span className='inline-flex rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600 uppercase'>
                  {userInfo?.role || 'Unknown'}
                </span>
              </InfoItem>

              <InfoItem label='User Code' value={userInfo?.userCode || '—'} />
              <InfoItem
                label='Date of Birth'
                value={
                  userInfo?.dateOfBirth
                    ? new Date(userInfo.dateOfBirth).toLocaleDateString('vi-VN')
                    : '—'
                }
              />
              <InfoItem label='University' value='—' />
              <InfoItem label='Gender' value='—' />
            </div>
          )}
        </div>
      </Card>

      <h1 className='text-2xl font-bold text-slate-900 mt-7'>Skills</h1>

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

                      if (skillError) {
                        setSkillError('');
                      }
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
                    className='w-full rounded-md border border-slate-300 px-3 py-2 text-sm cursor-pointer'
                  >
                    <option value=''>Không bắt buộc</option>
                    <option value='Beginner'>Beginner</option>
                    <option value='Intermediate'>Intermediate</option>
                    <option value='Advanced'>Advanced</option>
                  </select>
                </div>

                <button
                  onClick={handleAddSkill}
                  className='h-10 rounded-full bg-red-600 px-6 text-sm font-semibold text-white hover:bg-red-700 cursor-pointer'
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
          <div className='flex flex-wrap gap-3 mt-5'>
            {skills.map((skill) => (
              <div key={skill.name} className='flex items-center gap-2'>
                <div
                  onClick={() => {
                    if (!editMode) return;

                    setEditingSkill(skill.name);
                    setEditForm(skill);
                  }}
                  className={`group flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition
    ${editMode ? 'cursor-pointer hover:bg-red-100' : 'border-slate-200 bg-white text-slate-700'}
  `}
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
            {editingSkill && (
              <div
                className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm'
                onClick={() => setEditingSkill(null)}
              >
                <div
                  className='w-full max-w-md rounded-2xl bg-white p-6 shadow-xl animate-fadeIn'
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className='mb-6'>
                    <h2 className='text-lg font-semibold text-slate-900'>Edit</h2>
                  </div>

                  <div className='space-y-4'>
                    <div>
                      <label className='block text-sm font-medium text-slate-600 mb-1'>
                        Skill Name
                      </label>
                      <input
                        value={editForm.name}
                        maxLength={30}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className='w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-slate-600 mb-1'>Level</label>
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
                      onClick={() => {
                        setSkills((prev) => prev.filter((s) => s.name !== editingSkill));
                        setEditingSkill(null);
                        toast.success('Đã xóa kỹ năng');
                      }}
                      className='text-sm font-medium text-red-600 hover:underline'
                    >
                      Delete
                    </button>

                    <div className='flex gap-3'>
                      <button
                        onClick={() => setEditingSkill(null)}
                        className='rounded-full bg-slate-200 px-5 py-2 text-sm font-semibold hover:bg-slate-300'
                      >
                        Cancel
                      </button>

                      <button
                        onClick={() => {
                          if (!editForm.name.trim()) return;

                          setSkills((prev) =>
                            prev.map((s) => (s.name === editingSkill ? editForm : s)),
                          );
                          setEditingSkill(null);
                          toast.success('Cập nhật thành công');
                        }}
                        className='rounded-full bg-red-600 px-6 py-2 text-sm font-semibold text-white hover:bg-red-700'
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {!editMode && (
              <button
                onClick={() => setShowAddForm(true)}
                className='rounded-full border border-dashed border-red-400 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition'
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
              className='min-w-[120px] rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition'
            >
              {editMode ? 'Done' : 'Edit'}
            </button>
          </div>
        </div>
      </Card>
    </section>
  );
}

function InfoItem({ label, value, children }) {
  return (
    <div>
      <p className='mb-1 text-sm font-medium text-slate-500'>{label}</p>
      {value && <p className='text-base font-semibold text-slate-900'>{value}</p>}
      {children}
    </div>
  );
}

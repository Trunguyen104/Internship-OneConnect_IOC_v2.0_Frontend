'use client';

import AvatarUploader from '@/shared/components/AvatarUploader';
import Card from '@/shared/components/Card';
import { useState } from 'react';
import { useToast } from '@/providers/ToastProvider';

export default function PersonalInfo() {
  const toast = useToast();
  const [avatarUrl, setAvatarUrl] = useState(null);

  const [skills, setSkills] = useState([
    { name: 'HTML', level: 'Advanced' },
    { name: 'CSS', level: 'Advanced' },
    { name: 'React', level: 'Intermediate' },
    { name: 'Tailwind CSS' },
    { name: 'Git' },
    { name: 'Next.js' },
  ]);

  const [newSkill, setNewSkill] = useState({ name: '', level: '' });

  const [selectMode, setSelectMode] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);

  const toggleSelectSkill = (name) => {
    setSelectedSkills((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name],
    );
  };

  const handleDeleteSelected = () => {
    const count = selectedSkills.length;

    setSkills((prev) => prev.filter((s) => !selectedSkills.includes(s.name)));
    setSelectedSkills([]);
    setSelectMode(false);

    toast.success('Xóa kỹ năng thành công', `Đã xóa ${count} kỹ năng`);
  };

  const handleAddSkill = () => {
    if (!newSkill.name.trim()) {
      setSkillError('Vui lòng nhập tên kỹ năng');
      return;
    }

    const exists = skills.some((s) => s.name.toLowerCase() === newSkill.name.trim().toLowerCase());

    if (exists) {
      setSkillError('Kỹ năng này đã tồn tại');
      return;
    }

    setSkills([...skills, newSkill]);
    setNewSkill({ name: '', level: '' });
    setSkillError('');

    toast.success(
      'Thêm kỹ năng thành công',
      `${newSkill.name}${newSkill.level ? ` (${newSkill.level})` : ''}`,
    );
  };

  const [skillError, setSkillError] = useState('');

  return (
    <section className='space-y-6'>
      <h1 className='text-2xl font-bold text-slate-900'>Thông tin cá nhân</h1>

      <Card>
        <div className='flex items-center gap-6 border-b border-slate-200 pb-6'>
          <AvatarUploader value={avatarUrl} onChange={setAvatarUrl} />

          <div>
            <h2 className='text-lg font-bold text-slate-900'>Ảnh đại diện</h2>
            <p className='mt-1 text-sm text-slate-500'>
              Định dạng JPG, PNG, kích thước dưới 2MB, kích thước tiêu chuẩn: 1200x1200px
            </p>
          </div>

          <div className='flex gap-3 ml-50 mt-15'>
            <button className='rounded-full cursor-pointer bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700'>
              Chỉnh sửa
            </button>
            <button className='rounded-full cursor-pointer bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700'>
              Tải lên CV
            </button>
          </div>
        </div>

        <div className='pt-6'>
          <div className='grid grid-cols-1 gap-x-12 gap-y-6 md:grid-cols-4'>
            <InfoItem label='Họ và tên' value='Lê Duy Khánh' />
            <InfoItem label='Email' value='KhanhLD.CE190235@gmail.com' />
            <InfoItem label='Số điện thoại' value='0765 602 789' />
            <InfoItem label='Vai trò'>
              <span className='inline-flex rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600'>
                Sinh viên
              </span>
            </InfoItem>

            <InfoItem label='Mã sinh viên' value='STU-1740' />
            <InfoItem label='Trường học' value='FU Cần Thơ' />
            <InfoItem label='Ngày sinh' value='29/01/2005' />
            <InfoItem label='Giới tính' value='Nam' />
          </div>
        </div>
      </Card>

      <h1 className='text-2xl font-bold text-slate-900 mt-7'>Kỹ năng</h1>

      <Card>
        <div className='space-y-6'>
          <div>
            <div className='flex flex-col gap-4 rounded-lg border border-slate-200 bg-slate-50 p-6 md:flex-row md:items-end'>
              <div className='flex-1'>
                <label className='mb-1 block text-sm font-medium text-slate-600'>
                  Kỹ năng
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
                <label className='mb-1 block text-sm font-medium text-slate-600'>Trình độ</label>
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
                Thêm
              </button>
            </div>

            <div className='mt-1 min-h-5'>
              {skillError && <p className='text-sm text-red-600'>{skillError}</p>}
            </div>
          </div>

          <div className='flex items-center gap-4'>
            {skills.length > 0 && (
              <button
                onClick={() => {
                  setSelectMode(!selectMode);
                  setSelectedSkills([]);
                }}
                className='text-sm font-semibold text-red-600 hover:underline cursor-pointer'
              >
                {selectMode ? 'Hủy chọn' : 'Chọn để xóa'}
              </button>
            )}

            {selectMode && selectedSkills.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className='rounded-full bg-red-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-700'
              >
                Xóa ({selectedSkills.length})
              </button>
            )}
          </div>

          <div className='flex flex-wrap gap-3'>
            {skills.map((skill) => {
              const checked = selectedSkills.includes(skill.name);

              return (
                <label
                  key={skill.name}
                  className={`group flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition
        ${
          checked
            ? 'border-red-400 bg-red-50 text-red-600'
            : 'border-slate-200 bg-white text-slate-700 hover:border-red-400 hover:bg-red-50'
        }`}
                >
                  {selectMode && (
                    <input
                      type='checkbox'
                      checked={checked}
                      onChange={() => toggleSelectSkill(skill.name)}
                      className='accent-red-600'
                    />
                  )}

                  <span>{skill.name}</span>

                  {skill.level && (
                    <span className='rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500'>
                      {skill.level}
                    </span>
                  )}
                </label>
              );
            })}
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

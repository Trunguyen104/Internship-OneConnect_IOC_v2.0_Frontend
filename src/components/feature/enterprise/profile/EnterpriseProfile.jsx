import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  EnvironmentOutlined,
  GlobalOutlined,
  SolutionOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  HistoryOutlined,
} from '@ant-design/icons';

export function EnterpriseProfile({ profile, editMode, onEdit, onCancel, onSave, isSaving }) {
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    description: profile?.description || '',
    website: profile?.website || '',
    industry: profile?.industry || '',
    headquater: profile?.headquater || profile?.address || '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editMode) {
      setFormData({
        name: profile?.name || '',
        description: profile?.description || '',
        website: profile?.website || '',
        industry: profile?.industry || '',
        headquater: profile?.headquater || profile?.address || '',
      });
      setErrors({});
    }
  }, [editMode, profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (formData.website && !/^https?:\/\/.*/.test(formData.website)) {
      newErrors.website = 'Website must be a valid URL starting with http:// or https://';
    }
    if (formData.description && formData.description.length > 2000) {
      newErrors.description = 'Description cannot exceed 2000 characters';
    }
    if (!formData.name.trim()) {
      newErrors.name = 'Company Name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <div className='w-full max-w-7xl mx-auto pb-12 animate-fade-in'>
      {/* Banner Section */}
      <div className='relative h-64 md:h-80 w-full bg-[var(--color-primary)]'>
        {profile?.backgroundUrl ? (
          <Image
            src={profile.backgroundUrl}
            alt='Cover'
            fill
            className='object-cover opacity-90'
            priority
          />
        ) : (
          <div className='absolute inset-0 bg-gradient-to-r from-red-800 to-red-600 opacity-90' />
        )}

        {/* Banner Overlay Controls */}
        <div className='absolute top-6 right-6 flex gap-3'>
          {!editMode ? (
            <button
              onClick={onEdit}
              className='flex items-center gap-2 px-4 py-2 bg-white text-[var(--color-primary)] rounded-lg font-bold shadow-md hover:bg-gray-50 transition-colors'
            >
              <EditOutlined /> Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={onCancel}
                disabled={isSaving}
                className='flex items-center gap-2 px-4 py-2 bg-white text-gray-600 rounded-lg font-bold shadow-md hover:bg-gray-50 transition-colors disabled:opacity-50'
              >
                <CloseOutlined /> Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSaving}
                className='flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg font-bold shadow-md hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50'
              >
                <SaveOutlined /> {isSaving ? 'Saving...' : 'Save'}
              </button>
            </>
          )}
        </div>
      </div>

      <div className='px-8 -mt-20 relative z-10'>
        {/* Profile Header (Logo & Title) */}
        <div className='flex flex-col md:flex-row md:items-end gap-6 mb-8'>
          <div className='w-40 h-40 rounded-2xl bg-white p-2 shadow-lg border-4 border-white flex-shrink-0'>
            <div className='w-full h-full relative rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center'>
              {profile?.logoUrl ? (
                <Image src={profile.logoUrl} alt='Logo' fill className='object-contain p-2' />
              ) : (
                <span className='text-4xl text-gray-300 font-bold'>LOGO</span>
              )}
            </div>
          </div>

          <div className='flex-1 pb-2'>
            {editMode ? (
              <div className='mb-2'>
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  className={`text-3xl font-black text-gray-900 bg-white border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-1 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-red-200`}
                  placeholder='Company Name'
                />
                {errors.name && <p className='text-red-500 text-sm mt-1'>{errors.name}</p>}
              </div>
            ) : (
              <h1 className='text-3xl font-black text-gray-900 mb-2'>
                {profile?.name || 'Unknown Company'}
              </h1>
            )}

            <div className='flex flex-wrap gap-3'>
              {/* Badges */}
              {(editMode ? formData.industry : profile?.industry) && (
                <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold border border-blue-100'>
                  <SolutionOutlined />
                  {editMode ? (
                    <input
                      type='text'
                      name='industry'
                      value={formData.industry}
                      onChange={handleChange}
                      className='bg-transparent outline-none w-32'
                      placeholder='Industry'
                    />
                  ) : (
                    profile.industry
                  )}
                </span>
              )}

              {(editMode ? formData.headquater : profile?.headquater) && (
                <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold border border-gray-200'>
                  <EnvironmentOutlined />
                  {editMode ? (
                    <input
                      type='text'
                      name='headquater'
                      value={formData.headquater}
                      onChange={handleChange}
                      className='bg-transparent outline-none w-40'
                      placeholder='Headquarters'
                    />
                  ) : (
                    profile.headquater
                  )}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content Rest */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Main Column */}
          <div className='lg:col-span-2 space-y-8'>
            {/* Company Overview Card */}
            <div className='bg-white rounded-2xl shadow-sm border border-[var(--color-border)] p-6'>
              <h2 className='text-xl font-bold text-gray-800 mb-4'>Company Overview</h2>
              {editMode ? (
                <div>
                  <textarea
                    name='description'
                    value={formData.description}
                    onChange={handleChange}
                    rows={6}
                    className={`w-full border ${errors.description ? 'border-red-500' : 'border-gray-200'} rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-200`}
                    placeholder='Describe your company (max 2000 characters)'
                  />
                  <div className='flex justify-between mt-1'>
                    {errors.description ? (
                      <span className='text-red-500 text-sm'>{errors.description}</span>
                    ) : (
                      <span></span>
                    )}
                    <span className='text-gray-400 text-sm'>
                      {formData.description.length}/2000
                    </span>
                  </div>
                </div>
              ) : (
                <div className='text-gray-600 leading-relaxed whitespace-pre-wrap'>
                  {profile?.description || 'No description provided.'}
                </div>
              )}
            </div>

            {/* Recent Activities Card */}
            <div className='bg-white rounded-2xl shadow-sm border border-[var(--color-border)] p-6'>
              <div className='flex items-center gap-2 mb-6'>
                <HistoryOutlined className='text-xl text-[var(--color-primary)]' />
                <h2 className='text-xl font-bold text-gray-800'>Recent Activities</h2>
              </div>

              <div className='flex flex-col items-center justify-center py-10 text-gray-400'>
                <p>No recent activities found.</p>
              </div>
            </div>
          </div>

          {/* Right Sidebar Column */}
          <div className='space-y-8'>
            {/* Information Card */}
            <div className='bg-white rounded-2xl shadow-sm border border-[var(--color-border)] p-6'>
              <h2 className='text-xl font-bold text-gray-800 mb-4'>Information</h2>

              <div className='space-y-5'>
                {/* Tax Code - Always Disabled */}
                <div>
                  <label className='block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1'>
                    Tax Code
                  </label>
                  <div className='text-gray-900 font-medium px-3 py-2 bg-gray-50 rounded-lg border border-gray-100'>
                    {profile?.taxCode || 'N/A'}
                  </div>
                  {editMode && (
                    <p className='text-xs text-gray-400 mt-1 italic'>Tax code cannot be changed.</p>
                  )}
                </div>

                {/* Website */}
                <div>
                  <label className='block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1'>
                    Website
                  </label>
                  {editMode ? (
                    <>
                      <div
                        className={`flex items-center border ${errors.website ? 'border-red-500' : 'border-gray-300'} rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-red-200`}
                      >
                        <span className='px-3 bg-gray-50 border-r border-gray-200 text-gray-400'>
                          <GlobalOutlined />
                        </span>
                        <input
                          type='text'
                          name='website'
                          value={formData.website}
                          onChange={handleChange}
                          className='w-full px-3 py-2 focus:outline-none'
                          placeholder='https://example.com'
                        />
                      </div>
                      {errors.website && (
                        <p className='text-red-500 text-xs mt-1'>{errors.website}</p>
                      )}
                    </>
                  ) : (
                    <div className='flex items-center gap-2 text-gray-900'>
                      <GlobalOutlined className='text-gray-400' />
                      {profile?.website ? (
                        <a
                          href={profile.website}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='font-medium text-[var(--color-info)] hover:underline'
                        >
                          {profile.website}
                        </a>
                      ) : (
                        <span className='text-gray-400 italic'>Not provided</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

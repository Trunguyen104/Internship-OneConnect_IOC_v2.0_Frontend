import { useState } from 'react';
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

import { PROFILE_UI } from '@/constants/user/uiText';

export function EnterpriseProfile({ profile, editMode, onEdit, onCancel, onSave, isSaving }) {
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    description: profile?.description || '',
    website: profile?.website || '',
    industry: profile?.industry || '',
    headquater: profile?.headquater || profile?.address || '',
  });

  const [errors, setErrors] = useState({});

  const [prevEditMode, setPrevEditMode] = useState(editMode);
  const [prevProfile, setPrevProfile] = useState(profile);

  if (editMode !== prevEditMode || profile !== prevProfile) {
    setPrevEditMode(editMode);
    setPrevProfile(profile);
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
  }

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
      newErrors.website = PROFILE_UI.ENTERPRISE.ERRORS.WEBSITE;
    }
    if (formData.description && formData.description.length > 2000) {
      newErrors.description = PROFILE_UI.ENTERPRISE.ERRORS.DESCRIPTION;
    }
    if (!formData.name.trim()) {
      newErrors.name = PROFILE_UI.ENTERPRISE.ERRORS.NAME;
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
    <div className='animate-fade-in mx-auto w-full max-w-7xl pb-12'>
      {/* Banner Section */}
      <div className='bg-primary relative h-64 w-full md:h-80'>
        {profile?.backgroundUrl ? (
          <Image
            src={profile.backgroundUrl}
            alt='Cover'
            fill
            className='object-cover opacity-90'
            priority
          />
        ) : (
          <div className='bg-primary/90 absolute inset-0' />
        )}

        {/* Banner Overlay Controls */}
        <div className='absolute top-6 right-6 flex gap-3'>
          {!editMode ? (
            <button
              onClick={onEdit}
              className='bg-bg text-primary hover:bg-surface flex items-center gap-2 rounded-lg px-4 py-2 font-bold shadow-md transition-colors'
            >
              <EditOutlined /> {PROFILE_UI.ENTERPRISE.EDIT_PROFILE}
            </button>
          ) : (
            <>
              <button
                onClick={onCancel}
                disabled={isSaving}
                className='bg-bg text-muted hover:bg-surface flex items-center gap-2 rounded-lg px-4 py-2 font-bold shadow-md transition-colors disabled:opacity-50'
              >
                <CloseOutlined /> {PROFILE_UI.BUTTONS.CANCEL}
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSaving}
                className='bg-primary hover:bg-primary/90 flex items-center gap-2 rounded-lg px-4 py-2 font-bold text-white shadow-md transition-colors disabled:opacity-50'
              >
                <SaveOutlined />{' '}
                {isSaving ? PROFILE_UI.ENTERPRISE.SAVING : PROFILE_UI.ENTERPRISE.SAVE}
              </button>
            </>
          )}
        </div>
      </div>

      <div className='relative z-10 -mt-20 px-8'>
        {/* Profile Header (Logo & Title) */}
        <div className='mb-8 flex flex-col gap-6 md:flex-row md:items-end'>
          <div className='h-40 w-40 flex-shrink-0 rounded-2xl border-4 border-white bg-white p-2 shadow-lg'>
            <div className='bg-surface relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl'>
              {profile?.logoUrl ? (
                <Image src={profile.logoUrl} alt='Logo' fill className='object-contain p-2' />
              ) : (
                <span className='text-muted text-4xl font-bold'>LOGO</span>
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
                  className={`border-border bg-bg text-text focus:ring-primary/20 w-full max-w-md rounded-md border px-3 py-1 text-3xl font-black outline-none focus:ring-2 ${errors.name ? 'border-danger' : 'border-border'}`}
                  placeholder={PROFILE_UI.ENTERPRISE.COMPANY_NAME_PLACEHOLDER}
                />
                {errors.name && <p className='text-danger mt-1 text-sm'>{errors.name}</p>}
              </div>
            ) : (
              <h1 className='text-text mb-2 text-3xl font-black'>
                {profile?.name || PROFILE_UI.ENTERPRISE.NOT_PROVIDED}
              </h1>
            )}

            <div className='flex flex-wrap gap-3'>
              {/* Badges */}
              {(editMode ? formData.industry : profile?.industry) && (
                <span className='bg-primary/10 text-primary border-primary/20 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold'>
                  <SolutionOutlined />
                  {editMode ? (
                    <input
                      type='text'
                      name='industry'
                      value={formData.industry}
                      onChange={handleChange}
                      className='w-32 bg-transparent outline-none'
                      placeholder={PROFILE_UI.ENTERPRISE.INDUSTRY}
                    />
                  ) : (
                    profile.industry
                  )}
                </span>
              )}

              {(editMode ? formData.headquater : profile?.headquater) && (
                <span className='bg-muted/10 text-muted border-border inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold'>
                  <EnvironmentOutlined />
                  {editMode ? (
                    <input
                      type='text'
                      name='headquater'
                      value={formData.headquater}
                      onChange={handleChange}
                      className='w-40 bg-transparent outline-none'
                      placeholder={PROFILE_UI.ENTERPRISE.HEADQUARTERS}
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
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          {/* Main Column */}
          <div className='space-y-8 lg:col-span-2'>
            {/* Company Overview Card */}
            <div className='border-border rounded-2xl border bg-white p-6 shadow-sm'>
              <h2 className='text-text mb-4 text-xl font-bold'>{PROFILE_UI.ENTERPRISE.OVERVIEW}</h2>
              {editMode ? (
                <div>
                  <textarea
                    name='description'
                    value={formData.description}
                    onChange={handleChange}
                    rows={6}
                    className={`focus:ring-primary/20 text-text w-full rounded-lg border p-3 outline-none focus:ring-2 ${errors.description ? 'border-danger' : 'border-border'}`}
                    placeholder={PROFILE_UI.ENTERPRISE.DESCRIPTION_PLACEHOLDER}
                  />
                  <div className='mt-1 flex justify-between'>
                    {errors.description ? (
                      <span className='text-danger text-sm'>{errors.description}</span>
                    ) : (
                      <span></span>
                    )}
                    <span className='text-muted text-sm'>{formData.description.length}/2000</span>
                  </div>
                </div>
              ) : (
                <div className='text-text leading-relaxed whitespace-pre-wrap'>
                  {profile?.description || PROFILE_UI.ENTERPRISE.NO_DESCRIPTION}
                </div>
              )}
            </div>

            {/* Recent Activities Card */}
            <div className='border-border rounded-2xl border bg-white p-6 shadow-sm'>
              <div className='mb-6 flex items-center gap-2'>
                <HistoryOutlined className='text-primary text-xl' />
                <h2 className='text-text text-xl font-bold'>{PROFILE_UI.ENTERPRISE.ACTIVITIES}</h2>
              </div>

              <div className='text-muted flex flex-col items-center justify-center py-10'>
                <p>{PROFILE_UI.ENTERPRISE.NO_ACTIVITIES}</p>
              </div>
            </div>
          </div>

          {/* Right Sidebar Column */}
          <div className='space-y-8'>
            {/* Information Card */}
            <div className='border-border rounded-2xl border bg-white p-6 shadow-sm'>
              <h2 className='text-text mb-4 text-xl font-bold'>{PROFILE_UI.ENTERPRISE.INFO}</h2>

              <div className='space-y-5'>
                {/* Tax Code - Always Disabled */}
                <div>
                  <label className='text-muted mb-1 block text-xs font-bold tracking-wider uppercase'>
                    {PROFILE_UI.ENTERPRISE.TAX_CODE}
                  </label>
                  <div className='bg-surface border-border text-text rounded-lg border px-3 py-2 font-medium'>
                    {profile?.taxCode || 'N/A'}
                  </div>
                  {editMode && (
                    <p className='text-muted mt-1 text-xs italic'>
                      {PROFILE_UI.ENTERPRISE.TAX_CODE_HINT}
                    </p>
                  )}
                </div>

                {/* Website */}
                <div>
                  <label className='text-muted mb-1 block text-xs font-bold tracking-wider uppercase'>
                    {PROFILE_UI.ENTERPRISE.WEBSITE}
                  </label>
                  {editMode ? (
                    <>
                      <div
                        className={`focus-within:ring-primary/20 flex items-center overflow-hidden rounded-lg border transition-shadow focus-within:ring-2 ${errors.website ? 'border-danger' : 'border-border'}`}
                      >
                        <span className='bg-surface border-border text-muted border-r px-3'>
                          <GlobalOutlined />
                        </span>
                        <input
                          type='text'
                          name='website'
                          value={formData.website}
                          onChange={handleChange}
                          className='bg-bg text-text w-full px-3 py-2 outline-none'
                          placeholder={PROFILE_UI.ENTERPRISE.WEBSITE_PLACEHOLDER}
                        />
                      </div>
                      {errors.website && (
                        <p className='text-danger mt-1 text-xs'>{errors.website}</p>
                      )}
                    </>
                  ) : (
                    <div className='text-text flex items-center gap-2'>
                      <GlobalOutlined className='text-muted' />
                      {profile?.website ? (
                        <a
                          href={profile.website}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-info font-medium hover:underline'
                        >
                          {profile.website}
                        </a>
                      ) : (
                        <span className='text-muted italic'>
                          {PROFILE_UI.ENTERPRISE.NOT_PROVIDED}
                        </span>
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

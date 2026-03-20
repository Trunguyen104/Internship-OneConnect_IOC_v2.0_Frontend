'use client';

// import AvatarUploader from '@/components/shared/AvatarUploader';
// import Card from '@/components/shared/Card';
import InfoItem from './InfoItem';
import { Button, Space, Spin } from 'antd';
import AvatarUploader from '@/components/ui/avataruploader';
import Card from '@/components/ui/card';
import { PROFILE_UI } from '@/constants/user/uiText';
import ProfileEditModal from './ProfileEditModal';

export default function ProfileInfo({
  userInfo,
  loadingUser,
  avatarUrl,
  onAvatarChange,
  isEditModalOpen,
  setIsEditModalOpen,
  onSaveProfile,
}) {
  return (
    <>
      <h1 className='text-text text-2xl font-bold'>{PROFILE_UI.PERSONAL_INFO}</h1>

      <Card>
        <div className='border-border flex items-center gap-6 border-b pb-6'>
          <AvatarUploader
            value={avatarUrl}
            onChange={onAvatarChange}
            fullName={userInfo?.fullName || PROFILE_UI.AVATAR.DEFAULT_NAME}
          />

          <div>
            <h2 className='text-text text-lg font-bold'>{PROFILE_UI.AVATAR.TITLE}</h2>
            <p className='text-muted mt-1 text-sm'>{PROFILE_UI.AVATAR.HINT}</p>
          </div>

          <Space className='mt-4 ml-auto flex gap-2'>
            <Button type='primary' danger onClick={() => setIsEditModalOpen(true)}>
              {PROFILE_UI.BUTTONS.EDIT}
            </Button>

            {userInfo?.role === 'Student' && <Button>{PROFILE_UI.BUTTONS.UPLOAD_CV}</Button>}
          </Space>
        </div>

        <div className='pt-6'>
          {loadingUser ? (
            <div className='flex w-full items-center justify-center py-12'>
              <Spin description='Loading profile...'>
                <div className='px-20' />
              </Spin>
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-x-12 gap-y-6 md:grid-cols-4'>
              <InfoItem label={PROFILE_UI.LABELS.FULL_NAME} value={userInfo?.fullName || '—'} />
              <InfoItem label={PROFILE_UI.LABELS.EMAIL} value={userInfo?.email || '—'} />
              <InfoItem label={PROFILE_UI.LABELS.PHONE} value={userInfo?.phoneNumber || '—'} />
              <InfoItem label={PROFILE_UI.LABELS.ROLE}>
                <span className='bg-primary-surface text-primary inline-flex rounded-full px-3 py-1 text-sm font-medium uppercase'>
                  {userInfo?.role || 'Unknown'}
                </span>
              </InfoItem>

              <InfoItem label={PROFILE_UI.LABELS.USER_CODE} value={userInfo?.userCode || '—'} />
              <InfoItem
                label={PROFILE_UI.LABELS.DATE_OF_BIRTH}
                value={
                  userInfo?.dateOfBirth
                    ? new Date(userInfo.dateOfBirth).toLocaleDateString('en-GB')
                    : '—'
                }
              />
              <InfoItem label={PROFILE_UI.LABELS.GENDER} value={userInfo?.gender || '—'} />

              {/* Role Specific Metadata */}
              {userInfo?.role === 'Student' && (
                <>
                  <InfoItem
                    label={PROFILE_UI.LABELS.UNIVERSITY}
                    value={userInfo?.universityName || '—'}
                  />
                  <InfoItem label='Major' value={userInfo?.major || '—'} />
                  <InfoItem label={PROFILE_UI.LABELS.PORTFOLIO}>
                    {userInfo?.portfolioUrl ? (
                      <a
                        href={userInfo.portfolioUrl}
                        target='_blank'
                        rel='noreferrer'
                        className='text-primary hover:underline'
                      >
                        View Link
                      </a>
                    ) : (
                      '—'
                    )}
                  </InfoItem>
                </>
              )}

              {(userInfo?.role === 'Mentor' ||
                userInfo?.role === 'HR' ||
                userInfo?.role === 'EnterpriseAdmin') && (
                <>
                  <InfoItem label='Enterprise' value={userInfo?.enterpriseName || '—'} />
                  <InfoItem label={PROFILE_UI.LABELS.POSITION} value={userInfo?.position || '—'} />
                  <InfoItem
                    label={PROFILE_UI.LABELS.EXPERTISE}
                    value={userInfo?.expertise || '—'}
                  />
                  <div className='md:col-span-4'>
                    <InfoItem label={PROFILE_UI.LABELS.BIO} value={userInfo?.bio || '—'} />
                  </div>
                </>
              )}

              {userInfo?.role === 'SchoolAdmin' && (
                <>
                  <InfoItem
                    label={PROFILE_UI.LABELS.UNIVERSITY}
                    value={userInfo?.universityName || '—'}
                  />
                  <InfoItem
                    label={PROFILE_UI.LABELS.DEPARTMENT}
                    value={userInfo?.department || '—'}
                  />
                  <InfoItem label={PROFILE_UI.LABELS.POSITION} value={userInfo?.position || '—'} />
                  <div className='md:col-span-4'>
                    <InfoItem label={PROFILE_UI.LABELS.BIO} value={userInfo?.bio || '—'} />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </Card>

      <ProfileEditModal
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        userInfo={userInfo}
        onSave={onSaveProfile}
        loading={loadingUser}
      />
    </>
  );
}

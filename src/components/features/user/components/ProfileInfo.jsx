'use client';

// import AvatarUploader from '@/components/shared/AvatarUploader';
// import Card from '@/components/shared/Card';
import InfoItem from './InfoItem';
import { Button, Space, Spin } from 'antd';
import AvatarUploader from '@/components/ui/AvatarUploader';
import Card from '@/components/ui/Card';
import { PROFILE_UI } from '@/constants/user/uiText';

export default function ProfileInfo({ userInfo, loadingUser, avatarUrl, onAvatarChange }) {
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
            <Button type='primary' danger>
              {PROFILE_UI.BUTTONS.EDIT}
            </Button>

            <Button>{PROFILE_UI.BUTTONS.UPLOAD_CV}</Button>
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
              <InfoItem label={PROFILE_UI.LABELS.UNIVERSITY} value='—' />
              <InfoItem label={PROFILE_UI.LABELS.GENDER} value='—' />
            </div>
          )}
        </div>
      </Card>
    </>
  );
}

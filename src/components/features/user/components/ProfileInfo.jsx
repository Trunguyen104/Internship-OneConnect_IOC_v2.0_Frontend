'use client';

// import AvatarUploader from '@/components/shared/AvatarUploader';
// import Card from '@/components/shared/Card';
import InfoItem from './InfoItem';
import { Button, Space, Spin } from 'antd';
import AvatarUploader from '@/components/ui/AvatarUploader';
import Card from '@/components/ui/Card';

export default function ProfileInfo({ userInfo, loadingUser, avatarUrl, onAvatarChange }) {
  return (
    <>
      <h1 className='text-2xl font-bold text-slate-900'>Personal Information</h1>

      <Card>
        <div className='flex items-center gap-6 border-b border-slate-200 pb-6'>
          <AvatarUploader
            value={avatarUrl}
            onChange={onAvatarChange}
            fullName={userInfo?.fullName || 'Người dùng'}
          />

          <div>
            <h2 className='text-lg font-bold text-slate-900'>Avatar</h2>
            <p className='mt-1 text-sm text-slate-500'>
              JPG, PNG format, under 2MB, recommended size: 1200x1200px
            </p>
          </div>

          <Space className='mt-4 ml-auto flex gap-2'>
            <Button type='primary' danger>
              Edit
            </Button>

            <Button>Upload CV</Button>
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
    </>
  );
}

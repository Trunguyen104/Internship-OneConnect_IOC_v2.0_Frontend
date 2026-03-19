'use client';

import { memo } from 'react';
import {
  CameraOutlined,
  CheckCircleFilled,
  EditOutlined,
  SolutionOutlined,
} from '@ant-design/icons';
import { Grid, Space, Tag, Typography, Upload, theme } from 'antd';
import ImgCrop from 'antd-img-crop';

import AvatarUploader from '@/components/ui/avataruploader';
import { Card } from '@/components/ui/atoms';
import { ENTERPRISE_PROFILE_UI } from '@/constants/company-profile/uiText';

const { Title } = Typography;

const primaryButtonClassName =
  'bg-primary hover:bg-primary-hover active:bg-primary-700 shadow-lg inline-flex items-center gap-2 rounded-lg px-4 py-2 text-[13px] font-bold text-white transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60';

export const ProfileSummaryCard = memo(function ProfileSummaryCard({
  profile,
  onEdit,
  onLogoChange,
  onBannerChange,
}) {
  const { token } = theme.useToken();
  const screens = Grid.useBreakpoint();

  const isMobile = !screens.md;
  const bannerHeight = isMobile ? 160 : 240;
  const avatarSize = isMobile ? 96 : 124;
  const avatarOverlap = avatarSize * 0.35; // 35% overlap

  const backgroundStyle = profile?.backgroundUrl
    ? {
        backgroundImage: `url(${profile.backgroundUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {
        background: `linear-gradient(135deg, ${token.colorPrimary} 0%, ${token.colorPurple} 100%)`,
      };

  const beforeBannerUpload = (file) => {
    onBannerChange?.(file);
    return false;
  };

  return (
    <Card className='group/card overflow-hidden rounded-3xl border-none bg-white p-0 shadow-xl'>
      {/* 1. Cover Banner Layer */}
      <div
        className='group/banner relative w-full overflow-hidden transition-all duration-300'
        style={{ height: bannerHeight, ...backgroundStyle }}
      >
        {!profile?.backgroundUrl && (
          <div
            className='absolute inset-0 opacity-20'
            style={{
              background:
                'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4) 0%, transparent 100%)',
            }}
          />
        )}

        {/* Change Banner Hover Control */}
        {onBannerChange && (
          <div className='absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover/banner:opacity-100'>
            <ImgCrop rotationSlider aspect={4 / 1}>
              <Upload showUploadList={false} beforeUpload={beforeBannerUpload}>
                <button className='text-text flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 font-semibold shadow-md transition-all hover:bg-white'>
                  <CameraOutlined />
                  <span>{ENTERPRISE_PROFILE_UI.ENTERPRISE.CHANGE_COVER}</span>
                </button>
              </Upload>
            </ImgCrop>
          </div>
        )}

        {/* Edit Profile Button - Top Right */}
        {onEdit && (
          <div className='absolute top-6 right-6 z-30 transition-transform duration-300 group-hover/card:scale-105'>
            <button type='button' onClick={onEdit} className={primaryButtonClassName}>
              <EditOutlined aria-hidden='true' />
              {isMobile ? '' : ENTERPRISE_PROFILE_UI.ENTERPRISE.EDIT_PROFILE}
            </button>
          </div>
        )}
      </div>

      {/* 2. Content Layer (Avatar + Info) */}
      <div className='relative px-6 pt-2 pb-8 md:px-10'>
        {/* Overlapping Avatar Area */}
        <div
          className='absolute z-20 transition-transform duration-500 hover:scale-105'
          style={{
            top: -avatarOverlap,
            left: isMobile ? '50%' : '40px',
            transform: isMobile ? 'translateX(-50%)' : 'none',
          }}
        >
          <div
            className='overflow-hidden rounded-full bg-white p-[5px] shadow-2xl'
            style={{ border: 'none' }}
          >
            <AvatarUploader
              value={profile?.logoUrl}
              onChange={onLogoChange}
              size={avatarSize}
              fullName={profile?.name}
            />
          </div>
        </div>

        {/* Info Area below/beside avatar */}
        <div
          style={{
            marginTop: isMobile ? avatarSize - avatarOverlap + 12 : 0,
            paddingLeft: isMobile ? 0 : avatarSize + 24,
            textAlign: isMobile ? 'center' : 'left',
          }}
          className='flex flex-col justify-between gap-6 md:flex-row md:items-end'
        >
          <div className='flex-1 space-y-3 py-2'>
            <div className='flex flex-col gap-2 md:flex-row md:items-center md:gap-4'>
              <Title
                level={1}
                style={{
                  margin: 0,
                  fontSize: isMobile ? 26 : 36,
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.1,
                  color: token.colorText,
                }}
              >
                {profile?.name || ENTERPRISE_PROFILE_UI.ENTERPRISE.NOT_PROVIDED}
              </Title>

              {profile?.isVerified && (
                <Tag
                  color='blue'
                  icon={<CheckCircleFilled />}
                  className='w-fit self-center border-none bg-blue-50 font-bold text-blue-600 shadow-sm md:self-auto'
                  style={{
                    borderRadius: 999,
                    paddingInline: 14,
                    paddingBlock: 6,
                    fontSize: '13px',
                  }}
                >
                  {ENTERPRISE_PROFILE_UI.ENTERPRISE.VERIFIED}
                </Tag>
              )}
            </div>

            <Space size={8} wrap className={isMobile ? 'justify-center' : ''}>
              <Tag
                icon={<SolutionOutlined />}
                className='border-none bg-slate-100 font-bold text-slate-500 shadow-sm'
                style={{ borderRadius: 999, paddingInline: 16, paddingBlock: 6 }}
              >
                {profile?.industry || ENTERPRISE_PROFILE_UI.ENTERPRISE.NOT_PROVIDED}
              </Tag>
            </Space>
          </div>
        </div>
      </div>
    </Card>
  );
});

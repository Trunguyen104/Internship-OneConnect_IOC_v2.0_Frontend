'use client';

import {
  CameraOutlined,
  CheckCircleFilled,
  EditOutlined,
  SolutionOutlined,
} from '@ant-design/icons';
import { Grid, theme, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { memo } from 'react';

import AvatarUploader from '@/components/ui/avataruploader';
import { ENTERPRISE_PROFILE_UI } from '@/constants/company-profile/uiText';

export const ProfileSummaryCard = memo(function ProfileSummaryCard({
  profile,
  onEdit,
  onLogoChange,
  onBannerChange,
}) {
  const { token } = theme.useToken();
  const screens = Grid.useBreakpoint();

  const isMobile = !screens.md;
  const bannerHeight = isMobile ? 180 : 280;
  const avatarSize = isMobile ? 100 : 140;
  const avatarOverlap = avatarSize * 0.4;

  const bannerUrl = profile?.backgroundUrl ?? profile?.backgroundUrl1;

  const backgroundStyle = bannerUrl
    ? {
        backgroundImage: `url("${bannerUrl}")`,
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
    <div className="group/card relative overflow-hidden rounded-[32px] border border-gray-100 bg-surface p-0 shadow-sm transition-all duration-500 hover:shadow-xl">
      {/* 1. Cover Banner Layer */}
      <div
        className="group/banner relative w-full overflow-hidden transition-all duration-500"
        style={{ height: bannerHeight, ...backgroundStyle }}
      >
        <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity duration-300 group-hover/banner:opacity-100" />

        {/* Change Banner Hover Control */}
        {onBannerChange && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-500 group-hover/banner:opacity-100">
            <ImgCrop rotationSlider aspect={4 / 1}>
              <Upload showUploadList={false} beforeUpload={beforeBannerUpload}>
                <button className="flex items-center gap-2 rounded-full bg-white/90 px-6 py-3 font-black text-text shadow-xl backdrop-blur-md transition-all hover:bg-white hover:scale-105 active:scale-95">
                  <CameraOutlined className="text-lg" />
                  <span className="text-sm uppercase tracking-wider">
                    {ENTERPRISE_PROFILE_UI.ENTERPRISE.CHANGE_COVER}
                  </span>
                </button>
              </Upload>
            </ImgCrop>
          </div>
        )}

        {/* Edit Profile Button - Top Right */}
        {onEdit && (
          <div className="absolute top-8 right-8 z-30">
            <button
              type="button"
              onClick={onEdit}
              className="group/edit flex items-center gap-2 rounded-2xl bg-white/90 p-4 font-black transition-all hover:bg-white hover:shadow-2xl hover:scale-105 active:scale-95 shadow-xl backdrop-blur-md"
            >
              <EditOutlined className="text-lg text-primary transition-transform group-hover/edit:rotate-12" />
              {!isMobile && (
                <span className="text-xs uppercase tracking-widest text-text">
                  {ENTERPRISE_PROFILE_UI.ENTERPRISE.EDIT_PROFILE}
                </span>
              )}
            </button>
          </div>
        )}
      </div>

      {/* 2. Content Layer (Avatar + Info) */}
      <div className="relative px-8 pt-4 pb-10 md:px-12">
        {/* Overlapping Avatar Area */}
        <div
          className="absolute z-20"
          style={{
            top: -avatarOverlap,
            left: isMobile ? '50%' : '48px',
            transform: isMobile ? 'translateX(-50%)' : 'none',
          }}
        >
          <div className="group/avatar relative overflow-hidden rounded-[40px] bg-surface p-1.5 shadow-2xl transition-all duration-500 hover:scale-105 hover:rotate-1">
            <AvatarUploader
              value={profile?.logoUrl}
              onChange={onLogoChange}
              size={avatarSize}
              fullName={profile?.name}
              className="rounded-[34px]"
            />
          </div>
        </div>

        {/* Info Area below/beside avatar */}
        <div
          style={{
            marginTop: isMobile ? avatarSize - avatarOverlap + 16 : 0,
            paddingLeft: isMobile ? 0 : avatarSize + 24,
            textAlign: isMobile ? 'center' : 'left',
          }}
          className="flex flex-col justify-between gap-8 md:flex-row md:items-end"
        >
          <div className="flex-1 space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
              <h1 className="m-0 text-3xl font-black tracking-tight text-text md:text-5xl">
                {profile?.name || ENTERPRISE_PROFILE_UI.ENTERPRISE.NOT_PROVIDED}
              </h1>

              {profile?.isVerified && (
                <div className="flex items-center gap-2 rounded-full bg-blue-50/50 border border-blue-100 px-5 py-2 text-blue-600 shadow-sm backdrop-blur-sm self-center md:self-auto transition-transform hover:scale-105">
                  <CheckCircleFilled className="text-base" />
                  <span className="text-[11px] font-black uppercase tracking-widest">
                    {ENTERPRISE_PROFILE_UI.ENTERPRISE.VERIFIED}
                  </span>
                </div>
              )}
            </div>

            <div className={`flex flex-wrap gap-2 ${isMobile ? 'justify-center' : ''}`}>
              <div className="flex items-center gap-2 rounded-2xl bg-gray-50 px-5 py-2.5 border border-gray-100 text-muted transition-colors hover:bg-gray-100">
                <SolutionOutlined className="text-sm" />
                <span className="text-xs font-black uppercase tracking-wider">
                  {profile?.industry || ENTERPRISE_PROFILE_UI.ENTERPRISE.NOT_PROVIDED}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

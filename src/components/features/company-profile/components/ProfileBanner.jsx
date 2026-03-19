'use client';

import { memo, useMemo } from 'react';
import Image from 'next/image';
import { EditOutlined } from '@ant-design/icons';
import { Grid, theme } from 'antd';
import { ENTERPRISE_PROFILE_UI } from '@/constants/company-profile/uiText';

const primaryButtonClassName =
  'bg-primary hover:bg-primary-hover active:bg-primary-700 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-[13px] font-bold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60';

export const ProfileBanner = memo(function ProfileBanner({ backgroundUrl, onEdit }) {
  const { token } = theme.useToken();
  const screens = Grid.useBreakpoint();

  const coverHeight = screens.md ? 240 : 180;

  const coverStyle = useMemo(
    () => ({
      position: 'relative',
      height: coverHeight,
      overflow: 'hidden',
      borderBottomLeftRadius: token.borderRadiusLG * 2,
      borderBottomRightRadius: token.borderRadiusLG * 2,
      border: `1px solid ${token.colorBorderSecondary}`,
      backgroundImage: `radial-gradient(circle at 20% 20%, ${token.colorPrimaryBg} 0%, transparent 55%), radial-gradient(circle at 85% 25%, ${token.colorFillSecondary} 0%, transparent 50%), linear-gradient(135deg, ${token.colorBgContainer} 0%, ${token.colorBgLayout} 100%)`,
    }),
    [coverHeight, token],
  );

  return (
    <header style={coverStyle}>
      {backgroundUrl ? (
        <Image
          src={backgroundUrl}
          alt='Cover'
          fill
          priority
          style={{ objectFit: 'cover', opacity: 0.18 }}
        />
      ) : null}

      <div
        aria-hidden='true'
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(180deg, ${token.colorBgContainer} 0%, transparent 55%)`,
          opacity: 0.8,
        }}
      />

      <div style={{ position: 'absolute', top: token.paddingLG, right: token.paddingLG }}>
        <button type='button' onClick={onEdit} className={primaryButtonClassName}>
          <EditOutlined aria-hidden='true' />
          {ENTERPRISE_PROFILE_UI.ENTERPRISE.EDIT_PROFILE}
        </button>
      </div>
    </header>
  );
});

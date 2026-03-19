'use client';

import { memo, useMemo } from 'react';
import Image from 'next/image';
import { CheckCircleFilled, EditOutlined, SolutionOutlined } from '@ant-design/icons';
import { Col, Grid, Row, Space, Tag, Typography, theme } from 'antd';

import { Card } from '@/components/ui/atoms';
import { ENTERPRISE_PROFILE_UI } from '@/constants/company-profile/uiText';

const { Title } = Typography;

const primaryButtonClassName =
  'bg-primary hover:bg-primary-hover active:bg-primary-700 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-[13px] font-bold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60';

export const ProfileSummaryCard = memo(function ProfileSummaryCard({ profile, onEdit }) {
  const { token } = theme.useToken();
  const screens = Grid.useBreakpoint();

  const logoSize = screens.md ? 144 : 120;

  const logoContainerStyle = useMemo(
    () => ({
      borderRadius: token.borderRadiusLG * 2,
      borderWidth: 1,
      borderStyle: 'solid',
      overflow: 'hidden',
      width: logoSize,
      height: logoSize,
      display: 'grid',
      placeItems: 'center',
    }),
    [logoSize, token.borderRadiusLG],
  );

  return (
    <Card className='min-h-0'>
      <div className='flex min-h-0 flex-1 flex-col p-6'>
        <Row gutter={[20, 16]} align='middle' wrap>
          <Col>
            <div className='bg-surface border-border/60 shadow-sm' style={logoContainerStyle}>
              {profile?.logoUrl ? (
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <Image
                    src={profile.logoUrl}
                    alt='Company logo'
                    fill
                    style={{ objectFit: 'contain', padding: 16 }}
                  />
                </div>
              ) : (
                <SolutionOutlined style={{ color: token.colorTextTertiary, fontSize: 38 }} />
              )}
            </div>
          </Col>

          <Col flex='auto'>
            <Space orientation='vertical' size={10} style={{ width: '100%' }}>
              <Space align='center' size={10} wrap>
                <Title
                  level={2}
                  style={{
                    margin: 0,
                    lineHeight: 1.1,
                    fontWeight: 900,
                    fontSize: screens.md ? 36 : 30,
                  }}
                  ellipsis={{
                    tooltip: profile?.name || ENTERPRISE_PROFILE_UI.ENTERPRISE.NOT_PROVIDED,
                  }}
                >
                  {profile?.name || ENTERPRISE_PROFILE_UI.ENTERPRISE.NOT_PROVIDED}
                </Title>
                {profile?.isVerified ? (
                  <Tag
                    icon={<CheckCircleFilled aria-hidden='true' />}
                    style={{
                      marginInlineEnd: 0,
                      borderRadius: 999,
                      borderColor: 'transparent',
                      background: token.colorSuccessBg,
                      color: token.colorSuccessText,
                      fontWeight: 700,
                      paddingInline: 12,
                      paddingBlock: 4,
                    }}
                  >
                    Verified
                  </Tag>
                ) : null}
              </Space>

              <Space size='small' wrap aria-label='Company metadata'>
                <Tag
                  icon={<SolutionOutlined aria-hidden='true' />}
                  style={{
                    marginInlineEnd: 0,
                    borderRadius: 999,
                    borderColor: 'transparent',
                    background: token.colorFillTertiary,
                    color: token.colorTextSecondary,
                    fontWeight: 600,
                    paddingInline: 12,
                    paddingBlock: 6,
                  }}
                >
                  {profile?.industry || ENTERPRISE_PROFILE_UI.ENTERPRISE.NOT_PROVIDED}
                </Tag>
              </Space>
            </Space>
          </Col>

          {onEdit && (
            <Col>
              <button type='button' onClick={onEdit} className={primaryButtonClassName}>
                <EditOutlined aria-hidden='true' />
                {ENTERPRISE_PROFILE_UI.ENTERPRISE.EDIT_PROFILE}
              </button>
            </Col>
          )}
        </Row>
      </div>
    </Card>
  );
});

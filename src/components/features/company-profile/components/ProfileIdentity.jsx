'use client';

import { EnvironmentOutlined, GlobalOutlined, SolutionOutlined } from '@ant-design/icons';
import { Col, Grid, Row, Space, Tag, theme, Typography } from 'antd';
import Image from 'next/image';
import { memo } from 'react';

import { ENTERPRISE_PROFILE_UI } from '@/constants/company-profile/uiText';

const { Title, Link } = Typography;

export const ProfileIdentity = memo(function ProfileIdentity({ profile }) {
  const { token } = theme.useToken();
  const screens = Grid.useBreakpoint();

  const logoSize = screens.md ? 96 : 80;

  return (
    <section
      aria-label="Company identity"
      style={{
        marginTop: token.marginLG,
        marginBottom: token.marginXL,
        paddingInline: token.paddingLG,
      }}
    >
      <Row gutter={[16, 16]} align="bottom" wrap>
        <Col>
          <div
            style={{
              borderRadius: token.borderRadiusLG,
              border: `4px solid ${token.colorBgContainer}`,
              background: token.colorBgContainer,
              overflow: 'hidden',
              width: logoSize,
              height: logoSize,
              display: 'grid',
              placeItems: 'center',
            }}
          >
            {profile?.logoUrl ? (
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <Image
                  src={profile.logoUrl}
                  alt="Company logo"
                  fill
                  style={{ objectFit: 'contain', padding: 12 }}
                />
              </div>
            ) : (
              <div style={{ display: 'grid', placeItems: 'center', width: '100%', height: '100%' }}>
                <SolutionOutlined style={{ color: token.colorTextTertiary, fontSize: 28 }} />
              </div>
            )}
          </div>
        </Col>

        <Col flex="auto">
          <Space orientation="vertical" size={6} style={{ width: '100%' }}>
            <Space align="center" size={8} wrap>
              <Title
                level={2}
                style={{ margin: 0, lineHeight: 1.15 }}
                ellipsis={{
                  tooltip: profile?.name || ENTERPRISE_PROFILE_UI.ENTERPRISE.NOT_PROVIDED,
                }}
              >
                {profile?.name || ENTERPRISE_PROFILE_UI.ENTERPRISE.NOT_PROVIDED}
              </Title>
            </Space>

            <Space size="small" wrap aria-label="Company metadata">
              <Tag
                icon={<SolutionOutlined aria-hidden="true" />}
                style={{
                  marginInlineEnd: 0,
                  borderRadius: 999,
                  borderColor: 'transparent',
                  background: token.colorFillTertiary,
                  color: token.colorTextSecondary,
                  fontWeight: 600,
                }}
              >
                {profile?.industry || ENTERPRISE_PROFILE_UI.ENTERPRISE.NOT_PROVIDED}
              </Tag>
              <Tag
                icon={<EnvironmentOutlined aria-hidden="true" />}
                style={{
                  marginInlineEnd: 0,
                  borderRadius: 999,
                  borderColor: 'transparent',
                  background: token.colorPrimaryBg,
                  color: token.colorPrimaryTextActive,
                  fontWeight: 600,
                }}
              >
                {profile?.address || ENTERPRISE_PROFILE_UI.ENTERPRISE.NOT_PROVIDED}
              </Tag>
              {profile?.website ? (
                <Tag
                  icon={<GlobalOutlined aria-hidden="true" />}
                  style={{
                    marginInlineEnd: 0,
                    borderRadius: 999,
                    borderColor: 'transparent',
                    background: token.colorFillTertiary,
                    color: token.colorTextSecondary,
                    fontWeight: 600,
                  }}
                >
                  <Link href={profile.website} target="_blank" rel="noopener noreferrer">
                    {ENTERPRISE_PROFILE_UI.ENTERPRISE.WEBSITE}
                  </Link>
                </Tag>
              ) : null}
            </Space>
          </Space>
        </Col>
      </Row>
    </section>
  );
});

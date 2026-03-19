'use client';

import { memo } from 'react';
import {
  EnvironmentOutlined,
  GlobalOutlined,
  InfoCircleOutlined,
  SolutionOutlined,
} from '@ant-design/icons';
import { Descriptions, Divider, Space, Tooltip, Typography, theme } from 'antd';
import { ENTERPRISE_PROFILE_UI } from '@/constants/company-profile/uiText';
import { ProfileSectionCard } from './ProfileSectionCard';

const { Text, Link } = Typography;

export const ProfileInfoPanel = memo(function ProfileInfoPanel({ profile }) {
  const { token } = theme.useToken();
  const taxCodeValue =
    profile?.taxCode ?? profile?.taxcode ?? profile?.tax_code ?? profile?.taxCODE ?? null;
  const taxCodeDisplay =
    taxCodeValue === null || taxCodeValue === undefined || String(taxCodeValue).trim() === ''
      ? ENTERPRISE_PROFILE_UI.ENTERPRISE.NOT_PROVIDED
      : String(taxCodeValue);

  return (
    <ProfileSectionCard title={ENTERPRISE_PROFILE_UI.ENTERPRISE.INFO} icon={<InfoCircleOutlined />}>
      <Space orientation='vertical' size='middle' style={{ width: '100%' }}>
        <Descriptions
          column={1}
          bordered={false}
          layout='vertical'
          styles={{
            label: {
              color: token.colorTextTertiary,
              fontWeight: 700,
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              paddingBottom: 6,
            },
            content: {
              color: token.colorText,
              fontWeight: 700,
              fontSize: 15,
              paddingBottom: 14,
            },
          }}
        >
          <Descriptions.Item
            label={
              <Space size={6}>
                <InfoCircleOutlined aria-hidden='true' />
                {ENTERPRISE_PROFILE_UI.ENTERPRISE.TAX_CODE}
                <Tooltip title={ENTERPRISE_PROFILE_UI.ENTERPRISE.TAX_CODE_HINT}>
                  <Text type='secondary' style={{ fontWeight: 700 }}>
                    (i)
                  </Text>
                </Tooltip>
              </Space>
            }
          >
            <Text strong>{taxCodeDisplay}</Text>
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <Space size={6}>
                <SolutionOutlined aria-hidden='true' />
                {ENTERPRISE_PROFILE_UI.ENTERPRISE.INDUSTRY}
              </Space>
            }
          >
            <Text strong>{profile?.industry || ENTERPRISE_PROFILE_UI.ENTERPRISE.NOT_PROVIDED}</Text>
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <Space size={6}>
                <EnvironmentOutlined aria-hidden='true' />
                {ENTERPRISE_PROFILE_UI.ENTERPRISE.ADDRESS}
              </Space>
            }
          >
            <Text strong>{profile?.address || ENTERPRISE_PROFILE_UI.ENTERPRISE.NOT_PROVIDED}</Text>
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <Space size={6}>
                <GlobalOutlined aria-hidden='true' />
                {ENTERPRISE_PROFILE_UI.ENTERPRISE.WEBSITE}
              </Space>
            }
          >
            {profile?.website ? (
              <Link href={profile.website} target='_blank' rel='noopener noreferrer'>
                {profile.website}
              </Link>
            ) : (
              <Text strong>{ENTERPRISE_PROFILE_UI.ENTERPRISE.NOT_PROVIDED}</Text>
            )}
          </Descriptions.Item>
        </Descriptions>

        <Divider style={{ marginBlock: 0 }} />

        <Text type='secondary' style={{ display: 'block' }}>
          {ENTERPRISE_PROFILE_UI.ENTERPRISE.TRUST_HINT}
        </Text>
      </Space>
    </ProfileSectionCard>
  );
});

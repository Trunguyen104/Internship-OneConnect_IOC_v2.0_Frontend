'use client';

import { createContext, memo, useCallback, useContext, useEffect, useMemo } from 'react';
import Image from 'next/image';
import {
  CheckCircleFilled,
  CloseOutlined,
  EditOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  SaveOutlined,
  SolutionOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Empty,
  Form,
  Grid,
  Input,
  Layout,
  Row,
  Space,
  Tag,
  Tooltip,
  Typography,
  theme,
} from 'antd';
import { PROFILE_UI } from '@/constants/user/uiText';

const ProfileContext = createContext(null);

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) throw new Error('useProfile must be used within EnterpriseProfile');
  return context;
}

function normalizeProfile(profile) {
  return {
    name: profile?.name ?? '',
    description: profile?.description ?? '',
    website: profile?.website ?? '',
    industry: profile?.industry ?? '',
    address: profile?.address ?? '',
  };
}

function isHttpUrl(value) {
  if (!value) return true;
  return /^https?:\/\/.+/i.test(value);
}

const { Title, Text, Link, Paragraph } = Typography;

function toEllipsis(value) {
  if (!value) return value;
  return value.replace('...', '…');
}

export function EnterpriseProfile({
  children,
  profile,
  isSaving,
  onSave,
  onEdit,
  editMode,
  onCancel,
}) {
  const [form] = Form.useForm();

  const normalizedProfile = useMemo(() => normalizeProfile(profile), [profile]);

  useEffect(() => {
    form.setFieldsValue(normalizedProfile);
  }, [form, normalizedProfile, editMode]);

  const handleStartEdit = useCallback(() => onEdit?.(), [onEdit]);

  const handleCancel = useCallback(() => {
    form.setFieldsValue(normalizedProfile);
    onCancel?.();
  }, [form, normalizedProfile, onCancel]);

  const handleSubmit = useCallback(() => form.submit(), [form]);

  const handleFinish = useCallback((values) => onSave?.(values), [onSave]);

  const handleFinishFailed = useCallback(
    ({ errorFields }) => {
      const firstFieldName = errorFields?.[0]?.name;
      if (firstFieldName) form.scrollToField(firstFieldName, { block: 'center' });
    },
    [form],
  );

  useEffect(() => {
    if (!editMode) return undefined;

    const handleBeforeUnload = (event) => {
      if (!form.isFieldsTouched(true)) return;
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [editMode, form]);

  const value = useMemo(
    () => ({
      profile,
      editMode,
      isSaving,
      form,
      normalizedProfile,
      actions: { startEdit: handleStartEdit, cancel: handleCancel, submit: handleSubmit },
    }),
    [
      editMode,
      form,
      handleCancel,
      handleStartEdit,
      handleSubmit,
      isSaving,
      normalizedProfile,
      profile,
    ],
  );

  return (
    <ProfileContext.Provider value={value}>
      <Layout style={{ background: 'transparent' }}>
        <Layout.Content>
          <Form
            form={form}
            layout='vertical'
            requiredMark={false}
            onFinish={handleFinish}
            onFinishFailed={handleFinishFailed}
            initialValues={normalizedProfile}
          >
            <div style={{ marginInline: 'auto', width: '100%', maxWidth: 1120, paddingBottom: 32 }}>
              {children}
            </div>
          </Form>
        </Layout.Content>
      </Layout>
    </ProfileContext.Provider>
  );
}

EnterpriseProfile.Banner = memo(function Banner() {
  const { token } = theme.useToken();
  const screens = Grid.useBreakpoint();
  const { profile, editMode, isSaving, actions } = useProfile();

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
      {profile?.backgroundUrl ? (
        <Image
          src={profile.backgroundUrl}
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
        {!editMode ? (
          <Button type='primary' icon={<EditOutlined />} onClick={actions.startEdit}>
            {PROFILE_UI.ENTERPRISE.EDIT_PROFILE}
          </Button>
        ) : (
          <Space size='small'>
            <Button icon={<CloseOutlined />} onClick={actions.cancel} disabled={isSaving}>
              {PROFILE_UI.BUTTONS.CANCEL}
            </Button>
            <Button
              type='primary'
              icon={<SaveOutlined />}
              onClick={actions.submit}
              loading={isSaving}
              disabled={isSaving}
            >
              {isSaving ? toEllipsis(PROFILE_UI.ENTERPRISE.SAVING) : PROFILE_UI.ENTERPRISE.SAVE}
            </Button>
          </Space>
        )}
      </div>
    </header>
  );
});

EnterpriseProfile.Identity = memo(function Identity() {
  const { token } = theme.useToken();
  const screens = Grid.useBreakpoint();
  const { profile, editMode, form } = useProfile();

  const logoSize = screens.md ? 96 : 80;

  const industry = Form.useWatch('industry', form);
  const address = Form.useWatch('address', form);

  return (
    <section
      aria-label='Company identity'
      style={{
        position: 'relative',
        zIndex: 1,
        marginTop: -(token.marginXL + token.marginXS),
        marginBottom: token.marginXL,
        paddingInline: token.paddingLG,
      }}
    >
      <Row gutter={[16, 16]} align='bottom' wrap>
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
                  alt='Company logo'
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

        <Col flex='auto'>
          <Space direction='vertical' size={6} style={{ width: '100%' }}>
            <Space align='center' size={8} wrap>
              {editMode ? (
                <Form.Item
                  name='name'
                  rules={[{ required: true, message: PROFILE_UI.ENTERPRISE.ERRORS.NAME }]}
                  style={{ marginBottom: 0, width: 'min(560px, 100%)' }}
                >
                  <Input
                    size='large'
                    placeholder={`${PROFILE_UI.ENTERPRISE.COMPANY_NAME_PLACEHOLDER}…`}
                    aria-label={PROFILE_UI.ENTERPRISE.COMPANY_NAME_PLACEHOLDER}
                    name='name'
                    autoComplete='organization'
                    style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.2 }}
                  />
                </Form.Item>
              ) : (
                <>
                  <Title
                    level={2}
                    style={{ margin: 0, lineHeight: 1.15 }}
                    ellipsis={{ tooltip: profile?.name || PROFILE_UI.ENTERPRISE.NOT_PROVIDED }}
                  >
                    {profile?.name || PROFILE_UI.ENTERPRISE.NOT_PROVIDED}
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
                      }}
                    >
                      Verified
                    </Tag>
                  ) : null}
                </>
              )}
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
                }}
              >
                {industry || profile?.industry || PROFILE_UI.ENTERPRISE.NOT_PROVIDED}
              </Tag>
              <Tag
                icon={<EnvironmentOutlined aria-hidden='true' />}
                style={{
                  marginInlineEnd: 0,
                  borderRadius: 999,
                  borderColor: 'transparent',
                  background: token.colorPrimaryBg,
                  color: token.colorPrimaryTextActive,
                  fontWeight: 600,
                }}
              >
                {address || profile?.address || PROFILE_UI.ENTERPRISE.NOT_PROVIDED}
              </Tag>
              {profile?.website ? (
                <Tag
                  icon={<GlobalOutlined aria-hidden='true' />}
                  style={{
                    marginInlineEnd: 0,
                    borderRadius: 999,
                    borderColor: 'transparent',
                    background: token.colorFillTertiary,
                    color: token.colorTextSecondary,
                    fontWeight: 600,
                  }}
                >
                  <Link href={profile.website} target='_blank' rel='noopener noreferrer'>
                    {PROFILE_UI.ENTERPRISE.WEBSITE}
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

EnterpriseProfile.Content = function Content({ children }) {
  const { token } = theme.useToken();
  return (
    <main style={{ paddingInline: token.paddingLG, paddingBottom: token.paddingXL }}>
      <Row gutter={[16, 16]} align='top' wrap>
        {children}
      </Row>
    </main>
  );
};

EnterpriseProfile.Main = function Main({ children }) {
  return (
    <Col xs={24} lg={16}>
      <Space direction='vertical' size='large' style={{ width: '100%' }}>
        {children}
      </Space>
    </Col>
  );
};

EnterpriseProfile.Sidebar = function Sidebar({ children }) {
  return (
    <Col xs={24} lg={8}>
      <Space direction='vertical' size='large' style={{ width: '100%' }}>
        {children}
      </Space>
    </Col>
  );
};

EnterpriseProfile.Card = function ProfileCard({ title, icon, children, extra }) {
  const { token } = theme.useToken();
  return (
    <Card
      title={
        <Space size={8}>
          {icon ? <span style={{ color: token.colorTextSecondary }}>{icon}</span> : null}
          <Text style={{ fontWeight: 800, color: token.colorText }}>{title}</Text>
        </Space>
      }
      extra={extra}
      bordered
      styles={{
        header: {
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          paddingInline: token.paddingLG,
        },
        body: { padding: token.paddingLG },
      }}
      style={{
        borderRadius: token.borderRadiusLG,
        borderColor: token.colorBorderSecondary,
        background: token.colorBgContainer,
      }}
    >
      {children}
    </Card>
  );
};

EnterpriseProfile.Description = memo(function Description() {
  const { token } = theme.useToken();
  const { profile, editMode, actions } = useProfile();

  if (editMode) {
    return (
      <Form.Item
        name='description'
        rules={[{ max: 2000, message: PROFILE_UI.ENTERPRISE.ERRORS.DESCRIPTION }]}
        style={{ marginBottom: 0 }}
      >
        <Input.TextArea
          placeholder={`${PROFILE_UI.ENTERPRISE.DESCRIPTION_PLACEHOLDER}…`}
          name='description'
          autoComplete='off'
          maxLength={2000}
          showCount
          autoSize={{ minRows: 7, maxRows: 12 }}
        />
      </Form.Item>
    );
  }

  if (!profile?.description) {
    return (
      <div
        style={{
          padding: token.paddingXL,
          borderRadius: token.borderRadiusLG,
          border: `1px dashed ${token.colorBorder}`,
          background: token.colorFillQuaternary,
        }}
      >
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Space direction='vertical' size={0}>
              <Text strong style={{ color: token.colorText }}>
                {PROFILE_UI.ENTERPRISE.NO_DESCRIPTION}
              </Text>
              <Text type='secondary'>
                Add a short overview to make your company profile more complete.
              </Text>
            </Space>
          }
        >
          <Button type='primary' icon={<PlusOutlined />} onClick={actions.startEdit}>
            Add Company Description
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <Paragraph style={{ marginBottom: 0, color: token.colorTextSecondary, whiteSpace: 'pre-wrap' }}>
      {profile.description}
    </Paragraph>
  );
});

EnterpriseProfile.Activities = memo(function Activities() {
  const { token } = theme.useToken();
  return (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={<Text type='secondary'>{PROFILE_UI.ENTERPRISE.NO_ACTIVITIES}</Text>}
      style={{ paddingBlock: token.paddingLG }}
    />
  );
});

EnterpriseProfile.InfoPanel = memo(function InfoPanel() {
  const { token } = theme.useToken();
  const { profile, editMode } = useProfile();

  return (
    <Space direction='vertical' size='middle' style={{ width: '100%' }}>
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
          content: { color: token.colorText, fontWeight: 700, fontSize: 15, paddingBottom: 14 },
        }}
      >
        <Descriptions.Item
          label={
            <Space size={6}>
              <InfoCircleOutlined aria-hidden='true' />
              {PROFILE_UI.ENTERPRISE.TAX_CODE}
              <Tooltip title={PROFILE_UI.ENTERPRISE.TAX_CODE_HINT}>
                <Text type='secondary' style={{ fontWeight: 700 }}>
                  (i)
                </Text>
              </Tooltip>
            </Space>
          }
        >
          <Text strong>{profile?.taxCode || PROFILE_UI.ENTERPRISE.NOT_PROVIDED}</Text>
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <Space size={6}>
              <SolutionOutlined aria-hidden='true' />
              {PROFILE_UI.ENTERPRISE.INDUSTRY}
            </Space>
          }
        >
          {editMode ? (
            <Form.Item name='industry' style={{ marginBottom: 0 }}>
              <Input
                placeholder={`${PROFILE_UI.ENTERPRISE.INDUSTRY}…`}
                aria-label={PROFILE_UI.ENTERPRISE.INDUSTRY}
                name='industry'
                autoComplete='off'
              />
            </Form.Item>
          ) : (
            <Text strong>{profile?.industry || PROFILE_UI.ENTERPRISE.NOT_PROVIDED}</Text>
          )}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <Space size={6}>
              <EnvironmentOutlined aria-hidden='true' />
              {PROFILE_UI.ENTERPRISE.ADDRESS}
            </Space>
          }
        >
          {editMode ? (
            <Form.Item name='address' style={{ marginBottom: 0 }}>
              <Input
                placeholder={`${PROFILE_UI.ENTERPRISE.ADDRESS}…`}
                aria-label={PROFILE_UI.ENTERPRISE.ADDRESS}
                name='address'
                autoComplete='street-address'
              />
            </Form.Item>
          ) : (
            <Text strong>{profile?.address || PROFILE_UI.ENTERPRISE.NOT_PROVIDED}</Text>
          )}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <Space size={6}>
              <GlobalOutlined aria-hidden='true' />
              {PROFILE_UI.ENTERPRISE.WEBSITE}
            </Space>
          }
        >
          {editMode ? (
            <Form.Item
              name='website'
              rules={[
                {
                  validator: async (_, value) => {
                    if (!isHttpUrl(value)) throw new Error(PROFILE_UI.ENTERPRISE.ERRORS.WEBSITE);
                  },
                },
              ]}
              style={{ marginBottom: 0 }}
            >
              <Input
                placeholder={`${PROFILE_UI.ENTERPRISE.WEBSITE_PLACEHOLDER}…`}
                aria-label={PROFILE_UI.ENTERPRISE.WEBSITE}
                name='website'
                type='url'
                inputMode='url'
                autoComplete='url'
              />
            </Form.Item>
          ) : profile?.website ? (
            <Link href={profile.website} target='_blank' rel='noopener noreferrer'>
              {profile.website}
            </Link>
          ) : (
            <Text strong>{PROFILE_UI.ENTERPRISE.NOT_PROVIDED}</Text>
          )}
        </Descriptions.Item>
      </Descriptions>

      <Divider style={{ marginBlock: 0 }} />

      <Text type='secondary' style={{ display: 'block' }}>
        Keep your company information up to date to build trust with candidates.
      </Text>
    </Space>
  );
});

// Legacy API: kept for compatibility with older container markup.
EnterpriseProfile.InfoItem = memo(function InfoItem() {
  return null;
});

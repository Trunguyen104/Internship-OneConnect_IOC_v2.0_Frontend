'use client';

import { Button, Drawer, Form, Input, Space, Typography } from 'antd';
import { Col, Row } from 'antd';
import { useCallback, useEffect, useMemo } from 'react';

import AvatarUploader from '@/components/ui/avataruploader';
import BannerUploader from '@/components/ui/banneruploader';
import { ENTERPRISE_PROFILE_UI } from '@/constants/company-profile/uiText';

function isHttpUrl(value) {
  if (!value) return true;
  return /^https?:\/\/.+/i.test(value);
}

function normalizeProfileToForm(profile) {
  const taxCodeValue =
    profile?.taxCode ?? profile?.taxcode ?? profile?.tax_code ?? profile?.taxCODE ?? '';
  return {
    logoUrl: profile?.logoUrl ?? '',
    backgroundUrl: profile?.backgroundUrl ?? profile?.backgroundUrl1 ?? '',
    name: profile?.name ?? '',
    website: profile?.website ?? '',
    industry: profile?.industry ?? '',
    taxCode: taxCodeValue,
    description: profile?.description ?? '',
    address: profile?.address ?? '',
  };
}

export default function EnterpriseProfileEditDrawer({ open, saving, profile, onClose, onSave }) {
  const [form] = Form.useForm();

  const initialValues = useMemo(() => normalizeProfileToForm(profile), [profile]);

  useEffect(() => {
    if (!open) return;
    form.setFieldsValue(initialValues);
  }, [open, form, initialValues]);

  const handleCancel = useCallback(() => {
    form.setFieldsValue(initialValues);
    onClose?.();
  }, [form, initialValues, onClose]);

  const handleSubmit = useCallback(async () => {
    const values = await form.validateFields();
    await onSave?.(values);
  }, [form, onSave]);

  return (
    <Drawer
      open={open}
      onClose={handleCancel}
      size="large"
      placement="right"
      destroyOnClose={false}
      title={
        <div className="space-y-1">
          <Typography.Text className="text-text text-lg font-bold">
            {ENTERPRISE_PROFILE_UI.EDIT_DRAWER.TITLE}
          </Typography.Text>
          <Typography.Text type="secondary" className="block">
            {ENTERPRISE_PROFILE_UI.EDIT_DRAWER.SUBTITLE}
          </Typography.Text>
        </div>
      }
      footer={
        <div className="flex gap-3">
          <Button size="large" className="flex-1" onClick={handleCancel} disabled={saving}>
            {ENTERPRISE_PROFILE_UI.BUTTONS.CANCEL}
          </Button>
          <Button
            type="primary"
            size="large"
            className="flex-1"
            onClick={handleSubmit}
            loading={saving}
            disabled={saving}
          >
            {ENTERPRISE_PROFILE_UI.EDIT_DRAWER.SAVE_CHANGES}
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        <div className="space-y-6 p-1">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6 shadow-sm">
            <Row gutter={[48, 24]} align="top" justify="center">
              {/* Logo Section */}
              <Col xs={24} md={8} lg={7}>
                <div className="flex flex-col items-center">
                  <div className="mb-4 w-full text-center">
                    <span className="font-bold whitespace-nowrap text-slate-700">
                      {ENTERPRISE_PROFILE_UI.EDIT_DRAWER.COMPANY_LOGO}
                    </span>
                  </div>

                  <div className="flex justify-center">
                    <Form.Item name="logoUrl" className="mb-0">
                      <AvatarUploader size={100} fullName={initialValues?.name} />
                    </Form.Item>
                  </div>
                </div>
              </Col>

              {/* Banner Section */}
              <Col xs={24} md={16} lg={17}>
                <div className="flex flex-col items-center">
                  <div className="mb-4 w-full text-center">
                    <span className="font-bold whitespace-nowrap text-slate-700">
                      {ENTERPRISE_PROFILE_UI.EDIT_DRAWER.COVER_BANNER}
                    </span>
                  </div>

                  <Form.Item name="backgroundUrl" className="mb-0 w-full">
                    <BannerUploader />
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <div className="mt-8 text-center text-xs font-medium text-slate-400 italic">
              {ENTERPRISE_PROFILE_UI.EDIT_DRAWER.LOGO_OVERLAP_HINT}
            </div>
          </div>

          <Form.Item
            name="name"
            label={ENTERPRISE_PROFILE_UI.ENTERPRISE.COMPANY_NAME_PLACEHOLDER}
            rules={[{ required: true, message: ENTERPRISE_PROFILE_UI.ENTERPRISE.ERRORS.NAME }]}
          >
            <Input size="large" autoComplete="organization" />
          </Form.Item>

          <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
            <Form.Item
              name="website"
              label={ENTERPRISE_PROFILE_UI.ENTERPRISE.WEBSITE}
              rules={[
                {
                  validator: async (_, value) => {
                    if (!isHttpUrl(value))
                      throw new Error(ENTERPRISE_PROFILE_UI.ENTERPRISE.ERRORS.WEBSITE);
                  },
                },
              ]}
            >
              <Input
                size="large"
                type="url"
                inputMode="url"
                autoComplete="url"
                placeholder={ENTERPRISE_PROFILE_UI.ENTERPRISE.WEBSITE_PLACEHOLDER}
              />
            </Form.Item>

            <Form.Item name="industry" label={ENTERPRISE_PROFILE_UI.ENTERPRISE.INDUSTRY}>
              <Input size="large" />
            </Form.Item>

            <Form.Item name="taxCode" label={ENTERPRISE_PROFILE_UI.ENTERPRISE.TAX_CODE}>
              <Input size="large" disabled />
            </Form.Item>

            <Form.Item name="address" label={ENTERPRISE_PROFILE_UI.ENTERPRISE.ADDRESS}>
              <Input size="large" autoComplete="street-address" />
            </Form.Item>
          </Space>

          <Form.Item
            name="description"
            label={ENTERPRISE_PROFILE_UI.ENTERPRISE.OVERVIEW}
            rules={[{ max: 2000, message: ENTERPRISE_PROFILE_UI.ENTERPRISE.ERRORS.DESCRIPTION }]}
          >
            <Input.TextArea
              placeholder={ENTERPRISE_PROFILE_UI.ENTERPRISE.DESCRIPTION_PLACEHOLDER}
              autoComplete="off"
              maxLength={2000}
              showCount
              autoSize={{ minRows: 6, maxRows: 12 }}
            />
          </Form.Item>
        </div>
      </Form>
    </Drawer>
  );
}

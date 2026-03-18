'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { Button, Drawer, Form, Input, Space, Typography } from 'antd';

import AvatarUploader from '@/components/ui/avataruploader';
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
      size='large'
      placement='right'
      destroyOnClose={false}
      title={
        <div className='space-y-1'>
          <Typography.Text className='text-text text-lg font-bold'>
            {ENTERPRISE_PROFILE_UI.EDIT_DRAWER.TITLE}
          </Typography.Text>
          <Typography.Text type='secondary' className='block'>
            {ENTERPRISE_PROFILE_UI.EDIT_DRAWER.SUBTITLE}
          </Typography.Text>
        </div>
      }
      footer={
        <div className='flex gap-3'>
          <Button size='large' className='flex-1' onClick={handleCancel} disabled={saving}>
            {ENTERPRISE_PROFILE_UI.BUTTONS.CANCEL}
          </Button>
          <Button
            type='primary'
            size='large'
            className='flex-1'
            onClick={handleSubmit}
            loading={saving}
            disabled={saving}
          >
            {ENTERPRISE_PROFILE_UI.EDIT_DRAWER.SAVE_CHANGES}
          </Button>
        </div>
      }
    >
      <Form form={form} layout='vertical' requiredMark={false}>
        <div className='space-y-6 p-1'>
          <Form.Item name='logoUrl' label='Logo'>
            <AvatarUploader size={104} fullName={initialValues?.name} />
          </Form.Item>

          <Form.Item
            name='name'
            label={ENTERPRISE_PROFILE_UI.ENTERPRISE.COMPANY_NAME_PLACEHOLDER}
            rules={[{ required: true, message: ENTERPRISE_PROFILE_UI.ENTERPRISE.ERRORS.NAME }]}
          >
            <Input size='large' autoComplete='organization' />
          </Form.Item>

          <Space orientation='vertical' size='middle' style={{ width: '100%' }}>
            <Form.Item
              name='website'
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
                size='large'
                type='url'
                inputMode='url'
                autoComplete='url'
                placeholder={ENTERPRISE_PROFILE_UI.ENTERPRISE.WEBSITE_PLACEHOLDER}
              />
            </Form.Item>

            <Form.Item name='industry' label={ENTERPRISE_PROFILE_UI.ENTERPRISE.INDUSTRY}>
              <Input size='large' />
            </Form.Item>

            <Form.Item name='taxCode' label={ENTERPRISE_PROFILE_UI.ENTERPRISE.TAX_CODE}>
              <Input size='large' disabled />
            </Form.Item>

            <Form.Item name='address' label={ENTERPRISE_PROFILE_UI.ENTERPRISE.ADDRESS}>
              <Input size='large' autoComplete='street-address' />
            </Form.Item>
          </Space>

          <Form.Item
            name='description'
            label={ENTERPRISE_PROFILE_UI.ENTERPRISE.OVERVIEW}
            rules={[{ max: 2000, message: ENTERPRISE_PROFILE_UI.ENTERPRISE.ERRORS.DESCRIPTION }]}
          >
            <Input.TextArea
              placeholder={ENTERPRISE_PROFILE_UI.ENTERPRISE.DESCRIPTION_PLACEHOLDER}
              autoComplete='off'
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

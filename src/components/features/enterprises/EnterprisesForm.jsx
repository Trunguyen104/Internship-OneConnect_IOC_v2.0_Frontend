'use client';

import { Col, Form, Input, Row, Space } from 'antd';
import { useEffect, useState } from 'react';

import AvatarUploader from '@/components/ui/avataruploader';
import BannerUploader from '@/components/ui/banneruploader';
import { Button } from '@/components/ui/button';
import ErrorMessages from '@/components/ui/errormessages';
import { Spinner } from '@/components/ui/spinner';
import { ENTERPRISE_PROFILE_UI } from '@/constants/company-profile/uiText';
import { UI_TEXT } from '@/lib/UI_Text';
import { useToast } from '@/providers/ToastProvider';
import { enterpriseService } from '@/services/enterprise.service';
import { mediaService } from '@/services/media.service';
import { useEnterprisesStore } from '@/store/useEnterprisesStore';

function isHttpUrl(value) {
  if (!value) return true;
  return /^https?:\/\/.+/i.test(value);
}

export default function EnterprisesForm({ enterprise, onSuccess, onCancel }) {
  const [form] = Form.useForm();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  const isEdit = !!enterprise;

  useEffect(() => {
    if (enterprise) {
      const taxCodeValue =
        enterprise.taxCode ?? enterprise.taxcode ?? enterprise.tax_code ?? enterprise.taxCODE ?? '';

      form.setFieldsValue({
        logoUrl: enterprise.logoUrl ?? '',
        backgroundUrl: enterprise.backgroundUrl ?? '',
        name: enterprise.name ?? '',
        website: enterprise.website ?? '',
        industry: enterprise.industry ?? '',
        taxCode: taxCodeValue,
        description: enterprise.description ?? '',
        address: enterprise.address ?? '',
        contactEmail: enterprise.contactEmail ?? '',
      });
    } else {
      form.resetFields();
    }
  }, [enterprise, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      setFormError(null);

      let { logoUrl, backgroundUrl } = values;

      if (logoUrl instanceof File) {
        const uploadRes = await mediaService.uploadImage(logoUrl, 'Enterprises');
        if (uploadRes?.success && uploadRes?.data) {
          logoUrl = uploadRes.data;
        } else {
          throw new Error('Failed to upload logo');
        }
      }

      if (backgroundUrl instanceof File) {
        const uploadRes = await mediaService.uploadImage(backgroundUrl, 'Enterprises');
        if (uploadRes?.success && uploadRes?.data) {
          backgroundUrl = uploadRes.data;
        } else {
          throw new Error('Failed to upload background');
        }
      }

      const payload = {
        name: values.name?.trim() || '',
        taxCode: values.taxCode?.trim() || undefined,
        industry: values.industry?.trim() || undefined,
        description: values.description?.trim() || undefined,
        address: values.address?.trim() || undefined,
        website: values.website?.trim() || undefined,
        contactEmail: values.contactEmail?.trim() || undefined,
      };

      if (typeof logoUrl === 'string' && logoUrl.trim() !== '') {
        payload.logoUrl = logoUrl.trim();
      }

      if (typeof backgroundUrl === 'string' && backgroundUrl.trim() !== '') {
        payload.backgroundUrl = backgroundUrl.trim();
      }

      if (isEdit) {
        await enterpriseService.update(enterprise.enterpriseId || enterprise.id, {
          ...payload,
          enterpriseId: enterprise.enterpriseId || enterprise.id,
        });
        toast.success(`${payload.name} ${UI_TEXT.COMMON.UPDATE_SUCCESS.toLowerCase()}`);
      } else {
        await enterpriseService.create(payload);
        toast.success(`${payload.name} ${UI_TEXT.COMMON.CREATE_SUCCESS.toLowerCase()}`);
      }
      if (useEnterprisesStore.increment) {
        useEnterprisesStore.increment();
      } else if (
        useEnterprisesStore.getState &&
        typeof useEnterprisesStore.getState().increment === 'function'
      ) {
        useEnterprisesStore.getState().increment();
      }

      onSuccess?.();
    } catch (err) {
      if (err.errorFields) return; // Ant Design form validation error
      setFormError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col pb-2">
      <Form form={form} layout="vertical" requiredMark={false}>
        <div className="space-y-6 p-1">
          {isEdit && (
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6 shadow-sm">
              <Row gutter={[48, 24]} align="top" justify="center">
                <Col xs={24} md={8} lg={7}>
                  <div className="flex flex-col items-center">
                    <div className="mb-4 w-full text-center">
                      <span className="font-bold whitespace-nowrap text-slate-700">
                        {ENTERPRISE_PROFILE_UI.EDIT_DRAWER.COMPANY_LOGO}
                      </span>
                    </div>
                    <div className="flex justify-center">
                      <Form.Item name="logoUrl" className="mb-0">
                        <AvatarUploader size={100} fullName={enterprise?.name} />
                      </Form.Item>
                    </div>
                  </div>
                </Col>

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
          )}

          <Form.Item
            name="name"
            label={UI_TEXT.ENTERPRISES.NAME}
            rules={[{ required: true, message: ENTERPRISE_PROFILE_UI.ENTERPRISE.ERRORS.NAME }]}
          >
            <Input
              size="large"
              autoComplete="organization"
              placeholder={UI_TEXT.ENTERPRISES.NAME_PLACEHOLDER}
            />
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
                placeholder={UI_TEXT.ENTERPRISES.WEBSITE_PLACEHOLDER}
              />
            </Form.Item>

            <Form.Item name="industry" label={UI_TEXT.ENTERPRISES.INDUSTRY_COLUMN}>
              <Input size="large" placeholder={UI_TEXT.ENTERPRISES.INDUSTRY_PLACEHOLDER} />
            </Form.Item>

            <Form.Item name="taxCode" label={ENTERPRISE_PROFILE_UI.ENTERPRISE.TAX_CODE}>
              <Input size="large" placeholder={UI_TEXT.ENTERPRISES.TAX_CODE_PLACEHOLDER} />
            </Form.Item>

            <Form.Item name="address" label={ENTERPRISE_PROFILE_UI.ENTERPRISE.ADDRESS}>
              <Input
                size="large"
                autoComplete="street-address"
                placeholder={UI_TEXT.ENTERPRISES.ADDRESS_PLACEHOLDER}
              />
            </Form.Item>

            <Form.Item
              name="contactEmail"
              label={UI_TEXT.ENTERPRISES.CONTACT_EMAIL}
              rules={[{ type: 'email', message: UI_TEXT.ENTERPRISES.INVALID_EMAIL }]}
            >
              <Input
                size="large"
                type="email"
                placeholder={UI_TEXT.ENTERPRISES.EMAIL_PLACEHOLDER}
              />
            </Form.Item>
          </Space>

          <Form.Item
            name="description"
            label={ENTERPRISE_PROFILE_UI.ENTERPRISE.OVERVIEW}
            rules={[{ max: 2000, message: ENTERPRISE_PROFILE_UI.ENTERPRISE.ERRORS.DESCRIPTION }]}
          >
            <Input.TextArea
              placeholder={UI_TEXT.ENTERPRISES.OVERVIEW_PLACEHOLDER}
              autoComplete="off"
              maxLength={2000}
              showCount
              autoSize={{ minRows: 6, maxRows: 12 }}
            />
          </Form.Item>
        </div>
      </Form>

      <div className="mt-4">
        <ErrorMessages error={formError} />
      </div>

      <div className="mt-2 flex justify-end gap-3 border-t border-slate-100 pt-6">
        <Button
          type="button"
          variant="ghost"
          className="h-9 rounded-full bg-slate-50 px-5 text-sm font-semibold text-slate-500 hover:bg-slate-100"
          onClick={() => onCancel?.()}
        >
          {UI_TEXT.BUTTON.CANCEL}
        </Button>
        <Button
          type="button"
          disabled={loading}
          onClick={handleSubmit}
          className="bg-primary hover:bg-primary/90 shadow-primary/10 h-9 min-w-[120px] rounded-full px-6 text-sm font-bold text-white shadow-md transition-all active:scale-95"
        >
          {loading ? (
            <Spinner className="mr-2 h-4 w-4" />
          ) : isHttpUrl(enterprise?.website) ? (
            UI_TEXT.BUTTON.SAVE_CHANGES
          ) : (
            UI_TEXT.ENTERPRISES.INITIALIZE
          )}
        </Button>
      </div>
    </div>
  );
}

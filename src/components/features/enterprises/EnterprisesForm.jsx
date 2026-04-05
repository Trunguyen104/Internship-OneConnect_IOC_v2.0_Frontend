'use client';

import { Alert, Col, Form, Input, Modal, Row, Select, Space } from 'antd';
import { ShieldAlert } from 'lucide-react';
import { useEffect, useState } from 'react';

import AvatarUploader from '@/components/ui/avataruploader';
import BannerUploader from '@/components/ui/banneruploader';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { ENTERPRISE_PROFILE_UI } from '@/constants/company-profile/uiText';
import { USER_STATUS } from '@/constants/user-management/enums';
import { getErrorMessage } from '@/lib/error';
import { UI_TEXT } from '@/lib/UI_Text';
import { validate } from '@/lib/validators';
import { useToast } from '@/providers/ToastProvider';
import { enterpriseService } from '@/services/enterprise.service';
import { mediaService } from '@/services/media.service';
import { useEnterprisesStore } from '@/store/useEnterprisesStore';

const STATUS_OPTIONS = [
  { label: UI_TEXT.COMMON.STATUS_ACTIVE, value: USER_STATUS.ACTIVE },
  { label: UI_TEXT.COMMON.STATUS_INACTIVE, value: USER_STATUS.INACTIVE },
];

export default function EnterprisesForm({ enterprise, onSuccess, onCancel }) {
  const [form] = Form.useForm();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const status = Form.useWatch('status', form);

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
        status: enterprise.status ?? USER_STATUS.ACTIVE, // Default to Active if not provided
      });
    } else {
      form.resetFields();
    }
  }, [enterprise, form]);

  const internalSave = async (payload, logoUrl, backgroundUrl) => {
    setLoading(true);
    try {
      if (logoUrl instanceof File) {
        const uploadRes = await mediaService.uploadImage(logoUrl, 'Enterprises');
        if (uploadRes?.success && uploadRes?.data) {
          logoUrl = uploadRes.data;
        } else throw new Error('Failed to upload logo');
      }

      if (backgroundUrl instanceof File) {
        const uploadRes = await mediaService.uploadImage(backgroundUrl, 'Enterprises');
        if (uploadRes?.success && uploadRes?.data) {
          backgroundUrl = uploadRes.data;
        } else throw new Error('Failed to upload background');
      }

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

      if (
        useEnterprisesStore.getState &&
        typeof useEnterprisesStore.getState().increment === 'function'
      ) {
        useEnterprisesStore.getState().increment();
      } else if (useEnterprisesStore.increment) {
        useEnterprisesStore.increment();
      }

      onSuccess?.();
    } catch (err) {
      const validationErrors = err?.data?.validationErrors;
      if (validationErrors && typeof validationErrors === 'object') {
        const fieldErrors = Object.entries(validationErrors).map(([field, messages]) => {
          const formField = field.charAt(0).toLowerCase() + field.slice(1);
          return {
            name: formField,
            errors: Array.isArray(messages) ? messages : [messages],
          };
        });
        form.setFields(fieldErrors);
      } else {
        toast.error(getErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        name: values.name?.trim() || '',
        taxCode: values.taxCode?.trim() || undefined,
        industry: values.industry?.trim() || undefined,
        description: values.description?.trim() || undefined,
        address: values.address?.trim() || undefined,
        website: values.website?.trim() || undefined,
        contactEmail: values.contactEmail?.trim() || undefined,
        status: values.status,
      };

      // Xác nhận khi chuyển sang Inactive từ trạng thái khác hoặc khi đang ở Inactive
      if (
        isEdit &&
        values.status === USER_STATUS.INACTIVE &&
        enterprise.status !== USER_STATUS.INACTIVE
      ) {
        Modal.confirm({
          title: (
            <span className="font-bold text-red-600">
              {UI_TEXT.COMMON.DEACTIVATE_CONFIRM_TITLE}
            </span>
          ),
          icon: <ShieldAlert className="mr-2 h-5 w-5 text-red-600" />,
          centered: true,
          content: (
            <div className="py-2">
              <p className="mb-2 font-medium">{UI_TEXT.COMMON.DEACTIVATE_CONFIRM_MSG}</p>
              <ul className="list-inside list-disc space-y-1 text-xs text-slate-500">
                <li>{UI_TEXT.COMMON.DEACTIVATE_CONFIRM_ENTERPRISE}</li>
                <li>{UI_TEXT.COMMON.DEACTIVATE_CONFIRM_HINT_1}</li>
                <li>{UI_TEXT.COMMON.DEACTIVATE_CONFIRM_HINT_2}</li>
              </ul>
            </div>
          ),
          okText: UI_TEXT.COMMON.CONFIRM_LOCK,
          okButtonProps: {
            danger: true,
            className: 'rounded-full px-6 font-bold bg-red-600 hover:bg-red-700',
          },
          cancelText: UI_TEXT.COMMON.CANCEL,
          cancelButtonProps: { className: 'rounded-full px-6' },
          onOk: () => internalSave(payload, values.logoUrl, values.backgroundUrl),
        });
      } else {
        await internalSave(payload, values.logoUrl, values.backgroundUrl);
      }
    } catch (err) {
      if (err.errorFields) return;
      console.error('Validation failed:', err);
    }
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col pb-2">
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        validateTrigger={['onChange', 'onBlur']}
        noValidate
      >
        <div className="space-y-4 p-1">
          {status === USER_STATUS.INACTIVE && (
            <Alert
              title={
                <span className="font-bold text-red-800">
                  {UI_TEXT.COMMON.DEACTIVATE_CONFIRM_TITLE}
                </span>
              }
              description={
                <span className="text-xs text-red-700">
                  {UI_TEXT.COMMON.DEACTIVATE_CONFIRM_ENTERPRISE}
                </span>
              }
              type="error"
              showIcon
              icon={<ShieldAlert className="h-5 w-5" />}
              className="mb-4 rounded-xl border-red-100 bg-red-50"
            />
          )}

          {isEdit && (
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6 shadow-sm mb-4">
              <Row gutter={[48, 24]} align="top" justify="center">
                <Col xs={24} md={8} lg={7}>
                  <div className="flex flex-col items-center">
                    <div className="mb-4 w-full text-center">
                      <span className="font-bold whitespace-nowrap text-slate-700 text-xs uppercase tracking-wider">
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
                      <span className="font-bold whitespace-nowrap text-slate-700 text-xs uppercase tracking-wider">
                        {ENTERPRISE_PROFILE_UI.EDIT_DRAWER.COVER_BANNER}
                      </span>
                    </div>
                    <Form.Item name="backgroundUrl" className="mb-0 w-full">
                      <BannerUploader />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
            </div>
          )}

          <Row gutter={16}>
            <Col span={isEdit ? 16 : 24}>
              <Form.Item
                name="name"
                label={
                  <span className="text-[11px] font-black uppercase tracking-widest text-muted/60 pl-1">
                    {UI_TEXT.ENTERPRISES.NAME}
                  </span>
                }
                rules={[
                  validate.required(ENTERPRISE_PROFILE_UI.ENTERPRISE.ERRORS.NAME),
                  validate.name('Name must only contain letters and not special characters'),
                ]}
              >
                <Input
                  size="large"
                  placeholder={UI_TEXT.ENTERPRISES.NAME_PLACEHOLDER}
                  maxLength={255}
                  className="rounded-xl border-gray-100 bg-gray-50/50 px-4 h-12 transition-all focus:bg-white focus:border-primary/30"
                />
              </Form.Item>
            </Col>

            {isEdit && (
              <Col span={8}>
                <Form.Item
                  name="status"
                  label={
                    <span className="text-[11px] font-black uppercase tracking-widest text-muted/60 pl-1">
                      {UI_TEXT.USER_MANAGEMENT.STATUS}
                    </span>
                  }
                  rules={[validate.required('Please select status')]}
                >
                  <Select
                    size="large"
                    options={STATUS_OPTIONS}
                    className="w-full"
                    classNames={{ popup: { root: 'rounded-xl' } }}
                  />
                </Form.Item>
              </Col>
            )}
          </Row>

          <Space orientation="vertical" size="small" style={{ width: '100%' }} className="gap-0">
            <Form.Item
              name="website"
              label={
                <span className="text-[11px] font-black uppercase tracking-widest text-muted/60 pl-1">
                  {ENTERPRISE_PROFILE_UI.ENTERPRISE.WEBSITE}
                </span>
              }
              rules={[validate.url(ENTERPRISE_PROFILE_UI.ENTERPRISE.ERRORS.WEBSITE)]}
            >
              <Input
                size="large"
                placeholder={UI_TEXT.ENTERPRISES.WEBSITE_PLACEHOLDER}
                maxLength={255}
                className="rounded-xl border-gray-100 bg-gray-50/50 px-4 h-12 transition-all focus:bg-white focus:border-primary/30"
              />
            </Form.Item>

            <Form.Item
              name="industry"
              label={
                <span className="text-[11px] font-black uppercase tracking-widest text-muted/60 pl-1">
                  {UI_TEXT.ENTERPRISES.INDUSTRY_COLUMN}
                </span>
              }
            >
              <Input
                size="large"
                placeholder={UI_TEXT.ENTERPRISES.INDUSTRY_PLACEHOLDER}
                maxLength={150}
                className="rounded-xl border-gray-100 bg-gray-50/50 px-4 h-12 transition-all focus:bg-white focus:border-primary/30"
              />
            </Form.Item>

            <Form.Item
              name="taxCode"
              label={
                <span className="text-[11px] font-black uppercase tracking-widest text-muted/60 pl-1">
                  {ENTERPRISE_PROFILE_UI.ENTERPRISE.TAX_CODE}
                </span>
              }
              rules={[
                validate.required(UI_TEXT.ENTERPRISES.TAX_CODE_REQUIRED),
                validate.taxCode(UI_TEXT.ENTERPRISES.TAX_CODE_INVALID),
              ]}
            >
              <Input
                size="large"
                placeholder={UI_TEXT.ENTERPRISES.TAX_CODE_PLACEHOLDER}
                maxLength={50}
                className="rounded-xl border-gray-100 bg-gray-50/50 px-4 h-12 transition-all focus:bg-white focus:border-primary/30"
              />
            </Form.Item>

            <Form.Item
              name="address"
              label={
                <span className="text-[11px] font-black uppercase tracking-widest text-muted/60 pl-1">
                  {ENTERPRISE_PROFILE_UI.ENTERPRISE.ADDRESS}
                </span>
              }
            >
              <Input
                size="large"
                placeholder={UI_TEXT.ENTERPRISES.ADDRESS_PLACEHOLDER}
                maxLength={500}
                className="rounded-xl border-gray-100 bg-gray-50/50 px-4 h-12 transition-all focus:bg-white focus:border-primary/30"
              />
            </Form.Item>

            <Form.Item
              name="contactEmail"
              label={
                <span className="text-[11px] font-black uppercase tracking-widest text-muted/60 pl-1">
                  {UI_TEXT.ENTERPRISES.CONTACT_EMAIL}
                </span>
              }
              rules={[validate.email(UI_TEXT.ENTERPRISES.INVALID_EMAIL)]}
            >
              <Input
                size="large"
                placeholder={UI_TEXT.ENTERPRISES.EMAIL_PLACEHOLDER}
                maxLength={255}
                className="rounded-xl border-gray-100 bg-gray-50/50 px-4 h-12 transition-all focus:bg-white focus:border-primary/30"
              />
            </Form.Item>
          </Space>

          <Form.Item
            name="description"
            label={
              <span className="text-[11px] font-black uppercase tracking-widest text-muted/60 pl-1">
                {ENTERPRISE_PROFILE_UI.ENTERPRISE.OVERVIEW}
              </span>
            }
            rules={[{ max: 2000, message: ENTERPRISE_PROFILE_UI.ENTERPRISE.ERRORS.DESCRIPTION }]}
            className="mb-0"
          >
            <Input.TextArea
              placeholder={UI_TEXT.ENTERPRISES.OVERVIEW_PLACEHOLDER}
              maxLength={2000}
              showCount
              autoSize={{ minRows: 4, maxRows: 8 }}
              className="rounded-xl border-gray-100 bg-gray-50/50 p-4 transition-all focus:bg-white focus:border-primary/30"
            />
          </Form.Item>
        </div>
      </Form>

      <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-6">
        <Button
          type="button"
          variant="ghost"
          className="h-10 rounded-full bg-slate-50 px-6 text-sm font-semibold text-slate-500 hover:bg-slate-100"
          onClick={() => onCancel?.()}
        >
          {UI_TEXT.BUTTON.CANCEL}
        </Button>
        <Button
          type="button"
          disabled={loading}
          onClick={handleSubmit}
          className="bg-primary hover:bg-primary/90 shadow-primary/10 h-10 min-w-[140px] rounded-full px-8 text-sm font-bold text-white shadow-md transition-all active:scale-95"
        >
          {loading ? (
            <Spinner className="mr-2 h-4 w-4" />
          ) : isEdit ? (
            UI_TEXT.BUTTON.SAVE_CHANGES
          ) : (
            UI_TEXT.ENTERPRISES.INITIALIZE
          )}
        </Button>
      </div>
    </div>
  );
}

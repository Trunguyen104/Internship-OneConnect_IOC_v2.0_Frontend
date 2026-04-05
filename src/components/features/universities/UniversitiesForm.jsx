'use client';

import { Alert, Col, Form, Modal, Row, Select } from 'antd';
import { ShieldAlert } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LogoUploader from '@/components/ui/logouploader';
import { Spinner } from '@/components/ui/spinner';
import { USER_STATUS } from '@/constants/user-management/enums';
import { getErrorMessage } from '@/lib/error';
import { UI_TEXT } from '@/lib/UI_Text';
import { validate } from '@/lib/validators';
import { useToast } from '@/providers/ToastProvider';
import { universityService } from '@/services/university.service';
import { useUniversitiesStore } from '@/store/useUniversitiesStore';

const STATUS_OPTIONS = [
  { label: UI_TEXT.COMMON.STATUS_ACTIVE, value: USER_STATUS.ACTIVE },
  { label: UI_TEXT.COMMON.STATUS_INACTIVE, value: USER_STATUS.INACTIVE },
];

export default function UniversitiesForm({ university, onSuccess, onCancel }) {
  const [form] = Form.useForm();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const status = Form.useWatch('status', form);
  const [logoUrl, setLogoUrl] = useState(university?.logoUrl || '');
  const isEdit = !!university;

  useEffect(() => {
    if (university) {
      form.setFieldsValue({
        name: university.name || '',
        code: university.code || '',
        address: university.address || '',
        contactEmail: university.contactEmail || '',
        status: university.status ?? USER_STATUS.ACTIVE,
      });
      setLogoUrl(university.logoUrl || '');
    } else {
      form.resetFields();
      setLogoUrl('');
    }
  }, [university, form]);

  const internalSave = async (payload) => {
    setLoading(true);
    try {
      if (isEdit) {
        await universityService.update(university.universityId, {
          ...payload,
          logoUrl: logoUrl.trim() || undefined,
          universityId: university.universityId,
        });
        toast.success(UI_TEXT.COMMON.UPDATE_SUCCESS);
      } else {
        await universityService.create(payload);
        toast.success(UI_TEXT.COMMON.CREATE_SUCCESS);
      }

      useUniversitiesStore.increment();
      onSuccess?.();
    } catch (err) {
      if (err?.data?.errors && typeof err.data.errors === 'object') {
        const fieldErrors = Object.entries(err.data.errors).map(([field, messages]) => {
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

  const onFinish = async (values) => {
    const payload = {
      name: String(values.name || '').trim(),
      code: String(values.code || '').trim(),
      address: String(values.address || '').trim() || undefined,
      contactEmail: String(values.contactEmail || '').trim() || undefined,
      status: values.status,
    };

    if (
      isEdit &&
      values.status === USER_STATUS.INACTIVE &&
      university.status !== USER_STATUS.INACTIVE
    ) {
      Modal.confirm({
        title: (
          <span className="font-bold text-red-600">{UI_TEXT.COMMON.DEACTIVATE_CONFIRM_TITLE}</span>
        ),
        icon: <ShieldAlert className="mr-2 h-5 w-5 text-red-600" />,
        centered: true,
        content: (
          <div className="py-2">
            <p className="mb-2 font-medium">{UI_TEXT.COMMON.DEACTIVATE_CONFIRM_MSG}</p>
            <ul className="list-inside list-disc space-y-1 text-xs text-slate-500">
              <li>{UI_TEXT.COMMON.DEACTIVATE_CONFIRM_UNIVERSITY}</li>
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
        onOk: () => internalSave(payload),
      });
    } else {
      await internalSave(payload);
    }
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      requiredMark={false}
      validateTrigger={['onChange', 'onBlur']}
      className="flex flex-col gap-6"
      noValidate
    >
      {status === USER_STATUS.INACTIVE && (
        <Alert
          title={
            <span className="font-bold text-red-800">
              {UI_TEXT.COMMON.DEACTIVATE_CONFIRM_TITLE}
            </span>
          }
          description={
            <span className="text-xs text-red-700">
              {UI_TEXT.COMMON.DEACTIVATE_CONFIRM_UNIVERSITY}
            </span>
          }
          type="error"
          showIcon
          icon={<ShieldAlert className="h-5 w-5" />}
          className="mb-4 rounded-xl border-red-100 bg-red-50"
        />
      )}
      {isEdit && (
        <div className="flex flex-col items-center gap-4 mb-4">
          <LogoUploader value={logoUrl} onChange={setLogoUrl} size={100} folder="Universities" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {UI_TEXT.UNIVERSITIES.LOGO_LABEL}
          </span>
        </div>
      )}

      <div className="p-1">
        <Row gutter={[16, 0]}>
          <Col span={isEdit ? 16 : 24}>
            <Form.Item
              name="name"
              label={
                <span className="text-[11px] font-black uppercase tracking-widest text-muted/60 pl-1">
                  {UI_TEXT.UNIVERSITIES.NAME}
                </span>
              }
              rules={[
                validate.required(UI_TEXT.UNIVERSITIES.NAME_REQUIRED),
                validate.name('Name must only contain letters and not starting with numbers'),
              ]}
            >
              <Input
                placeholder={UI_TEXT.UNIVERSITIES.NAME_PLACEHOLDER}
                className="h-12 rounded-2xl border-gray-100 bg-gray-50/50 px-5 transition-all focus:border-primary/30 focus:bg-white"
                maxLength={255}
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
                rules={[validate.required('Status is required')]}
              >
                <Select
                  size="large"
                  placeholder="Status"
                  options={STATUS_OPTIONS}
                  className="w-full"
                  classNames={{ popup: { root: 'rounded-xl' } }}
                  style={{ height: '48px' }}
                />
              </Form.Item>
            </Col>
          )}

          <Col span={24}>
            <Form.Item
              name="code"
              label={
                <span className="text-[11px] font-black uppercase tracking-widest text-muted/60 pl-1">
                  {UI_TEXT.UNIVERSITIES.CODE}
                </span>
              }
              rules={[validate.required(UI_TEXT.UNIVERSITIES.CODE_REQUIRED)]}
            >
              <Input
                placeholder={UI_TEXT.UNIVERSITIES.CODE_PLACEHOLDER}
                className="h-12 rounded-2xl border-gray-100 bg-gray-50/50 px-5 transition-all focus:border-primary/30 focus:bg-white"
                maxLength={20}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="address"
              label={
                <span className="text-[11px] font-black uppercase tracking-widest text-muted/60 pl-1">
                  {UI_TEXT.UNIVERSITIES.ADDRESS}
                </span>
              }
            >
              <Input
                placeholder={UI_TEXT.UNIVERSITIES.ADDRESS_PLACEHOLDER}
                className="h-12 rounded-2xl border-gray-100 bg-gray-50/50 px-5 transition-all focus:border-primary/30 focus:bg-white"
                maxLength={500}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="contactEmail"
              label={
                <span className="text-[11px] font-black uppercase tracking-widest text-muted/60 pl-1">
                  {UI_TEXT.UNIVERSITIES.CONTACT_EMAIL}
                </span>
              }
              rules={[validate.email(UI_TEXT.UNIVERSITIES.ERR_INVALID_EMAIL)]}
            >
              <Input
                type="text"
                inputMode="email"
                placeholder={UI_TEXT.UNIVERSITIES.EMAIL_PLACEHOLDER}
                className="h-12 rounded-2xl border-gray-100 bg-gray-50/50 px-5 transition-all focus:border-primary/30 focus:bg-white"
                maxLength={255}
              />
            </Form.Item>
          </Col>
        </Row>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-gray-50">
        <Button
          type="button"
          variant="ghost"
          className="h-10 rounded-full px-6 font-semibold text-sm text-muted/60 transition-all hover:bg-gray-100"
          onClick={() => onCancel?.()}
        >
          {UI_TEXT.BUTTON.CANCEL}
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-primary hover:bg-primary/90 h-10 min-w-[140px] rounded-full px-8 text-sm font-bold text-white shadow-md transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <Spinner className="size-4" />
          ) : isEdit ? (
            UI_TEXT.BUTTON.SAVE_CHANGES
          ) : (
            UI_TEXT.UNIVERSITIES.CREATE
          )}
        </Button>
      </div>
    </Form>
  );
}

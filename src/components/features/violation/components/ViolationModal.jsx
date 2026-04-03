'use client';

import { DatePicker, Form, Input } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';

import CompoundModal from '@/components/ui/CompoundModal';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

const ViolationModalBody = ({ initialValues, onCancel, loading, viewOnly }) => {
  const [form] = Form.useForm();
  const { VIOLATION_REPORT } = INTERNSHIP_MANAGEMENT_UI.ENTERPRISE;
  const { FORM, DETAIL } = VIOLATION_REPORT;

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        occurredDate: initialValues.violationTime ? dayjs(initialValues.violationTime) : undefined,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const modalTitle = viewOnly ? DETAIL.TITLE : initialValues ? FORM.EDIT_TITLE : FORM.CREATE_TITLE;

  return (
    <>
      <CompoundModal.Header title={modalTitle} />
      <CompoundModal.Content>
        <Form form={form} layout="vertical" disabled={viewOnly || loading}>
          <div className="grid grid-cols-2 gap-x-4">
            <Form.Item label={DETAIL.STUDENT_NAME} name="name">
              <Input className="h-10 cursor-default bg-bg !text-slate-900 font-medium" readOnly />
            </Form.Item>
            <Form.Item label={DETAIL.STUDENT_CODE} name="studentCode">
              <Input className="h-10 cursor-default bg-bg !text-slate-900 font-medium" readOnly />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-x-4">
            <Form.Item label={DETAIL.INTERN_GROUP} name="internshipGroupName">
              <Input className="h-10 cursor-default bg-bg !text-slate-900 font-medium" readOnly />
            </Form.Item>
            <Form.Item label={DETAIL.CREATED_BY} name="reporter">
              <Input className="h-10 cursor-default bg-bg !text-slate-900 font-medium" readOnly />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-x-4">
            <Form.Item label={DETAIL.INCIDENT_DATE}>
              <DatePicker
                className="h-10 w-full !text-slate-900 font-medium !opacity-100"
                format={VIOLATION_REPORT.DATE_FORMATS.UI}
                placeholder={FORM.PLACEHOLDERS.INCIDENT_DATE}
                showTime={false}
                disabled
                value={
                  initialValues?.violationTime ? dayjs(initialValues.violationTime) : undefined
                }
              />
            </Form.Item>
            <Form.Item label={DETAIL.CREATED_TIME}>
              <DatePicker
                className="h-10 w-full !text-slate-900 font-medium !opacity-100"
                format={VIOLATION_REPORT.DATE_FORMATS.UI}
                showTime={false}
                disabled
                value={initialValues?.createdAt ? dayjs(initialValues.createdAt) : undefined}
              />
            </Form.Item>
          </div>

          <Form.Item name="description" label={DETAIL.DESCRIPTION}>
            <Input.TextArea
              placeholder={FORM.PLACEHOLDERS.DESCRIPTION}
              rows={4}
              className="resize-none !text-slate-900 font-medium"
              readOnly
            />
          </Form.Item>
        </Form>
      </CompoundModal.Content>
      <CompoundModal.Footer
        onCancel={onCancel}
        onConfirm={onCancel}
        confirmText={FORM.CLOSE}
        showConfirm={true}
        showCancel={false}
      />
    </>
  );
};

const ViolationModal = ({ visible, onCancel, ...props }) => {
  return (
    <CompoundModal open={visible} onCancel={onCancel} width={520} destroyOnClose closable={false}>
      {visible && <ViolationModalBody onCancel={onCancel} {...props} />}
    </CompoundModal>
  );
};

export default ViolationModal;

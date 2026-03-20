'use client';

import { InfoCircleOutlined } from '@ant-design/icons';
import { DatePicker, Form, Input, Select } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';

import CompoundModal from '@/components/ui/CompoundModal';

import { VIOLATION_REPORT_UI } from '../constants/violationReportUI';

const { TextArea } = Input;

export default function ViolationReportForm({
  open,
  onCancel,
  onSave,
  initialValues,
  students,
  loading = false,
}) {
  const [form] = Form.useForm();
  const { FORM } = VIOLATION_REPORT_UI;

  useEffect(() => {
    if (open) {
      if (initialValues) {
        form.setFieldsValue({
          studentId: initialValues.studentId,
          incidentDate: dayjs(initialValues.incidentDate),
          description: initialValues.description,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        incidentDate: values.incidentDate.format('YYYY-MM-DD'),
      };

      const success = await onSave(payload);
      if (success) {
        onCancel();
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const disabledDate = (current) => {
    return current && current > dayjs().endOf('day');
  };

  return (
    <CompoundModal open={open} onCancel={onCancel} width={600}>
      <CompoundModal.Header
        title={initialValues ? FORM.EDIT_TITLE : FORM.CREATE_TITLE}
        icon={<InfoCircleOutlined />}
      />

      <CompoundModal.Content>
        <Form form={form} layout="vertical" autoComplete="off" className="mt-4">
          <Form.Item
            name="studentId"
            label={FORM.STUDENT}
            rules={[{ required: true, message: FORM.VALIDATION.STUDENT_REQUIRED }]}
          >
            <Select
              placeholder={FORM.PLACEHOLDERS.STUDENT}
              options={students.map((s) => ({
                label: `${s.fullName} (${s.studentId})`,
                value: s.id,
              }))}
              disabled={!!initialValues}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>

          <Form.Item
            name="incidentDate"
            label={FORM.INCIDENT_DATE}
            rules={[{ required: true, message: FORM.VALIDATION.DATE_REQUIRED }]}
          >
            <DatePicker
              className="w-full"
              placeholder={FORM.PLACEHOLDERS.INCIDENT_DATE}
              disabledDate={disabledDate}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label={FORM.DESCRIPTION}
            rules={[{ required: true, message: FORM.VALIDATION.DESCRIPTION_REQUIRED }]}
          >
            <TextArea rows={4} placeholder={FORM.PLACEHOLDERS.DESCRIPTION} />
          </Form.Item>
        </Form>
      </CompoundModal.Content>

      <CompoundModal.Footer
        onCancel={onCancel}
        onConfirm={handleSubmit}
        confirmText={initialValues ? 'Save Changes' : 'Create Report'}
        loading={loading}
      />
    </CompoundModal>
  );
}

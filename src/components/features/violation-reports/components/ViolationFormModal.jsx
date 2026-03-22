'use client';

import { SaveOutlined } from '@ant-design/icons';
import { DatePicker, Form, Input, Select } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';

import CompoundModal from '@/components/ui/CompoundModal';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

const ViolationFormBody = ({ initialValues, onSave, onCancel, loading, viewOnly, students }) => {
  const [form] = Form.useForm();
  const { VIOLATION_REPORT } = INTERNSHIP_MANAGEMENT_UI.ENTERPRISE;
  const { FORM, DETAIL } = VIOLATION_REPORT;

  const studentId = Form.useWatch('studentId', form);
  const selectedStudent = students.find((s) => (s.studentId || s.id) === studentId);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        studentId: initialValues.studentId,
        occurredDate: initialValues.occurredDate ? dayjs(initialValues.occurredDate) : null,
        description: initialValues.description,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSave({
        ...values,
        occurredDate: values.occurredDate
          ? values.occurredDate.format(VIOLATION_REPORT.DATE_FORMATS.API)
          : null,
      });
    } catch (error) {
      if (error?.errorFields) return;
      console.error(VIOLATION_REPORT.LOGS.VALIDATION_ERROR, error);
    }
  };

  const modalTitle = initialValues
    ? viewOnly
      ? DETAIL.TITLE
      : FORM.EDIT_TITLE
    : FORM.CREATE_TITLE;

  return (
    <>
      <CompoundModal.Header title={modalTitle} />

      <CompoundModal.Content>
        <Form form={form} layout="vertical" disabled={viewOnly || loading} requiredMark={!viewOnly}>
          <Form.Item
            name="studentId"
            label={FORM.STUDENT}
            rules={[{ required: true, message: FORM.VALIDATION.STUDENT_REQUIRED }]}
          >
            <Select
              placeholder={FORM.PLACEHOLDERS.STUDENT}
              className="h-10 w-full"
              loading={loading}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={students.map((s) => ({
                label: `${s.fullName || s.studentFullName} (${s.studentCode})`,
                value: s.studentId || s.id,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="occurredDate"
            label={FORM.INCIDENT_DATE}
            rules={[
              { required: true, message: FORM.VALIDATION.DATE_REQUIRED },
              () => ({
                validator(_, value) {
                  if (!value) return Promise.resolve();

                  if (value.isAfter(dayjs().endOf('day'))) {
                    return Promise.reject(new Error(FORM.VALIDATION.DATE_FUTURE));
                  }

                  if (selectedStudent?.groupStartDate) {
                    const startDate = dayjs(selectedStudent.groupStartDate);
                    if (value.isBefore(startDate, 'day')) {
                      return Promise.reject(new Error(FORM.VALIDATION.DATE_BEFORE_START));
                    }
                    if (selectedStudent?.groupEndDate) {
                      const endDate = dayjs(selectedStudent.groupEndDate);
                      if (value.isAfter(endDate, 'day')) {
                        return Promise.reject(new Error(FORM.VALIDATION.DATE_AFTER_END));
                      }
                    }
                  }

                  return Promise.resolve();
                },
              }),
            ]}
          >
            <DatePicker
              className="h-10 w-full"
              format={VIOLATION_REPORT.DATE_FORMATS.UI}
              placeholder={FORM.PLACEHOLDERS.INCIDENT_DATE}
              disabledDate={(current) => {
                if (!current) return false;
                const isFuture = current > dayjs().endOf('day');

                let isBeforeStart = false;
                if (selectedStudent?.groupStartDate) {
                  isBeforeStart = current < dayjs(selectedStudent.groupStartDate).startOf('day');
                }

                let isAfterEnd = false;
                if (selectedStudent?.groupEndDate) {
                  isAfterEnd = current > dayjs(selectedStudent.groupEndDate).endOf('day');
                }

                return isFuture || isBeforeStart || isAfterEnd;
              }}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label={FORM.DESCRIPTION}
            rules={[{ required: true, message: FORM.VALIDATION.DESCRIPTION_REQUIRED }]}
          >
            <Input.TextArea
              placeholder={FORM.PLACEHOLDERS.DESCRIPTION}
              rows={4}
              className="resize-none"
            />
          </Form.Item>
        </Form>
      </CompoundModal.Content>

      <CompoundModal.Footer
        onCancel={onCancel}
        onConfirm={viewOnly ? onCancel : handleSubmit}
        loading={loading}
        confirmIcon={!viewOnly && <SaveOutlined />}
        confirmText={viewOnly ? FORM.CLOSE : FORM.SAVE}
      />
    </>
  );
};

const ViolationFormModal = ({ visible, onCancel, ...props }) => {
  return (
    <CompoundModal open={visible} onCancel={onCancel} width={640} destroyOnClose>
      {visible && <ViolationFormBody onCancel={onCancel} {...props} />}
    </CompoundModal>
  );
};

export default ViolationFormModal;

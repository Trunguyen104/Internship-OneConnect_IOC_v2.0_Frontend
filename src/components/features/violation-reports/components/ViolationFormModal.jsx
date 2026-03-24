'use client';

import { SaveOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input } from 'antd';
import dayjs from 'dayjs';
import React, { startTransition, useEffect, useState } from 'react';

import CompoundModal from '@/components/ui/CompoundModal';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

import StudentPickerModal from './StudentPickerModal';

const ViolationFormBody = ({ initialValues, onSave, onCancel, loading, viewOnly, students }) => {
  const [form] = Form.useForm();
  const { VIOLATION_REPORT } = INTERNSHIP_MANAGEMENT_UI.ENTERPRISE;
  const { FORM, DETAIL } = VIOLATION_REPORT;

  const [pickerVisible, setPickerVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        studentId: initialValues.studentId,
        occurredDate: initialValues.occurredDate ? dayjs(initialValues.occurredDate) : null,
        description: initialValues.description,
      });

      const found = students.find((s) => (s.studentId || s.id) === initialValues.studentId);

      startTransition(() => {
        if (found) {
          setSelectedStudent(found);
        } else if (initialValues.studentFullName) {
          setSelectedStudent({
            studentFullName: initialValues.studentFullName,
            studentCode: initialValues.studentCode,
            groupStartDate: initialValues.groupStartDate,
            groupEndDate: initialValues.groupEndDate,
          });
        }
      });
    } else {
      form.resetFields();
      startTransition(() => setSelectedStudent(null));
    }
  }, [initialValues, form, students]);

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    form.setFieldsValue({ studentId: student.id || student.studentId });
    setPickerVisible(false);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSave({
        ...values,
        violationReportId: initialValues?.violationReportId || initialValues?.id,
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
          <Form.Item label={FORM.STUDENT} required>
            <div className="flex items-center gap-2">
              <Input
                placeholder={FORM.PLACEHOLDERS.STUDENT}
                className="h-10 flex-1 cursor-default bg-slate-50"
                value={
                  selectedStudent
                    ? `${selectedStudent.studentFullName || selectedStudent.fullName} ${VIOLATION_REPORT.COMMON.LEFT_PAREN}${selectedStudent.studentCode || selectedStudent.userCode}${VIOLATION_REPORT.COMMON.RIGHT_PAREN}`
                    : ''
                }
                readOnly
              />
              {!initialValues && (
                <Button
                  type="primary"
                  onClick={() => setPickerVisible(true)}
                  className="h-10 rounded-lg px-4"
                  disabled={viewOnly || loading}
                >
                  {FORM.STUDENT}
                </Button>
              )}
            </div>
            {/* Real form field for validation and value storage */}
            <Form.Item
              name="studentId"
              noStyle
              rules={[{ required: true, message: FORM.VALIDATION.STUDENT_REQUIRED }]}
            >
              <Input type="hidden" />
            </Form.Item>
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
      <StudentPickerModal
        visible={pickerVisible}
        onCancel={() => setPickerVisible(false)}
        onSelect={handleStudentSelect}
        students={students}
        loading={loading}
      />
    </>
  );
};

const ViolationFormModal = ({ visible, onCancel, ...props }) => {
  return (
    <CompoundModal open={visible} onCancel={onCancel} width={520} destroyOnClose>
      {visible && <ViolationFormBody onCancel={onCancel} {...props} />}
    </CompoundModal>
  );
};

export default ViolationFormModal;

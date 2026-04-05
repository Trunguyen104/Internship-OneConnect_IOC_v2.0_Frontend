'use client';

import { SaveOutlined } from '@ant-design/icons';
import { DatePicker, Form, Input, Select } from 'antd';
import dayjs from 'dayjs';
import React, { startTransition, useEffect, useMemo, useState } from 'react';

import CompoundModal from '@/components/ui/CompoundModal';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

const ViolationFormBody = ({ initialValues, onSave, onCancel, loading, viewOnly, students }) => {
  const [form] = Form.useForm();
  const { VIOLATION_REPORT } = INTERNSHIP_MANAGEMENT_UI.ENTERPRISE;
  const { FORM, DETAIL } = VIOLATION_REPORT;

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
            groupStartDate: initialValues.groupStartDate || initialValues.GroupStartDate,
            groupEndDate: initialValues.groupEndDate || initialValues.GroupEndDate,
            groupName: initialValues.internshipGroupName || initialValues.groupName,
          });
        }
      });
    } else {
      form.resetFields();
      startTransition(() => setSelectedStudent(null));
    }
  }, [initialValues, form, students]);

  // Normalize date comparison by ignoring time/timezone shifts
  const getCalendarDate = (dateString) => {
    if (!dateString) return null;
    const dateOnly = dateString.split('T')[0];
    return dayjs(dateOnly).startOf('day');
  };

  const studentOptions = useMemo(() => {
    return students.map((s) => ({
      label: `${s.studentFullName || s.fullName} (${s.studentCode || s.userCode}) - ${s.groupName || VIOLATION_REPORT.COMMON.EMPTY_VALUE}`,
      value: s.studentId || s.id,
      student: s,
    }));
  }, [students, VIOLATION_REPORT]);

  const handleStudentChange = (value) => {
    const option = studentOptions.find((opt) => opt.value === value);
    if (option) {
      setSelectedStudent(option.student);
      form.setFieldsValue({ studentId: value });
    } else {
      setSelectedStudent(null);
      form.setFieldsValue({ studentId: undefined });
    }
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
              showSearch
              placeholder={FORM.PLACEHOLDERS.STUDENT}
              className="h-10 w-full"
              optionFilterProp="label"
              options={studentOptions}
              onChange={handleStudentChange}
              disabled={!!initialValues || viewOnly || loading}
            />
          </Form.Item>

          {/* INTERNSHIP PERIOD INFO DISPLAY */}
          {selectedStudent && (selectedStudent.groupStartDate || selectedStudent.groupEndDate) && (
            <div
              className={`mt-2 rounded-lg border px-3 py-2 text-xs transition-all ${
                getCalendarDate(selectedStudent.groupStartDate)?.isAfter(
                  getCalendarDate(selectedStudent.groupEndDate),
                  'day'
                )
                  ? 'border-yellow-200 bg-yellow-50 text-yellow-700'
                  : 'border-blue-100 bg-blue-50/50 text-blue-700'
              }`}
            >
              <p className="flex items-center gap-1.5 font-medium">
                {VIOLATION_REPORT.DETAIL.INTERN_GROUP}
                {VIOLATION_REPORT.COMMON.COLON}
                {selectedStudent.groupName || VIOLATION_REPORT.COMMON.EMPTY_VALUE}
              </p>
              <p className="mt-0.5 opacity-90">
                {VIOLATION_REPORT.FILTERS.DATE_RANGE}
                {VIOLATION_REPORT.COMMON.COLON}{' '}
                <span className="font-semibold">
                  {selectedStudent.groupStartDate
                    ? dayjs(selectedStudent.groupStartDate.split('T')[0]).format(
                        VIOLATION_REPORT.DATE_FORMATS.UI
                      )
                    : VIOLATION_REPORT.COMMON.QUESTION_MARK}
                  {VIOLATION_REPORT.COMMON.DASH_SEPARATOR}
                  {selectedStudent.groupEndDate
                    ? dayjs(selectedStudent.groupEndDate.split('T')[0]).format(
                        VIOLATION_REPORT.DATE_FORMATS.UI
                      )
                    : VIOLATION_REPORT.COMMON.QUESTION_MARK}
                </span>
                {getCalendarDate(selectedStudent.groupStartDate)?.isAfter(
                  getCalendarDate(selectedStudent.groupEndDate),
                  'day'
                ) && (
                  <span className="ml-1 text-[10px] italic">
                    {VIOLATION_REPORT.COMMON.LEFT_PAREN}
                    {VIOLATION_REPORT.COMMON.INVALID_RANGE}
                    {VIOLATION_REPORT.COMMON.RIGHT_PAREN}
                  </span>
                )}
              </p>
            </div>
          )}

          {viewOnly && (
            <>
              <div className="grid grid-cols-2 gap-x-4">
                <Form.Item label={DETAIL.INTERN_GROUP}>
                  <Input
                    className="h-10 cursor-default bg-bg"
                    value={
                      initialValues?.internshipGroupName || VIOLATION_REPORT.COMMON.EMPTY_VALUE
                    }
                    readOnly
                  />
                </Form.Item>
                <Form.Item label={DETAIL.CREATED_BY}>
                  <Input
                    className="h-10 cursor-default bg-bg"
                    value={initialValues?.mentorName || VIOLATION_REPORT.COMMON.EMPTY_VALUE}
                    readOnly
                  />
                </Form.Item>
              </div>
            </>
          )}

          <div className={`${viewOnly ? 'grid grid-cols-2 gap-x-4' : ''}`}>
            <Form.Item
              name="occurredDate"
              label={FORM.INCIDENT_DATE}
              rules={[
                { required: true, message: FORM.VALIDATION.DATE_REQUIRED },
                () => ({
                  validator(_, value) {
                    if (!value || viewOnly) return Promise.resolve();

                    if (value.isAfter(dayjs().endOf('day'))) {
                      return Promise.reject(new Error(FORM.VALIDATION.DATE_FUTURE));
                    }

                    if (selectedStudent?.groupStartDate) {
                      const startDate = getCalendarDate(selectedStudent.groupStartDate);
                      const endDate = getCalendarDate(selectedStudent.groupEndDate);
                      const isBadRange = startDate && endDate && startDate.isAfter(endDate, 'day');

                      if (!isBadRange) {
                        if (value.startOf('day').isBefore(startDate, 'day')) {
                          return Promise.reject(new Error(FORM.VALIDATION.DATE_BEFORE_START));
                        }
                        if (endDate && value.startOf('day').isAfter(endDate, 'day')) {
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
                disabled={viewOnly}
                disabledDate={(current) => {
                  if (!current || viewOnly) return false;
                  const isFuture = current.startOf('day') > dayjs().endOf('day');

                  const startDate = getCalendarDate(selectedStudent?.groupStartDate);
                  const endDate = getCalendarDate(selectedStudent?.groupEndDate);

                  // If data is invalid (End < Start), we relax the restriction to allow report creation
                  const isBadRange = startDate && endDate && startDate.isAfter(endDate, 'day');

                  let isBeforeStart = false;
                  if (startDate && !isBadRange) {
                    isBeforeStart = current.startOf('day').isBefore(startDate, 'day');
                  }

                  let isAfterEnd = false;
                  if (endDate && !isBadRange) {
                    isAfterEnd = current.startOf('day').isAfter(endDate, 'day');
                  }

                  return isFuture || isBeforeStart || isAfterEnd;
                }}
              />
            </Form.Item>

            {viewOnly && (
              <Form.Item label={DETAIL.CREATED_TIME}>
                <DatePicker
                  className="h-10 w-full"
                  format={VIOLATION_REPORT.DATE_FORMATS.UI}
                  value={initialValues?.createdAt ? dayjs(initialValues.createdAt) : undefined}
                  disabled
                />
              </Form.Item>
            )}
          </div>
          <Form.Item
            name="description"
            label={FORM.DESCRIPTION}
            rules={[{ required: true, message: FORM.VALIDATION.DESCRIPTION_REQUIRED }]}
          >
            <Input.TextArea
              placeholder={FORM.PLACEHOLDERS.DESCRIPTION}
              rows={4}
              className="resize-none"
              readOnly={viewOnly}
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
        showCancel={!viewOnly}
      />
    </>
  );
};

const ViolationFormModal = ({ visible, onCancel, ...props }) => {
  return (
    <CompoundModal open={visible} onCancel={onCancel} width={520} destroyOnHidden closable={false}>
      {visible && <ViolationFormBody onCancel={onCancel} {...props} />}
    </CompoundModal>
  );
};

export default ViolationFormModal;

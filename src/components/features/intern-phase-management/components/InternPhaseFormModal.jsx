'use client';

import { InfoCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
} from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useMemo } from 'react';

import {
  INTERN_PHASE_MANAGEMENT,
  INTERN_PHASE_STATUS,
} from '@/constants/intern-phase-management/intern-phase';
import { translateMessage } from '@/utils/errorUtils';

const { TextArea } = Input;

export default function InternPhaseFormModal({
  visible,
  onCancel,
  onSave,
  loading,
  editingRecord,
  existingPhases = [],
}) {
  const [form] = Form.useForm();
  const { FORM } = INTERN_PHASE_MANAGEMENT;

  const nameValue = Form.useWatch('name', form);
  const startDateValue = Form.useWatch('startDate', form);
  const endDateValue = Form.useWatch('endDate', form);

  // AC-03 Rule: Block edit if students/groups exist
  const isBlocked = useMemo(() => {
    if (!editingRecord) return false;
    const placedCount = editingRecord.placedCount || 0;
    const groupCount = editingRecord.groupCount || 0;
    return placedCount > 0 || groupCount > 0;
  }, [editingRecord]);

  const nameWarning = useMemo(() => {
    if (!nameValue || !visible) return null;
    const isDuplicate = existingPhases.some(
      (p) =>
        p.name?.toLowerCase() === nameValue.trim().toLowerCase() &&
        p.id !== editingRecord?.id &&
        p.internPhaseId !== editingRecord?.internPhaseId
    );
    return isDuplicate ? FORM.VALIDATION.NAME_EXISTS : null;
  }, [nameValue, existingPhases, editingRecord, visible, FORM.VALIDATION.NAME_EXISTS]);

  useEffect(() => {
    if (visible && editingRecord) {
      form.setFieldsValue({
        ...editingRecord,
        startDate: editingRecord.startDate ? dayjs(editingRecord.startDate) : null,
        endDate: editingRecord.endDate ? dayjs(editingRecord.endDate) : null,
        majorFields:
          typeof editingRecord.majorFields === 'string'
            ? editingRecord.majorFields.split(',').filter(Boolean)
            : editingRecord.majorFields || [],
      });
    } else if (visible) {
      form.resetFields();
      form.setFieldsValue({
        majorFields: FORM.DEFAULT_MAJORS,
      });
    }
  }, [visible, editingRecord, form, FORM.DEFAULT_MAJORS]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSave?.(values);
    } catch (error) {
      // 1. Client-side validation
      if (error.errorFields?.length > 0) return;

      // 2. Server-side validation
      const errorData = error.data || error.response?.data;
      if (errorData?.validationErrors) {
        const fields = Object.keys(errorData.validationErrors).map((key) => ({
          name: key,
          errors: errorData.validationErrors[key].map((err) => translateMessage(err)),
        }));
        form.setFields(fields);
      }
    }
  };

  return (
    <Drawer
      title={
        <div className="flex flex-col">
          <h3 className="mb-0 text-lg font-bold">
            {editingRecord ? FORM.TITLE_EDIT : FORM.TITLE_ADD}
          </h3>
          <p className="mt-1 text-xs font-normal text-gray-400">{FORM.DESC}</p>
        </div>
      }
      open={visible}
      onClose={onCancel}
      size="large"
      zIndex={1100}
      className="intern-phase-form-drawer"
      footer={
        <div className="flex justify-between px-4 py-2 bg-slate-50">
          <Button onClick={onCancel}>{FORM.CANCEL_BTN}</Button>
          <Space>
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={loading}
              className="bg-primary hover:bg-primary/90"
            >
              {editingRecord ? FORM.SAVE_CHANGES_BTN : FORM.SAVE_BTN}
            </Button>
          </Space>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        disabled={loading || editingRecord?.status === INTERN_PHASE_STATUS.ENDED}
        className="px-2"
        requiredMark={true}
      >
        {isBlocked && (
          <div className="mb-6 rounded-lg bg-warning-surface border border-warning-border p-4 flex gap-3">
            <InfoCircleOutlined className="text-warning-text mt-1" />
            <span className="text-xs text-warning-text leading-relaxed">{FORM.BLOCK_MESSAGE}</span>
          </div>
        )}

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="name"
              label={FORM.LABEL.NAME}
              rules={[{ required: true, message: FORM.VALIDATION.NAME_REQUIRED }]}
              help={
                nameWarning ? (
                  <span className="text-warning-text font-medium italic">{nameWarning}</span>
                ) : null
              }
              validateStatus={nameWarning ? 'warning' : ''}
            >
              <Input placeholder={FORM.PLACEHOLDER.NAME} className="rounded-lg h-10" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={10}>
            <Form.Item
              name="startDate"
              label={FORM.LABEL.START_DATE}
              rules={[
                { required: true, message: FORM.VALIDATION.START_DATE_REQUIRED },
                () => ({
                  validator(_, value) {
                    if (!value || editingRecord) return Promise.resolve();

                    // AC-02: Prevent selecting past date for NEW phases
                    if (dayjs(value).isBefore(dayjs().startOf('day'))) {
                      return Promise.reject(new Error(FORM.VALIDATION.START_DATE_PAST));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <DatePicker
                format="DD/MM/YYYY"
                className="w-full h-10 rounded-lg"
                placeholder={FORM.PLACEHOLDER.DATE}
                disabled={isBlocked || editingRecord?.status === INTERN_PHASE_STATUS.ENDED}
                onChange={() => {
                  if (endDateValue) form.validateFields(['endDate']);
                }}
              />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item
              name="endDate"
              label={FORM.LABEL.END_DATE}
              rules={[
                { required: true, message: FORM.VALIDATION.END_DATE_REQUIRED },
                () => ({
                  validator(_, value) {
                    if (!value || !startDateValue) return Promise.resolve();

                    const start = dayjs(startDateValue).startOf('day');
                    const end = dayjs(value).startOf('day');

                    if (end.isBefore(start) || end.isSame(start)) {
                      return Promise.reject(new Error(FORM.VALIDATION.END_AFTER_START));
                    }

                    const diffDays = end.diff(start, 'day');
                    if (diffDays < 28) {
                      return Promise.reject(new Error(FORM.VALIDATION.MIN_DURATION));
                    }
                    if (diffDays > 365) {
                      return Promise.reject(new Error(FORM.VALIDATION.MAX_DURATION));
                    }

                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <DatePicker
                format="DD/MM/YYYY"
                className="w-full h-10 rounded-lg"
                placeholder={FORM.PLACEHOLDER.DATE}
                disabled={isBlocked || editingRecord?.status === INTERN_PHASE_STATUS.ENDED}
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              name="capacity"
              label={FORM.LABEL.CAPACITY}
              rules={[
                { required: true, message: FORM.VALIDATION.CAPACITY_REQUIRED },
                { type: 'number', min: 1, message: FORM.VALIDATION.CAPACITY_MIN },
              ]}
            >
              <InputNumber
                className="w-full h-10 flex items-center rounded-lg"
                placeholder={FORM.PLACEHOLDER.CAPACITY}
                disabled={isBlocked || editingRecord?.status === INTERN_PHASE_STATUS.ENDED}
                min={1}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="majorFields"
              label={FORM.LABEL.MAJORS}
              rules={[{ required: true, message: FORM.VALIDATION.MAJORS_REQUIRED }]}
            >
              <Select
                mode="tags"
                placeholder={FORM.PLACEHOLDER.MAJORS}
                className="w-full"
                tokenSeparators={[',']}
                suffixIcon={null}
                notFoundContent={null}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="description" label={FORM.LABEL.DESCRIPTION}>
              <TextArea
                rows={5}
                placeholder={FORM.PLACEHOLDER.DESCRIPTION}
                className="rounded-xl"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
}

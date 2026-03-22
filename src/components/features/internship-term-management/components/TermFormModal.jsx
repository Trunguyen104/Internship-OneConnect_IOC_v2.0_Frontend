'use client';

import { SaveOutlined } from '@ant-design/icons';
import { Col, DatePicker, Form, Input, Row, Select } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';

import CompoundModal from '@/components/ui/CompoundModal';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

const TermStats = ({ initialValues }) => {
  if (!initialValues) return null;

  const { STATS } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.MODALS;
  const stats = [
    {
      label: STATS.TOTAL_ENROLLED,
      value: initialValues.totalEnrolled || 0,
      containerClass: 'bg-info-surface border-info/10',
      textClass: 'text-info',
    },
    {
      label: STATS.TOTAL_PLACED,
      value: initialValues.totalPlaced || 0,
      containerClass: 'bg-success-surface border-success/10',
      textClass: 'text-success',
    },
    {
      label: STATS.TOTAL_UNPLACED,
      value: initialValues.totalUnplaced || 0,
      containerClass: 'bg-warning-surface border-warning/10',
      textClass: 'text-warning',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 py-2">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className={`rounded-lg border p-3 text-center transition-all ${stat.containerClass}`}
        >
          <div className="text-muted mb-1 text-[10px] font-bold tracking-wider uppercase">
            {stat.label}
          </div>
          <div className={`text-lg font-bold ${stat.textClass}`}>{stat.value}</div>
        </div>
      ))}
    </div>
  );
};

const TermFormBody = ({
  initialValues,
  onSave,
  onCancel,
  loading,
  viewOnly,
  isSuperAdmin,
  universities,
  userUniversity,
}) => {
  const [form] = Form.useForm();
  const { FORM } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.MODALS;

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        startDate: initialValues.startDate ? dayjs(initialValues.startDate) : null,
        endDate: initialValues.endDate ? dayjs(initialValues.endDate) : null,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSave({
        ...values,
        startDate: values.startDate ? values.startDate.format('YYYY-MM-DD') : null,
        endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : null,
      });
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const modalTitle = initialValues
    ? viewOnly
      ? FORM.TITLE_VIEW
      : FORM.TITLE_EDIT
    : FORM.TITLE_ADD;

  return (
    <>
      <CompoundModal.Header title={modalTitle} />

      {viewOnly && <TermStats initialValues={initialValues} />}

      <CompoundModal.Content>
        <Form form={form} layout="vertical" disabled={viewOnly || loading} requiredMark={!viewOnly}>
          <Form.Item
            name="name"
            label={FORM.NAME_LABEL}
            rules={[
              { required: true, message: FORM.NAME_REQUIRED },
              { max: 100, message: FORM.NAME_MAX },
            ]}
          >
            <Input placeholder={FORM.NAME_PLACEHOLDER} className="h-10" />
          </Form.Item>

          {isSuperAdmin ? (
            <Form.Item
              name="universityId"
              label={FORM.UNIVERSITY_LABEL}
              rules={[{ required: true, message: FORM.UNIVERSITY_REQUIRED }]}
            >
              <Select
                placeholder={FORM.UNIVERSITY_LABEL}
                className="h-10 w-full"
                loading={loading}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={universities.map((uni) => ({
                  value: uni.universityId,
                  label: uni.name,
                }))}
              />
            </Form.Item>
          ) : (
            <Form.Item label={FORM.UNIVERSITY_LABEL}>
              <Input value={userUniversity?.name || ''} disabled className="h-10" />
            </Form.Item>
          )}

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startDate"
                label={FORM.START_DATE_LABEL}
                rules={[{ required: true, message: FORM.START_DATE_REQUIRED }]}
              >
                <DatePicker
                  className="h-10 w-full"
                  format="DD/MM/YYYY"
                  placeholder={FORM.DATE_PLACEHOLDER}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endDate"
                label={FORM.END_DATE_LABEL}
                dependencies={['startDate']}
                rules={[
                  { required: true, message: FORM.END_DATE_REQUIRED },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (
                        !value ||
                        !getFieldValue('startDate') ||
                        value.isAfter(getFieldValue('startDate'))
                      ) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error(FORM.DATE_INVALID));
                    },
                  }),
                ]}
              >
                <DatePicker
                  className="h-10 w-full"
                  format="DD/MM/YYYY"
                  placeholder={FORM.DATE_PLACEHOLDER}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </CompoundModal.Content>

      <CompoundModal.Footer
        onCancel={onCancel}
        onConfirm={viewOnly ? onCancel : handleSubmit}
        loading={loading}
        confirmIcon={!viewOnly && <SaveOutlined />}
        confirmText={viewOnly ? FORM.CLOSE : FORM.SUBMIT}
      />
    </>
  );
};

const TermFormModal = ({ visible, onCancel, ...props }) => {
  return (
    <CompoundModal open={visible} onCancel={onCancel} width={640} destroyOnClose>
      {visible && <TermFormBody onCancel={onCancel} {...props} />}
    </CompoundModal>
  );
};

export default TermFormModal;

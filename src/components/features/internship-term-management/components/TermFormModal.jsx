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

  const totalEnrolled = Math.max(0, initialValues.totalEnrolled || initialValues.studentCount || 0);
  const totalPlaced = Math.min(totalEnrolled, Math.max(0, initialValues.totalPlaced || 0));
  const totalUnplaced = totalEnrolled - totalPlaced;

  const stats = [
    {
      label: STATS.TOTAL_ENROLLED,
      value: totalEnrolled,
      variant: 'primary',
    },
    {
      label: STATS.TOTAL_PLACED,
      value: totalPlaced,
      variant: 'success',
    },
    {
      label: STATS.TOTAL_UNPLACED,
      value: totalUnplaced,
      variant: 'warning',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 pt-2 pb-6">
      {stats.map((stat, idx) => (
        <CompoundModal.InfoBox
          key={idx}
          label={stat.label}
          value={stat.value}
          color={stat.variant}
        />
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
      const name = initialValues.name || initialValues.Name;
      const universityId = initialValues.universityId || initialValues.UniversityId;
      const startDate = initialValues.startDate || initialValues.StartDate;
      const endDate = initialValues.endDate || initialValues.EndDate;

      form.setFieldsValue({
        ...initialValues,
        name,
        universityId,
        startDate: startDate ? dayjs(startDate) : null,
        endDate: endDate ? dayjs(endDate) : null,
      });
    } else {
      form.resetFields();
      if (!isSuperAdmin && userUniversity?.id) {
        form.setFieldsValue({ universityId: userUniversity.id });
      }
    }
  }, [initialValues, form, isSuperAdmin, userUniversity]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSave({
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

  const modalSubtitle = viewOnly
    ? initialValues.name
    : initialValues
      ? FORM.TITLE_EDIT
      : FORM.TITLE_ADD;

  return (
    <>
      <CompoundModal.Header
        title={modalTitle}
        subtitle={
          viewOnly
            ? initialValues.name
            : initialValues
              ? FORM.UPDATE_SUBTITLE
              : FORM.CREATE_SUBTITLE
        }
      />

      <CompoundModal.Content className="!pb-0">
        {viewOnly && <TermStats initialValues={initialValues} />}

        <Form
          form={form}
          layout="vertical"
          disabled={viewOnly || loading}
          requiredMark={!viewOnly}
          className="premium-form"
        >
          <Form.Item
            name="name"
            label={FORM.NAME_LABEL}
            rules={[
              { required: true, message: FORM.NAME_REQUIRED },
              { max: 100, message: FORM.NAME_MAX },
            ]}
          >
            <Input placeholder={FORM.NAME_PLACEHOLDER} className="!h-11 !rounded-xl" />
          </Form.Item>

          {isSuperAdmin && (
            <Form.Item
              name="universityId"
              label={FORM.UNIVERSITY_LABEL}
              rules={[{ required: true, message: FORM.UNIVERSITY_REQUIRED }]}
            >
              <Select
                placeholder={FORM.UNIVERSITY_LABEL}
                className="!h-11 w-full"
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
          )}

          {!isSuperAdmin && (
            <Form.Item name="universityId" hidden>
              <Input />
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
                  className="!h-11 w-full !rounded-xl"
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
                  className="!h-11 w-full !rounded-xl"
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
        showCancel={!viewOnly}
        className="!mt-0"
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

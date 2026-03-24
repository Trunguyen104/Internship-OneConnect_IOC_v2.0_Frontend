'use client';

import {
  CalendarOutlined,
  IdcardOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Col, DatePicker, Form, Input, Row, Select } from 'antd';
import React, { useEffect } from 'react';

import CompoundModal from '@/components/ui/CompoundModal';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

const AddStudentModal = ({ open, onCancel, onSave }) => {
  const [form] = Form.useForm();
  const { ADD } = INTERNSHIP_MANAGEMENT_UI.INTERNSHIP_LIST.MODALS;

  useEffect(() => {
    if (open) form.resetFields();
  }, [open, form]);

  const handleFinish = (values) => {
    onSave(values);
    form.resetFields();
  };

  return (
    <CompoundModal open={open} onCancel={onCancel} width={640} destroyOnHidden closable={false}>
      <CompoundModal.Header
        icon={<PlusCircleOutlined />}
        title={ADD.TITLE}
        subtitle={ADD.SUBTITLE}
      />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="px-8 py-6"
        requiredMark={false}
      >
        <Row gutter={24}>
          <Col span={14}>
            <Form.Item
              label={
                <span className="text-text text-xs font-bold tracking-wider uppercase">
                  {ADD.NAME_LABEL}
                </span>
              }
              name="fullName"
              rules={[{ required: true, message: ADD.NAME_REQUIRED }]}
            >
              <Input
                prefix={<UserOutlined className="text-muted" />}
                placeholder={ADD.NAME_PLACEHOLDER}
                className="bg-surface border-border h-11 rounded-xl"
              />
            </Form.Item>
          </Col>

          <Col span={10}>
            <Form.Item
              label={
                <span className="text-text text-xs font-bold tracking-wider uppercase">
                  {ADD.ID_LABEL}
                </span>
              }
              name="studentId"
              rules={[{ required: true, message: ADD.ID_REQUIRED }]}
            >
              <Input
                prefix={<IdcardOutlined className="text-muted" />}
                placeholder={ADD.ID_PLACEHOLDER}
                className="bg-surface border-border h-11 rounded-xl"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={
            <span className="text-text text-xs font-bold tracking-wider uppercase">
              {ADD.EMAIL_LABEL}
            </span>
          }
          name="email"
          rules={[
            { required: true, message: ADD.EMAIL_REQUIRED },
            { type: 'email', message: ADD.EMAIL_INVALID },
          ]}
        >
          <Input
            prefix={<MailOutlined className="text-muted" />}
            placeholder={ADD.EMAIL_PLACEHOLDER}
            className="bg-surface border-border h-11 rounded-xl"
          />
        </Form.Item>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label={
                <span className="text-text text-xs font-bold tracking-wider uppercase">
                  {ADD.PHONE_LABEL}
                </span>
              }
              name="phone"
              rules={[
                { required: true, message: ADD.PHONE_REQUIRED },
                { pattern: /^[0-9]{10,11}$/, message: ADD.PHONE_INVALID },
              ]}
            >
              <Input
                prefix={<PhoneOutlined className="text-muted" />}
                placeholder={ADD.PHONE_PLACEHOLDER}
                className="bg-surface border-border h-11 rounded-xl"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={
                <span className="text-text text-xs font-bold tracking-wider uppercase">
                  {ADD.DOB_LABEL}
                </span>
              }
              name="dob"
              rules={[{ required: true, message: ADD.DOB_REQUIRED }]}
            >
              <DatePicker
                placeholder={ADD.DATE_FORMAT_PLACEHOLDER}
                format="DD/MM/YYYY"
                className="bg-surface border-border h-11 w-full rounded-xl"
                suffixIcon={<CalendarOutlined className="text-muted" />}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={
            <span className="text-text text-xs font-bold tracking-wider uppercase">
              {ADD.MAJOR_LABEL}
            </span>
          }
          name="major"
          rules={[{ required: true, message: ADD.MAJOR_REQUIRED }]}
        >
          <Select
            placeholder={ADD.MAJOR_PLACEHOLDER}
            className="h-11 w-full rounded-xl"
            options={ADD.MAJOR_OPTIONS}
          />
        </Form.Item>

        <CompoundModal.Footer
          cancelText={ADD.CANCEL}
          confirmText={ADD.SUBMIT}
          onCancel={onCancel}
          onConfirm={() => form.submit()}
        />
      </Form>
    </CompoundModal>
  );
};

export default AddStudentModal;

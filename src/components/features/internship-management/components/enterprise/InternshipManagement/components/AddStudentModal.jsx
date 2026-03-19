'use client';

import React, { useEffect } from 'react';
import { Form, Input, Select, Row, Col } from 'antd';
import { UserOutlined, IdcardOutlined, MailOutlined, PlusCircleOutlined } from '@ant-design/icons';
import CompoundModal from '@/components/ui/CompoundModal';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

const AddStudentModal = ({ open, onCancel, onSave }) => {
  const [form] = Form.useForm();
  const { ADD } = INTERNSHIP_MANAGEMENT_UI.INTERNSHIP_LIST.MODALS;

  useEffect(() => {
    if (!open) form.resetFields();
  }, [open, form]);

  const handleFinish = (values) => {
    onSave(values);
    form.resetFields();
  };

  return (
    <CompoundModal open={open} onCancel={onCancel} width={600} destroyOnHidden>
      <CompoundModal.Header
        icon={<PlusCircleOutlined />}
        title={ADD.TITLE}
        subtitle={ADD.SUBTITLE}
      />

      <Form
        form={form}
        layout='vertical'
        onFinish={handleFinish}
        className='p-6 pt-8'
        requiredMark={false}
      >
        <Row gutter={24}>
          <Col span={14}>
            <Form.Item
              label={
                <span className='text-text text-xs font-bold tracking-wider uppercase'>
                  {ADD.NAME_LABEL}
                </span>
              }
              name='fullName'
              rules={[{ required: true, message: ADD.NAME_REQUIRED }]}
            >
              <Input
                prefix={<UserOutlined className='text-muted ml-1' />}
                placeholder={ADD.NAME_PLACEHOLDER}
                className='bg-surface border-border h-11 rounded-xl'
              />
            </Form.Item>
          </Col>

          <Col span={10}>
            <Form.Item
              label={
                <span className='text-text text-xs font-bold tracking-wider uppercase'>
                  {ADD.ID_LABEL}
                </span>
              }
              name='studentId'
              rules={[{ required: true, message: ADD.ID_REQUIRED }]}
            >
              <Input
                prefix={<IdcardOutlined className='text-muted ml-1' />}
                placeholder={ADD.ID_PLACEHOLDER}
                className='bg-surface border-border h-11 rounded-xl'
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={
            <span className='text-text text-xs font-bold tracking-wider uppercase'>
              {ADD.EMAIL_LABEL}
            </span>
          }
          name='email'
          rules={[
            { required: true, message: ADD.EMAIL_REQUIRED },
            { type: 'email', message: ADD.EMAIL_INVALID },
          ]}
        >
          <Input
            prefix={<MailOutlined className='text-muted ml-1' />}
            placeholder={ADD.EMAIL_PLACEHOLDER}
            className='bg-surface border-border h-11 rounded-xl'
          />
        </Form.Item>

        <Form.Item
          label={
            <span className='text-text text-xs font-bold tracking-wider uppercase'>
              {ADD.MAJOR_LABEL}
            </span>
          }
          name='major'
          rules={[{ required: true, message: ADD.MAJOR_REQUIRED }]}
        >
          <Select
            placeholder={ADD.MAJOR_PLACEHOLDER}
            className='h-11 w-full rounded-xl'
            options={ADD.MAJOR_OPTIONS}
          />
        </Form.Item>

        <CompoundModal.Footer
          cancelText={ADD.CANCEL}
          submitText={ADD.SUBMIT}
          onCancel={onCancel}
          onSubmit={() => form.submit()}
          className='mt-8 pt-6'
        />
      </Form>
    </CompoundModal>
  );
};

export default AddStudentModal;

'use client';

import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Row, Col, Typography, Space, Divider } from 'antd';
import {
  UserOutlined,
  IdcardOutlined,
  MailOutlined,
  PlusCircleOutlined,
  BookOutlined,
} from '@ant-design/icons';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

const { Title, Text } = Typography;

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
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      width={600}
      destroyOnHidden
      className='modal-custom'
    >
      <div className='mb-6 flex flex-col items-center gap-3 text-center'>
        <div className='bg-primary/10 flex size-14 items-center justify-center rounded-2xl'>
          <PlusCircleOutlined className='text-primary text-3xl' />
        </div>
        <div>
          <Title level={4} className='text-text mb-1'>
            {ADD.TITLE}
          </Title>
          <Text className='text-muted text-xs'>
            Vui lòng điền đầy đủ thông tin sinh viên để thêm vào hệ thống quản lý
          </Text>
        </div>
      </div>

      <Divider className='border-border m-0' />

      <Form form={form} layout='vertical' onFinish={handleFinish} className='mt-8 space-y-4 px-2'>
        <Row gutter={24}>
          <Col span={14}>
            <Form.Item
              label={<span className='text-text font-semibold'>{ADD.NAME_LABEL}</span>}
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
              label={<span className='text-text font-semibold'>{ADD.ID_LABEL}</span>}
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
          label={<span className='text-text font-semibold'>{ADD.EMAIL_LABEL}</span>}
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
          label={<span className='text-text font-semibold'>{ADD.MAJOR_LABEL}</span>}
          name='major'
          rules={[{ required: true, message: ADD.MAJOR_REQUIRED }]}
        >
          <Select
            placeholder={ADD.MAJOR_PLACEHOLDER}
            prefix={<BookOutlined className='text-muted ml-1' />}
            className='h-11 w-full rounded-xl'
            options={[
              { label: 'Computer Science', value: 'Computer Science' },
              { label: 'Software Engineering', value: 'Software Engineering' },
              { label: 'Data Science', value: 'Data Science' },
              { label: 'UX Design', value: 'UX Design' },
            ]}
          />
        </Form.Item>

        <Space className='mt-8 flex w-full justify-end gap-3 pb-2'>
          <Button
            onClick={onCancel}
            className='border-border h-11 rounded-xl px-8 font-semibold transition-all hover:bg-slate-50'
          >
            {ADD.CANCEL}
          </Button>

          <Button
            type='primary'
            htmlType='submit'
            className='bg-primary h-11 rounded-xl border-none px-8 font-semibold shadow-md transition-all hover:scale-105 active:scale-95'
          >
            {ADD.SUBMIT}
          </Button>
        </Space>
      </Form>
    </Modal>
  );
};

export default AddStudentModal;

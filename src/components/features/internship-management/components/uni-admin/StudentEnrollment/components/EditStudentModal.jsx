'use client';

import React, { memo, useEffect } from 'react';
import { Modal, Button, Input, Form, Typography, Space, Divider, Row, Col, Select } from 'antd';
import {
  UserOutlined,
  IdcardOutlined,
  MailOutlined,
  EditOutlined,
  BookOutlined,
} from '@ant-design/icons';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

const { Title, Text } = Typography;

const EditStudentModal = memo(function EditStudentModal({ visible, onClose, student, onSave }) {
  const [form] = Form.useForm();
  const { ADD_EDIT } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.STUDENT_ENROLLMENT.MODALS;

  useEffect(() => {
    if (student) {
      form.setFieldsValue({
        fullName: student.name,
        studentCode: student.id,
        email: student.email || `${student.id.toLowerCase()}@university.edu`,
        major: student.major,
      });
    }
  }, [student, form]);

  const handleSubmit = (values) => {
    onSave?.(values);
    onClose();
  };

  if (!student) return null;

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      width={600}
      footer={null}
      centered
      destroyOnHidden
      className='modal-custom'
    >
      <div className='mb-6 flex flex-col items-center gap-3 text-center'>
        <div className='bg-primary/10 flex size-14 items-center justify-center rounded-2xl'>
          <EditOutlined className='text-primary text-3xl' />
        </div>
        <div>
          <Title level={4} className='text-text mb-1'>
            {ADD_EDIT.TITLE_EDIT}
          </Title>
          <Text className='text-muted text-xs'>
            Cập nhật thông tin chi tiết cho sinh viên{' '}
            <Text className='text-text font-bold'>{student.name}</Text>
          </Text>
        </div>
      </div>

      <Divider className='border-border m-0' />

      <Form form={form} layout='vertical' onFinish={handleSubmit} className='mt-8 space-y-4 px-2'>
        <Row gutter={24}>
          <Col span={14}>
            <Form.Item
              label={<span className='text-text font-semibold'>{ADD_EDIT.NAME_LABEL}</span>}
              name='fullName'
              rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
            >
              <Input
                prefix={<UserOutlined className='text-muted ml-1' />}
                className='bg-surface border-border h-11 rounded-xl'
              />
            </Form.Item>
          </Col>

          <Col span={10}>
            <Form.Item
              label={<span className='text-text font-semibold'>{ADD_EDIT.ID_LABEL}</span>}
              name='studentCode'
              rules={[{ required: true, message: 'Vui lòng nhập MSSV' }]}
            >
              <Input
                prefix={<IdcardOutlined className='text-muted ml-1' />}
                className='bg-surface border-border h-11 rounded-xl'
                disabled
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={<span className='text-text font-semibold'>{ADD_EDIT.EMAIL_LABEL}</span>}
          name='email'
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' },
          ]}
        >
          <Input
            prefix={<MailOutlined className='text-muted ml-1' />}
            className='bg-surface border-border h-11 rounded-xl'
          />
        </Form.Item>

        <Form.Item
          label={<span className='text-text font-semibold'>{ADD_EDIT.MAJOR_LABEL}</span>}
          name='major'
          rules={[{ required: true, message: 'Vui lòng chọn ngành học' }]}
        >
          <Select
            placeholder='Chọn ngành học'
            prefix={<BookOutlined className='text-muted ml-1' />}
            className='h-11 w-full rounded-xl'
            options={[
              { label: 'Kỹ thuật phần mềm', value: 'Software Engineering' },
              { label: 'An toàn thông tin', value: 'Information Security' },
              { label: 'Thiết kế đồ họa', value: 'Graphic Design' },
            ]}
          />
        </Form.Item>

        <Space className='mt-8 flex w-full justify-end gap-3 pb-2'>
          <Button
            onClick={onClose}
            className='border-border h-11 rounded-xl px-8 font-semibold transition-all hover:bg-slate-50'
          >
            {ADD_EDIT.CANCEL}
          </Button>

          <Button
            type='primary'
            htmlType='submit'
            className='bg-primary h-11 rounded-xl border-none px-8 font-semibold shadow-md transition-all hover:scale-105 active:scale-95'
          >
            {ADD_EDIT.SUBMIT_EDIT}
          </Button>
        </Space>
      </Form>
    </Modal>
  );
});

export default EditStudentModal;

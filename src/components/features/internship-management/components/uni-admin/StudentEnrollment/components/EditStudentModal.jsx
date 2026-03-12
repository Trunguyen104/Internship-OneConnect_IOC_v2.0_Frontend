'use client';
import React, { memo, useEffect } from 'react';
import { Modal, Button, Input, Form } from 'antd';
import {
  UserOutlined,
  IdcardOutlined,
  MailOutlined,
  CheckCircleOutlined,
  CloseOutlined,
} from '@ant-design/icons';

const EditStudentModal = memo(function EditStudentModal({ visible, onClose, student }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (student) {
      form.setFieldsValue({
        fullName: student.name,
        studentCode: student.id,
        email: `${student.id.toLowerCase()}@university.edu`,
      });
    }
  }, [student, form]);

  const handleSubmit = (values) => {
    console.log(values);
    onClose();
  };

  if (!student) return null;

  return (
    <Modal
      title={
        <div className='flex items-center gap-3 text-slate-900'>
          <span className='text-xl font-bold tracking-tight'>Chỉnh sửa Sinh viên</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={560}
      footer={null}
      className='custom-add-student-modal'
      closeIcon={<CloseOutlined className='hover:text-primary text-slate-500' />}
    >
      <Form form={form} layout='vertical' onFinish={handleSubmit} className='pt-6 pb-2'>
        <Form.Item
          label='Full Name'
          name='fullName'
          rules={[{ required: true, message: 'Please enter full name' }]}
        >
          <Input
            size='large'
            prefix={<UserOutlined className='text-slate-400' />}
            className='rounded-xl'
          />
        </Form.Item>

        <Form.Item
          label='Student Code'
          name='studentCode'
          rules={[{ required: true, message: 'Please enter student code' }]}
        >
          <Input
            size='large'
            prefix={<IdcardOutlined className='text-slate-400' />}
            className='rounded-xl'
          />
        </Form.Item>

        <Form.Item
          label='Email Address'
          name='email'
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Invalid email format' },
          ]}
        >
          <Input
            size='large'
            prefix={<MailOutlined className='text-slate-400' />}
            className='rounded-xl'
          />
        </Form.Item>

        <div className='mt-6 flex items-center justify-end gap-4 px-2 py-2'>
          <Button
            onClick={onClose}
            shape='round'
            size='large'
            className='border-none bg-slate-100 font-semibold text-slate-600 hover:!bg-slate-200'
          >
            Cancel
          </Button>

          <Button
            htmlType='submit'
            type='primary'
            shape='round'
            size='large'
            className='bg-primary shadow-primary/20 hover:!bg-primary/90 flex items-center gap-2 border-none font-bold shadow-md'
          >
            Save Changes
            <CheckCircleOutlined />
          </Button>
        </div>
      </Form>
    </Modal>
  );
});

export default EditStudentModal;

'use client';
import React, { memo } from 'react';
import { Modal, Button, Input, Form, DatePicker } from 'antd';
import {
  UserOutlined,
  IdcardOutlined,
  MailOutlined,
  PhoneOutlined,
  CheckCircleOutlined,
  CloseOutlined,
} from '@ant-design/icons';

const AddStudentModal = memo(function AddStudentModal({ visible, onClose }) {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    console.log(values);

    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={
        <div className='flex items-center gap-3 text-slate-900'>
          <span className='text-xl font-bold tracking-tight'>Add New Student</span>
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
            placeholder='e.g. John Doe'
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
            placeholder='e.g. STU-2024-001'
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
            placeholder='e.g. john@university.edu'
            className='rounded-xl'
          />
        </Form.Item>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <Form.Item
            label='Phone Number'
            name='phone'
            rules={[{ required: true, message: 'Please enter phone number' }]}
          >
            <Input
              size='large'
              prefix={<PhoneOutlined className='text-slate-400' />}
              placeholder='+1 (555) 000-0000'
              className='rounded-xl'
            />
          </Form.Item>

          <Form.Item
            label='Date of Birth'
            name='dob'
            rules={[{ required: true, message: 'Please select date of birth' }]}
          >
            <DatePicker size='large' style={{ width: '100%' }} className='rounded-xl' />
          </Form.Item>
        </div>

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
            Save Student
            <CheckCircleOutlined />
          </Button>
        </div>
      </Form>
    </Modal>
  );
});

export default AddStudentModal;

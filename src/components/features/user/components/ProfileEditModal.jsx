'use client';

import { Modal, Form, Input, Select, Button, Space, DatePicker } from 'antd';
import { PROFILE_UI } from '@/constants/user/uiText';
import dayjs from 'dayjs';
import { useEffect } from 'react';

export default function ProfileEditModal({ open, onCancel, userInfo, onSave, loading }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && userInfo) {
      form.setFieldsValue({
        ...userInfo,
        dateOfBirth: userInfo.dateOfBirth ? dayjs(userInfo.dateOfBirth) : null,
      });
    }
  }, [open, userInfo, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = {
        ...values,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : null,
      };
      const success = await onSave(formattedValues);
      if (success) onCancel();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const renderRoleSpecificFields = () => {
    if (!userInfo) return null;

    switch (userInfo.role) {
      case 'Student':
        return (
          <Form.Item label={PROFILE_UI.LABELS.PORTFOLIO} name='portfolioUrl'>
            <Input placeholder='https://github.com/your-portfolio' />
          </Form.Item>
        );
      case 'Mentor':
      case 'HR':
      case 'EnterpriseAdmin':
        return (
          <>
            <Form.Item label={PROFILE_UI.LABELS.POSITION} name='position'>
              <Input />
            </Form.Item>
            <Form.Item label={PROFILE_UI.LABELS.EXPERTISE} name='expertise'>
              <Input placeholder='e.g. Software Engineering, Recruitment' />
            </Form.Item>
            <Form.Item label={PROFILE_UI.LABELS.BIO} name='bio'>
              <Input.TextArea rows={4} maxLength={1000} showCount />
            </Form.Item>
          </>
        );
      case 'SchoolAdmin':
        return (
          <>
            <Form.Item label={PROFILE_UI.LABELS.POSITION} name='position'>
              <Input />
            </Form.Item>
            <Form.Item label={PROFILE_UI.LABELS.DEPARTMENT} name='department'>
              <Input />
            </Form.Item>
            <Form.Item label={PROFILE_UI.LABELS.BIO} name='bio'>
              <Input.TextArea rows={4} maxLength={1000} showCount />
            </Form.Item>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      open={open}
      title={PROFILE_UI.BUTTONS.EDIT + ' ' + PROFILE_UI.PERSONAL_INFO}
      onCancel={onCancel}
      footer={[
        <Button key='cancel' onClick={onCancel}>
          {PROFILE_UI.BUTTONS.CANCEL}
        </Button>,
        <Button key='save' type='primary' danger loading={loading} onClick={handleSubmit}>
          {PROFILE_UI.BUTTONS.SAVE_CHANGES}
        </Button>,
      ]}
      width={600}
      centered
    >
      <Form form={form} layout='vertical' className='mt-4'>
        <div className='grid grid-cols-1 gap-x-4 md:grid-cols-2'>
          <Form.Item
            label={PROFILE_UI.LABELS.FULL_NAME}
            name='fullName'
            rules={[{ required: true, message: 'Full name is required' }]}
          >
            <Input maxLength={150} />
          </Form.Item>

          <Form.Item
            label={PROFILE_UI.LABELS.PHONE}
            name='phoneNumber'
            rules={[
              { pattern: /^\d+$/, message: 'Phone number must contain only digits' },
              { max: 15, message: 'Max 15 characters' },
            ]}
          >
            <Input placeholder='09xxxxxxxx' />
          </Form.Item>

          <Form.Item label={PROFILE_UI.LABELS.DATE_OF_BIRTH} name='dateOfBirth'>
            <DatePicker className='w-full' format='DD/MM/YYYY' />
          </Form.Item>

          <Form.Item label={PROFILE_UI.LABELS.GENDER} name='gender'>
            <Select
              options={[
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' },
              ]}
            />
          </Form.Item>
        </div>

        {renderRoleSpecificFields()}
      </Form>
    </Modal>
  );
}

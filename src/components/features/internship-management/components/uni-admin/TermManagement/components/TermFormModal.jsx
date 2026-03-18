'use client';

import { Form, Input, DatePicker, Modal, Button, Space } from 'antd';
import dayjs from 'dayjs';
import React, { memo, useEffect } from 'react';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import {
  EditOutlined,
  PlusCircleOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
} from '@ant-design/icons';

const TermFormModal = memo(function TermFormModal({
  visible,
  onCancel,
  onSave,
  loading,
  initialValues,
}) {
  const [form] = Form.useForm();
  const { FORM } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.MODALS;

  const isClosed = initialValues?.status === 3 || initialValues?.status === 'Closed';

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue({
        name: initialValues.name,
        startDate: dayjs(initialValues.startDate),
        endDate: dayjs(initialValues.endDate),
        status: initialValues.status,
      });
    } else if (visible) {
      form.resetFields();
    }
  }, [visible, initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        name: values.name,
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: values.endDate.format('YYYY-MM-DD'),
        status: initialValues ? initialValues.status : 1, // Default to Active/Open on creation
      };

      onSave(payload, initialValues?.termId);
    } catch (err) {
      console.error(err);
    }
  };

  const renderTitle = () => {
    if (isClosed) {
      return (
        <Space>
          <InfoCircleOutlined className='text-primary' />
          <span>{FORM.TITLE_VIEW}</span>
        </Space>
      );
    }

    return (
      <Space>
        {initialValues ? (
          <EditOutlined className='text-primary' />
        ) : (
          <PlusCircleOutlined className='text-primary' />
        )}
        <span>{initialValues ? FORM.TITLE_EDIT : FORM.TITLE_ADD}</span>
      </Space>
    );
  };

  const renderStats = () => {
    if (!initialValues) return null;

    const { STATS } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.MODALS;
    const stats = [
      {
        label: STATS.TOTAL_ENROLLED,
        value: initialValues.totalEnrolled || 0,
        color: '#1677ff',
        bg: '#e6f4ff',
      },
      {
        label: STATS.TOTAL_PLACED,
        value: initialValues.totalPlaced || 0,
        color: '#52c41a',
        bg: '#f6ffed',
      },
      {
        label: STATS.TOTAL_UNPLACED,
        value: initialValues.totalUnplaced || 0,
        color: '#fa8c16',
        bg: '#fff7e6',
      },
    ];

    return (
      <div className='mb-6 grid grid-cols-3 gap-3'>
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className='rounded-lg p-3 text-center'
            style={{ backgroundColor: stat.bg, border: `1px solid ${stat.color}22` }}
          >
            <div className='text-muted mb-1 text-[10px] font-bold tracking-wider uppercase'>
              {stat.label}
            </div>
            <div className='text-lg font-bold' style={{ color: stat.color }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      title={renderTitle()}
      width={520}
      centered
      footer={
        isClosed ? (
          <Button key='close' type='primary' onClick={onCancel}>
            {FORM.CLOSE}
          </Button>
        ) : (
          [
            <Button key='cancel' onClick={onCancel}>
              {FORM.CANCEL}
            </Button>,
            <Button key='submit' type='primary' loading={loading} onClick={handleSubmit}>
              {FORM.SUBMIT}
            </Button>,
          ]
        )
      }
    >
      <div className='py-4'>
        {renderStats()}

        <Form form={form} layout='vertical' autoComplete='off' disabled={isClosed}>
          <Form.Item
            label={<span className='text-text font-semibold'>{FORM.NAME_LABEL}</span>}
            name='name'
            rules={[
              { required: true, message: FORM.NAME_REQUIRED },
              { max: 100, message: FORM.NAME_MAX },
            ]}
          >
            <Input
              prefix={<InfoCircleOutlined className='text-muted' />}
              placeholder={FORM.NAME_PLACEHOLDER}
            />
          </Form.Item>

          <div className='grid grid-cols-2 gap-4'>
            <Form.Item
              label={<span className='text-text font-semibold'>{FORM.START_DATE_LABEL}</span>}
              name='startDate'
              rules={[{ required: true, message: FORM.START_DATE_REQUIRED }]}
            >
              <DatePicker
                placeholder={FORM.DATE_PLACEHOLDER}
                suffixIcon={<CalendarOutlined className='text-muted' />}
                style={{ width: '100%' }}
                format='DD/MM/YYYY'
              />
            </Form.Item>

            <Form.Item
              label={<span className='text-text font-semibold'>{FORM.END_DATE_LABEL}</span>}
              name='endDate'
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
                placeholder={FORM.DATE_PLACEHOLDER}
                suffixIcon={<CalendarOutlined className='text-muted' />}
                style={{ width: '100%' }}
                format='DD/MM/YYYY'
              />
            </Form.Item>
          </div>
        </Form>
      </div>
    </Modal>
  );
});

export default TermFormModal;

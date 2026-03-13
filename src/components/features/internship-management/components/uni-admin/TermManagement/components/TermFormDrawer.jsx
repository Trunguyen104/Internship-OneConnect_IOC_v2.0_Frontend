'use client';
import React, { memo, useEffect } from 'react';
import { Form, Input, DatePicker, Select, Drawer, Button, Space, Typography } from 'antd';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const TermFormDrawer = memo(function TermFormDrawer({
  visible,
  onCancel,
  onSave,
  loading,
  initialValues,
}) {
  const [form] = Form.useForm();

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
      form.setFieldsValue({ status: 0 });
    }
  }, [visible, initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        name: values.name,
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: values.endDate.format('YYYY-MM-DD'),
        status: initialValues ? initialValues.status : values.status,
      };

      onSave(payload, initialValues?.termId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Drawer
      open={visible}
      onClose={onCancel}
      title={
        <Space direction='vertical' size={0}>
          <Title level={4} style={{ margin: 0 }}>
            {initialValues ? 'Edit Internship Term' : 'Add Internship Term'}
          </Title>
          <Text type='secondary'>
            {initialValues ? 'Update term information' : 'Enter information to create a new term'}
          </Text>
        </Space>
      }
      width={520}
      footer={
        <Space style={{ float: 'right' }}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type='primary' loading={loading} onClick={handleSubmit}>
            {initialValues ? 'Update' : 'Create'}
          </Button>
        </Space>
      }
    >
      <Form form={form} layout='vertical' name='termForm' requiredMark={false} autoComplete='off'>
        <Form.Item
          label='Term Name'
          name='name'
          rules={[
            { required: true, message: 'Please enter term name' },
            { max: 100, message: 'Maximum 100 characters' },
          ]}
        >
          <Input placeholder='e.g., Spring 2026 Term' />
        </Form.Item>

        <Form.Item
          label='Start Date'
          name='startDate'
          rules={[{ required: true, message: 'Please select start date' }]}
        >
          <DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' />
        </Form.Item>

        <Form.Item
          label='End Date'
          name='endDate'
          dependencies={['startDate']}
          rules={[
            { required: true, message: 'Please select end date' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (
                  !value ||
                  !getFieldValue('startDate') ||
                  value.isAfter(getFieldValue('startDate'))
                ) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('End date must be after start date'));
              },
            }),
          ]}
        >
          <DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' />
        </Form.Item>

        {!initialValues && (
          <Form.Item label='Status' name='status' rules={[{ required: true }]}>
            <Select
              options={[
                { value: 0, label: 'Draft' },
                { value: 1, label: 'Activate immediately' },
              ]}
            />
          </Form.Item>
        )}
      </Form>
    </Drawer>
  );
});

export default TermFormDrawer;

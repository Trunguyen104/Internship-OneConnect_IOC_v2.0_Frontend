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
            {initialValues ? 'Chỉnh sửa kỳ thực tập' : 'Thêm kỳ thực tập'}
          </Title>
          <Text type='secondary'>
            {initialValues
              ? 'Cập nhật thông tin kỳ thực tập'
              : 'Nhập thông tin để tạo kỳ thực tập mới'}
          </Text>
        </Space>
      }
      width={520}
      footer={
        <Space style={{ float: 'right' }}>
          <Button onClick={onCancel}>Hủy</Button>
          <Button type='primary' loading={loading} onClick={handleSubmit}>
            {initialValues ? 'Cập nhật' : 'Tạo'}
          </Button>
        </Space>
      }
    >
      <Form form={form} layout='vertical' name='termForm' requiredMark={false} autoComplete='off'>
        <Form.Item
          label='Tên kỳ thực tập'
          name='name'
          rules={[
            { required: true, message: 'Vui lòng nhập tên kỳ thực tập' },
            { max: 100, message: 'Không quá 100 ký tự' },
          ]}
        >
          <Input placeholder='VD: Kỳ thực tập Xuân 2026' />
        </Form.Item>

        <Form.Item label='Ngày bắt đầu' name='startDate' rules={[{ required: true }]}>
          <DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' />
        </Form.Item>

        <Form.Item
          label='Ngày kết thúc'
          name='endDate'
          dependencies={['startDate']}
          rules={[
            { required: true },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (
                  !value ||
                  !getFieldValue('startDate') ||
                  value.isAfter(getFieldValue('startDate'))
                ) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Ngày kết thúc phải sau ngày bắt đầu'));
              },
            }),
          ]}
        >
          <DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' />
        </Form.Item>

        {!initialValues && (
          <Form.Item label='Trạng thái' name='status' rules={[{ required: true }]}>
            <Select
              options={[
                { value: 0, label: 'Nháp (Draft)' },
                { value: 1, label: 'Kích hoạt ngay' },
              ]}
            />
          </Form.Item>
        )}
      </Form>
    </Drawer>
  );
});

export default TermFormDrawer;

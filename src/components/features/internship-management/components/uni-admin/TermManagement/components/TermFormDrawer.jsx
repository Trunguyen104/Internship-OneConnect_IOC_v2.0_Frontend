'use client';

import React, { memo, useEffect } from 'react';
import { Form, Input, DatePicker, Select, Drawer, Button, Space, Typography, Divider } from 'antd';
import {
  CalendarOutlined,
  PlusCircleOutlined,
  EditOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

const { Title, Text } = Typography;

const TermFormDrawer = memo(function TermFormDrawer({
  visible,
  onCancel,
  onSave,
  loading,
  initialValues,
}) {
  const [form] = Form.useForm();
  const { FORM } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN.TERM_MANAGEMENT.MODALS;

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
      title={null}
      width={480}
      footer={null}
      className='premium-drawer'
    >
      <div className='flex h-full flex-col'>
        {/* Header */}
        <div className='mb-6 flex flex-col items-center gap-3 text-center'>
          <div className='bg-primary/10 flex size-14 items-center justify-center rounded-2xl'>
            {initialValues ? (
              <EditOutlined className='text-primary text-3xl' />
            ) : (
              <PlusCircleOutlined className='text-primary text-3xl' />
            )}
          </div>
          <div>
            <Title level={4} className='text-text mb-1'>
              {initialValues ? FORM.TITLE_EDIT : FORM.TITLE_ADD}
            </Title>
            <Text className='text-muted text-xs italic'>
              {initialValues
                ? 'Cập nhật thông tin chi tiết đợt thực tập'
                : 'Vui lòng cung cấp thông tin để tạo đợt mới'}
            </Text>
          </div>
        </div>

        <Divider className='border-border m-0' />

        {/* Form Body */}
        <div className='flex-1 py-8'>
          <Form form={form} layout='vertical' autoComplete='off' className='space-y-5'>
            <Form.Item
              label={<span className='text-text font-semibold'>{FORM.NAME_LABEL}</span>}
              name='name'
              rules={[
                { required: true, message: 'Vui lòng nhập tên đợt thực tập' },
                { max: 100, message: 'Tên đợt tối đa 100 ký tự' },
              ]}
            >
              <Input
                prefix={<InfoCircleOutlined className='text-muted' />}
                placeholder={FORM.NAME_PLACEHOLDER}
                className='bg-surface border-border h-11 rounded-xl'
              />
            </Form.Item>

            <div className='grid grid-cols-2 gap-4'>
              <Form.Item
                label={<span className='text-text font-semibold'>Ngày bắt đầu</span>}
                name='startDate'
                rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
              >
                <DatePicker
                  placeholder='Chọn ngày'
                  suffixIcon={<CalendarOutlined className='text-muted' />}
                  style={{ width: '100%' }}
                  format='DD/MM/YYYY'
                  className='bg-surface border-border h-11 rounded-xl'
                />
              </Form.Item>

              <Form.Item
                label={<span className='text-text font-semibold'>Ngày kết thúc</span>}
                name='endDate'
                dependencies={['startDate']}
                rules={[
                  { required: true, message: 'Vui lòng chọn ngày kết thúc' },
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
                <DatePicker
                  placeholder='Chọn ngày'
                  suffixIcon={<CalendarOutlined className='text-muted' />}
                  style={{ width: '100%' }}
                  format='DD/MM/YYYY'
                  className='bg-surface border-border h-11 rounded-xl'
                />
              </Form.Item>
            </div>

            {!initialValues && (
              <Form.Item
                label={<span className='text-text font-semibold'>Trạng thái khởi tạo</span>}
                name='status'
                rules={[{ required: true }]}
              >
                <Select
                  className='h-11'
                  options={[
                    { value: 0, label: 'Lưu dưới dạng Bản nháp' },
                    { value: 1, label: 'Kích hoạt ngay lập tức' },
                  ]}
                />
              </Form.Item>
            )}
          </Form>
        </div>

        {/* Footer */}
        <div className='border-border mt-auto flex gap-3 border-t pt-6'>
          <Button
            onClick={onCancel}
            className='border-border h-11 flex-1 rounded-xl font-semibold transition-all hover:bg-slate-50'
          >
            {FORM.CANCEL}
          </Button>
          <Button
            type='primary'
            loading={loading}
            onClick={handleSubmit}
            className='bg-primary h-11 flex-1 rounded-xl border-none font-bold shadow-md transition-all hover:scale-105 active:scale-95'
          >
            {FORM.SUBMIT}
          </Button>
        </div>
      </div>
    </Drawer>
  );
});

export default TermFormDrawer;

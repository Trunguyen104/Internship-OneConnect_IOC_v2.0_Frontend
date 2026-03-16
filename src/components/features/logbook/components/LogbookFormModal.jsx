'use client';

import React, { memo } from 'react';
import { Modal, Form, DatePicker, Input, Button, Typography, Divider, Space } from 'antd';
import {
  PlusCircleOutlined,
  EditOutlined,
  CalendarOutlined,
  SendOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { DAILY_REPORT_UI } from '@/constants/dailyReport/uiText';

const { TextArea } = Input;
const { Title, Text } = Typography;

const LogbookFormModal = memo(function LogbookFormModal({
  visible,
  editingId,
  onSubmit,
  onCancel,
  submitting,
  initialValues,
}) {
  const { MODAL, FORM } = DAILY_REPORT_UI;
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue({
          dateReport: initialValues.dateReport ? dayjs(initialValues.dateReport) : null,
          summary: initialValues.summary,
          issue: initialValues.issue,
          plan: initialValues.plan,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialValues, form]);

  return (
    <Modal
      open={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      footer={null}
      width={520}
      centered
      destroyOnHidden
      title={
        <Space className='mb-2'>
          {editingId ? (
            <EditOutlined className='text-primary' />
          ) : (
            <PlusCircleOutlined className='text-primary' />
          )}
          <span>{editingId ? MODAL.EDIT_TITLE : MODAL.CREATE_TITLE}</span>
        </Space>
      }
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={onSubmit}
        className='mt-4'
        requiredMark='optional'
      >
        <Form.Item
          label={FORM.REPORT_DATE}
          name='dateReport'
          rules={[{ required: true, message: FORM.VALIDATION.DATE_REQUIRED }]}
        >
          <DatePicker
            placeholder='Chọn ngày'
            className='w-full'
            format='DD/MM/YYYY'
            disabledDate={(current) => current && current > dayjs().endOf('day')}
          />
        </Form.Item>

        <Form.Item
          label={FORM.SUMMARY}
          name='summary'
          rules={[
            { required: true, message: FORM.VALIDATION.SUMMARY_REQUIRED },
            { min: 10, message: FORM.VALIDATION.SUMMARY_MIN },
            { max: 200, message: FORM.VALIDATION.SUMMARY_MAX },
          ]}
        >
          <TextArea rows={4} placeholder={FORM.PLACEHOLDER_SUMMARY} />
        </Form.Item>

        <Form.Item
          label={FORM.ISSUE}
          name='issue'
          rules={[{ max: 200, message: FORM.VALIDATION.ISSUE_MAX }]}
        >
          <TextArea rows={2} placeholder={FORM.PLACEHOLDER_ISSUE} />
        </Form.Item>

        <Form.Item
          label={FORM.PLAN}
          name='plan'
          rules={[
            { required: true, message: FORM.VALIDATION.PLAN_REQUIRED },
            { max: 200, message: FORM.VALIDATION.PLAN_MAX },
          ]}
        >
          <TextArea rows={3} placeholder={FORM.PLACEHOLDER_PLAN} />
        </Form.Item>

        <div className='mt-6 flex justify-end gap-3'>
          <Button
            onClick={() => {
              form.resetFields();
              onCancel();
            }}
          >
            {MODAL.CANCEL}
          </Button>
          <Button type='primary' htmlType='submit' loading={submitting} icon={<SendOutlined />}>
            {editingId ? MODAL.SAVE : MODAL.SUBMIT}
          </Button>
        </div>
      </Form>
    </Modal>
  );
});

export default LogbookFormModal;

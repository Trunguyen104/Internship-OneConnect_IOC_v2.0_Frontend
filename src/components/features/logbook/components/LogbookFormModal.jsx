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
  form,
}) {
  const { MODAL, FORM } = DAILY_REPORT_UI;

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      centered
      destroyOnClose
      className='modal-custom'
    >
      <div className='mb-6 flex flex-col items-center gap-3 text-center'>
        <div className='bg-primary/10 flex size-14 items-center justify-center rounded-2xl'>
          {editingId ? (
            <EditOutlined className='text-primary text-3xl' />
          ) : (
            <PlusCircleOutlined className='text-primary text-3xl' />
          )}
        </div>
        <div>
          <Title level={4} className='text-text mb-1'>
            {editingId ? MODAL.EDIT_TITLE : MODAL.CREATE_TITLE}
          </Title>
          <Text className='text-muted text-xs italic'>
            {editingId ? MODAL.EDIT_DESC : MODAL.CREATE_DESC}
          </Text>
        </div>
      </div>

      <Divider className='border-border m-0' />

      <Form form={form} layout='vertical' onFinish={onSubmit} className='mt-8 space-y-4 px-2'>
        <Form.Item
          label={<span className='text-text font-semibold'>{FORM.REPORT_DATE}</span>}
          name='dateReport'
          rules={[{ required: true, message: 'Vui lòng chọn ngày báo cáo' }]}
        >
          <DatePicker
            placeholder='Chọn ngày'
            suffixIcon={<CalendarOutlined className='text-muted' />}
            className='bg-surface border-border hover:border-primary h-11 w-full rounded-xl transition-all'
            format='DD/MM/YYYY'
            disabledDate={(current) => current && current > dayjs().endOf('day')}
          />
        </Form.Item>

        <Form.Item
          label={<span className='text-text font-semibold'>{FORM.SUMMARY}</span>}
          name='summary'
          rules={[
            { required: true, message: 'Vui lòng nhập tóm tắt công việc' },
            { min: 10, message: 'Tóm tắt cần ít nhất 10 ký tự' },
          ]}
        >
          <TextArea
            rows={4}
            placeholder={FORM.PLACEHOLDER_SUMMARY}
            className='bg-surface border-border hover:border-primary rounded-xl transition-all'
          />
        </Form.Item>

        <Form.Item
          label={<span className='text-text font-semibold'>{FORM.ISSUE}</span>}
          name='issue'
        >
          <TextArea
            rows={2}
            placeholder={FORM.PLACEHOLDER_ISSUE}
            className='bg-surface border-border hover:border-primary rounded-xl border-dashed transition-all'
          />
        </Form.Item>

        <Form.Item
          label={<span className='text-text font-semibold'>{FORM.PLAN}</span>}
          name='plan'
          rules={[{ required: true, message: 'Vui lòng nhập kế hoạch' }]}
        >
          <TextArea
            rows={3}
            placeholder={FORM.PLACEHOLDER_PLAN}
            className='bg-surface border-border hover:border-primary rounded-xl transition-all'
          />
        </Form.Item>

        <Space className='mt-8 flex w-full justify-end gap-3 pb-2'>
          <Button
            onClick={onCancel}
            className='border-border h-11 rounded-xl px-8 font-semibold transition-all hover:bg-slate-50'
          >
            {MODAL.CANCEL}
          </Button>

          <Button
            type='primary'
            htmlType='submit'
            loading={submitting}
            icon={<SendOutlined />}
            className='bg-primary h-11 rounded-xl border-none px-8 font-semibold shadow-md transition-all hover:scale-105 active:scale-95'
          >
            {editingId ? MODAL.SAVE : MODAL.SUBMIT}
          </Button>
        </Space>
      </Form>
    </Modal>
  );
});

export default LogbookFormModal;

'use client';

import { Modal, Form, DatePicker, Input, Button } from 'antd';
import dayjs from 'dayjs';
import { DAILY_REPORT_UI } from '@/constants/dailyReport/uiText';

const { TextArea } = Input;

export default function LogbookFormModal({
  visible,
  editingId,
  onSubmit,
  onCancel,
  submitting,
  form,
}) {
  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      centered
      title={
        <h2 className='text-xl font-semibold text-gray-800'>
          {editingId ? DAILY_REPORT_UI.MODAL.EDIT_TITLE : DAILY_REPORT_UI.MODAL.CREATE_TITLE}
        </h2>
      }
    >
      <Form form={form} layout='vertical' onFinish={onSubmit} className='space-y-2'>
        <Form.Item
          label='Report Date'
          name='dateReport'
          rules={[{ required: true, message: 'Please select report date' }]}
        >
          <DatePicker
            className='w-full rounded-md'
            format='DD/MM/YYYY'
            disabledDate={(current) => current && current > dayjs().endOf('day')}
          />
        </Form.Item>

        <Form.Item
          label={DAILY_REPORT_UI.FORM.SUMMARY}
          name='summary'
          rules={[
            { required: true, message: 'Please enter summary' },
            { min: 10, message: 'Minimum 10 characters' },
            { max: 200, message: 'Maximum 200 characters' },
          ]}
        >
          <TextArea
            rows={4}
            placeholder={DAILY_REPORT_UI.FORM.PLACEHOLDER_SUMMARY}
            className='rounded-md'
          />
        </Form.Item>

        <Form.Item
          label={DAILY_REPORT_UI.FORM.ISSUE}
          name='issue'
          rules={[{ max: 200, message: 'Maximum 200 characters' }]}
        >
          <TextArea
            rows={2}
            placeholder={DAILY_REPORT_UI.FORM.PLACEHOLDER_ISSUE}
            className='rounded-md'
          />
        </Form.Item>

        <Form.Item
          label={DAILY_REPORT_UI.FORM.PLAN}
          name='plan'
          rules={[
            { required: true, message: 'Please enter next plan' },
            { max: 200, message: 'Maximum 200 characters' },
          ]}
        >
          <TextArea
            rows={3}
            placeholder={DAILY_REPORT_UI.FORM.PLACEHOLDER_PLAN}
            className='rounded-md'
          />
        </Form.Item>

        <div className='flex justify-end gap-3 border-t pt-4'>
          <Button onClick={onCancel}>{DAILY_REPORT_UI.MODAL.CANCEL}</Button>

          <Button
            type='primary'
            loading={submitting}
            onClick={() => form.submit()}
            className='bg-blue-600 hover:bg-blue-700'
          >
            {editingId ? DAILY_REPORT_UI.MODAL.SAVE : DAILY_REPORT_UI.MODAL.SUBMIT}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

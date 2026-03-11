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
      destroyOnHidden
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
          label='Summary'
          name='summary'
          rules={[
            { required: true, message: 'Please enter summary' },
            { min: 10, message: 'Minimum 10 characters' },
          ]}
        >
          <TextArea rows={4} placeholder='Describe your work today...' className='rounded-md' />
        </Form.Item>

        <Form.Item label='Issue' name='issue'>
          <TextArea rows={2} placeholder='Problems encountered (optional)' className='rounded-md' />
        </Form.Item>

        <Form.Item
          label='Plan'
          name='plan'
          rules={[{ required: true, message: 'Please enter next plan' }]}
        >
          <TextArea rows={3} placeholder='Plan for next working day...' className='rounded-md' />
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


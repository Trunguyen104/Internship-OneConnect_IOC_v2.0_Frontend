'use client';

import { CalendarOutlined, EditOutlined } from '@ant-design/icons';
import { DatePicker, Form, Input } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

import CompoundModal from '@/components/ui/CompoundModal';
import { EVALUATION_UI } from '@/constants/evaluation/evaluation';

export default function CycleDialog({
  open,
  onOpenChange,
  onSave,
  initialData = null,
  termDates = null,
}) {
  const [form] = Form.useForm();
  const { LABELS, BUTTONS, MESSAGES } = EVALUATION_UI;

  // Reset form data when dialog opens
  React.useEffect(() => {
    if (open) {
      if (initialData) {
        form.setFieldsValue({
          name: initialData.name,
          startDate: initialData.startDate ? dayjs(initialData.startDate) : null,
          endDate: initialData.endDate ? dayjs(initialData.endDate) : null,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, initialData, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
        status: initialData?.status ?? 1,
      };

      const success = await onSave(payload);
      if (success) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const disabledStartDate = (current) => {
    if (!termDates) return false;
    return (
      current &&
      (current.isBefore(dayjs(termDates.startDate), 'day') ||
        current.isAfter(dayjs(termDates.endDate), 'day'))
    );
  };

  const disabledEndDate = (current) => {
    const startDate = form.getFieldValue('startDate');
    if (!termDates) {
      if (startDate) {
        return current && current.isBefore(dayjs(startDate), 'day');
      }
      return false;
    }

    const termStart = dayjs(termDates.startDate);
    const termEnd = dayjs(termDates.endDate);
    const cycleStart = startDate ? dayjs(startDate) : termStart;

    return current && (current.isBefore(cycleStart, 'day') || current.isAfter(termEnd, 'day'));
  };

  return (
    <CompoundModal
      open={open}
      onCancel={() => onOpenChange(false)}
      width={500}
      className="premium-modal"
    >
      <CompoundModal.Header
        icon={<CalendarOutlined />}
        title={initialData ? BUTTONS.EDIT : BUTTONS.CREATE_CYCLE}
        subtitle={LABELS.CYCLE_TITLE}
      />

      <Form
        form={form}
        layout="vertical"
        id="cycle-form"
        onFinish={handleSave}
        requiredMark={false}
        className="space-y-6 pt-6 pb-2 animate-in fade-in slide-in-from-bottom-4 duration-500"
      >
        {/* Cycle Name Section */}
        <Form.Item
          label={
            <span className="text-[10px] font-black text-muted/60 uppercase tracking-widest ml-1 flex items-center gap-2">
              <EditOutlined className="text-[12px]" />
              {LABELS.CYCLE_NAME}
            </span>
          }
          name="name"
          rules={[{ required: true, message: MESSAGES.NAME_REQUIRED }]}
        >
          <Input
            placeholder={LABELS.CYCLE_NAME}
            size="large"
            className="h-12 rounded-xl border-gray-100 bg-gray-50/30 font-bold text-sm focus:bg-white transition-all hover:border-primary/30"
          />
        </Form.Item>

        {/* Date Range Section */}
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label={
              <span className="text-[10px] font-black text-muted/60 uppercase tracking-widest ml-1 flex items-center gap-2">
                {LABELS.START_DATE}
              </span>
            }
            name="startDate"
            rules={[{ required: true, message: MESSAGES.VALIDATION_ERROR }]}
          >
            <DatePicker
              className="w-full h-12 rounded-xl border-gray-100 bg-gray-50/30 font-bold text-sm transition-all hover:bg-white hover:border-primary/30"
              disabledDate={disabledStartDate}
              getPopupContainer={(trigger) => trigger.parentElement}
              format="DD/MM/YYYY"
              placeholder={LABELS.PICK_START}
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-[10px] font-black text-muted/60 uppercase tracking-widest ml-1 flex items-center gap-2">
                {LABELS.END_DATE}
              </span>
            }
            name="endDate"
            rules={[
              { required: true, message: MESSAGES.VALIDATION_ERROR },
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
            <DatePicker
              className="w-full h-12 rounded-xl border-gray-100 bg-gray-50/30 font-bold text-sm transition-all hover:bg-white hover:border-primary/30"
              disabledDate={disabledEndDate}
              getPopupContainer={(trigger) => trigger.parentElement}
              format="DD/MM/YYYY"
              placeholder={LABELS.PICK_END}
            />
          </Form.Item>
        </div>
      </Form>

      <CompoundModal.Footer
        onCancel={() => onOpenChange(false)}
        onSubmit={() => form.submit()}
        cancelText={BUTTONS.CANCEL}
        confirmText={BUTTONS.SAVE}
      />
    </CompoundModal>
  );
}

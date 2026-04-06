'use client';

import { PlusCircleOutlined } from '@ant-design/icons';
import { DatePicker, Form, Input } from 'antd';
import React, { memo } from 'react';

import { Button } from '@/components/ui/button';
import CompoundModal from '@/components/ui/CompoundModal';
import { PUBLIC_HOLIDAY_UI } from '@/constants/publicHoliday/uiText';

const PublicHolidayFormModal = memo(function PublicHolidayFormModal({
  visible,
  onCancel,
  onSubmit,
  submitting,
}) {
  const [form] = Form.useForm();
  const { MODAL, FORM } = PUBLIC_HOLIDAY_UI;

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleFinish = async (values) => {
    const payload = {
      date: values.date.format('YYYY-MM-DD'),
      description: values.description,
    };
    await onSubmit(payload);
    form.resetFields();
  };

  return (
    <CompoundModal
      open={visible}
      onCancel={handleCancel}
      width={500}
      title={MODAL.CREATE_TITLE}
      description={MODAL.CREATE_DESC}
      icon={<PlusCircleOutlined />}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="mt-4 space-y-6"
        requiredMark="optional"
      >
        <Form.Item
          label={
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted/50">
              {FORM.DATE}
            </span>
          }
          name="date"
          rules={[{ required: true, message: FORM.VALIDATION.DATE_REQUIRED }]}
        >
          <DatePicker
            placeholder={FORM.PLACEHOLDER_DATE}
            className="h-12 w-full rounded-2xl border-gray-100 font-bold hover:border-primary focus:border-primary transition-all shadow-sm"
            format="DD/MM/YYYY"
          />
        </Form.Item>

        <Form.Item
          label={
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted/50">
              {FORM.DESCRIPTION}
            </span>
          }
          name="description"
          rules={[{ max: 200, message: FORM.VALIDATION.DESC_MAX }]}
        >
          <Input
            placeholder={FORM.PLACEHOLDER_DESC}
            className="h-12 w-full rounded-2xl border-gray-100 font-bold px-4 shadow-sm transition-all hover:border-primary focus:border-primary"
          />
        </Form.Item>

        <div className="mt-10 flex justify-end gap-3 pt-6 border-t border-gray-50">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="px-8 h-12 rounded-full font-black uppercase tracking-widest text-[11px] hover:bg-gray-100 transition-all"
          >
            {MODAL.CANCEL}
          </Button>
          <Button
            variant="primary"
            type="submit"
            loading={submitting}
            className="rounded-full h-12 px-10 font-black uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            {MODAL.SUBMIT}
          </Button>
        </div>
      </Form>
    </CompoundModal>
  );
});

export default PublicHolidayFormModal;

'use client';

import { EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { DatePicker, Form, Input } from 'antd';
import dayjs from 'dayjs';
import React, { memo } from 'react';

import { Button } from '@/components/ui/button';
import CompoundModal from '@/components/ui/CompoundModal';
import { DAILY_REPORT_UI } from '@/constants/dailyReport/uiText';

const { TextArea } = Input;

const LogbookFormModal = memo(function LogbookFormModal({
  visible,
  editingId,
  onSubmit,
  onCancel,
  submitting,
  initialValues,
}) {
  const { FORM, MODAL } = DAILY_REPORT_UI;
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (initialValues && visible) {
      const reportDate =
        initialValues.dateReport ||
        initialValues.reportDate ||
        initialValues.createdAt ||
        initialValues.date;

      form.setFieldsValue({
        dateReport: reportDate ? dayjs(reportDate) : null,
        summary: initialValues.summary,
        issue: initialValues.issue,
        plan: initialValues.plan,
      });
    } else if (visible) {
      form.resetFields();
    }
  }, [initialValues, form, visible]);

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <CompoundModal
      open={visible}
      onCancel={handleCancel}
      width={500}
      title={editingId ? MODAL.EDIT_TITLE : MODAL.CREATE_TITLE}
      description={editingId ? MODAL.EDIT_DESC : MODAL.CREATE_DESC}
      icon={editingId ? <EditOutlined /> : <PlusCircleOutlined />}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        className="mt-2 space-y-3"
        requiredMark="optional"
      >
        <div className="grid grid-cols-1 gap-3">
          <Form.Item
            label={
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                {FORM.REPORT_DATE}
              </span>
            }
            name="dateReport"
            rules={[{ required: true, message: FORM.VALIDATION.DATE_REQUIRED }]}
          >
            <DatePicker
              placeholder={FORM.PLACEHOLDER_DATE}
              className="h-12 w-full rounded-2xl border-gray-100 font-bold hover:border-primary focus:border-primary transition-all shadow-sm"
              format={DAILY_REPORT_UI.DATE_FORMAT}
              disabledDate={(current) => current && current > dayjs().endOf('day')}
              disabled={!!editingId}
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                {FORM.SUMMARY}
              </span>
            }
            name="summary"
            rules={[
              { required: true, message: FORM.VALIDATION.SUMMARY_REQUIRED },
              { min: 10, message: FORM.VALIDATION.SUMMARY_MIN },
              { max: 500, message: FORM.VALIDATION.SUMMARY_MAX },
            ]}
          >
            <TextArea
              rows={2}
              placeholder={FORM.PLACEHOLDER_SUMMARY}
              className="rounded-2xl border-gray-100 font-bold p-4 shadow-sm transition-all hover:border-primary focus:border-primary"
            />
          </Form.Item>

          <div className="grid grid-cols-1 gap-3">
            <Form.Item
              label={
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  {FORM.ISSUE}
                </span>
              }
              name="issue"
              rules={[{ max: 500, message: FORM.VALIDATION.ISSUE_MAX }]}
            >
              <TextArea
                rows={2}
                placeholder={FORM.PLACEHOLDER_ISSUE}
                className="rounded-2xl border-gray-100 font-bold p-4 shadow-sm transition-all hover:border-primary focus:border-primary"
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  {FORM.PLAN}
                </span>
              }
              name="plan"
              rules={[
                { required: true, message: FORM.VALIDATION.PLAN_REQUIRED },
                { max: 500, message: FORM.VALIDATION.PLAN_MAX },
              ]}
            >
              <TextArea
                rows={2}
                placeholder={FORM.PLACEHOLDER_PLAN}
                className="rounded-2xl border-gray-100 font-bold p-4 shadow-sm transition-all hover:border-primary focus:border-primary"
              />
            </Form.Item>
          </div>
        </div>

        <div className="mt-10 flex justify-end gap-3 mt-[-2] border-t border-gray-50">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="px-8 h-9 rounded-full font-black uppercase tracking-widest text-[11px] hover:bg-gray-100 transition-all"
          >
            {DAILY_REPORT_UI.MODAL.CANCEL}
          </Button>
          <Button
            variant="primary"
            type="submit"
            loading={submitting}
            className="rounded-full h-9 px-10 font-black uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            {editingId ? DAILY_REPORT_UI.MODAL.SAVE : DAILY_REPORT_UI.MODAL.SUBMIT}
          </Button>
        </div>
      </Form>
    </CompoundModal>
  );
});

export default LogbookFormModal;

import { DatePicker, Form, Input } from 'antd';
import dayjs from 'dayjs';
import { Calendar, ClipboardList, Edit3, PlusCircle, ShieldAlert, TrendingUp } from 'lucide-react';
import React, { memo } from 'react';

import { Button } from '@/components/ui/button';
import CompoundModal from '@/components/ui/CompoundModal';
import { DAILY_REPORT_UI } from '@/constants/dailyReport/uiText';

const { TextArea } = Input;

/**
 * Field Label Component with Icon for consistent UI
 */
const FieldLabel = ({ icon: Icon, label, required = false }) => (
  <div className="mb-2 flex items-center gap-2">
    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
      <Icon className="size-3.5" />
    </div>
    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
      {label}
      {required && <span className="ml-1 text-rose-500">*</span>}
    </span>
  </div>
);

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
      width={600}
      title={editingId ? MODAL.EDIT_TITLE : MODAL.CREATE_TITLE}
      description={editingId ? MODAL.EDIT_DESC : MODAL.CREATE_DESC}
      icon={editingId ? <Edit3 className="size-5" /> : <PlusCircle className="size-5" />}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        className="mt-4 px-2"
        requiredMark={false}
      >
        <div className="space-y-6">
          <Form.Item
            label={<FieldLabel icon={Calendar} label={FORM.REPORT_DATE} required />}
            name="dateReport"
            rules={[{ required: true, message: FORM.VALIDATION.DATE_REQUIRED }]}
          >
            <DatePicker
              placeholder={FORM.PLACEHOLDER_DATE}
              className="h-11 w-full rounded-xl border-slate-200 font-semibold hover:border-primary focus:border-primary transition-all"
              format={DAILY_REPORT_UI.DATE_FORMAT}
              disabledDate={(current) => current && current > dayjs().endOf('day')}
              disabled={!!editingId}
            />
          </Form.Item>

          <Form.Item
            label={<FieldLabel icon={ClipboardList} label={FORM.SUMMARY} required />}
            name="summary"
            rules={[
              { required: true, message: FORM.VALIDATION.SUMMARY_REQUIRED },
              { min: 10, message: FORM.VALIDATION.SUMMARY_MIN },
              { max: 200, message: FORM.VALIDATION.SUMMARY_MAX },
            ]}
          >
            <TextArea
              rows={3}
              maxLength={200}
              placeholder={FORM.PLACEHOLDER_SUMMARY}
              className="rounded-xl border-slate-200 font-medium p-3 transition-all hover:border-primary focus:border-primary !bg-slate-50/30"
            />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              label={<FieldLabel icon={ShieldAlert} label={FORM.ISSUE} />}
              name="issue"
              rules={[{ max: 200, message: FORM.VALIDATION.ISSUE_MAX }]}
            >
              <TextArea
                rows={3}
                maxLength={200}
                placeholder={FORM.PLACEHOLDER_ISSUE}
                className="rounded-xl border-slate-200 font-medium p-3 transition-all hover:border-primary focus:border-primary !bg-slate-50/30"
              />
            </Form.Item>

            <Form.Item
              label={<FieldLabel icon={TrendingUp} label={FORM.PLAN} required />}
              name="plan"
              rules={[
                { required: true, message: FORM.VALIDATION.PLAN_REQUIRED },
                { max: 200, message: FORM.VALIDATION.PLAN_MAX },
              ]}
            >
              <TextArea
                rows={3}
                maxLength={200}
                placeholder={FORM.PLACEHOLDER_PLAN}
                className="rounded-xl border-slate-200 font-medium p-3 transition-all hover:border-primary focus:border-primary !bg-slate-50/30"
              />
            </Form.Item>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="px-6 h-10 rounded-xl font-bold uppercase tracking-wider text-[11px] text-slate-500 hover:text-slate-800 transition-all"
          >
            {DAILY_REPORT_UI.MODAL.CANCEL}
          </Button>
          <Button
            variant="primary"
            type="submit"
            loading={submitting}
            className="rounded-xl h-10 px-8 font-bold uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 bg-gradient-to-r from-primary to-primary-focus border-none"
          >
            {editingId ? DAILY_REPORT_UI.MODAL.SAVE : DAILY_REPORT_UI.MODAL.SUBMIT}
          </Button>
        </div>
      </Form>
    </CompoundModal>
  );
});

export default LogbookFormModal;

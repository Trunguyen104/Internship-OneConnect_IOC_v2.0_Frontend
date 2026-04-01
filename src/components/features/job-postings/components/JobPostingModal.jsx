'use client';

import { App, Col, Form, Row } from 'antd';
import React, { useMemo } from 'react';

import CompoundModal from '@/components/ui/CompoundModal';
import DatePicker from '@/components/ui/datepicker';
import Input from '@/components/ui/input';
import { RadioGroup } from '@/components/ui/radio';
import Select from '@/components/ui/select';
import Textarea from '@/components/ui/textarea';
import TiptapEditor from '@/components/ui/tiptapeditor';

import { JOB_AUDIENCE, JOB_POSTING_UI } from '../constants/job-postings.constant';
import { useJobPostingActions } from '../hooks/useJobPostings';

export default function JobPostingModal({ open, onCancel, record = null, phases = [], onSuccess }) {
  const { modal: modalApi } = App.useApp();
  const [form] = Form.useForm();
  const isEdit = !!record;
  const actions = useJobPostingActions();

  const activeAppCount = useMemo(() => {
    if (!record) return 0;
    return (record.applicationStatusCounts || [])
      .filter((item) => [1, 2, 3].includes(item.status)) // Applied, Interviewing, Offered
      .reduce((sum, item) => sum + item.count, 0);
  }, [record]);

  const phaseOptions = phases.map((p) => ({
    label: p.name,
    value: p.phaseId,
    startDate: p.startDate,
    endDate: p.endDate,
  }));

  const handlePhaseChange = (value) => {
    if (isEdit && activeAppCount > 0 && value !== record.internshipPhaseId) {
      modalApi.error({
        title: JOB_POSTING_UI.FORM.MODALS.CHANGE_BLOCKED.TITLE,
        content: JOB_POSTING_UI.FORM.MODALS.CHANGE_BLOCKED.CONTENT(activeAppCount),
        centered: true,
      });
      form.setFieldsValue({ internshipPhaseId: record.internshipPhaseId });
      return;
    }

    const phase = phaseOptions.find((p) => p.value === value);
    if (phase) {
      form.setFieldsValue({
        startDate: phase.startDate,
        endDate: phase.endDate,
      });
    }
  };

  const submitData = async (values, isDraft = false) => {
    if (isEdit) {
      if (isDraft) {
        await actions.saveDraft.mutateAsync({ ...values, jobId: record.jobId });
      } else {
        await actions.updateJob.mutateAsync({ id: record.jobId, data: values });
      }
    } else {
      if (isDraft) {
        await actions.saveDraft.mutateAsync(values);
      } else {
        await actions.createJob.mutateAsync(values);
      }
    }
    onSuccess?.();
    form.resetFields();
  };

  const handlePublish = async () => {
    try {
      const values = await form.validateFields();

      if (isEdit && activeAppCount > 0) {
        modalApi.confirm({
          title: JOB_POSTING_UI.FORM.MODALS.CONFIRM_UPDATE.TITLE,
          content: JOB_POSTING_UI.FORM.MODALS.CONFIRM_UPDATE.CONTENT(activeAppCount),
          centered: true,
          onOk: () => submitData(values),
        });
      } else {
        await submitData(values);
      }
    } catch (err) {
      console.error('Validation failed:', err);
    }
  };

  const handleSaveDraft = async () => {
    try {
      const values = form.getFieldsValue();
      await submitData(values, true);
    } catch (err) {
      console.error('Draft save failed:', err);
    }
  };

  return (
    <CompoundModal
      open={open}
      onCancel={onCancel}
      width={1200}
      title={isEdit ? JOB_POSTING_UI.FORM.EDIT_TITLE : JOB_POSTING_UI.FORM.CREATE_TITLE}
      footer={null}
      style={{ top: 20 }}
      styles={{ body: { backgroundColor: '#f9fafb', padding: 0 } }}
    >
      <Form
        form={form}
        layout="vertical"
        className="p-0"
        initialValues={{
          audience: JOB_AUDIENCE.PUBLIC,
          ...record,
        }}
      >
        <div className="flex bg-slate-50/50">
          {/* Left Column: Main Info */}
          <div className="flex-1 p-8 overflow-y-auto max-h-[85vh]">
            <div className="flex flex-col gap-6">
              {/* Header section style like the image */}
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                <Row gutter={24}>
                  <Col span={24}>
                    <Form.Item
                      label={
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {JOB_POSTING_UI.FORM.FIELDS.JOB_TITLE}
                        </span>
                      }
                      name="title"
                      rules={[
                        { required: true, message: JOB_POSTING_UI.FORM.MESSAGES.VALIDATION.TITLE },
                      ]}
                      className="mb-0"
                    >
                      <Input
                        placeholder={JOB_POSTING_UI.FORM.FIELDS.JOB_TITLE_PLACEHOLDER}
                        className="h-12 rounded-xl bg-slate-50 border-none font-bold text-slate-700 text-base"
                      />
                    </Form.Item>
                  </Col>

                  <Col span={24} className="mt-6">
                    <Form.Item
                      label={
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {JOB_POSTING_UI.FORM.FIELDS.POSITION}
                        </span>
                      }
                      name="position"
                      rules={[
                        {
                          required: true,
                          message: JOB_POSTING_UI.FORM.MESSAGES.VALIDATION.POSITION,
                        },
                      ]}
                      className="mb-0"
                    >
                      <Input
                        placeholder={JOB_POSTING_UI.FORM.FIELDS.POSITION_PLACEHOLDER}
                        className="h-12 rounded-xl bg-slate-50 border-none font-medium text-slate-600"
                      />
                    </Form.Item>
                  </Col>

                  <Col span={24} className="mt-6">
                    <Form.Item
                      label={
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {JOB_POSTING_UI.FORM.FIELDS.INTERN_PHASE}
                        </span>
                      }
                      name="internshipPhaseId"
                      rules={[
                        { required: true, message: JOB_POSTING_UI.FORM.MESSAGES.VALIDATION.PHASE },
                      ]}
                      className="mb-0"
                    >
                      <Select
                        options={phaseOptions}
                        onChange={handlePhaseChange}
                        placeholder={JOB_POSTING_UI.FORM.FIELDS.INTERN_PHASE_PLACEHOLDER}
                        className="rounded-xl! h-12 bg-slate-50 border-none font-medium text-slate-600"
                      />
                    </Form.Item>
                  </Col>

                  <Col span={24} className="mt-6">
                    <Form.Item
                      label={
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {JOB_POSTING_UI.FORM.FIELDS.LOCATION}
                        </span>
                      }
                      name="location"
                      rules={[
                        {
                          required: true,
                          message: JOB_POSTING_UI.FORM.MESSAGES.VALIDATION.LOCATION,
                        },
                      ]}
                      className="mb-0"
                    >
                      <Input
                        placeholder={JOB_POSTING_UI.FORM.FIELDS.LOCATION_PLACEHOLDER}
                        className="h-12 rounded-xl bg-slate-50 border-none font-medium text-slate-600"
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12} className="mt-6">
                    <div className="rounded-xl bg-slate-50/80 p-4 border border-slate-100">
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                        {JOB_POSTING_UI.FORM.FIELDS.START_DATE}
                      </div>
                    </div>
                  </Col>
                  <Col span={12} className="mt-6">
                    <div className="rounded-xl bg-slate-50/80 p-4 border border-slate-100">
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                        {JOB_POSTING_UI.FORM.FIELDS.END_DATE}
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Description section with clear title */}
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-5 border-b border-slate-50 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-slate-900/20">
                    {1}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">
                      {JOB_POSTING_UI.FORM.SECTIONS.ONE}
                    </span>
                    <span className="text-sm font-black uppercase tracking-[0.15em] text-slate-700 leading-none">
                      {JOB_POSTING_UI.FORM.FIELDS.DESCRIPTION}
                    </span>
                  </div>
                </div>
                <Form.Item name="description" rules={[{ required: true }]} className="mb-0">
                  <TiptapEditor />
                </Form.Item>
              </div>

              {/* Bottom twin cards */}
              <Row gutter={24}>
                <Col span={12}>
                  <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-5 border-b border-slate-50 pb-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-black text-sm">
                        {2}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">
                          {JOB_POSTING_UI.FORM.SECTIONS.TWO}
                        </span>
                        <span className="text-sm font-black uppercase tracking-[0.1em] text-slate-700 leading-none">
                          {JOB_POSTING_UI.FORM.FIELDS.REQUIREMENTS}
                        </span>
                      </div>
                    </div>
                    <Form.Item name="requirements" className="mb-0 flex-1">
                      <Textarea
                        rows={6}
                        placeholder={JOB_POSTING_UI.FORM.PLACEHOLDERS.REQUIREMENTS}
                        className="rounded-2xl border-slate-100 bg-slate-50/50"
                      />
                    </Form.Item>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-5 border-b border-slate-50 pb-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-black text-sm">
                        {3}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">
                          {JOB_POSTING_UI.FORM.SECTIONS.THREE}
                        </span>
                        <span className="text-sm font-black uppercase tracking-[0.1em] text-slate-700 leading-none">
                          {JOB_POSTING_UI.FORM.FIELDS.BENEFITS}
                        </span>
                      </div>
                    </div>
                    <Form.Item name="benefit" className="mb-0 flex-1">
                      <Textarea
                        rows={6}
                        placeholder={JOB_POSTING_UI.FORM.PLACEHOLDERS.BENEFITS}
                        className="rounded-2xl border-slate-100 bg-slate-50/50"
                      />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="w-[380px] p-8 border-l border-slate-100 bg-white/40 backdrop-blur-sm">
            <div className="flex flex-col gap-6 sticky top-8">
              {/* Deadline Card */}
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                <Form.Item
                  label={
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {JOB_POSTING_UI.FORM.FIELDS.APPLICATION_DEADLINE}
                    </span>
                  }
                  name="expireDate"
                  rules={[{ required: true }]}
                  className="mb-0"
                >
                  <DatePicker
                    className="h-12 w-full rounded-xl bg-slate-50 border-none font-bold text-slate-700"
                    placeholder={JOB_POSTING_UI.FORM.PLACEHOLDERS.SELECT_DATE}
                  />
                </Form.Item>
                <div className="mt-3 flex items-start gap-2 text-[11px] text-rose-500 font-medium leading-tight">
                  <span className="mt-0.5">
                    {JOB_POSTING_UI.FORM.MESSAGES.VALIDATION.DEADLINE_BULLET}
                  </span>
                  <span>{JOB_POSTING_UI.FORM.MESSAGES.VALIDATION.DEADLINE_TOOLTIP}</span>
                </div>
              </div>

              {/* Target Audience Card */}
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                <Form.Item
                  label={
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {JOB_POSTING_UI.FORM.FIELDS.AUDIENCE}
                    </span>
                  }
                  name="audience"
                  rules={[{ required: true }]}
                  className="mb-0"
                >
                  <RadioGroup
                    className="flex flex-col gap-5 mt-2"
                    options={[
                      {
                        label: (
                          <div className="flex flex-col -mt-0.5 ml-2">
                            <span className="font-bold text-slate-700 text-sm">
                              {JOB_POSTING_UI.FORM.REACH.PUBLIC_TITLE}
                            </span>
                          </div>
                        ),
                        value: JOB_AUDIENCE.PUBLIC,
                      },
                      {
                        label: (
                          <div className="flex flex-col -mt-0.5 ml-2 opacity-60">
                            <span className="font-bold text-slate-500 text-sm">
                              {JOB_POSTING_UI.FORM.REACH.TARGETED_TITLE}
                            </span>
                            <span className="text-[10px] text-slate-400 font-black tracking-widest uppercase">
                              {JOB_POSTING_UI.FORM.REACH.COMING_SOON}
                            </span>
                          </div>
                        ),
                        value: JOB_AUDIENCE.TARGETED,
                        disabled: true,
                      },
                    ]}
                  />
                </Form.Item>
              </div>

              {/* Action Buttons Section */}
              <div className="mt-4 flex flex-col gap-4">
                <button
                  type="button"
                  onClick={handlePublish}
                  className="w-full rounded-2xl bg-slate-900 py-4 text-xs font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-slate-900/20 transition-all hover:bg-slate-800 hover:-translate-y-1 active:translate-y-0"
                  disabled={actions.isMutating}
                >
                  {actions.isMutating
                    ? JOB_POSTING_UI.FORM.BUTTONS.PROCESSING
                    : JOB_POSTING_UI.FORM.BUTTONS.PUBLISH}
                </button>

                <div className="flex items-center gap-3 w-full">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="flex-1 rounded-2xl bg-white border border-slate-200 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 transition-all hover:bg-slate-50"
                    disabled={actions.isMutating}
                  >
                    {JOB_POSTING_UI.FORM.BUTTONS.SAVE_DRAFT}
                  </button>
                  <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 rounded-2xl bg-transparent py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all hover:text-slate-600"
                  >
                    {JOB_POSTING_UI.FORM.BUTTONS.CANCEL}
                  </button>
                </div>

                <div className="mt-2 text-center">
                  <span className="text-[10px] font-bold text-slate-300 italic">
                    {JOB_POSTING_UI.FORM.PLACEHOLDERS.DRAFT_STATUS('2 minutes')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </CompoundModal>
  );
}

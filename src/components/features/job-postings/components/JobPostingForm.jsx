'use client';

import { Col, Form, Row } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

import DatePicker from '@/components/ui/datepicker';
import Input from '@/components/ui/input';
import { RadioGroup } from '@/components/ui/radio';
import Select from '@/components/ui/select';
import Textarea from '@/components/ui/textarea';

import { JOB_AUDIENCE, JOB_POSTING_UI } from '../constants/job-postings.constant';

export const JobPostingForm = ({ form, phaseOptions, schoolOptions, audience, onPhaseChange }) => {
  const selectedPhaseId = Form.useWatch('internshipPhaseId', form);
  const selectedPhase = phaseOptions.find((o) => o.value === selectedPhaseId);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        audience: JOB_AUDIENCE.PUBLIC,
      }}
      className="px-2"
    >
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            label={JOB_POSTING_UI.FORM.FIELDS.JOB_TITLE}
            name="title"
            rules={[{ required: true, message: JOB_POSTING_UI.FORM.MESSAGES.VALIDATION.TITLE }]}
          >
            <Input placeholder={JOB_POSTING_UI.FORM.FIELDS.JOB_TITLE_PLACEHOLDER} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={JOB_POSTING_UI.FORM.FIELDS.POSITION}
            name="position"
            rules={[{ required: true, message: JOB_POSTING_UI.FORM.MESSAGES.VALIDATION.POSITION }]}
          >
            <Input placeholder={JOB_POSTING_UI.FORM.FIELDS.POSITION_PLACEHOLDER} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label={JOB_POSTING_UI.FORM.FIELDS.INTERN_PHASE}
            name="internshipPhaseId"
            rules={[{ required: true, message: JOB_POSTING_UI.FORM.MESSAGES.VALIDATION.PHASE }]}
          >
            <Select
              options={phaseOptions}
              onChange={onPhaseChange}
              placeholder={JOB_POSTING_UI.FORM.FIELDS.INTERN_PHASE_PLACEHOLDER}
              className="w-full"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={JOB_POSTING_UI.FORM.FIELDS.LOCATION}
            name="location"
            rules={[{ required: true, message: JOB_POSTING_UI.FORM.MESSAGES.VALIDATION.LOCATION }]}
          >
            <Input placeholder={JOB_POSTING_UI.FORM.FIELDS.LOCATION_PLACEHOLDER} />
          </Form.Item>
        </Col>

        {/* Phase Dates Display */}
        {selectedPhaseId && (
          <Col span={24}>
            <div className="mb-6 p-4 bg-bg rounded-lg border border-dashed border-border flex justify-between items-center">
              <div>
                <span className="text-[10px] text-muted uppercase font-bold block mb-1">
                  {JOB_POSTING_UI.FORM.FIELDS.START_DATE_LABEL}
                </span>
                <span className="font-semibold text-text">
                  {selectedPhase?.startDate
                    ? dayjs(selectedPhase.startDate).format('DD MMMM, YYYY')
                    : JOB_POSTING_UI.PLACEHOLDERS.NOT_AVAILABLE}
                </span>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-right">
                <span className="text-[10px] text-muted uppercase font-bold block mb-1">
                  {JOB_POSTING_UI.FORM.FIELDS.END_DATE_LABEL}
                </span>
                <span className="font-semibold text-text">
                  {selectedPhase?.endDate
                    ? dayjs(selectedPhase.endDate).format('DD MMMM, YYYY')
                    : JOB_POSTING_UI.PLACEHOLDERS.NOT_AVAILABLE}
                </span>
              </div>
            </div>
          </Col>
        )}

        <Col span={24}>
          <Form.Item
            label={JOB_POSTING_UI.FORM.FIELDS.APPLICATION_DEADLINE}
            name="expireDate"
            rules={[
              { required: true, message: JOB_POSTING_UI.FORM.MESSAGES.VALIDATION.DEADLINE },
              () => ({
                validator(_, value) {
                  if (!value) return Promise.resolve();
                  const today = dayjs().startOf('day');
                  if (value.isBefore(today))
                    return Promise.reject(
                      new Error(JOB_POSTING_UI.FORM.MESSAGES.VALIDATION.DEADLINE_EXPIRED)
                    );

                  if (selectedPhase) {
                    const startDate = dayjs(selectedPhase.startDate);
                    const endDate = dayjs(selectedPhase.endDate);
                    const isStarted = today.isAfter(startDate);
                    const deadlineBound = isStarted ? endDate : startDate;
                    if (value.isAfter(deadlineBound)) {
                      return Promise.reject(
                        new Error(JOB_POSTING_UI.FORM.MESSAGES.VALIDATION.DEADLINE_FOR_REOPEN)
                      );
                    }
                  }
                  return Promise.resolve();
                },
              }),
            ]}
            extra={
              <span className="text-[10px] text-muted">
                {JOB_POSTING_UI.FORM.MESSAGES.VALIDATION.DEADLINE_TOOLTIP}
              </span>
            }
          >
            <DatePicker
              className="w-full"
              placeholder={JOB_POSTING_UI.PLACEHOLDERS.SELECT_DATE}
              disabledDate={(current) => {
                const today = dayjs().startOf('day');

                // Disable past dates
                if (current && current < today) return true;

                if (selectedPhase) {
                  const startDate = dayjs(selectedPhase.startDate);
                  const endDate = dayjs(selectedPhase.endDate);
                  const isStarted = today.isAfter(startDate);
                  const deadlineBound = isStarted ? endDate : startDate;
                  if (current && current.isAfter(deadlineBound)) return true;
                }

                return false;
              }}
            />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            label={JOB_POSTING_UI.FORM.FIELDS.AUDIENCE}
            name="audience"
            rules={[{ required: true }]}
          >
            <RadioGroup
              options={[
                { label: JOB_POSTING_UI.FORM.REACH.PUBLIC_TITLE, value: JOB_AUDIENCE.PUBLIC },
                { label: JOB_POSTING_UI.FORM.REACH.TARGETED_TITLE, value: JOB_AUDIENCE.TARGETED },
              ]}
            />
          </Form.Item>
        </Col>

        {audience === JOB_AUDIENCE.TARGETED && (
          <Col span={24}>
            <Form.Item
              label={JOB_POSTING_UI.FORM.FIELDS.TARGET_SCHOOLS}
              name="universityIds"
              rules={[
                {
                  required: true,
                  message: JOB_POSTING_UI.FORM.MESSAGES.VALIDATION.SCHOOLS_REQUIRED,
                },
              ]}
            >
              <Select
                mode="multiple"
                options={schoolOptions}
                placeholder={JOB_POSTING_UI.FORM.FIELDS.TARGET_SCHOOLS_PLACEHOLDER}
                className="w-full"
              />
            </Form.Item>
          </Col>
        )}

        {/* Descriptive Content */}
        <Col span={24} className="mt-4">
          <Form.Item
            label={JOB_POSTING_UI.FORM.FIELDS.DESCRIPTION}
            name="description"
            rules={[{ required: true }]}
          >
            <Textarea placeholder={JOB_POSTING_UI.FORM.FIELDS.JOB_TITLE_PLACEHOLDER} rows={6} />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item label={JOB_POSTING_UI.FORM.FIELDS.REQUIREMENTS} name="requirements">
            <Textarea placeholder={JOB_POSTING_UI.PLACEHOLDERS.REQUIREMENTS} rows={4} />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item label={JOB_POSTING_UI.FORM.FIELDS.BENEFITS} name="benefit">
            <Textarea placeholder={JOB_POSTING_UI.PLACEHOLDERS.BENEFITS} rows={4} />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item label={JOB_POSTING_UI.FORM.FIELDS.ROLE_DESCRIPTION} name="jobRoleDescription">
            <Textarea
              placeholder={JOB_POSTING_UI.FORM.FIELDS.ROLE_DESCRIPTION_PLACEHOLDER}
              rows={4}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

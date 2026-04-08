'use client';

import { Button as AntdButton, Drawer, Space, Typography } from 'antd';
import React from 'react';

const { Title, Text } = Typography;

import { JOB_POSTING_UI, JOB_STATUS } from '../constants/job-postings.constant';
import { useJobPostingForm } from '../hooks/useJobPostingForm';
import { JobPostingForm } from './JobPostingForm';

/**
 * Sidebar drawer for creating or editing job postings.
 * Uses useJobPostingForm for complex form state management and auto-saving logic.
 *
 * @param {Object} props - Component properties.
 * @param {boolean} props.open - Whether the drawer is visible.
 * @param {Function} props.onCancel - Callback when the drawer is closed without saving.
 * @param {Object} props.record - The existing job record to edit (null for creation).
 * @param {Array} props.phases - List of available internship phases.
 * @param {Function} props.onSuccess - Callback after a successful save operation.
 */
export default function JobPostingDrawer({
  open,
  onCancel,
  record = null,
  phases = [],
  onSuccess,
}) {
  const {
    form,
    isEdit,
    actions,
    isAutoSaving,
    lastAutoSaved,
    audience,
    schoolOptions,
    phaseOptions,
    handlePhaseChange,
    handlePublish,
    handleSaveDraft,
    handleCancel,
  } = useJobPostingForm({ open, record, phases, onCancel, onSuccess });

  return (
    <Drawer
      title={
        <div className="flex flex-col">
          <Title level={4} className="!m-0 text-lg font-bold">
            {isEdit ? JOB_POSTING_UI.FORM.EDIT_TITLE : JOB_POSTING_UI.FORM.CREATE_TITLE}
          </Title>
          <Text className="text-muted text-xs font-normal mt-1">
            {isEdit ? JOB_POSTING_UI.FORM.EDIT_SUBTITLE : JOB_POSTING_UI.FORM.CREATE_SUBTITLE}
          </Text>
        </div>
      }
      open={open}
      onClose={handleCancel}
      size="large"
      destroyOnHidden
      footer={
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">
            {isAutoSaving ? (
              <span className="text-primary opacity-60 text-[10px] font-bold italic animate-pulse">
                {JOB_POSTING_UI.FORM.BUTTONS.AUTO_SAVING}
              </span>
            ) : lastAutoSaved ? (
              <span className="text-muted text-[10px] font-medium">
                {record?.status === JOB_STATUS.PUBLISHED
                  ? JOB_POSTING_UI.PLACEHOLDERS.SAVED_AT(lastAutoSaved)
                  : JOB_POSTING_UI.PLACEHOLDERS.DRAFT_STATUS(lastAutoSaved)}
              </span>
            ) : null}
          </div>
          <Space size="middle">
            <AntdButton onClick={handleCancel}>{JOB_POSTING_UI.FORM.BUTTONS.CANCEL}</AntdButton>
            {(!record || record.status === JOB_STATUS.DRAFT) && (
              <AntdButton
                onClick={() => handleSaveDraft(false)}
                loading={actions.isMutating}
                disabled={actions.isMutating}
              >
                {JOB_POSTING_UI.FORM.BUTTONS.SAVE_DRAFT}
              </AntdButton>
            )}
            <AntdButton
              type="primary"
              onClick={handlePublish}
              loading={actions.isMutating}
              disabled={actions.isMutating}
            >
              {!isEdit || record?.status === JOB_STATUS.DRAFT
                ? JOB_POSTING_UI.FORM.BUTTONS.PUBLISH
                : JOB_POSTING_UI.FORM.BUTTONS.SAVE_CHANGES}
            </AntdButton>
          </Space>
        </div>
      }
    >
      <JobPostingForm
        form={form}
        phaseOptions={phaseOptions}
        schoolOptions={schoolOptions}
        audience={audience}
        onPhaseChange={handlePhaseChange}
      />
    </Drawer>
  );
}

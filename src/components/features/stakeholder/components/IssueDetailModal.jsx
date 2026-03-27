'use client';

import { InfoCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import React, { memo } from 'react';

import { Button } from '@/components/ui/button';
import CompoundModal from '@/components/ui/compoundmodal';
import { ISSUE_UI } from '@/constants/stakeholderIssue/uiText';

import IssueStatusTag from './IssueStatusTag';

const IssueDetailModal = memo(function IssueDetailModal({ issue, onClose }) {
  if (!issue) return null;

  const { DETAIL, TABLE } = ISSUE_UI;

  return (
    <CompoundModal open={!!issue} onCancel={onClose} width={560}>
      <CompoundModal.Header
        title={DETAIL.TITLE}
        subtitle={
          ISSUE_UI.SUBTITLE_DETAIL || 'Xem chi tiáº¿t thÃ´ng tin váº¥n Ä‘á» Ä‘Ã£ ghi nháº­n'
        }
        icon={<InfoCircleOutlined />}
      />

      <CompoundModal.Content>
        <div className="space-y-8 py-2">
          {/* Header Info */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold tracking-wide text-text/60 uppercase">
              {TABLE.TITLE}
            </label>
            <h3 className="text-xl font-black tracking-tight text-text">{issue.title}</h3>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold tracking-wide text-text/60 uppercase">
                {TABLE.STAKEHOLDER}
              </label>
              <span className="text-base font-bold text-text">
                {issue.stakeholderName || 'â€”'}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold tracking-wide text-text/60 uppercase">
                {TABLE.STATUS}
              </label>
              <div className="flex">
                <IssueStatusTag status={issue.status} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold tracking-wide text-text/60 uppercase">
                {DETAIL.CREATED_AT}
              </label>
              <span className="text-base font-bold text-text">
                {dayjs(issue.createdAt).format('DD/MM/YYYY')}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold tracking-wide text-text/60 uppercase">
                {DETAIL.RESOLVED_AT}
              </label>
              <span className="text-base font-bold text-text">
                {issue.resolvedAt ? dayjs(issue.resolvedAt).format('DD/MM/YYYY') : 'â€”'}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold tracking-wide text-text/60 uppercase">
              {TABLE.DESCRIPTION}
            </label>
            <p className="text-sm font-medium leading-relaxed text-text/80 whitespace-pre-wrap rounded-xl bg-gray-50/50 p-4 border border-gray-100/50">
              {issue.description || 'No detailed description provided.'}
            </p>
          </div>
        </div>
      </CompoundModal.Content>

      <CompoundModal.Footer>
        <div className="flex w-full items-center justify-end">
          <Button
            onClick={onClose}
            className="h-11 rounded-2xl bg-gray-900 px-10 font-black tracking-tight text-white transition-all hover:bg-black active:scale-95"
          >
            {ISSUE_UI.BUTTON.CLOSE}
          </Button>
        </div>
      </CompoundModal.Footer>
    </CompoundModal>
  );
});

export default IssueDetailModal;

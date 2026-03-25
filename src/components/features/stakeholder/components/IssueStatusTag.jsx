'use client';

import { CheckCircleOutlined, ClockCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import React, { memo } from 'react';

import { ISSUE_UI } from '@/constants/stakeholderIssue/uiText';

import { ISSUE_STATUS } from '../constants/issueStatus';

const STATUS_CONFIG = {
  [ISSUE_STATUS.OPEN]: {
    label: ISSUE_UI.STATUS.OPEN,
    className: 'border-blue-200 bg-blue-50 text-blue-600',
    icon: <ClockCircleOutlined className="animate-pulse" />,
  },
  [ISSUE_STATUS.IN_PROGRESS]: {
    label: ISSUE_UI.STATUS.PROCESSING,
    className: 'border-amber-200 bg-amber-50 text-amber-600',
    icon: <SyncOutlined spin />,
  },
  [ISSUE_STATUS.RESOLVED]: {
    label: ISSUE_UI.STATUS.RESOLVED,
    className: 'border-emerald-200 bg-emerald-50 text-emerald-600',
    icon: <CheckCircleOutlined />,
  },
  [ISSUE_STATUS.CLOSED]: {
    label: ISSUE_UI.STATUS.CLOSED,
    className: 'border-gray-200 bg-gray-50 text-gray-500',
    icon: <CheckCircleOutlined />,
  },
};

const IssueStatusTag = memo(function IssueStatusTag({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG[ISSUE_STATUS.OPEN];

  return (
    <Tag
      icon={config.icon}
      className={`flex w-fit items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider !rounded-lg border shadow-sm ${config.className}`}
    >
      {config.label}
    </Tag>
  );
});

export default IssueStatusTag;

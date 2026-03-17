'use client';

import React, { memo } from 'react';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { ISSUE_STATUS } from '../constants/issueStatus';
import { ISSUE_UI } from '@/constants/stakeholderIssue/uiText';

const ISSUE_STATUS_MAP = {
  [ISSUE_STATUS.OPEN]: {
    label: ISSUE_UI.STATUS.OPEN,
    color: 'text-info',
  },
  [ISSUE_STATUS.IN_PROGRESS]: {
    label: ISSUE_UI.STATUS.PROCESSING,
    color: 'text-warning',
  },
  [ISSUE_STATUS.RESOLVED]: {
    label: ISSUE_UI.STATUS.RESOLVED,
    color: 'text-success',
    icon: <CheckCircleOutlined />,
  },
  [ISSUE_STATUS.CLOSED]: {
    label: ISSUE_UI.STATUS.CLOSED,
    color: 'text-muted',
    icon: <CloseCircleOutlined />,
  },
};

const IssueStatusTag = memo(function IssueStatusTag({ status }) {
  const config = ISSUE_STATUS_MAP[status] || ISSUE_STATUS_MAP[ISSUE_STATUS.IN_PROGRESS];

  return (
    <span className={`flex w-fit items-center gap-1.5 text-xs font-semibold ${config.color}`}>
      {config.icon}
      {config.label}
    </span>
  );
});

export default IssueStatusTag;

'use client';

import React, { memo } from 'react';
import { Tag } from 'antd';
import {
  CheckCircleOutlined,
  SyncOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { ISSUE_STATUS } from '../constants/issueStatus';

const ISSUE_STATUS_MAP = {
  [ISSUE_STATUS.OPEN]: { label: 'Mở', color: 'blue', icon: <ClockCircleOutlined /> },
  [ISSUE_STATUS.IN_PROGRESS]: { label: 'Đang xử lý', color: 'orange', icon: <SyncOutlined spin /> },
  [ISSUE_STATUS.RESOLVED]: {
    label: 'Đã giải quyết',
    color: 'success',
    icon: <CheckCircleOutlined />,
  },
  [ISSUE_STATUS.CLOSED]: { label: 'Đã đóng', color: 'default', icon: <CloseCircleOutlined /> },
};

const IssueStatusTag = memo(function IssueStatusTag({ status }) {
  const config = ISSUE_STATUS_MAP[status] || {
    label: status === 'Resolved' ? 'Đã giải quyết' : 'Đang xử lý',
    color: status === 'Resolved' ? 'success' : 'orange',
    icon: status === 'Resolved' ? <CheckCircleOutlined /> : <SyncOutlined spin />,
  };

  return (
    <Tag
      icon={config.icon}
      color={config.color}
      variant='filled'
      className='m-0 flex w-fit items-center gap-1.5 rounded-full px-4 py-0.5 text-[10px] font-black tracking-widest uppercase'
    >
      {config.label}
    </Tag>
  );
});

export default IssueStatusTag;

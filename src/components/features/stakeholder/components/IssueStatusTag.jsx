'use client';

import { CheckCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { ISSUE_STATUS, ISSUE_STATUS_LABEL } from './IssueTable';

export default function IssueStatusTag({ status }) {
  const isResolved =
    status === ISSUE_STATUS.RESOLVED || status === 'Resolved' || status === 'Đã giải quyết';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
        isResolved
          ? 'border-green-200 bg-green-50 text-green-700'
          : 'border-orange-200 bg-orange-50 text-orange-700'
      }`}
    >
      {isResolved ? <CheckCircleOutlined /> : <SyncOutlined spin />}
      {ISSUE_STATUS_LABEL[status] || status || 'Processing'}
    </span>
  );
}

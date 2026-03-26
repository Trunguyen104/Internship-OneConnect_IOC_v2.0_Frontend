import { CheckCircleOutlined, DeleteOutlined, EyeOutlined, SyncOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import dayjs from 'dayjs';
import React, { memo } from 'react';

import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/datatable';
import { showDeleteConfirm } from '@/components/ui/deleteconfirm';
import { ISSUE_UI } from '@/constants/stakeholderIssue/uiText';

import IssueStatusTag from './IssueStatusTag';

const IssueTable = memo(function IssueTable({
  issues,
  stakeholders,
  loading,
  page,
  pageSize,
  onToggleStatus,
  onDelete,
  onView,
}) {
  const columns = [
    {
      title: ISSUE_UI.TABLE.NO,
      key: 'no',
      width: '80px',
      render: (_, __, index) => (
        <span className="text-muted text-[13px] font-semibold">
          {(page - 1) * pageSize + index + 1}
        </span>
      ),
    },
    {
      title: ISSUE_UI.TABLE.TITLE,
      key: 'title',
      width: '350px',
      render: (_, record) => (
        <div className="flex min-w-0 flex-col py-1.5">
          <span className="text-text block truncate text-[15px] font-bold">{record.title}</span>
          {record.description && (
            <span className="text-muted block truncate text-[11px] font-medium opacity-60">
              {record.description}
            </span>
          )}
        </div>
      ),
    },
    {
      title: ISSUE_UI.TABLE.STAKEHOLDER,
      key: 'stakeholderId',
      render: (stakeholderId) => {
        const stakeholder = stakeholders.find((s) => s.id === stakeholderId);
        return (
          <span className="text-text text-sm font-medium">
            {stakeholder?.name || ISSUE_UI.EMPTY.UNKNOWN}
          </span>
        );
      },
    },
    {
      title: ISSUE_UI.TABLE.STATUS,
      key: 'status',
      width: '140px',
      render: (status) => <IssueStatusTag status={status} />,
    },
    {
      title: ISSUE_UI.TABLE.CREATED_DATE,
      key: 'createdAt',
      width: '160px',
      render: (date) => (
        <span className="text-text text-sm font-medium">{dayjs(date).format('DD/MM/YYYY')}</span>
      ),
    },
    {
      title: ISSUE_UI.TABLE.ACTIONS,
      key: 'action',
      align: 'right',
      render: (_, record) => (
        <div className="flex items-center justify-end gap-1 px-2">
          <Tooltip title={record.status === 2 ? ISSUE_UI.BUTTON.REOPEN : ISSUE_UI.BUTTON.RESOLVE}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleStatus(record)}
              className="size-9 rounded-xl text-muted/60 transition-all hover:bg-primary/5 hover:text-primary active:scale-90"
            >
              {record.status === 2 ? (
                <SyncOutlined className="size-4" />
              ) : (
                <CheckCircleOutlined className="size-4" />
              )}
            </Button>
          </Tooltip>
          <Tooltip title={ISSUE_UI.TABLE.VIEW_DETAIL}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onView(record.id)}
              className="size-9 rounded-xl text-muted/40 transition-all hover:bg-gray-100/50 hover:text-text active:scale-90"
            >
              <EyeOutlined className="size-4" />
            </Button>
          </Tooltip>
          <Tooltip title={ISSUE_UI.BUTTON.DELETE}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                showDeleteConfirm({
                  title: ISSUE_UI.BUTTON.DELETE,
                  content: ISSUE_UI.TABLE.DELETE_CONFIRM,
                  onOk: () => onDelete(record.id),
                })
              }
              className="size-9 rounded-xl text-muted/40 transition-all hover:bg-rose-50 hover:text-rose-500 active:scale-90"
            >
              <DeleteOutlined className="size-4" />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={issues}
      loading={loading}
      emptyText={ISSUE_UI.EMPTY.NO_DATA}
    />
  );
});

export default IssueTable;

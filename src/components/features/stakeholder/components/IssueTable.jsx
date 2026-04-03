import { CheckCircleOutlined, DeleteOutlined, EyeOutlined, SyncOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import React, { memo } from 'react';

import DataTable from '@/components/ui/datatable';
import { showDeleteConfirm } from '@/components/ui/deleteconfirm';
import TableRowDropdown from '@/components/ui/TableRowActions';
import { ISSUE_UI } from '@/constants/stakeholderIssue/uiText';
import { TABLE_CELL } from '@/lib/tableStyles';

import { ISSUE_STATUS } from '../constants/issueStatus';
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
  tableBodyRef,
}) {
  const columns = [
    {
      title: ISSUE_UI.TABLE.NO,
      key: 'no',
      width: '80px',
      render: (_, __, index) => (
        <span className={TABLE_CELL.rowIndex}>{(page - 1) * pageSize + index + 1}</span>
      ),
    },
    {
      title: ISSUE_UI.TABLE.TITLE,
      key: 'title',
      width: '350px',
      render: (_, record) => (
        <div className="flex min-w-0 flex-col py-1.5">
          <span className={`${TABLE_CELL.title} block truncate`}>{record.title}</span>
          {record.description && (
            <span className={`${TABLE_CELL.subtitle} block truncate text-[11px] opacity-80`}>
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
          <span className={TABLE_CELL.secondary}>
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
        <span className={TABLE_CELL.secondary}>{dayjs(date).format('DD/MM/YYYY')}</span>
      ),
    },
    {
      title: '',
      key: 'action',
      align: 'right',
      width: '48px',
      render: (_, record) => {
        const isResolved = Number(record.status) === ISSUE_STATUS.RESOLVED;
        const items = [
          {
            key: 'toggle',
            label: isResolved ? ISSUE_UI.BUTTON.REOPEN : ISSUE_UI.BUTTON.RESOLVE,
            icon: isResolved ? <SyncOutlined /> : <CheckCircleOutlined />,
            variant: 'success',
            onClick: () => onToggleStatus(record),
          },
          {
            key: 'view',
            label: ISSUE_UI.TABLE.VIEW_DETAIL,
            icon: <EyeOutlined />,
            onClick: () => onView(record.id),
          },
          { type: 'divider' },
          {
            key: 'delete',
            label: ISSUE_UI.BUTTON.DELETE,
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () =>
              showDeleteConfirm({
                title: ISSUE_UI.BUTTON.DELETE,
                content: ISSUE_UI.TABLE.DELETE_CONFIRM,
                onOk: () => onDelete(record.id),
              }),
          },
        ];

        return (
          <div className="flex justify-end pr-1" onClick={(e) => e.stopPropagation()}>
            <TableRowDropdown items={items} />
          </div>
        );
      },
    },
  ];

  return (
    <div ref={tableBodyRef} className="flex min-h-0 flex-1 flex-col">
      <DataTable
        columns={columns}
        data={issues}
        loading={loading}
        emptyText={ISSUE_UI.EMPTY.NO_DATA}
        minWidth="auto"
      />
    </div>
  );
});

export default IssueTable;

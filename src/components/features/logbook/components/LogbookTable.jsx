'use client';

import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import dayjs from 'dayjs';
import React, { memo, useMemo } from 'react';

import DataTable from '@/components/ui/datatable';
import { showDeleteConfirm } from '@/components/ui/deleteconfirm';
import TableRowDropdown from '@/components/ui/TableRowActions';
import { DAILY_REPORT_UI } from '@/constants/dailyReport/uiText';
import { TABLE_CELL } from '@/lib/tableStyles';

import LogbookStatusTag from './LogbookStatusTag';

const LogbookTable = memo(function LogbookTable({
  data,
  loading,
  userProfile,
  onView,
  onEdit,
  onDelete,
}) {
  const currentStudentId = userProfile?.studentId;
  const { TABLE, DATE_FORMAT, VIEW_MODAL, DELETE_MODAL, MODAL } = DAILY_REPORT_UI;

  const columns = useMemo(
    () => [
      {
        title: TABLE.REPORT_DATE,
        key: 'dateReport',
        width: '180px',
        render: (text) => (
          <span className={`px-1 ${TABLE_CELL.primary}`}>
            {text ? dayjs(text).format(DATE_FORMAT) : VIEW_MODAL.NA}
          </span>
        ),
      },
      {
        title: TABLE.STUDENT,
        key: 'studentName',
        width: '240px',
        render: (text) => <span className={TABLE_CELL.primary}>{text || VIEW_MODAL.NA}</span>,
      },
      {
        title: TABLE.SUMMARY,
        key: 'summary',
        render: (text) => (
          <Tooltip placement="topLeft" title={text}>
            <div className={`max-w-[300px] truncate ${TABLE_CELL.secondary}`}>{text}</div>
          </Tooltip>
        ),
      },
      {
        title: TABLE.ISSUE,
        key: 'issue',
        width: '220px',
        render: (text) => (
          <Tooltip placement="topLeft" title={text}>
            <div className={`max-w-[200px] truncate italic ${TABLE_CELL.muted}`}>{text || '-'}</div>
          </Tooltip>
        ),
      },
      {
        title: TABLE.STATUS,
        key: 'status',
        align: 'center',
        width: '140px',
        render: (status) => <LogbookStatusTag status={status} />,
      },
      {
        title: '',
        key: 'actions',
        align: 'right',
        width: '48px',
        render: (_, record) => {
          const isOwner = record.studentId === currentStudentId;

          const items = [
            {
              key: 'view',
              label: VIEW_MODAL.TITLE,
              icon: <EyeOutlined />,
              onClick: () => onView(record),
            },
          ];

          if (isOwner) {
            items.push(
              { type: 'divider' },
              {
                key: 'edit',
                label: MODAL.EDIT_TITLE,
                icon: <EditOutlined />,
                onClick: () => onEdit(record),
              },
              {
                key: 'delete',
                label: DELETE_MODAL.TITLE,
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () =>
                  showDeleteConfirm({
                    title: DELETE_MODAL.TITLE,
                    content: DELETE_MODAL.CONTENT,
                    onOk: () => onDelete(record.logbookId),
                  }),
              }
            );
          }

          return (
            <div className="flex justify-end pr-1" onClick={(e) => e.stopPropagation()}>
              <TableRowDropdown items={items} />
            </div>
          );
        },
      },
    ],
    [
      currentStudentId,
      DATE_FORMAT,
      MODAL,
      TABLE,
      VIEW_MODAL,
      DELETE_MODAL,
      onView,
      onEdit,
      onDelete,
    ]
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        rowKey="logbookId"
        emptyText={DAILY_REPORT_UI.EMPTY.NO_LOGBOOK}
        minWidth="auto"
      />
    </div>
  );
});

export default LogbookTable;

'use client';

import { EyeOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import dayjs from 'dayjs';
import React, { memo, useMemo } from 'react';

import DataTable from '@/components/ui/datatable';
import TableRowDropdown from '@/components/ui/TableRowActions';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { TABLE_CELL } from '@/lib/tableStyles';

const ViolationTable = memo(function ViolationTable({ data, loading, page, pageSize, onView }) {
  const { VIOLATION_REPORT } = INTERNSHIP_MANAGEMENT_UI.ENTERPRISE;
  const { TABLE } = VIOLATION_REPORT;

  const columns = useMemo(
    () => [
      {
        title: TABLE.COLUMNS.INDEX,
        key: 'index',
        width: '60px',
        align: 'center',
        render: (_, __, index) => (
          <span className={TABLE_CELL.rowIndex}>{(page - 1) * pageSize + index + 1}</span>
        ),
      },
      {
        title: TABLE.COLUMNS.STUDENT_NAME,
        dataIndex: 'name',
        key: 'name',
        width: '200px',
        render: (text) => (
          <div className="flex flex-col overflow-hidden">
            <span className={`${TABLE_CELL.primary} truncate`}>{text}</span>
          </div>
        ),
      },
      {
        title: TABLE.COLUMNS.CREATED_BY,
        dataIndex: 'reporter',
        key: 'reporter',
        width: '150px',
        render: (text) => (
          <Tooltip title={text}>
            <span className={`${TABLE_CELL.secondary} block truncate`}>
              {text || VIOLATION_REPORT.COMMON.EMPTY_VALUE}
            </span>
          </Tooltip>
        ),
      },
      {
        title: TABLE.COLUMNS.CREATE_TIME,
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: '150px',
        render: (text) => (
          <span className={`${TABLE_CELL.secondary} text-xs`}>
            {text
              ? dayjs(text).format(VIOLATION_REPORT.DATE_FORMATS.UI)
              : VIOLATION_REPORT.COMMON.EMPTY_VALUE}
          </span>
        ),
      },
      {
        title: TABLE.COLUMNS.VIOLATION_TIME,
        dataIndex: 'violationTime',
        key: 'violationTime',
        width: '150px',
        render: (text) => (
          <span className={`${TABLE_CELL.secondary} text-xs`}>
            {text
              ? dayjs(text).format(VIOLATION_REPORT.DATE_FORMATS.UI)
              : VIOLATION_REPORT.COMMON.EMPTY_VALUE}
          </span>
        ),
      },
      {
        title: TABLE.COLUMNS.DESCRIPTION,
        dataIndex: 'description',
        key: 'description',
        width: '200px',
        render: (text) => (
          <Tooltip title={text}>
            <span className={`${TABLE_CELL.secondary} block truncate text-xs`}>
              {text || VIOLATION_REPORT.COMMON.EMPTY_VALUE}
            </span>
          </Tooltip>
        ),
      },
      {
        title: '',
        key: 'actions',
        width: '48px',
        align: 'right',
        render: (_, record) => {
          const items = [
            {
              key: 'view',
              label: TABLE.ACTIONS.VIEW,
              icon: <EyeOutlined />,
              onClick: () => onView(record.id),
            },
          ];

          return (
            <div className="flex justify-end pr-1" onClick={(e) => e.stopPropagation()}>
              <TableRowDropdown items={items} />
            </div>
          );
        },
      },
    ],
    [page, pageSize, TABLE, onView, VIOLATION_REPORT]
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        rowKey="id"
        minWidth="auto"
        emptyText={VIOLATION_REPORT.EMPTY_MESSAGE}
      />
    </div>
  );
});

export default ViolationTable;

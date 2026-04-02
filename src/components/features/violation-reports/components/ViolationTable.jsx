import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import dayjs from 'dayjs';
import React, { memo, useMemo } from 'react';

import DataTable from '@/components/ui/datatable';
import TableRowDropdown from '@/components/ui/TableRowActions';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { TABLE_CELL } from '@/lib/tableStyles';

const ViolationTable = memo(function ViolationTable({
  data,
  loading,
  page,
  pageSize,
  onEdit,
  onView,
  onRequestDelete,
  isMentor = false,
}) {
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
        key: 'studentName',
        width: '200px',
        render: (_, record) => (
          <div className="flex flex-col overflow-hidden">
            <span className={`${TABLE_CELL.primary} truncate`}>{record.studentName}</span>
          </div>
        ),
      },
      {
        title: TABLE.COLUMNS.CREATED_BY,
        dataIndex: 'mentorName',
        key: 'mentorName',
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
        key: 'createTime',
        width: '150px',
        render: (text, record) => (
          <Tooltip title={text}>
            <span className={`${TABLE_CELL.secondary} text-xs`}>
              {dayjs(record.createdAt).format(VIOLATION_REPORT.DATE_FORMATS.UI)}
            </span>
          </Tooltip>
        ),
      },
      {
        title: TABLE.COLUMNS.VIOLATION_TIME,
        dataIndex: 'violationTime',
        key: 'violationTime',
        width: '150px',
        render: (text, record) => (
          <Tooltip title={text}>
            <span className={`${TABLE_CELL.secondary} text-xs`}>
              {dayjs(record.violationTime).format(VIOLATION_REPORT.DATE_FORMATS.UI)}
            </span>
          </Tooltip>
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
              onClick: () => onView(record),
            },
          ];

          if (isMentor) {
            items.push(
              {
                key: 'edit',
                label: TABLE.ACTIONS.EDIT,
                icon: <EditOutlined />,
                onClick: () => onEdit(record),
              },
              { type: 'divider' },
              {
                key: 'delete',
                label: TABLE.ACTIONS.DELETE,
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () => onRequestDelete(record),
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
    [page, pageSize, TABLE, onEdit, onView, onRequestDelete, isMentor, VIOLATION_REPORT]
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        rowKey="violationReportId"
        minWidth="auto"
        emptyText={VIOLATION_REPORT.EMPTY_MESSAGE}
      />
    </div>
  );
});

export default ViolationTable;

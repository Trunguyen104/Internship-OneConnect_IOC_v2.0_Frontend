import { DeleteOutlined, EditOutlined, EyeOutlined, MoreOutlined } from '@ant-design/icons';
import { Button, Dropdown, Tooltip } from 'antd';
import dayjs from 'dayjs';
import React, { memo, useMemo } from 'react';

import DataTable from '@/components/ui/datatable';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

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
        render: (_, __, index) => (page - 1) * pageSize + index + 1,
        className: 'text-muted font-semibold text-xs',
      },
      {
        title: TABLE.COLUMNS.STUDENT_NAME,
        key: 'studentName',
        width: '200px',
        render: (_, record) => (
          <div className="flex flex-col overflow-hidden">
            <span className="text-text truncate text-sm font-bold">{record.studentName}</span>
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
            <span className="text-text truncate text-sm block">
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
            <span className="text-muted text-xs font-medium">
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
            <span className="text-muted text-xs font-medium">
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
            <span className="text-muted text-xs font-medium truncate block">
              {text || VIOLATION_REPORT.COMMON.EMPTY_VALUE}
            </span>
          </Tooltip>
        ),
      },
      {
        title: TABLE.COLUMNS.ACTIONS,
        key: 'actions',
        width: '60px',
        align: 'right',
        render: (_, record) => {
          const items = [
            {
              key: 'view',
              label: TABLE.ACTIONS.VIEW,
              icon: <EyeOutlined className="text-primary" />,
              onClick: () => onView(record),
            },
            {
              key: 'edit',
              label: TABLE.ACTIONS.EDIT,
              icon: <EditOutlined className="text-primary" />,
              onClick: () => onEdit(record),
            },
            {
              type: 'divider',
            },
            {
              key: 'delete',
              label: TABLE.ACTIONS.DELETE,
              icon: <DeleteOutlined className="text-danger" />,
              danger: true,
              onClick: () => onRequestDelete(record),
            },
          ].filter((item) => {
            if (
              !isMentor &&
              (item.key === 'edit' || item.key === 'delete' || item.type === 'divider')
            )
              return false;
            return true;
          });

          return (
            <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
              <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
                <Button
                  type="text"
                  size="small"
                  icon={<MoreOutlined className="rotate-90" />}
                  className="hover:bg-primary-surface text-muted flex h-8 w-8 items-center justify-center rounded-lg"
                />
              </Dropdown>
            </div>
          );
        },
      },
    ],
    [page, pageSize, TABLE, onEdit, onView, onRequestDelete, isMentor]
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      rowKey="violationReportId"
      minWidth="800px"
      className="mt-2 min-h-0 flex-1"
      locale={{ emptyText: VIOLATION_REPORT.EMPTY_MESSAGE }}
    />
  );
});

export default ViolationTable;

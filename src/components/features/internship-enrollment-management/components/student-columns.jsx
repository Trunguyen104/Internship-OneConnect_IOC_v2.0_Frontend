import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import React from 'react';

import StatusBadge from '@/components/ui/status-badge';
import TableRowDropdown from '@/components/ui/TableRowActions';

export const getStudentColumns = ({
  pagination,
  isClosed,
  handleView,
  handleEdit,
  handleDelete,
  handleBulkWithdraw,
  TABLE,
  ACTION_LABELS,
  STATUS_LABELS,
  PLACEMENT_LABELS,
}) => {
  return [
    {
      title: '#',
      key: 'index',
      width: 80,
      align: 'center',
      render: (_, __, index) => (
        <span className="text-muted font-mono text-xs font-bold">
          {String((pagination.current - 1) * pagination.pageSize + index + 1).padStart(2, '0')}
        </span>
      ),
    },
    {
      title: TABLE.COLUMNS.FULL_NAME,
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      sortKey: 'FullName',
      render: (name) => <span className="text-text text-sm font-bold tracking-tight">{name}</span>,
    },
    {
      title: TABLE.COLUMNS.STUDENT_ID,
      dataIndex: 'id',
      key: 'id',
      width: 140,
      sorter: true,
      sortKey: 'StudentId',
      render: (id) => <span className="text-muted font-mono text-xs font-semibold">{id}</span>,
    },
    {
      title: TABLE.COLUMNS.MAJOR,
      dataIndex: 'major',
      key: 'major',
      render: (major) => (
        <Tooltip title={major}>
          <span className="text-text block max-w-[150px] truncate text-xs font-medium whitespace-nowrap">
            {major}
          </span>
        </Tooltip>
      ),
    },
    {
      title: TABLE.COLUMNS.PLACEMENT,
      key: 'placement',
      width: 200,
      render: (_, record) => {
        const isPlaced = record.placementStatus === 'PLACED';
        const isPending = record.placementStatus === 'PENDING_ASSIGNMENT';
        const variant = isPlaced ? 'success' : isPending ? 'warning' : 'neutral';
        const label = isPlaced
          ? record.enterpriseName || PLACEMENT_LABELS.PLACED
          : isPending
            ? PLACEMENT_LABELS.PENDING
            : PLACEMENT_LABELS.UNPLACED;

        return (
          <StatusBadge
            variant={variant}
            label={label}
            showDot={isPlaced || isPending}
            variantType="minimal"
            className="opacity-90 font-bold"
          />
        );
      },
    },
    {
      title: TABLE.COLUMNS.STATUS,
      dataIndex: 'status',
      key: 'status',
      width: 140,
      align: 'center',
      render: (status) => {
        const variantMap = {
          ACTIVE: 'success',
          WITHDRAWN: 'danger',
        };
        const variant = variantMap[status] || 'neutral';
        const label = STATUS_LABELS[status] || status;
        return <StatusBadge variant={variant} label={label} variantType="minimal" />;
      },
    },
    {
      title: '',
      key: 'actions',
      width: 48,
      align: 'right',
      render: (_, record) => {
        const isWithdrawn = record.status === 'WITHDRAWN';

        const items = [
          {
            key: 'view',
            label: ACTION_LABELS.VIEW,
            icon: <EyeOutlined />,
            onClick: () => handleView(record),
          },
        ];

        if (!isClosed) {
          if (!isWithdrawn) {
            items.push(
              { type: 'divider' },
              {
                key: 'edit',
                label: ACTION_LABELS.EDIT,
                icon: <EditOutlined />,
                onClick: () => handleEdit(record),
              },
              {
                key: 'withdraw',
                label: ACTION_LABELS.DELETE,
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () => handleDelete(record),
              }
            );
          } else {
            items.push(
              { type: 'divider' },
              {
                key: 'delete',
                label: ACTION_LABELS.DELETE,
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () => handleDelete(record),
              }
            );
          }
        }

        return (
          <div className="flex justify-end pr-1" onClick={(e) => e.stopPropagation()}>
            <TableRowDropdown items={items} />
          </div>
        );
      },
    },
  ];
};

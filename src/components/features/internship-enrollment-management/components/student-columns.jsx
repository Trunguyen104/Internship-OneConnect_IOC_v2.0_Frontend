import {
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  SwapOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { Tooltip } from 'antd';
import React from 'react';

import StatusBadge from '@/components/ui/status-badge';
import TableRowDropdown from '@/components/ui/TableRowActions';

import AssignEnterprisePopover from '../../internship-placement/components/AssignEnterprisePopover';

export const getStudentColumns = ({
  pagination,
  isClosed,
  termId,
  termName,
  handleView,
  handleEdit,
  handleDelete,
  handleUnassign,
  handleBulkWithdraw,
  TABLE,
  ACTION_LABELS,
  STATUS_LABELS,
  PLACEMENT_LABELS,
}) => {
  const renderActionLabel = (label, icon, variant = 'primary') => {
    const variants = {
      primary: { box: 'bg-blue-50/50', icon: 'text-blue-600' },
      warning: { box: 'bg-amber-50/50', icon: 'text-amber-600' },
      danger: { box: 'bg-rose-50/50', icon: 'text-rose-600' },
      neutral: { box: 'bg-slate-50/50', icon: 'text-slate-600' },
    };
    const v = variants[variant] || variants.primary;

    return (
      <div className="flex items-center gap-4 pr-8">
        <div className={`rounded-xl p-2.5 ${v.box}`}>
          <span className={`flex items-center justify-center text-base leading-none ${v.icon}`}>
            {icon}
          </span>
        </div>
        <span
          className={`text-sm font-black tracking-tight ${
            variant === 'danger' ? 'text-rose-600' : 'text-slate-800'
          }`}
        >
          {label}
        </span>
      </div>
    );
  };

  return [
    {
      title: TABLE.COLUMNS.STUDENT_ID,
      dataIndex: 'studentCode',
      key: 'studentCode',
      width: 120,
      render: (code) => (
        <span className="text-text/70 text-xs font-bold tracking-tight">{code}</span>
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
      title: TABLE.COLUMNS.EMAIL,
      dataIndex: 'email',
      key: 'email',
      width: 180,
      render: (email) => (
        <Tooltip title={email}>
          <span className="text-text/80 block max-w-[160px] truncate text-xs font-medium">
            {email}
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
        const labelText = record.enterpriseName || '';

        const variant = isPlaced ? 'success' : isPending ? 'warning' : 'neutral';

        const label =
          labelText ||
          (isPlaced
            ? PLACEMENT_LABELS.PLACED
            : isPending
              ? PLACEMENT_LABELS.PENDING
              : PLACEMENT_LABELS.UNPLACED);

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
    // {
    //   title: TABLE.COLUMNS.STATUS,
    //   dataIndex: 'status',
    //   key: 'status',
    //   width: 140,
    //   align: 'center',
    //   render: (status) => {
    //     const variantMap = {
    //       ACTIVE: 'success',
    //       WITHDRAWN: 'danger',
    //     };
    //     const variant = variantMap[status] || 'neutral';
    //     const label = STATUS_LABELS[status] || status;
    //     return <StatusBadge variant={variant} label={label} variantType="minimal" />;
    //   },
    // },
    {
      title: '',
      key: 'actions',
      width: 48,
      align: 'right',
      render: (_, record) => {
        const isWithdrawn = record.status === 'WITHDRAWN';
        const isPlaced = record.placementStatus === 'PLACED';
        const isPending = record.placementStatus === 'PENDING_ASSIGNMENT';
        const isUnplaced = !isPlaced && !isPending;

        const items = [
          {
            key: 'view',
            label: renderActionLabel(ACTION_LABELS.VIEW, <EyeOutlined />, 'primary'),
            onClick: () => handleView(record),
          },
        ];

        if (!isClosed) {
          if (!isWithdrawn) {
            items.push({ type: 'divider' });

            // 1. Assign / Change Enterprise
            items.push({
              key: 'assign-enterprise',
              label: (
                <AssignEnterprisePopover
                  student={record}
                  termId={termId}
                  termName={termName}
                  disabled={isClosed}
                >
                  <div className="w-full text-left">
                    {renderActionLabel(
                      isUnplaced ? 'Assign Enterprise' : 'Change Enterprise',
                      isUnplaced ? <UserAddOutlined /> : <SwapOutlined />,
                      isUnplaced ? 'primary' : 'warning'
                    )}
                  </div>
                </AssignEnterprisePopover>
              ),
              disabled: isClosed,
            });

            // 2. Cancel Placement (only if placed or pending)
            if (!isUnplaced) {
              items.push({
                key: 'cancel-placement',
                label: renderActionLabel('Cancel Placement', <CloseCircleOutlined />, 'danger'),
                onClick: () => handleUnassign(record),
              });
            }

            items.push(
              {
                key: 'edit',
                label: renderActionLabel(ACTION_LABELS.EDIT, <EditOutlined />, 'primary'),
                onClick: () => handleEdit(record),
              },
              {
                key: 'withdraw',
                label: renderActionLabel(ACTION_LABELS.DELETE, <DeleteOutlined />, 'danger'),
                onClick: () => handleDelete(record),
              }
            );
          } else {
            items.push(
              { type: 'divider' },
              {
                key: 'delete',
                label: renderActionLabel(ACTION_LABELS.DELETE, <DeleteOutlined />, 'danger'),
                onClick: () => handleDelete(record),
              }
            );
          }
        }

        return (
          <div className="flex justify-end pr-1" onClick={(e) => e.stopPropagation()}>
            <TableRowDropdown items={items} enrich={false} />
          </div>
        );
      },
    },
  ];
};

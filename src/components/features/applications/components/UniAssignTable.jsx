'use client';

import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { Tooltip } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

import DataTable from '@/components/ui/datatable';
import TableRowDropdown from '@/components/ui/TableRowActions';
import { APPLICATION_STATUS } from '@/constants/applications/application.constants';
import { APPLICATIONS_UI } from '@/constants/applications/uiText';

import ApplicationStatusBadge from './ApplicationStatusBadge';

/**
 * Table specific to Uni-assigned applications flow.
 */
export const UniAssignTable = ({ data = [], loading = false, pagination, onAction }) => {
  const columns = [
    {
      title: APPLICATIONS_UI.COLUMNS.STUDENT_NAME,
      key: 'studentFullName',
      width: '180px',
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-bold text-slate-800">{record.studentFullName}</span>
          {record.hasSelfApplyDuplicate && (
            <Tooltip
              title={`This student has an active self-apply application (Status: ${record.selfApplyStatus || 'Processing'}). If you approve, that application will be automatically withdrawn.`}
            >
              <InfoCircleOutlined className="cursor-help animate-pulse text-amber-500" />
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      title: APPLICATIONS_UI.COLUMNS.STUDENT_ID,
      dataIndex: 'studentCode',
      key: 'studentCode',
      width: '120px',
      render: (code) => (
        <span className="text-[12px] font-medium uppercase text-slate-500">{code}</span>
      ),
    },
    {
      title: APPLICATIONS_UI.COLUMNS.SCHOOL,
      dataIndex: 'universityName',
      key: 'universityName',
      width: '180px',
      render: (universityName) => (
        <span className="line-clamp-1 text-[13px] text-slate-600">{universityName || '—'}</span>
      ),
    },
    {
      title: APPLICATIONS_UI.COLUMNS.REQUESTED_POSITION,
      key: 'job',
      width: '250px',
      render: (_, record) => (
        <span className="max-w-[200px] truncate text-[14px] font-bold text-slate-700">
          {record.jobPostingTitle || '—'}
        </span>
      ),
    },
    {
      title: APPLICATIONS_UI.COLUMNS.REQUESTED_DATE,
      key: 'appliedAt',
      dataIndex: 'appliedAt',
      width: '150px',
      render: (date) => (
        <span className="text-slate-500 font-bold uppercase text-xs">
          {date ? dayjs(date).format('DD/MM/YYYY') : '—'}
        </span>
      ),
    },
    {
      title: APPLICATIONS_UI.COLUMNS.STATUS,
      key: 'status',
      dataIndex: 'status',
      width: '180px',
      align: 'center',
      render: (status) => <ApplicationStatusBadge status={status} />,
    },
    {
      title: APPLICATIONS_UI.COLUMNS.ACTIONS,
      key: 'action',
      width: '100px',
      align: 'right',
      render: (_, record) => {
        const getMenuItems = () => {
          const items = [{ key: 'details', label: 'View Details', icon: <EyeOutlined /> }];

          if (record.status === APPLICATION_STATUS.PENDING_ASSIGNMENT) {
            items.push({
              key: 'approve',
              label: 'Approve Assignment',
              icon: <CheckCircleOutlined />,
              variant: 'success',
            });
            items.push({
              key: 'reject-uni',
              label: 'Reject Assignment',
              icon: <CloseCircleOutlined />,
              danger: true,
            });
          }

          return items;
        };

        return (
          <TableRowDropdown
            items={getMenuItems()}
            menuProps={{ onClick: ({ key }) => onAction(key, record) }}
          />
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      rowKey={(record) => record.applicationId || record.id}
      className="border-none bg-transparent"
      emptyText={APPLICATIONS_UI.EMPTY_STATE}
      pagination={
        pagination
          ? {
              ...pagination,
              pageSizeOptions: ['10', '20', '50', '100'],
              showSizeChanger: true,
            }
          : false
      }
    />
  );
};

export default UniAssignTable;

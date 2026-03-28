'use client';

import { MoreOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/datatable';
import { APPLICATION_STATUS } from '@/constants/applications/application.constants';
import { APPLICATIONS_UI } from '@/constants/applications/uiText';

import ApplicationStatusBadge from './ApplicationStatusBadge';

/**
 * Table specific to Self-apply applications flow.
 */
export const SelfApplyTable = ({ data = [], loading = false, pagination, onAction }) => {
  const columns = [
    {
      title: APPLICATIONS_UI.COLUMNS.STUDENT_NAME,
      key: 'studentFullName',
      width: '180px',
      render: (_, record) => (
        <span className="text-[14px] font-bold text-slate-800">{record.studentFullName}</span>
      ),
    },
    {
      title: APPLICATIONS_UI.COLUMNS.STUDENT_ID,
      dataIndex: 'studentCode',
      key: 'studentCode',
      width: '120px',
      render: (code) => (
        <span className="text-[12px] font-medium text-slate-500 uppercase">{code}</span>
      ),
    },
    {
      title: APPLICATIONS_UI.COLUMNS.SCHOOL,
      dataIndex: 'universityName',
      key: 'universityName',
      width: '180px',
      render: (universityName) => (
        <span className="text-[13px] text-slate-600 line-clamp-1">{universityName || '—'}</span>
      ),
    },
    {
      title: APPLICATIONS_UI.COLUMNS.JOB_APPLIED,
      key: 'job',
      width: '200px',
      render: (_, record) => (
        <div className="flex flex-col">
          <span className="max-w-[180px] truncate text-[14px] font-bold text-slate-700">
            {record.jobPostingTitle || '—'}
          </span>
          {record.isJobClosed && (
            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-tighter">
              {APPLICATIONS_UI.JOB_CLOSED || 'Closed'}
            </span>
          )}
        </div>
      ),
    },
    {
      title: APPLICATIONS_UI.COLUMNS.APPLIED_DATE,
      key: 'appliedAt',
      dataIndex: 'appliedAt',
      width: '140px',
      render: (date) => (
        <span className="text-slate-500 font-medium">
          {date ? dayjs(date).format('DD/MM/YYYY') : '—'}
        </span>
      ),
    },
    {
      title: APPLICATIONS_UI.COLUMNS.STATUS,
      key: 'status',
      dataIndex: 'status',
      width: '150px',
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
          const items = [{ key: 'details', label: 'View Details' }];

          if (record.status === APPLICATION_STATUS.APPLIED) {
            items.push({ key: 'interview', label: 'Interviewing' });
          }
          if (record.status === APPLICATION_STATUS.INTERVIEWING) {
            items.push({ key: 'offer', label: 'Send Offer' });
          }
          if (record.status === APPLICATION_STATUS.OFFERED) {
            items.push({ key: 'placed', label: 'Mark as Placed' });
          }

          if (
            record.status < APPLICATION_STATUS.PLACED &&
            record.status !== APPLICATION_STATUS.REJECTED
          ) {
            items.push({ key: 'reject', label: 'Reject Application', danger: true });
          }

          return items;
        };

        return (
          <Dropdown
            menu={{
              items: getMenuItems(),
              onClick: ({ key }) => onAction(key, record),
            }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-slate-100 text-slate-400"
            >
              <MoreOutlined className="rotate-90 text-lg" />
            </Button>
          </Dropdown>
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

export default SelfApplyTable;

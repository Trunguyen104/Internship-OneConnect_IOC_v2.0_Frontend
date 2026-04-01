'use client';

import { MoreOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/datatable';

import { JOB_POSTING_UI, JOB_STATUS } from '../constants/job-postings.constant';
import JobPostingStatusBadge from './JobPostingStatusBadge';

export const JobPostingsTable = ({ data = [], loading = false, pagination, onAction }) => {
  const columns = [
    {
      title: JOB_POSTING_UI.TABLE.COLUMNS.TITLE,
      key: 'title',
      width: '250px',
      render: (_, record) => (
        <div className="flex flex-col">
          <span className="text-[14px] font-bold text-slate-800 line-clamp-1">{record.title}</span>
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-tight">
            {record.position || JOB_POSTING_UI.PLACEHOLDERS.NOT_AVAILABLE}
          </span>
        </div>
      ),
    },
    {
      title: JOB_POSTING_UI.TABLE.COLUMNS.PHASE,
      key: 'termName',
      width: '180px',
      render: (_, record) => (
        <span className="text-[13px] font-medium text-slate-600 line-clamp-1">
          {record.termName ||
            record.internshipPhaseName ||
            JOB_POSTING_UI.PLACEHOLDERS.DASH_FALLBACK}
        </span>
      ),
    },
    {
      title: JOB_POSTING_UI.TABLE.COLUMNS.DEADLINE,
      key: 'expireDate',
      width: '140px',
      render: (_, record) => (
        <span className="font-medium text-slate-500">
          {record.expireDate
            ? dayjs(record.expireDate).format('DD/MM/YYYY')
            : JOB_POSTING_UI.PLACEHOLDERS.DASH_FALLBACK}
        </span>
      ),
    },
    {
      title: JOB_POSTING_UI.TABLE.COLUMNS.APPLICATIONS,
      key: 'applicationCount',
      width: '120px',
      align: 'center',
      render: (count) => (
        <span className="rounded-full bg-slate-100 px-3 py-1 text-[13px] font-bold text-slate-700">
          {count || 0}
        </span>
      ),
    },
    {
      title: JOB_POSTING_UI.TABLE.COLUMNS.STATUS,
      key: 'status',
      width: '140px',
      align: 'center',
      render: (status) => <JobPostingStatusBadge status={status} />,
    },
    {
      title: JOB_POSTING_UI.TABLE.COLUMNS.ACTIONS,
      key: 'action',
      width: '100px',
      align: 'right',
      render: (_, record) => {
        const getMenuItems = () => {
          const items = [{ key: 'edit', label: JOB_POSTING_UI.MENU.EDIT }];

          if (record.status === JOB_STATUS.DRAFT) {
            items.push({ key: 'publish', label: JOB_POSTING_UI.MENU.PUBLISH });
          }
          if (record.status === JOB_STATUS.PUBLISHED) {
            items.push({ key: 'close', label: JOB_POSTING_UI.MENU.CLOSE });
          }
          if (record.status === JOB_STATUS.CLOSED) {
            items.push({ key: 'republish', label: JOB_POSTING_UI.MENU.REPUBLISH });
          }

          items.push({ key: 'delete', label: JOB_POSTING_UI.MENU.DELETE, danger: true });

          return items;
        };

        return (
          <Dropdown
            menu={{
              items: getMenuItems(),
              onClick: ({ key }) => onAction?.(key, record),
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
      rowKey="jobId"
      className="border-none bg-transparent"
      emptyText={JOB_POSTING_UI.PLACEHOLDERS.EMPTY_TABLE}
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

export default JobPostingsTable;

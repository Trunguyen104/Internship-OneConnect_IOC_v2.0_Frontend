'use client';

import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  SendOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { Dropdown } from 'antd';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';

import JobPostingStatusBadge from '../components/JobPostingStatusBadge';
import { JOB_POSTING_UI, JOB_STATUS } from '../constants/job-postings.constant';

/**
 * Hook to define and manage column configurations for the Job Postings table.
 * Encapsulates complex rendering logic, index calculation, and contextual action menus.
 *
 * @param {Object} props - Hook properties.
 * @param {number} props.current - Current page index.
 * @param {number} props.pageSize - Number of items per page.
 * @param {Function} props.onAction - Handler for triggering actions (View, Edit, etc.).
 * @returns {Object} Column configuration for Ant Design Table.
 */
export const useJobPostingsTable = ({ current, pageSize, onAction }) => {
  const columns = useMemo(
    () => [
      {
        title: '#',
        key: 'index',
        width: 40,
        align: 'center',
        render: (_, __, index) => (current - 1) * pageSize + index + 1,
      },
      {
        title: JOB_POSTING_UI.TABLE.COLUMNS.TITLE,
        key: 'title',
        width: 250,
        render: (_, record) => {
          const isDeleted = record.status === JOB_STATUS.DELETED;
          return (
            <div className="flex flex-col max-w-[250px]">
              {isDeleted ? (
                <span className="font-semibold text-muted opacity-60 truncate" title={record.title}>
                  {record.title}
                </span>
              ) : (
                <span
                  className="font-semibold text-text hover:text-primary hover:underline cursor-pointer transition-colors truncate"
                  onClick={() => onAction?.('view', record)}
                  title={record.title}
                >
                  {record.title}
                </span>
              )}
              <span className="text-muted text-[11px] font-medium uppercase tracking-wider truncate">
                {record.position || JOB_POSTING_UI.PLACEHOLDERS.NOT_AVAILABLE}
              </span>
            </div>
          );
        },
      },
      {
        title: JOB_POSTING_UI.TABLE.COLUMNS.PHASE,
        key: 'termName',
        width: 180,
        render: (_, record) => (
          <span
            className="text-text font-semibold truncate block max-w-[170px]"
            title={record.termName || record.internshipPhaseName}
          >
            {record.termName ||
              record.internshipPhaseName ||
              JOB_POSTING_UI.PLACEHOLDERS.DASH_FALLBACK}
          </span>
        ),
      },
      {
        title: JOB_POSTING_UI.TABLE.COLUMNS.DEADLINE,
        key: 'expireDate',
        width: 120,
        render: (_, record) => (
          <span className="text-muted font-medium text-xs">
            {record.expireDate
              ? dayjs(record.expireDate).format('DD/MM/YYYY')
              : JOB_POSTING_UI.PLACEHOLDERS.DASH_FALLBACK}
          </span>
        ),
      },
      {
        title: JOB_POSTING_UI.TABLE.COLUMNS.APPLICATIONS,
        key: 'applicationCount',
        width: 100,
        align: 'center',
        render: (count) => (
          <span className="bg-bg text-text rounded-full px-3 py-0.5 text-xs font-bold border border-border">
            {count || 0}
          </span>
        ),
      },
      {
        title: JOB_POSTING_UI.TABLE.COLUMNS.STATUS,
        key: 'status',
        width: 100,
        align: 'center',
        render: (status) => <JobPostingStatusBadge status={status} />,
      },
      {
        title: JOB_POSTING_UI.TABLE.COLUMNS.ACTIONS,
        key: 'actions',
        width: 60,
        align: 'center',
        render: (_, record) => {
          if (record.status === JOB_STATUS.DELETED) {
            return (
              <span className="text-muted font-bold tracking-widest opacity-30 select-none">
                {JOB_POSTING_UI.PLACEHOLDERS.DASH_FALLBACK}
              </span>
            );
          }

          const items = [
            {
              key: 'view',
              label: JOB_POSTING_UI.MENU.VIEW,
              icon: <EllipsisOutlined />,
            },
            {
              key: 'edit',
              label: JOB_POSTING_UI.MENU.EDIT,
              icon: <EditOutlined />,
            },
            { type: 'divider' },
          ];

          if (record.status === JOB_STATUS.DRAFT) {
            items.push({
              key: 'publish',
              label: JOB_POSTING_UI.MENU.PUBLISH,
              icon: <SendOutlined />,
            });
          }
          if (record.status === JOB_STATUS.PUBLISHED) {
            items.push({
              key: 'close',
              label: JOB_POSTING_UI.MENU.CLOSE,
              icon: <StopOutlined />,
            });
          }
          if (record.status === JOB_STATUS.CLOSED) {
            items.push({
              key: 'republish',
              label: JOB_POSTING_UI.MENU.REPUBLISH,
              icon: <SendOutlined />,
            });
          }

          items.push({
            key: 'delete',
            label: JOB_POSTING_UI.MENU.DELETE,
            danger: true,
            icon: <DeleteOutlined />,
          });

          return (
            <Dropdown
              menu={{
                items,
                onClick: ({ key }) => onAction?.(key, record),
              }}
              trigger={['click']}
              placement="bottomRight"
            >
              <div className="flex justify-center hover:bg-bg p-1 rounded cursor-pointer transition-colors w-8 h-8 items-center mx-auto">
                <EllipsisOutlined className="text-lg rotate-90" />
              </div>
            </Dropdown>
          );
        },
      },
    ],
    [onAction, current, pageSize]
  );

  return { columns };
};

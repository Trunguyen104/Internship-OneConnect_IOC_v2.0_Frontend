'use client';

import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import dayjs from 'dayjs';
import React, { memo } from 'react';

import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/datatable';
import { showDeleteConfirm } from '@/components/ui/deleteconfirm';
import { DAILY_REPORT_UI } from '@/constants/dailyReport/uiText';

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

  const columns = [
    {
      title: (
        <span className="text-[10px] font-black uppercase tracking-widest text-muted/50">
          {TABLE.REPORT_DATE}
        </span>
      ),
      key: 'dateReport',
      width: '180px',
      render: (text) => (
        <span className="px-1 text-sm font-black tracking-tight text-text">
          {text ? dayjs(text).format(DATE_FORMAT) : VIEW_MODAL.NA}
        </span>
      ),
    },
    {
      title: (
        <span className="text-[10px] font-black uppercase tracking-widest text-muted/50">
          {TABLE.STUDENT}
        </span>
      ),
      key: 'studentName',
      width: '240px',
      render: (text) => (
        <span className="text-sm font-bold tracking-tight text-text/80">
          {text || VIEW_MODAL.NA}
        </span>
      ),
    },
    {
      title: (
        <span className="text-[10px] font-black uppercase tracking-widest text-muted/50">
          {TABLE.SUMMARY}
        </span>
      ),
      key: 'summary',
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          <div className="max-w-[300px] truncate text-sm font-medium tracking-tight text-muted/70">
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: (
        <span className="text-[10px] font-black uppercase tracking-widest text-muted/50">
          {TABLE.ISSUE}
        </span>
      ),
      key: 'issue',
      width: '220px',
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          <div className="max-w-[200px] truncate text-sm font-medium italic tracking-tight text-muted/50">
            {text || '-'}
          </div>
        </Tooltip>
      ),
    },
    {
      title: (
        <span className="text-[10px] font-black uppercase tracking-widest text-muted/50">
          {TABLE.STATUS}
        </span>
      ),
      key: 'status',
      align: 'center',
      width: '140px',
      render: (status) => <LogbookStatusTag status={status} />,
    },
    {
      title: '',
      key: 'actions',
      align: 'right',
      width: '160px',
      render: (_, record) => {
        const isOwner = record.studentId === currentStudentId;

        return (
          <div className="flex items-center justify-end gap-2 pr-2">
            <Tooltip title={VIEW_MODAL.TITLE}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView(record)}
                className="h-9 w-9 p-0 flex items-center justify-center rounded-xl hover:bg-primary/10 text-muted/30 hover:text-primary transition-all"
              >
                <EyeOutlined className="text-lg" />
              </Button>
            </Tooltip>

            {isOwner && (
              <>
                <Tooltip title={MODAL.EDIT_TITLE}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(record)}
                    className="h-9 w-9 p-0 flex items-center justify-center rounded-xl hover:bg-blue-50 text-muted/30 hover:text-blue-500 transition-all"
                  >
                    <EditOutlined className="text-lg" />
                  </Button>
                </Tooltip>

                <Tooltip title={DELETE_MODAL.TITLE}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      showDeleteConfirm({
                        title: DELETE_MODAL.TITLE,
                        content: DELETE_MODAL.CONTENT,
                        onOk: () => onDelete(record.logbookId),
                      })
                    }
                    className="h-9 w-9 p-0 flex items-center justify-center rounded-xl hover:bg-rose-50 text-muted/30 hover:text-rose-500 transition-all"
                  >
                    <DeleteOutlined className="text-lg" />
                  </Button>
                </Tooltip>
              </>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-white/50 backdrop-blur-sm rounded-[32px] border border-gray-100/50 shadow-sm">
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        rowKey="logbookId"
        emptyText={DAILY_REPORT_UI.EMPTY.NO_LOGBOOK}
      />
    </div>
  );
});

export default LogbookTable;

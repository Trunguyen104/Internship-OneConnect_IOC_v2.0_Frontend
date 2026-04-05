'use client';

import { ArrowRightOutlined, UsergroupAddOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import Link from 'next/link';
import React from 'react';

import Badge from '@/components/ui/badge';
import DataTable from '@/components/ui/datatable';
import DataTableToolbar from '@/components/ui/datatabletoolbar';

export default function ProjectStudentsTab({
  loading,
  searchTerm,
  setSearchTerm,
  assignedStudents,
  filteredStudents,
  DETAIL,
  FORM,
  currentProject,
  isHR,
}) {
  const studentColumns = [
    {
      title: DETAIL.STUDENTS?.COLUMNS?.NAME,
      key: 'fullName',
      width: 220,
      render: (_, record) => (
        <div className="flex items-center gap-2.5 py-1">
          <Avatar
            size={32}
            icon={<UserOutlined />}
            className="shrink-0 bg-slate-100 text-slate-400"
          />
          <div className="flex flex-col min-w-0 leading-tight">
            <span className="font-bold text-sm truncate text-slate-700">{record.fullName}</span>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider">
              {record.studentCode}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: DETAIL.STUDENTS?.COLUMNS?.EMAIL,
      dataIndex: 'email',
      key: 'email',
      width: 240,
      render: (email) => <span className="text-xs text-slate-500 font-medium">{email}</span>,
    },
    {
      title: DETAIL.STUDENTS?.COLUMNS?.STATUS,
      key: 'status',
      width: 120,
      align: 'right',
      render: (_, record) => {
        const isArchived =
          currentProject?.groupInfo?.status === DETAIL.GROUP?.ARCHIVED_VALUE ||
          currentProject?.groupStatus === DETAIL.GROUP?.ARCHIVED_VALUE ||
          currentProject?.internshipGroup?.status === DETAIL.GROUP?.ARCHIVED_VALUE;
        const status = record.termStatus || DETAIL.STUDENTS?.STATUS_ACTIVE;

        return (
          <div className="flex flex-col items-end gap-1">
            <Badge
              variant={status === DETAIL.STUDENTS?.STATUS_ACTIVE ? 'success-soft' : 'default'}
              size="sm"
            >
              {status}
            </Badge>
            {isArchived && (
              <Badge variant="default" size="xs">
                {DETAIL.GROUP?.ARCHIVED_LABEL}
              </Badge>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="pt-2">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <DataTableToolbar.Search
          placeholder={DETAIL.STUDENTS?.SEARCH_PLACEHOLDER}
          className="flex-1 sm:w-80"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex items-center gap-3">
          <Badge
            variant="primary-soft"
            className="h-9 px-3 font-bold whitespace-nowrap bg-blue-50/50 border-blue-100/50 text-[10px] flex items-center gap-1.5 rounded-lg border"
          >
            <UsergroupAddOutlined className="text-[12px]" />
            {assignedStudents.length} {DETAIL.GROUP?.STUDENTS_SUFFIX}
          </Badge>

          {isHR && (currentProject?.internshipId || currentProject?.groupInfo?.internshipId) && (
            <Link
              href={`/internship-management?groupId=${currentProject?.groupInfo?.internshipId || currentProject?.internshipId}`}
              className="flex items-center gap-1.5 text-[10px] font-bold text-primary hover:text-primary-hover bg-primary/5 px-3 py-2 rounded-lg transition-all uppercase tracking-wide border border-primary/10 hover:bg-primary/10 shadow-sm"
            >
              <ArrowRightOutlined className="rotate-180" /> {DETAIL.GROUP?.MANAGE_LINK}
            </Link>
          )}
        </div>
      </div>

      <DataTable
        columns={studentColumns}
        data={filteredStudents}
        loading={loading}
        rowKey="studentId"
        size="small"
        minWidth="100%"
        emptyText={DETAIL.STUDENTS?.EMPTY_MESSAGE}
      />
    </div>
  );
}

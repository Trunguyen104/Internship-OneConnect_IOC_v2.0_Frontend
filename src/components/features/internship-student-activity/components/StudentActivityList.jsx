'use client';

import { ExclamationCircleOutlined, SearchOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, Card, Input, Progress, Select } from 'antd';
import { useRouter } from 'next/navigation';
import React from 'react';

import Badge from '@/components/ui/badge';
import DataTable from '@/components/ui/DataTable';
import { UI_TEXT } from '@/lib/UI_Text';

import useStudentActivity from '../hooks/useStudentActivity';

export default function StudentActivityList() {
  const router = useRouter();
  const {
    students,
    loading,
    summary,
    terms,
    enterprises,
    termId,
    enterpriseId,
    statusFilter,
    logbookFilter,
    searchTerm,
    pagination,
    setTermId,
    setEnterpriseId,
    setStatusFilter,
    setLogbookFilter,
    setSearchTerm,
    setPagination,
    resetFilters,
    refresh,
  } = useStudentActivity();

  const handleRowClick = (record) => {
    const id = record.id;
    const url =
      termId && termId !== 'ALL'
        ? `/internship/students/${id}?termId=${termId}`
        : `/internship/students/${id}`;
    router.push(url);
  };

  const columns = [
    {
      title: UI_TEXT.STUDENT_ACTIVITY.LIST_COLUMNS.INDEX,
      key: 'index',
      width: 60,
      align: 'center',
      render: (_, __, index) => (
        <span className="text-muted font-mono text-xs font-bold leading-none">
          {String((pagination.current - 1) * pagination.pageSize + index + 1).padStart(2, '0')}
        </span>
      ),
    },
    {
      title: UI_TEXT.STUDENT_ACTIVITY.LIST_COLUMNS.STUDENT,
      key: 'fullname',
      width: 200,
      sorter: true,
      sortKey: 'FullName',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 font-bold border border-slate-100 text-xs shrink-0 shadow-sm">
            {record.fullName?.charAt(0)}
          </div>
          <div className="flex flex-col min-w-0 pr-2">
            <span className="truncate text-sm font-bold text-slate-800 leading-tight mb-0.5">
              {record.fullName}
            </span>
            <span className="truncate text-[10px] font-medium text-slate-400">
              {record.studentCode} {UI_TEXT.COMMON.BULLET} {record.className}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: UI_TEXT.STUDENT_ACTIVITY.LIST_COLUMNS.ENTERPRISE,
      key: 'enterprise',
      width: 140,
      render: (_, record) => (
        <span
          className="text-xs font-semibold text-slate-600 truncate block max-w-[130px]"
          title={record.enterpriseName}
        >
          {record.enterpriseName || (
            <span className="text-slate-200">{UI_TEXT.COMMON.EM_DASH}</span>
          )}
        </span>
      ),
    },
    {
      title: UI_TEXT.STUDENT_ACTIVITY.LIST_COLUMNS.MENTOR,
      key: 'mentor',
      width: 130,
      render: (_, record) => (
        <span
          className="text-xs font-semibold text-slate-600 truncate block max-w-[120px]"
          title={record.mentorName}
        >
          {record.mentorName || <span className="text-slate-200">{UI_TEXT.COMMON.EM_DASH}</span>}
        </span>
      ),
    },
    {
      title: UI_TEXT.STUDENT_ACTIVITY.LIST_COLUMNS.LOGBOOK_PROGRESS,
      key: 'logbook',
      width: 160,
      render: (_, record) => {
        if (
          !record.activity ||
          record.internshipStatus === 'Unplaced' ||
          record.internshipStatus === 5
        )
          return <span className="text-slate-200">{UI_TEXT.COMMON.EM_DASH}</span>;

        const { submitted, progress, totalWorkDays } = record.activity;

        if (totalWorkDays === 0)
          return <span className="text-slate-200">{UI_TEXT.COMMON.EM_DASH}</span>;

        let strokeColor = '#22c55e'; // success
        if (progress < 50)
          strokeColor = '#ef4444'; // danger
        else if (progress < 75) strokeColor = '#f59e0b'; // warning

        return (
          <div className="flex w-full flex-col gap-1.5 py-1 pr-4">
            <div className="flex items-center justify-between text-[10px] font-bold">
              <span className="text-slate-400">
                {UI_TEXT.STUDENT_ACTIVITY.LOGBOOK.REPORTS}: {submitted}/{totalWorkDays}
              </span>
              <span style={{ color: strokeColor }}>{progress}%</span>
            </div>
            <Progress
              percent={progress}
              size="small"
              showInfo={false}
              type="line"
              className="m-0 !h-1.5 [&_.ant-progress-inner]:!bg-slate-50 shadow-sm"
              strokeColor={strokeColor}
            />
          </div>
        );
      },
    },
    {
      title: UI_TEXT.STUDENT_ACTIVITY.LIST_COLUMNS.STATUS,
      key: 'status',
      width: 140,
      align: 'center',
      render: (_, record) => {
        const statuses = {
          1: { label: UI_TEXT.STUDENT_ACTIVITY.STATUS_LABELS.ACTIVE, variant: 'success' },
          2: { label: UI_TEXT.STUDENT_ACTIVITY.STATUS_LABELS.NO_GROUP, variant: 'warning' },
          3: { label: UI_TEXT.STUDENT_ACTIVITY.STATUS_LABELS.COMPLETED, variant: 'info' },
          4: { label: UI_TEXT.STUDENT_ACTIVITY.STATUS_LABELS.PENDING, variant: 'warning' },
          5: { label: UI_TEXT.STUDENT_ACTIVITY.STATUS_LABELS.UNPLACED, variant: 'danger' },
          Active: { label: UI_TEXT.STUDENT_ACTIVITY.STATUS_LABELS.ACTIVE, variant: 'success' },
          NoGroup: { label: UI_TEXT.STUDENT_ACTIVITY.STATUS_LABELS.NO_GROUP, variant: 'warning' },
          Completed: { label: UI_TEXT.STUDENT_ACTIVITY.STATUS_LABELS.COMPLETED, variant: 'info' },
          PendingConfirmation: {
            label: UI_TEXT.STUDENT_ACTIVITY.STATUS_LABELS.PENDING,
            variant: 'warning',
          },
          Unplaced: { label: UI_TEXT.STUDENT_ACTIVITY.STATUS_LABELS.UNPLACED, variant: 'danger' },
        };

        const status = statuses[record.internshipStatus] || {
          label: record.internshipStatus,
          variant: 'default',
        };
        return <Badge variant={status.variant}>{status.label}</Badge>;
      },
    },
    {
      title: UI_TEXT.STUDENT_ACTIVITY.LIST_COLUMNS.VIOLATIONS,
      key: 'violations',
      width: 80,
      align: 'center',
      render: (count) => {
        if (!count || count === 0) return null;
        return (
          <div className="flex items-center justify-center gap-1.5">
            <ExclamationCircleOutlined className="text-amber-500 font-bold" />
            <span className="text-xs font-bold text-slate-800">{count}</span>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: UI_TEXT.STUDENT_ACTIVITY.STATS.TOTAL_STUDENTS,
            value: summary.total,
            color: 'primary',
          },
          {
            title: UI_TEXT.STUDENT_ACTIVITY.STATS.INTERNING,
            value: summary.interning,
            color: 'success',
          },
          {
            title: UI_TEXT.STUDENT_ACTIVITY.STATS.MISSING_LOGBOOK,
            value: summary.missingLogbook,
            color: 'danger',
          },
          {
            title: UI_TEXT.STUDENT_ACTIVITY.STATS.UNPLACED,
            value: summary.unplaced,
            color: 'warning',
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="flex flex-col gap-1 rounded-[32px] bg-white p-6 shadow-xl shadow-slate-200/50 border border-white"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
              {stat.title}
            </span>
            <span className="text-3xl font-black tracking-tight text-slate-800 italic">
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      <Card className="!rounded-[44px] border-none shadow-2xl shadow-slate-200/50 bg-white/80 backdrop-blur-md overflow-hidden">
        <div className="flex flex-col gap-6 p-2">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between px-2">
            <div className="flex flex-wrap items-center gap-3">
              <Select
                value={termId}
                onChange={setTermId}
                placeholder={UI_TEXT.STUDENT_ACTIVITY.FILTERS.SELECT_TERM}
                className="!w-48 !h-10 [&_.ant-select-selector]:!rounded-xl [&_.ant-select-selector]:!border-slate-100"
                options={terms.map((term) => ({
                  value: term.termId || term.id,
                  label: term.termName || term.name,
                }))}
              />
              <Select
                value={enterpriseId}
                onChange={setEnterpriseId}
                className="!w-48 !h-10 [&_.ant-select-selector]:!rounded-xl [&_.ant-select-selector]:!border-slate-100"
                options={[
                  { value: 'ALL', label: UI_TEXT.STUDENT_ACTIVITY.FILTERS.ALL_ENTERPRISES },
                  ...enterprises.map((ent) => ({
                    value: ent.enterpriseId || ent.id,
                    label: ent.name,
                  })),
                ]}
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Input
                placeholder={UI_TEXT.STUDENT_ACTIVITY.FILTERS.SEARCH_STUDENTS}
                prefix={<SearchOutlined className="text-slate-400" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="!w-64 !h-10 !rounded-xl !border-slate-100 !bg-slate-50/50"
                allowClear
              />
              <Button
                icon={<SyncOutlined />}
                onClick={refresh}
                className="!h-10 !w-10 !rounded-xl !flex !items-center !justify-center"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 px-2">
            {[
              { label: UI_TEXT.STUDENT_ACTIVITY.FILTERS.ALL_STATUS, value: 'ALL', group: 'status' },
              {
                label: UI_TEXT.STUDENT_ACTIVITY.FILTERS.MISSING_LOGBOOK,
                value: 'MISSING',
                group: 'logbook',
              },
              { label: UI_TEXT.STUDENT_ACTIVITY.FILTERS.UNPLACED, value: '5', group: 'status' },
            ].map((filter, i) => (
              <Button
                key={i}
                onClick={() => {
                  if (filter.group === 'status') setStatusFilter(filter.value);
                  else setLogbookFilter(filter.value);
                }}
                className={`!h-8 !px-4 !rounded-full !text-[10px] !font-bold !uppercase !tracking-widest transition-all ${
                  (filter.group === 'status' ? statusFilter : logbookFilter) === filter.value
                    ? '!bg-primary !text-white border-primary shadow-lg shadow-primary/20'
                    : '!bg-slate-50 !text-slate-400 !border-slate-100 hover:!text-primary hover:!border-primary'
                }`}
              >
                {filter.label}
              </Button>
            ))}
            {(statusFilter !== 'ALL' ||
              logbookFilter !== 'ALL' ||
              enterpriseId !== 'ALL' ||
              searchTerm) && (
              <Button
                type="text"
                onClick={resetFilters}
                className="!text-[10px] !font-bold !text-primary !uppercase font-sans"
              >
                {UI_TEXT.STUDENT_ACTIVITY.FILTERS.CLEAR_FILTERS}
              </Button>
            )}
          </div>

          <DataTable
            columns={columns}
            dataSource={students}
            loading={loading}
            pagination={pagination}
            onChange={(p) => setPagination(p)}
            onRowClick={handleRowClick}
            rowKey="id"
          />
        </div>
      </Card>
    </div>
  );
}

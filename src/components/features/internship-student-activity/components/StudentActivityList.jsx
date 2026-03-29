'use client';

import {
  ExclamationCircleOutlined,
  FilterOutlined,
  ReloadOutlined,
  SearchOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Input, Select, Tooltip } from 'antd';
import { useRouter } from 'next/navigation';
import React from 'react';

import Badge from '@/components/ui/badge';
import DataTable from '@/components/ui/datatable';
import PageLayout from '@/components/ui/pagelayout';
import Pagination from '@/components/ui/pagination';
import { Progress } from '@/components/ui/progress';

import { STUDENT_ACTIVITY_UI } from '../constants/student-activity.constants';
import { useStudentActivity } from '../hooks/useStudentActivity';
import SummaryCard from './SummaryCard';

export default function StudentActivityList() {
  const router = useRouter();
  const { LIST } = STUDENT_ACTIVITY_UI;
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
    sort,
    setTermId,
    setEnterpriseId,
    setStatusFilter,
    setLogbookFilter,
    setSearchTerm,
    setPagination,
    setSort,
    resetFilters,
  } = useStudentActivity();

  const handleRowClick = (record) => {
    router.push(`/internship/students/${record.studentId || record.id}`);
  };

  const columns = [
    {
      title: 'Student',
      key: 'student',
      width: 200,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-error-surface flex items-center justify-center text-error font-black border-2 border-white shadow-sm shrink-0">
            {record.studentFullName?.charAt(0)}
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-black leading-tight tracking-tight text-slate-800">
              {record.studentFullName}
            </span>
            <span className="mt-0.5 truncate text-[10px] font-bold uppercase tracking-tighter text-slate-400">
              {record.className} • {record.studentCode}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: 'Enterprise',
      key: 'enterprise',
      width: 150,
      render: (_, record) => (
        <span className="block truncate text-sm font-black tracking-tight text-slate-700">
          {record.derivedStatus?.value === 'UNPLACED' ? (
            <span className="text-slate-200">—</span>
          ) : (
            record.enterpriseName
          )}
        </span>
      ),
    },
    {
      title: 'Mentor',
      key: 'mentor',
      width: 120,
      render: (_, record) => (
        <span className="block truncate text-sm font-bold italic tracking-tight text-primary/60">
          {record.mentorName || <span className="text-slate-200">—</span>}
        </span>
      ),
    },
    {
      title: 'Logbook',
      key: 'logbook',
      width: 140,
      render: (_, record) => {
        const { submitted, progress, missing, totalWorkDays } = record.activity;

        if (record.derivedStatus?.value === 'UNPLACED' || totalWorkDays === 0)
          return <span className="text-slate-300">—</span>;

        let strokeColor = '#10b981'; // Green
        if (progress < 50) strokeColor = '#ef4444'; // Red
        else if (progress < 75) strokeColor = '#f59e0b'; // Yellow

        return (
          <div className="flex w-full max-w-[110px] flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-500">
                {missing}/{submitted}
              </span>
              <span className="text-[10px] font-black" style={{ color: strokeColor }}>
                {progress}%
              </span>
            </div>
            <Progress
              type="line"
              percent={progress}
              strokeColor={strokeColor}
              size={['100%', 4]}
              showInfo={false}
              className="!flex-row"
            />
          </div>
        );
      },
    },
    {
      title: 'Status',
      key: 'status',
      width: 110,
      render: (_, record) => (
        <Badge
          variant={record.derivedStatus?.variant}
          size="xs"
          className="px-3 py-1 text-[9px] font-black uppercase tracking-widest"
        >
          {record.derivedStatus?.label}
        </Badge>
      ),
    },
    {
      title: 'Violations',
      key: 'violations',
      width: 80,
      align: 'center',
      render: (_, record) =>
        record.violationCount > 0 ? (
          <div className="flex items-center justify-center gap-1 rounded-lg bg-slate-50 px-2 py-1 text-xs font-bold text-slate-800 ring-1 ring-slate-100">
            <ExclamationCircleOutlined className="text-[10px] text-error" />
            {record.violationCount}
          </div>
        ) : (
          <span className="text-slate-200">—</span>
        ),
    },
  ];

  const statusOptions = [
    { label: 'All Statuses', value: 'ALL' },
    { label: 'Interning', value: 'INTERNING' },
    { label: 'No Group', value: 'NO_GROUP' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Unplaced', value: 'UNPLACED' },
  ];

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Internship', href: '/internship' },
    { label: 'Students', href: '/internship/students' },
  ];

  return (
    <PageLayout>
      <PageLayout.Header title="Internship Student List" breadcrumb={breadcrumbs} />

      <div className="grid grid-cols-1 gap-4 px-1 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title={LIST.SUMMARY.TOTAL}
          value={summary.total}
          suffix="Std"
          icon={<TeamOutlined className="text-slate-500" />}
          loading={loading}
          onClick={() => {
            resetFilters();
          }}
          active={enterpriseId === 'ALL' && statusFilter === 'ALL' && logbookFilter === 'ALL'}
        />
        <SummaryCard
          title={LIST.SUMMARY.INTERNING}
          value={summary.interning}
          suffix="Ongoing"
          icon={<div className="size-2 rounded-full bg-success" />}
          variant="success"
          loading={loading}
          onClick={() => {
            resetFilters();
            setStatusFilter('INTERNING');
          }}
          active={statusFilter === 'INTERNING'}
        />

        {/* Only show Missing Logbook if count > 0 */}
        {summary.missingLogbook > 0 && (
          <SummaryCard
            title={LIST.SUMMARY.MISSING_LOGBOOK}
            value={summary.missingLogbook}
            suffix="Missing"
            icon={<ExclamationCircleOutlined className="text-warning" />}
            variant="warning"
            loading={loading}
            onClick={() => {
              setLogbookFilter('CRITICAL');
            }}
            active={logbookFilter === 'CRITICAL'}
          />
        )}

        {/* Only show Unplaced if count > 0 */}
        {summary.unplaced > 0 && (
          <SummaryCard
            title={LIST.SUMMARY.UNPLACED}
            value={summary.unplaced}
            suffix="Unplaced"
            icon={<div className="size-2 rounded-full bg-error" />}
            variant="danger"
            loading={loading}
            onClick={() => {
              resetFilters();
              setStatusFilter('UNPLACED');
            }}
            active={statusFilter === 'UNPLACED'}
          />
        )}
      </div>

      <PageLayout.Card className="!rounded-[32px] !p-6 sm:!p-8 flex flex-1 flex-col min-h-0 mt-4">
        <PageLayout.Toolbar className="mb-6 flex-wrap gap-4">
          <Input
            prefix={<SearchOutlined className="text-slate-400" />}
            placeholder={LIST.FILTERS.SEARCH_PLACEHOLDER}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="!h-9 border-slate-200 shadow-sm !rounded-full max-w-sm"
          />

          <div className="flex flex-wrap items-center gap-3">
            <Select
              showSearch
              placeholder={LIST.FILTERS.TERM}
              value={termId}
              onChange={setTermId}
              className="!h-9 min-w-[200px]"
              classNames={{ popup: { root: '!rounded-2xl' } }}
              optionFilterProp="children"
              options={terms.map((t) => ({ label: t.name, value: t.termId }))}
              suffixIcon={<FilterOutlined className="text-slate-400" />}
            />
            <Select
              showSearch
              placeholder={LIST.FILTERS.ENTERPRISE}
              value={enterpriseId}
              onChange={setEnterpriseId}
              className="!h-9 min-w-[180px]"
              classNames={{ popup: { root: '!rounded-2xl' } }}
              options={[
                { label: 'All Enterprises', value: 'ALL' },
                ...enterprises.map((e) => ({ label: e.name, value: e.id })),
              ]}
            />
            <Select
              placeholder={LIST.FILTERS.STATUS}
              value={statusFilter}
              onChange={setStatusFilter}
              className="!h-9 min-w-[150px]"
              classNames={{ popup: { root: '!rounded-2xl' } }}
              options={statusOptions}
            />
            <Select
              placeholder={LIST.FILTERS.LOGBOOK}
              value={logbookFilter}
              onChange={setLogbookFilter}
              className="!h-9 min-w-[150px]"
              classNames={{ popup: { root: '!rounded-2xl' } }}
              options={[
                { label: 'All Logbook Status', value: 'ALL' },
                ...LIST.LOGBOOK_STATUS,
              ]}
            />
            <Tooltip title={LIST.FILTERS.RESET}>
              <button
                onClick={resetFilters}
                className="flex size-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all active:scale-95 shadow-sm"
              >
                <ReloadOutlined />
              </button>
            </Tooltip>
          </div>
        </PageLayout.Toolbar>

        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-widest text-slate-400">
            Total: <span className="text-slate-800">{pagination.total} students</span>
          </span>
        </div>

        <DataTable
          columns={columns}
          data={students}
          loading={loading}
          rowKey="id"
          onRowClick={handleRowClick}
          emptyText={
            terms.length === 0
              ? LIST.TABLE.NO_TERMS
              : searchTerm
                ? LIST.TABLE.NO_RESULTS
                : LIST.TABLE.EMPTY
          }
          sortBy={sort.column}
          sortOrder={sort.order === 'asc' ? 'Asc' : 'Desc'}
          onSort={(col, order) => setSort({ column: col, order: order.toLowerCase() })}
          className="group [&_tr]:cursor-pointer"
        />

        {pagination.total > 0 && (
          <PageLayout.Pagination
            total={pagination.total}
            page={pagination.current}
            pageSize={pagination.pageSize}
            totalPages={Math.ceil(pagination.total / pagination.pageSize)}
            onPageChange={(page) => setPagination((prev) => ({ ...prev, current: page }))}
            onPageSizeChange={(size) =>
              setPagination({ current: 1, pageSize: size, total: pagination.total })
            }
          />
        )}
      </PageLayout.Card>
    </PageLayout>
  );
}

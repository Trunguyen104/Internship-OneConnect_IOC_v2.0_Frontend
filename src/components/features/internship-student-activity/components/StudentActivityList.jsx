'use client';

import {
  CheckCircleFilled,
  ClearOutlined,
  CloseCircleFilled,
  ExclamationCircleFilled,
  SearchOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Button, Input, Progress, Select, Tooltip } from 'antd';
import { useRouter } from 'next/navigation';
import React from 'react';

import DataTable from '@/components/ui/datatable';
import PageLayout from '@/components/ui/pagelayout';
import StatusBadge from '@/components/ui/status-badge';
import { STUDENT_ACTIVITY_UI } from '@/constants/student-activity/student-activity';
import { UI_TEXT } from '@/lib/UI_Text';

import { useActivityFilters } from '../hooks/useActivityFilters';
import { useStudentList } from '../hooks/useStudentList';
import SummaryCard from './SummaryCard';

export default function StudentActivityList() {
  const router = useRouter();
  const filters = useActivityFilters();
  const {
    students,
    loading,
    summary,
    totalCount,
    pagination,
    setPagination,
    sortBy,
    sortOrder,
    onSort,
    refresh,
  } = useStudentList(filters);

  const {
    terms,
    enterprises,
    termId,
    enterpriseId,
    statusFilter,
    logbookFilter,
    searchTerm,
    setTermId,
    setEnterpriseId,
    setStatusFilter,
    setLogbookFilter,
    setSearchTerm,
    resetFilters,
  } = filters;

  const handleRowClick = (record) => {
    const id = record.studentId || record.id;
    const url =
      termId && termId !== 'ALL'
        ? `/internship/students/${id}?termId=${termId}`
        : `/internship/students/${id}`;
    router.push(url);
  };

  const columns = [
    {
      title: STUDENT_ACTIVITY_UI.LIST_COLUMNS.INDEX,
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
      title: STUDENT_ACTIVITY_UI.LIST_COLUMNS.STUDENT,
      key: 'fullname',
      width: 200,
      sorter: true,
      sortKey: 'FullName',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-bg flex items-center justify-center text-muted font-bold border border-border text-xs shrink-0 shadow-sm">
            {record.fullName?.charAt(0)}
          </div>
          <div className="flex flex-col min-w-0 pr-2">
            <span className="truncate text-sm font-bold text-text leading-tight mb-0.5">
              {record.fullName}
            </span>
            <span className="truncate text-[10px] font-bold text-muted">{record.className}</span>
          </div>
        </div>
      ),
    },
    {
      title: STUDENT_ACTIVITY_UI.LIST_COLUMNS.ENTERPRISE,
      key: 'enterprise',
      width: 140,
      render: (_, record) => (
        <span
          className="text-xs font-bold text-[var(--gray-700)] truncate block max-w-[130px]"
          title={record.enterpriseName}
        >
          {record.enterpriseName || (
            <span className="text-muted font-bold">{UI_TEXT.COMMON.EM_DASH}</span>
          )}
        </span>
      ),
    },
    {
      title: STUDENT_ACTIVITY_UI.LIST_COLUMNS.MENTOR,
      key: 'mentor',
      width: 130,
      render: (_, record) => (
        <span
          className="text-xs font-bold text-[var(--gray-700)] truncate block max-w-[120px]"
          title={record.mentorName}
        >
          {record.mentorName || (
            <span className="text-muted font-bold">{UI_TEXT.COMMON.EM_DASH}</span>
          )}
        </span>
      ),
    },
    {
      title: STUDENT_ACTIVITY_UI.LIST_COLUMNS.LOGBOOK_PROGRESS,
      key: 'logbook',
      dataIndex: 'logbook',
      sortKey: 'LogbookPercent',
      sorter: true,
      width: 160,
      render: (_, record) => {
        if (
          !record.logbook ||
          record.internshipStatus === STUDENT_ACTIVITY_UI.MAPPING.STATUS.UNPLACED ||
          record.internshipStatus === 5
        )
          return <span className="text-muted font-bold">{UI_TEXT.COMMON.EM_DASH}</span>;

        const { submitted, total: totalWorkDays, percentComplete: beProgress } = record.logbook;

        if (totalWorkDays === 0)
          return <span className="text-muted font-bold">{UI_TEXT.COMMON.EM_DASH}</span>;

        // Prioritize backend calculated value for filter consistency, fall back to manual ratio
        const rawProgress = beProgress ?? Math.round((submitted / totalWorkDays) * 100);
        const progress = Math.min(100, rawProgress);

        let strokeColor = 'var(--color-success)';
        if (progress < 50)
          strokeColor = 'var(--color-danger)'; // pink/red
        else if (progress < 75) strokeColor = 'var(--color-warning)'; // amber

        // Enhance color logic for 0%
        if (progress === 0) strokeColor = 'var(--color-danger)';

        return (
          <div className="flex w-full flex-col gap-1.5 py-1 pr-4">
            <div className="flex items-center justify-between text-[10px] font-bold">
              <span className="text-[var(--gray-600)]">
                {STUDENT_ACTIVITY_UI.LOGBOOK.REPORTS}: {submitted}/{totalWorkDays}
              </span>
              <span style={{ color: strokeColor }} className="font-extrabold">
                {progress}%
              </span>
            </div>
            <Progress
              percent={progress}
              size="small"
              showInfo={false}
              type="line"
              className="m-0 !h-1.5 [&_.ant-progress-inner]:!bg-bg shadow-sm"
              strokeColor={strokeColor}
            />
          </div>
        );
      },
    },
    {
      title: STUDENT_ACTIVITY_UI.LIST_COLUMNS.STATUS,
      key: 'status',
      width: 140,
      align: 'center',
      render: (_, record) => {
        const statuses = {
          1: { label: STUDENT_ACTIVITY_UI.STATUS_LABELS.ACTIVE, variant: 'success' },
          2: { label: STUDENT_ACTIVITY_UI.STATUS_LABELS.NO_GROUP, variant: 'warning-soft' },
          3: { label: STUDENT_ACTIVITY_UI.STATUS_LABELS.COMPLETED, variant: 'info' },
          4: { label: STUDENT_ACTIVITY_UI.STATUS_LABELS.PENDING, variant: 'warning' },
          5: { label: STUDENT_ACTIVITY_UI.STATUS_LABELS.UNPLACED, variant: 'danger' },
          [STUDENT_ACTIVITY_UI.MAPPING.STATUS.ACTIVE]: {
            label: STUDENT_ACTIVITY_UI.STATUS_LABELS.ACTIVE,
            variant: 'success',
          },
          [STUDENT_ACTIVITY_UI.MAPPING.STATUS.NO_GROUP]: {
            label: STUDENT_ACTIVITY_UI.STATUS_LABELS.NO_GROUP,
            variant: 'warning-soft',
          },
          [STUDENT_ACTIVITY_UI.MAPPING.STATUS.COMPLETED]: {
            label: STUDENT_ACTIVITY_UI.STATUS_LABELS.COMPLETED,
            variant: 'info',
          },
          [STUDENT_ACTIVITY_UI.MAPPING.STATUS.PENDING]: {
            label: STUDENT_ACTIVITY_UI.STATUS_LABELS.PENDING,
            variant: 'warning',
          },
          [STUDENT_ACTIVITY_UI.MAPPING.STATUS.UNPLACED]: {
            label: STUDENT_ACTIVITY_UI.STATUS_LABELS.UNPLACED,
            variant: 'danger',
          },
        };

        const status = statuses[record.internshipStatus] || {
          label: record.internshipStatus,
          variant: 'neutral',
        };

        // Map status variants to StatusBadge compatible variants
        const variantMap = {
          success: 'success',
          'warning-soft': 'warning',
          info: 'info',
          warning: 'warning',
          danger: 'danger',
          default: 'neutral',
        };

        return (
          <StatusBadge variant={variantMap[status.variant] || 'neutral'} label={status.label} />
        );
      },
    },
    {
      title: STUDENT_ACTIVITY_UI.LIST_COLUMNS.VIOLATIONS,
      key: 'violationCount',
      dataIndex: 'violationCount',
      sortKey: 'ViolationCount',
      sorter: true,
      width: 90,
      align: 'center',
      render: (count) => {
        if (!count || count === 0) return null;
        return (
          <div className="flex items-center justify-center gap-1.5 py-1">
            <ExclamationCircleFilled className="!text-red-500 scale-110 drop-shadow-sm" />
            <span className="text-xs font-black !text-red-500">{count}</span>
          </div>
        );
      },
    },
  ];

  return (
    <PageLayout>
      <PageLayout.Header title={STUDENT_ACTIVITY_UI.TITLE} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <SummaryCard
          title={STUDENT_ACTIVITY_UI.STATS.TOTAL}
          value={summary.total}
          loading={loading}
          active={statusFilter === 'ALL'}
          onClick={() => setStatusFilter('ALL')}
          variant="neutral"
          icon={<TeamOutlined className="opacity-90 mt-0.5" />}
          suffix={STUDENT_ACTIVITY_UI.STATS.STUDENTS_LABEL}
        />
        <SummaryCard
          title={STUDENT_ACTIVITY_UI.STATS.PLACED}
          value={summary.interning}
          loading={loading}
          active={statusFilter === 1 || statusFilter === '1'}
          onClick={() => setStatusFilter(1)}
          variant="success"
          icon={<CheckCircleFilled className="opacity-90 mt-0.5" />}
          suffix={STUDENT_ACTIVITY_UI.STATS.STUDENTS_LABEL}
        />
        <SummaryCard
          title={STUDENT_ACTIVITY_UI.STATS.UNPLACED}
          value={summary.unplaced}
          loading={loading}
          active={statusFilter === 5 || statusFilter === '5'}
          onClick={() => setStatusFilter(5)}
          variant="danger"
          icon={<CloseCircleFilled className="opacity-90 mt-0.5" />}
          suffix={STUDENT_ACTIVITY_UI.STATS.STUDENTS_LABEL}
        />
        <SummaryCard
          title={STUDENT_ACTIVITY_UI.STATS.NO_MENTOR}
          value={summary.noMentor}
          loading={loading}
          active={statusFilter === 2 || statusFilter === '2'}
          onClick={() => setStatusFilter(2)}
          variant="warning"
          icon={<ExclamationCircleFilled className="opacity-90 mt-0.5" />}
          suffix={STUDENT_ACTIVITY_UI.STATS.STUDENTS_LABEL}
        />
      </div>

      <PageLayout.Card>
        <PageLayout.Toolbar>
          <div className="flex w-full flex-wrap items-center gap-3">
            <Input
              prefix={<SearchOutlined className="text-muted" />}
              placeholder={STUDENT_ACTIVITY_UI.FILTERS.SEARCH_STUDENTS}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-56 rounded-full bg-bg/80 hover:bg-[var(--gray-200)]/50 border-transparent focus:bg-surface px-4 py-1.5 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              allowClear
            />
            <Select
              value={termId === 'ALL' ? undefined : termId}
              onChange={(val) => setTermId(val || 'ALL')}
              showSearch
              disabled={terms.length === 0}
              placeholder={
                terms.length === 0
                  ? STUDENT_ACTIVITY_UI.FILTERS.NO_TERM_FOUND
                  : STUDENT_ACTIVITY_UI.FILTERS.CHOOSE_TERM
              }
              className="w-40 min-w-[160px]"
              optionFilterProp="label"
              allowClear
              options={terms.map((term) => ({
                value: term.termId || term.id,
                label: term.termName || term.name,
              }))}
            />
            <Select
              value={enterpriseId === 'ALL' ? undefined : enterpriseId}
              onChange={(val) => setEnterpriseId(val || 'ALL')}
              className="w-48"
              showSearch
              allowClear
              placeholder={STUDENT_ACTIVITY_UI.FILTERS.ALL_ENTERPRISES}
              optionFilterProp="label"
              options={[
                ...enterprises.map((ent) => ({
                  value: ent.enterpriseId || ent.id,
                  label: ent.name || ent.enterpriseName,
                })),
              ]}
            />
            <Select
              value={statusFilter === 'ALL' ? undefined : statusFilter}
              onChange={(val) => setStatusFilter(val === undefined ? 'ALL' : val)}
              className="w-40"
              allowClear
              placeholder={STUDENT_ACTIVITY_UI.FILTERS.ALL_STATUS}
              options={[
                { value: 1, label: STUDENT_ACTIVITY_UI.FILTERS.ACTIVE_INTERNING },
                { value: 2, label: STUDENT_ACTIVITY_UI.FILTERS.NO_GROUP_YET },
                { value: 3, label: STUDENT_ACTIVITY_UI.FILTERS.COMPLETED_TERM },
                { value: 5, label: STUDENT_ACTIVITY_UI.FILTERS.UNPLACED_STATUS },
              ]}
            />
            <Select
              value={logbookFilter === 'ALL' ? undefined : logbookFilter}
              onChange={(val) => setLogbookFilter(val === undefined ? 'ALL' : val)}
              className="w-48"
              allowClear
              placeholder={STUDENT_ACTIVITY_UI.FILTERS.ALL_LOGBOOK}
              options={[
                { value: 1, label: STUDENT_ACTIVITY_UI.FILTERS.LOGBOOK_GOOD },
                { value: 2, label: STUDENT_ACTIVITY_UI.FILTERS.LOGBOOK_MEDIUM },
                { value: 3, label: STUDENT_ACTIVITY_UI.FILTERS.LOGBOOK_POOR },
              ]}
            />
            <div className="ml-auto inline-flex items-center gap-2">
              <Tooltip title={STUDENT_ACTIVITY_UI.FILTERS.CLEAR_ALL_TOOLTIP}>
                <Button
                  danger
                  icon={<ClearOutlined />}
                  onClick={resetFilters}
                  className="!h-8 !w-8 !rounded-full !flex !items-center !justify-center !bg-danger-surface hover:!bg-[var(--primary-100)] !border-transparent text-danger"
                />
              </Tooltip>
            </div>
          </div>
        </PageLayout.Toolbar>

        <PageLayout.Content>
          <DataTable
            columns={columns}
            data={students}
            loading={loading}
            pagination={false}
            onRowClick={handleRowClick}
            rowKey="studentId"
            size="small"
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={onSort}
            className="flex-none h-[350px]"
            emptyText={
              terms.length === 0 && !loading ? (
                <div className="flex flex-col items-center justify-center gap-2 py-8">
                  <span className="text-slate-500 font-medium text-sm">
                    {STUDENT_ACTIVITY_UI.FILTERS.NO_TERM_HINT}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 py-8">
                  <span className="text-slate-500 font-medium text-sm">
                    {STUDENT_ACTIVITY_UI.FILTERS.NO_STUDENT_MATCH}
                  </span>
                </div>
              )
            }
          />
        </PageLayout.Content>

        <PageLayout.Pagination
          total={totalCount}
          page={pagination.current}
          pageSize={pagination.pageSize}
          onPageChange={(page) => setPagination((prev) => ({ ...prev, current: page }))}
          onPageSizeChange={(size) =>
            setPagination((prev) => ({ ...prev, pageSize: size, current: 1 }))
          }
        />
      </PageLayout.Card>
    </PageLayout>
  );
}

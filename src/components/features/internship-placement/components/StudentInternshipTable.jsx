'use client';

import {
  CalendarOutlined,
  CloseCircleOutlined,
  FilterOutlined,
  SwapOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button as AntButton, Select, Space, Tooltip } from 'antd';
import React, { useMemo, useState } from 'react';

import { StudentService } from '@/components/features/internship-enrollment-management/services/student.service';
import Badge from '@/components/ui/badge';
import DataTable from '@/components/ui/datatable';
import DataTableToolbar from '@/components/ui/datatabletoolbar';
import PageLayout from '@/components/ui/pagelayout';
import {
  PLACEMENT_UI_TEXT,
  SEMESTER_STATUS,
} from '@/constants/internship-placement/placement.constants';
import { UI_TEXT } from '@/lib/UI_Text';

import { BulkAssignModal, BulkReassignModal, BulkUnassignModal } from './BulkPlacementModals';
import StudentRowActions from './StudentRowActions';

/**
 * Main table for Student Internship Semester.
 * AC-09: Displays columns and provides row/bulk actions.
 */
const StudentInternshipTable = ({
  semesterId,
  semesterStatus = SEMESTER_STATUS.ACTIVE,
  termName,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  terms,
  isLoadingTerms,
  onTermChange,
  hideTermSelect = false,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [modalType, setModalType] = useState(null); // 'assign', 'reassign', 'unassign'

  // Pagination state synced with enrollment pattern
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const UI = PLACEMENT_UI_TEXT.TABLE;

  const { data: res, isLoading: isLoadingStudents } = useQuery({
    queryKey: ['semester-students', semesterId, page, pageSize, searchTerm, statusFilter],
    queryFn: () =>
      StudentService.getAll(semesterId, {
        pageNumber: page,
        pageSize,
        searchTerm,
        placementStatus: statusFilter,
      }),
    enabled: !!semesterId,
  });

  const isLoading = isLoadingStudents;

  const students = useMemo(() => {
    const rawItems = res?.data?.items || res?.items || [];

    return rawItems.map((s) => {
      // AC-11 Sync: Match StudentStatus Enum (1-6)
      let rawStatus = s.displayStatus || s.placementStatus;

      // Map based on StudentStatus Enum
      // 1: NO_INTERNSHIP, 2: APPLIED, 3: IN_PROGRESS, 4: COMPLETED, 5: UNPLACED, 6: PLACED
      if (rawStatus === 1 || rawStatus === 5 || rawStatus === 'UNPLACED') rawStatus = 5;
      if (rawStatus === 3 || rawStatus === 6 || rawStatus === 'PLACED') rawStatus = 6;
      if (rawStatus === 2 || rawStatus === 'PENDING_ASSIGNMENT' || rawStatus === 'PENDING')
        rawStatus = 4;

      const isPending = rawStatus === 4;
      const isPlaced = rawStatus === 6;
      let displayStatus = rawStatus;
      let activeEnterprise = s.enterpriseName;

      if (isPending) {
        displayStatus = 4; // PENDING_ASSIGNMENT
        if (!activeEnterprise || activeEnterprise === '— Unassigned —') {
          activeEnterprise = 'Assigning...';
        }
      }

      return {
        ...s,
        enterpriseName: activeEnterprise,
        id: s.studentCode || s.id,
        displayStatus,
        isPending,
        isPlaced,
        // Critical: ensure Metadata is available even if StudentService missed it
        applicationId: s.applicationId || null,
        hasInternshipData: s.hasInternshipData || false,
      };
    });
  }, [res]);

  const pagination = {
    current: res?.data?.pageNumber || page,
    pageSize: res?.data?.pageSize || pageSize,
    total: res?.data?.totalCount || 0,
  };

  const onSelectChange = (newSelectedRowKeys, newSelectedRows) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRows(newSelectedRows);
  };

  const isEnded =
    semesterStatus === SEMESTER_STATUS.ENDED || semesterStatus === SEMESTER_STATUS.CLOSED;

  const columns = [
    {
      title: '#',
      key: 'index',
      width: 70,
      align: 'center',
      render: (_, __, index) => (
        <span className="text-muted font-mono text-[11px] font-bold">
          {String((pagination.current - 1) * pagination.pageSize + index + 1).padStart(2, '0')}
        </span>
      ),
    },
    {
      title: UI.FULL_NAME,
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text, record) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-text text-sm font-bold tracking-tight">{text}</span>
          <span className="text-muted font-mono text-[10px] font-semibold opacity-70">
            {record.studentCode || record.studentId}
          </span>
        </div>
      ),
    },
    {
      title: 'STUDENT ID',
      dataIndex: 'studentCode',
      key: 'studentCode',
      width: 140,
      render: (code, record) => (
        <span className="text-muted font-mono text-xs font-semibold">
          {code || record.studentId}
        </span>
      ),
    },
    {
      title: UI.MAJOR,
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
      title: 'PLACEMENT',
      dataIndex: 'enterpriseName',
      key: 'enterpriseName',
      width: 220,
      render: (text, record) => {
        const isPlaced = record.isPlaced;
        const isPending = record.isPending;

        let displayName = text;
        if (!displayName || displayName === '— Unassigned —' || displayName === '— UNPLACED —') {
          if (isPlaced) displayName = 'PLACED';
          else if (isPending) displayName = 'PENDING';
          else displayName = '— UNPLACED —';
        }

        return (
          <div className="flex flex-col">
            <Tooltip title={displayName}>
              <span
                className={`block truncate text-[11px] font-bold uppercase tracking-wider whitespace-nowrap ${
                  isPlaced || isPending ? 'text-text' : 'text-muted opacity-40'
                }`}
              >
                {displayName}
              </span>
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: 'STATUS',
      dataIndex: 'displayStatus',
      key: 'displayStatus',
      width: 160,
      align: 'center',
      render: (status) => {
        const variants = {
          0: 'info',
          5: 'success',
          1: 'success',
          4: 'warning',
        };
        const labels = {
          0: 'UNPLACED',
          5: 'PLACED',
          1: 'PLACED',
          4: 'PENDING',
        };
        return <Badge variant={variants[status] || 'default'}>{labels[status] || 'UNKNOWN'}</Badge>;
      },
    },
    {
      title: '',
      key: 'action',
      width: 60,
      align: 'right',
      render: (_, record) => (
        <StudentRowActions
          student={record}
          semesterId={semesterId}
          semesterStatus={semesterStatus}
          termName={termName}
          onUnassign={(student) => {
            setSelectedRows([student]);
            setModalType('unassign');
          }}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      <DataTableToolbar className="mb-4 !border-0 !p-0">
        <DataTableToolbar.Search
          placeholder="Search by name, email or major..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />

        <DataTableToolbar.Filters className="gap-0">
          <Space.Compact className="w-full overflow-hidden rounded-xl border border-border shadow-sm sm:w-auto">
            {!hideTermSelect && (
              <>
                <Select
                  loading={isLoadingTerms}
                  placeholder="Select term..."
                  value={semesterId}
                  onChange={onTermChange}
                  className="!h-11 min-w-[200px] !border-0 focus:!ring-0"
                  variant="borderless"
                  options={terms.map((t) => ({
                    label: `${t.name} ${t.status === SEMESTER_STATUS.ACTIVE ? '(Active)' : ''}`,
                    value: t.termId || t.id,
                  }))}
                  suffixIcon={<CalendarOutlined className="text-muted/40" />}
                />
                <div className="bg-border h-6 w-px self-center opacity-50" />
              </>
            )}
            <Select
              allowClear
              placeholder="All Status"
              value={statusFilter}
              onChange={setStatusFilter}
              className="!h-11 min-w-[140px] !border-0 focus:!ring-0"
              variant="borderless"
              options={[
                { label: 'Unplaced', value: 0 },
                { label: 'Pending', value: 4 },
                { label: 'Placed', value: 5 },
              ]}
              suffixIcon={<FilterOutlined className="text-muted/40" />}
            />
          </Space.Compact>
        </DataTableToolbar.Filters>

        <DataTableToolbar.Actions className="ml-auto gap-3">
          {selectedRowKeys.length > 0 && (
            <Space
              size="middle"
              className="bg-primary/5 px-4 py-1.5 rounded-xl border border-primary/10"
            >
              <span className="text-[11px] font-bold text-primary uppercase tracking-widest leading-none">
                {selectedRowKeys.length} {UI.SELECTED}
              </span>
              <div className="w-px h-4 bg-primary/20" />
              <Tooltip title={isEnded ? PLACEMENT_UI_TEXT.ACTIONS.ENDED_TOOLTIP : UI.ACTION_ASSIGN}>
                <AntButton
                  type="text"
                  size="small"
                  className="flex items-center justify-center !text-primary hover:!bg-primary/10"
                  icon={<UserAddOutlined />}
                  onClick={() => setModalType('assign')}
                  disabled={isEnded}
                />
              </Tooltip>
              <Tooltip title={isEnded ? PLACEMENT_UI_TEXT.ACTIONS.ENDED_TOOLTIP : UI.ACTION_CHANGE}>
                <AntButton
                  type="text"
                  size="small"
                  className="flex items-center justify-center !text-primary hover:!bg-primary/10"
                  icon={<SwapOutlined />}
                  onClick={() => setModalType('reassign')}
                  disabled={isEnded}
                />
              </Tooltip>
              {!isEnded && (
                <Tooltip title={UI.ACTION_CANCEL}>
                  <AntButton
                    type="text"
                    size="small"
                    className="flex items-center justify-center !text-red-500 hover:!bg-red-50"
                    icon={<CloseCircleOutlined />}
                    onClick={() => setModalType('unassign')}
                  />
                </Tooltip>
              )}
            </Space>
          )}
        </DataTableToolbar.Actions>
      </DataTableToolbar>

      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        <DataTable
          columns={columns}
          data={students}
          loading={isLoading}
          rowSelection={{
            selectedRowKeys,
            onChange: onSelectChange,
          }}
          rowKey="studentTermId"
          size="small"
          minWidth="1000px"
        />
      </div>

      {pagination.total > 0 && (
        <PageLayout.Footer className="flex items-center justify-between border-t border-border mt-4 pt-4">
          <span className="text-[12px] font-bold uppercase tracking-tight text-slate-400">
            {UI_TEXT.COMMON.TOTAL}:{' '}
            <span className="font-extrabold text-slate-800">{pagination.total}</span>
          </span>
          <PageLayout.Pagination
            total={pagination.total}
            page={pagination.current}
            pageSize={pagination.pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            className="mt-0 border-t-0 pt-0"
          />
        </PageLayout.Footer>
      )}

      {/* Modals */}
      <BulkAssignModal
        visible={modalType === 'assign'}
        onClose={() => setModalType(null)}
        selectedStudents={selectedRows}
        semesterId={semesterId}
        termName={termName}
      />
      <BulkReassignModal
        visible={modalType === 'reassign'}
        onClose={() => setModalType(null)}
        selectedStudents={selectedRows}
        semesterId={semesterId}
        termName={termName}
      />
      <BulkUnassignModal
        visible={modalType === 'unassign'}
        onClose={() => setModalType(null)}
        selectedStudents={selectedRows}
        semesterId={semesterId}
      />
    </div>
  );
};

export default StudentInternshipTable;

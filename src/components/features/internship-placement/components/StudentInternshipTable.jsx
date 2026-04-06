'use client';

import {
  CalendarOutlined,
  CloseCircleOutlined,
  SwapOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { Button as AntButton, Select, Space, Tooltip } from 'antd';
import React from 'react';

import DataTable from '@/components/ui/datatable';
import DataTableToolbar from '@/components/ui/datatabletoolbar';
import PageLayout from '@/components/ui/pagelayout';
import StatusBadge from '@/components/ui/status-badge';
import {
  PLACEMENT_STATUS_LABELS,
  PLACEMENT_STATUS_VARIANTS,
  PLACEMENT_UI_TEXT,
  SEMESTER_STATUS,
} from '@/constants/internship-placement/placement.constants';
import { UI_TEXT } from '@/lib/UI_Text';

import { useInternshipPlacement } from '../hooks/useInternshipPlacement';
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
  terms,
  isLoadingTerms,
  onTermChange,
  hideTermSelect = false,
}) => {
  const UI = PLACEMENT_UI_TEXT.TABLE;

  const {
    students,
    isLoading,
    selectedRowKeys,
    selectedRows,
    modalType,
    searchTerm,
    pagination,
    isEnded,
    onSelectChange,
    setPage,
    setPageSize,
    handleSearch,
    handleOpenAssign,
    handleOpenReassign,
    handleOpenUnassign,
    handleCloseModal,
  } = useInternshipPlacement({
    semesterId,
    semesterStatus,
  });

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
      width: 200,
      render: (text) => <span className="text-text text-sm font-bold tracking-tight">{text}</span>,
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
      title: UI.PLACEMENT,
      dataIndex: 'enterpriseName',
      key: 'enterpriseName',
      width: 220,
      render: (text, record) => {
        const isPlaced = record.isPlaced;
        const isPending = record.isPending;

        let displayName = text;
        if (!displayName || displayName === UI.UNASSIGNED || displayName === '— UNPLACED —') {
          if (isPlaced) displayName = PLACEMENT_UI_TEXT.STATUS_LABELS.PLACED;
          else if (isPending) displayName = PLACEMENT_UI_TEXT.STATUS_LABELS.PENDING_ASSIGNMENT;
          else displayName = PLACEMENT_UI_TEXT.STATUS_LABELS.UNPLACED;
        }

        const variant = isPlaced ? 'success' : isPending ? 'warning' : 'neutral';

        return (
          <StatusBadge
            variant={variant}
            label={displayName}
            showDot={isPlaced || isPending}
            variantType="minimal"
            className="opacity-90"
          />
        );
      },
    },
    {
      title: UI.STATUS,
      dataIndex: 'displayStatus',
      key: 'displayStatus',
      width: 160,
      align: 'center',
      render: (status) => {
        const variantMap = {
          'info-soft': 'info',
          'warning-soft': 'warning',
          'success-soft': 'success',
          'error-soft': 'danger',
          muted: 'neutral',
        };
        const rawVariant = PLACEMENT_STATUS_VARIANTS[status] || 'default';
        const variant = variantMap[rawVariant] || 'neutral';
        const label = PLACEMENT_STATUS_LABELS[status] || PLACEMENT_UI_TEXT.STATUS_LABELS.UNKNOWN;

        return <StatusBadge variant={variant} label={label} />;
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
          onUnassign={handleOpenUnassign}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      <DataTableToolbar className="mb-4 !border-0 !p-0">
        <DataTableToolbar.Search
          placeholder={UI.SEARCH_PLACEHOLDER}
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="max-w-md"
        />

        {!hideTermSelect && (
          <DataTableToolbar.Filters>
            <Select
              loading={isLoadingTerms}
              placeholder={UI.SELECT_TERM}
              value={semesterId}
              onChange={onTermChange}
              className="!h-11 min-w-[200px] rounded-xl border border-border shadow-sm focus:!ring-0"
              options={terms.map((t) => ({
                label: `${t.name} ${t.status === SEMESTER_STATUS.ACTIVE ? PLACEMENT_UI_TEXT.PAGE.ACTIVE_SUFFIX : ''}`,
                value: t.termId || t.id,
              }))}
              suffixIcon={<CalendarOutlined className="text-muted/40" />}
            />
          </DataTableToolbar.Filters>
        )}

        {selectedRowKeys.length > 0 && (
          <DataTableToolbar.Actions className="ml-auto gap-3">
            <Space
              size="middle"
              className="bg-primary-surface px-4 py-1.5 rounded-xl border border-primary/20"
            >
              <span className="text-[11px] font-bold text-primary uppercase tracking-widest leading-none">
                {selectedRowKeys.length} {UI.SELECTED}
              </span>
              <div className="w-px h-4 bg-primary/30" />
              <Tooltip title={isEnded ? PLACEMENT_UI_TEXT.ACTIONS.ENDED_TOOLTIP : UI.ACTION_ASSIGN}>
                <AntButton
                  type="text"
                  size="small"
                  className="flex items-center justify-center !text-primary hover:!bg-primary-surface"
                  icon={<UserAddOutlined />}
                  onClick={handleOpenAssign}
                  disabled={isEnded}
                />
              </Tooltip>
              <Tooltip title={isEnded ? PLACEMENT_UI_TEXT.ACTIONS.ENDED_TOOLTIP : UI.ACTION_CHANGE}>
                <AntButton
                  type="text"
                  size="small"
                  className="flex items-center justify-center !text-primary hover:!bg-primary-surface"
                  icon={<SwapOutlined />}
                  onClick={handleOpenReassign}
                  disabled={isEnded}
                />
              </Tooltip>
              {!isEnded && (
                <Tooltip title={UI.ACTION_CANCEL}>
                  <AntButton
                    type="text"
                    size="small"
                    className="flex items-center justify-center !text-danger hover:!bg-danger-surface"
                    icon={<CloseCircleOutlined />}
                    onClick={handleOpenUnassign}
                  />
                </Tooltip>
              )}
            </Space>
          </DataTableToolbar.Actions>
        )}
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
          <span className="text-[12px] font-bold uppercase tracking-tight text-muted">
            {UI_TEXT.COMMON.TOTAL}:{' '}
            <span className="font-extrabold text-text">{pagination.total}</span>
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
        onClose={handleCloseModal}
        selectedStudents={selectedRows}
        semesterId={semesterId}
        termName={termName}
      />
      <BulkReassignModal
        visible={modalType === 'reassign'}
        onClose={handleCloseModal}
        selectedStudents={selectedRows}
        semesterId={semesterId}
        termName={termName}
      />
      <BulkUnassignModal
        visible={modalType === 'unassign'}
        onClose={handleCloseModal}
        selectedStudents={selectedRows}
        semesterId={semesterId}
      />
    </div>
  );
};

export default StudentInternshipTable;

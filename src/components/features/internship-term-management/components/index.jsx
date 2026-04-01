'use client';

import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  PlusOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { Button, Select, Tooltip } from 'antd';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';

import StudentPageHeader from '@/components/layout/StudentPageHeader';
import DataTable from '@/components/ui/datatable';
import DataTableToolbar from '@/components/ui/datatabletoolbar';
import PageLayout from '@/components/ui/pagelayout';
import Pagination from '@/components/ui/pagination';
import StatusBadge from '@/components/ui/status-badge';
import {
  INTERNSHIP_MANAGEMENT_UI,
  TERM_STATUS,
  TERM_STATUS_VARIANTS,
} from '@/constants/internship-management/internship-management';

import { useTermManagement } from '../hooks/useTermManagement';
import TermDeleteModal from './TermDeleteModal';
import TermFormModal from './TermFormModal';
import TermStatusModal from './TermStatusModal';

export default function InternshipTermManagement() {
  const { TERM_MANAGEMENT } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN;

  const {
    data,
    loading,
    searchTerm,
    statusFilter,
    pagination,
    modalVisible,
    submitLoading,
    editingRecord,
    viewOnly,
    statusModalState,
    deleteModalState,
    setModalVisible,
    handleSearchChange,
    handleStatusChange,
    handleTableChange,
    handleSortChange,
    handleCreateNew,
    handleEdit,
    handleView,
    handleRequestDelete,
    handleDelete,
    handleRequestChangeStatus,
    handleChangeStatus,
    handleSaveModal,
    universities,
    isSuperAdmin,
    userUniversity,
    sortConfig,
  } = useTermManagement();

  const { TABLE, STATUS_LABELS, ACTIONS } = TERM_MANAGEMENT;

  const columns = useMemo(
    () => [
      {
        title: '#',
        key: 'index',
        width: 80,
        align: 'center',
        render: (_, __, index) => (
          <span className="text-muted font-mono text-xs font-bold">
            {String((pagination.current - 1) * pagination.pageSize + index + 1).padStart(2, '0')}
          </span>
        ),
      },
      {
        title: TABLE.COLUMNS.NAME,
        dataIndex: 'name',
        key: 'name',
        sortKey: 'name',
        sorter: true,
        render: (text) => (
          <span className="text-text block max-w-[300px] truncate text-sm font-bold tracking-tight">
            {text}
          </span>
        ),
      },
      {
        title: TABLE.COLUMNS.START_DATE,
        dataIndex: 'startDate',
        key: 'startDate',
        sortKey: 'startDate',
        sorter: true,
        width: 150,
        align: 'center',
        render: (date) => (
          <span className="text-muted text-xs font-medium">
            {dayjs(date).format('DD MMM, YYYY')}
          </span>
        ),
      },
      {
        title: TABLE.COLUMNS.END_DATE,
        dataIndex: 'endDate',
        key: 'endDate',
        sortKey: 'endDate',
        sorter: true,
        width: 150,
        align: 'center',
        render: (date) => (
          <span className="text-muted text-xs font-medium">
            {dayjs(date).format('DD MMM, YYYY')}
          </span>
        ),
      },
      {
        title: TABLE.COLUMNS.STATUS,
        dataIndex: 'status',
        key: 'status',
        sortKey: 'status',
        sorter: true,
        width: 140,
        align: 'center',
        render: (status) => {
          const variant = TERM_STATUS_VARIANTS[status] || 'default';
          const label = STATUS_LABELS[status] || status;
          return <StatusBadge variant={variant} label={label} />;
        },
      },
      {
        title: TABLE.COLUMNS.ACTIONS,
        key: 'actions',
        width: 160,
        align: 'right',
        render: (_, record) => {
          const status = Number(record.status);
          const isClosed = status === TERM_STATUS.CLOSED;
          const isUpcoming = status === TERM_STATUS.UPCOMING;
          const isActive = status === TERM_STATUS.ACTIVE;

          return (
            <div className="flex items-center justify-end gap-1.5">
              <Tooltip title={ACTIONS.VIEW}>
                <Button
                  type="text"
                  size="small"
                  icon={<EyeOutlined />}
                  className="hover:bg-primary/10 hover:text-primary text-muted flex size-8 items-center justify-center !rounded-xl transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleView(record);
                  }}
                />
              </Tooltip>

              {!isClosed && (
                <Tooltip title={ACTIONS.EDIT}>
                  <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    className="hover:bg-primary/10 hover:text-primary text-muted flex size-8 items-center justify-center !rounded-xl transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(record);
                    }}
                  />
                </Tooltip>
              )}

              {isUpcoming && (
                <Tooltip title={ACTIONS.DELETE}>
                  <Button
                    type="text"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    className="hover:bg-danger/10 hover:text-danger text-muted flex size-8 items-center justify-center !rounded-xl transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRequestDelete(record);
                    }}
                  />
                </Tooltip>
              )}

              {isActive && (
                <Tooltip title={ACTIONS.CLOSE}>
                  <Button
                    type="text"
                    size="small"
                    danger
                    icon={<StopOutlined />}
                    className="hover:bg-danger/10 hover:text-danger text-muted flex size-8 items-center justify-center !rounded-xl transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRequestChangeStatus(record, TERM_STATUS.CLOSED);
                    }}
                  />
                </Tooltip>
              )}
            </div>
          );
        },
      },
    ],
    [
      pagination.current,
      pagination.pageSize,
      TABLE,
      STATUS_LABELS,
      ACTIONS,
      handleRequestChangeStatus,
      handleEdit,
      handleView,
      handleRequestDelete,
    ]
  );

  return (
    <PageLayout className="animate-in fade-in flex min-h-0 flex-1 flex-col space-y-6 duration-500">
      <StudentPageHeader title={TERM_MANAGEMENT.TITLE} />

      <PageLayout.Card className="flex min-h-0 flex-1 flex-col overflow-hidden !p-4 sm:!p-8">
        <DataTableToolbar className="mb-6 !border-0 !p-0">
          <DataTableToolbar.Search
            placeholder={TERM_MANAGEMENT.SEARCH_PLACEHOLDER}
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          <DataTableToolbar.Filters className="gap-4">
            <Select
              allowClear
              placeholder={TERM_MANAGEMENT.STATUS_FILTER}
              value={statusFilter ?? undefined}
              onChange={handleStatusChange}
              className="!h-10 min-w-[200px]"
              options={TERM_MANAGEMENT.STATUS_OPTIONS}
              suffixIcon={<FilterOutlined className="text-muted/60" />}
            />
          </DataTableToolbar.Filters>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateNew}
            className="!h-10 !rounded-xl shadow-md ml-auto"
          >
            {TERM_MANAGEMENT.CREATE_BTN}
          </Button>
        </DataTableToolbar>

        <DataTable
          columns={columns}
          data={data}
          loading={loading}
          rowKey="termId"
          className="mt-4"
          sortBy={sortConfig.column}
          sortOrder={sortConfig.order === 'asc' ? 'Asc' : 'Desc'}
          onSort={handleSortChange}
          size="small"
          minWidth="800px"
        />

        <div className="border-border/50 mt-auto flex-shrink-0 border-t pt-6">
          <Pagination
            total={pagination.total || 0}
            page={pagination.current}
            pageSize={pagination.pageSize}
            totalPages={Math.max(1, Math.ceil((pagination.total || 0) / pagination.pageSize))}
            onPageChange={(page) => handleTableChange({ current: page })}
          />
        </div>
      </PageLayout.Card>

      <TermFormModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSave={handleSaveModal}
        loading={submitLoading}
        initialValues={editingRecord}
        viewOnly={viewOnly}
        universities={universities}
        isSuperAdmin={isSuperAdmin}
        userUniversity={userUniversity}
      />

      <TermStatusModal
        open={statusModalState.open}
        record={statusModalState.record}
        newStatus={statusModalState.newStatus}
        onCancel={() => handleRequestChangeStatus(null, null)}
        onConfirm={handleChangeStatus}
      />

      <TermDeleteModal
        open={deleteModalState.open}
        record={deleteModalState.record}
        onCancel={() => handleRequestDelete(null)}
        onConfirm={handleDelete}
        loading={submitLoading}
      />
    </PageLayout>
  );
}

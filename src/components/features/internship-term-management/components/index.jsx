'use client';

import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  LoginOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { Select } from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react';

import DataTable from '@/components/ui/datatable';
import PageLayout from '@/components/ui/pagelayout';
import StatusBadge from '@/components/ui/status-badge';
import TableRowDropdown from '@/components/ui/TableRowActions';
import {
  INTERNSHIP_MANAGEMENT_UI,
  TERM_STATUS,
  TERM_STATUS_VARIANTS,
} from '@/constants/internship-management/internship-management';
import { UI_TEXT } from '@/lib/UI_Text';

import { useTermManagement } from '../hooks/useTermManagement';
import TermDeleteModal from './TermDeleteModal';
import TermFormModal from './TermFormModal';
import TermStatusModal from './TermStatusModal';

export default function InternshipTermManagement() {
  const router = useRouter();
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
    handlePageSizeChange,
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
        render: (text, record) => (
          <span
            className="text-primary block max-w-[300px] cursor-pointer truncate text-sm font-bold tracking-tight hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/school/terms/${record.termId}/overview`);
            }}
          >
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
        title: '',
        key: 'actions',
        width: 48,
        align: 'right',
        render: (_, record) => {
          const status = Number(record.status);
          const isClosed = status === TERM_STATUS.CLOSED;
          const isUpcoming = status === TERM_STATUS.UPCOMING;
          const isActive = status === TERM_STATUS.ACTIVE;

          const items = [
            {
              key: 'manage',
              label: 'Quản lý', // or UI_TEXT.COMMON.MANAGE
              icon: <LoginOutlined />,
              onClick: () => router.push(`/school/terms/${record.termId}/overview`),
            },
            { type: 'divider' },
            {
              key: 'view',
              label: ACTIONS.VIEW,
              icon: <EyeOutlined />,
              onClick: () => handleView(record),
            },
          ];

          if (!isClosed) {
            items.push({
              key: 'edit',
              label: ACTIONS.EDIT,
              icon: <EditOutlined />,
              onClick: () => handleEdit(record),
            });
          }

          if (isUpcoming) {
            items.push({ type: 'divider' });
            items.push({
              key: 'delete',
              label: ACTIONS.DELETE,
              icon: <DeleteOutlined />,
              danger: true,
              onClick: () => handleRequestDelete(record),
            });
          }

          if (isActive) {
            items.push({ type: 'divider' });
            items.push({
              key: 'close',
              label: ACTIONS.CLOSE,
              icon: <StopOutlined />,
              danger: true,
              onClick: () => handleRequestChangeStatus(record, TERM_STATUS.CLOSED),
            });
          }

          return (
            <div className="flex justify-end pr-1" onClick={(e) => e.stopPropagation()}>
              <TableRowDropdown items={items} />
            </div>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps -- row index uses pagination.current/pageSize (React Compiler)
    [
      pagination.current,
      pagination.pageSize,
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
    <PageLayout>
      <PageLayout.Header title={TERM_MANAGEMENT.TITLE} subtitle={TERM_MANAGEMENT.PAGE_SUBTITLE} />

      <PageLayout.Card className="flex flex-col overflow-hidden">
        <PageLayout.Toolbar
          searchProps={{
            placeholder: TERM_MANAGEMENT.SEARCH_PLACEHOLDER,
            value: searchTerm,
            onChange: (e) => handleSearchChange(e.target.value),
            className: 'max-w-md',
          }}
          filterContent={
            <Select
              allowClear
              placeholder={TERM_MANAGEMENT.STATUS_FILTER}
              value={statusFilter ?? undefined}
              onChange={handleStatusChange}
              className="h-11 w-full min-w-[200px] md:w-64"
              rootClassName="premium-select"
              options={TERM_MANAGEMENT.STATUS_OPTIONS}
              suffixIcon={<FilterOutlined className="text-primary" />}
            />
          }
          actionProps={{
            label: TERM_MANAGEMENT.CREATE_BTN,
            onClick: handleCreateNew,
          }}
        />

        <PageLayout.Content className="px-0">
          <DataTable
            columns={columns}
            data={data}
            loading={loading}
            rowKey="termId"
            sortBy={sortConfig.column}
            sortOrder={sortConfig.order === 'asc' ? 'Asc' : 'Desc'}
            onSort={handleSortChange}
            size="small"
            minWidth="800px"
          />
        </PageLayout.Content>

        {pagination.total > 0 && (
          <PageLayout.Footer className="flex items-center justify-between">
            <span className="text-[12px] font-bold uppercase tracking-tight text-slate-400">
              {UI_TEXT.COMMON.TOTAL}:{' '}
              <span className="font-extrabold text-slate-800">{pagination.total}</span>
            </span>
            <PageLayout.Pagination
              total={pagination.total}
              page={pagination.current}
              pageSize={pagination.pageSize}
              onPageChange={(p) => handleTableChange({ current: p })}
              onPageSizeChange={handlePageSizeChange}
              className="mt-0 border-t-0 pt-0"
            />
          </PageLayout.Footer>
        )}
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

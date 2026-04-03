'use client';

import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  PlusOutlined,
  UserDeleteOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Select, Space, Tooltip } from 'antd';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { TermService } from '@/components/features/internship-term-management/services/term.service';
import Badge from '@/components/ui/badge';
import DataTable from '@/components/ui/datatable';
import DataTableToolbar from '@/components/ui/datatabletoolbar';
import PageLayout from '@/components/ui/pagelayout';
import TableRowDropdown from '@/components/ui/TableRowActions';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { UI_TEXT } from '@/lib/UI_Text';

import { useStudentEnrollment } from '../hooks/useStudentEnrollment';
import ImportModal from './ImportModal';
import StudentFormModal from './StudentFormModal';

export default function TermStudentManagement() {
  const params = useParams();
  const isTermScoped = !!params?.termId;
  const { ENROLLMENT_MANAGEMENT } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN;
  const { MESSAGES, ACTIONS, SEARCH, STATUS_OPTIONS } = ENROLLMENT_MANAGEMENT;

  const [terms, setTerms] = useState([]);
  const [termsLoading, setTermsLoading] = useState(false);

  const {
    termId,
    searchTerm,
    statusFilter,
    pagination,
    students,
    loading,
    submitLoading,
    importVisible,
    addVisible,
    editVisible,
    detailsVisible,
    selectedStudent,
    selectedIds,
    onTermChange,
    onSearchChange,
    onStatusChange,
    onPageChange,
    onPageSizeChange,
    setImportVisible,
    setAddVisible,
    onAdd,
    setEditVisible,
    setDetailsVisible,
    setSelectedIds,
    handleView,
    handleEdit,
    handleDelete,
    handleUpdateStudent,
    handleAddStudent,
    handleImportPreview,
    handleImportConfirm,
    handleBulkWithdraw,
    handleDownloadTemplate,
    sortBy,
    sortOrder,
    handleSortChange,
  } = useStudentEnrollment();

  const activeTerm = terms.find((t) => t.termId === termId);
  const isClosed = activeTerm?.status === 4;

  const { TABLE, ACTIONS: ACTION_LABELS, STATUS_LABELS, PLACEMENT_LABELS } = ENROLLMENT_MANAGEMENT;

  const STATUS_VARIANTS = {
    PLACED: 'success',
    ACTIVE: 'success',
    UNPLACED: 'info',
    WITHDRAWN: 'danger',
  };

  const columns = React.useMemo(
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
        title: TABLE.COLUMNS.FULL_NAME,
        dataIndex: 'name',
        key: 'name',
        sorter: true,
        sortKey: 'FullName',
        render: (name) => (
          <span className="text-text text-sm font-bold tracking-tight">{name}</span>
        ),
      },
      {
        title: TABLE.COLUMNS.STUDENT_ID,
        dataIndex: 'id',
        key: 'id',
        width: 140,
        sorter: true,
        sortKey: 'StudentId',
        render: (id) => <span className="text-muted font-mono text-xs font-semibold">{id}</span>,
      },
      {
        title: TABLE.COLUMNS.MAJOR,
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
        title: TABLE.COLUMNS.PLACEMENT,
        key: 'placement',
        width: 200,
        render: (_, record) => {
          const isPlaced = record.placementStatus === 'PLACED';
          return (
            <div className="flex flex-col gap-0.5">
              <Tooltip
                title={
                  isPlaced
                    ? record.enterpriseName || PLACEMENT_LABELS.PLACED
                    : PLACEMENT_LABELS.UNPLACED
                }
              >
                <span
                  className={`block truncate text-[11px] font-bold uppercase tracking-wider whitespace-nowrap ${
                    isPlaced ? 'text-text max-w-[180px]' : 'text-muted'
                  }`}
                >
                  {isPlaced
                    ? record.enterpriseName || PLACEMENT_LABELS.PLACED
                    : PLACEMENT_LABELS.UNPLACED}
                </span>
              </Tooltip>
            </div>
          );
        },
      },
      {
        title: TABLE.COLUMNS.STATUS,
        dataIndex: 'status',
        key: 'status',
        width: 140,
        align: 'center',
        render: (status) => {
          const variant = STATUS_VARIANTS[status] || 'default';
          const label = STATUS_LABELS[status] || status;
          return <Badge variant={variant}>{label}</Badge>;
        },
      },
      {
        title: '',
        key: 'actions',
        width: 48,
        align: 'right',
        render: (_, record) => {
          const isWithdrawn = record.status === 'WITHDRAWN';

          const items = [
            {
              key: 'view',
              label: ACTION_LABELS.VIEW,
              icon: <EyeOutlined />,
              onClick: () => handleView(record),
            },
          ];

          if (!isClosed) {
            if (!isWithdrawn) {
              items.push(
                { type: 'divider' },
                {
                  key: 'edit',
                  label: ACTION_LABELS.EDIT,
                  icon: <EditOutlined />,
                  onClick: () => handleEdit(record),
                },
                {
                  key: 'delete',
                  label: ACTION_LABELS.DELETE,
                  icon: <DeleteOutlined />,
                  danger: true,
                  onClick: () => handleDelete(record),
                }
              );
            }
          }

          return (
            <div className="flex justify-end pr-1" onClick={(e) => e.stopPropagation()}>
              <TableRowDropdown items={items} />
            </div>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pagination.current, pagination.pageSize, isClosed, STATUS_LABELS, PLACEMENT_LABELS, TABLE]
  );

  useEffect(() => {
    const fetchTerms = async () => {
      setTermsLoading(true);
      try {
        const response = await TermService.getAll({ pageSize: 100 });
        if (response?.data?.items) {
          const items = response.data.items;
          setTerms(items);
          if (!termId && items.length > 0) {
            onTermChange(items[0].termId);
          }
        }
      } catch (error) {
        if (error?.status === 401 || error?.silent) return;
        console.error('Fetch terms failed:', error);
      } finally {
        setTermsLoading(false);
      }
    };
    fetchTerms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onTermChange]);

  return (
    <PageLayout>
      <PageLayout.Header
        title={ENROLLMENT_MANAGEMENT.TITLE}
        subtitle={ENROLLMENT_MANAGEMENT.PAGE_SUBTITLE}
      />

      <PageLayout.Card className="flex flex-1 flex-col overflow-hidden min-h-[500px] max-h-[calc(100vh-160px)]">
        <DataTableToolbar className="mb-4 !border-0 !p-0">
          <DataTableToolbar.Search
            placeholder={SEARCH.PLACEHOLDER}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="max-w-md"
          />
          <DataTableToolbar.Filters className="gap-0">
            <Space.Compact className="w-full overflow-hidden rounded-xl border border-border shadow-sm sm:w-auto">
              <Select
                loading={termsLoading}
                placeholder={SEARCH.TERM_PLACEHOLDER}
                value={termId}
                onChange={onTermChange}
                disabled={isTermScoped}
                className="!h-11 min-w-[150px] !border-0 focus:!ring-0 disabled:bg-transparent"
                variant="borderless"
                options={terms.map((t) => ({ label: t.name, value: t.termId }))}
                suffixIcon={!isTermScoped && <FilterOutlined className="text-muted/40" />}
              />
              <div className="bg-border h-6 w-px self-center opacity-50" />
              <Select
                allowClear
                placeholder={ENROLLMENT_MANAGEMENT.STATUS_FILTER}
                value={statusFilter || undefined}
                onChange={onStatusChange}
                className="!h-11 min-w-[140px] !border-0 focus:!ring-0"
                variant="borderless"
                options={STATUS_OPTIONS}
                suffixIcon={<FilterOutlined className="text-muted/40" />}
              />
            </Space.Compact>
          </DataTableToolbar.Filters>
          <DataTableToolbar.Actions className="ml-auto gap-3">
            <Button
              danger
              type="primary"
              icon={<UserDeleteOutlined />}
              onClick={handleBulkWithdraw}
              disabled={selectedIds.length === 0 || isClosed}
              className="!h-11 !rounded-xl shadow-md"
            >
              {MESSAGES.BULK_WITHDRAW.ACTION_LABEL}
              {selectedIds.length > 0 && ` (${selectedIds.length})`}
            </Button>

            <Dropdown
              disabled={isClosed}
              trigger={['click']}
              menu={{
                items: [
                  {
                    key: 'add',
                    icon: <PlusOutlined />,
                    label: ACTIONS.ADD,
                    onClick: onAdd,
                  },
                  {
                    type: 'divider',
                  },
                  {
                    key: 'import',
                    icon: <DownloadOutlined />,
                    label: ACTIONS.IMPORT,
                    onClick: () => setImportVisible(true),
                  },
                ],
              }}
            >
              <Button
                type="primary"
                icon={<PlusOutlined />}
                className="!h-11 !rounded-xl px-4 font-semibold shadow-md"
              >
                {ACTIONS.ADD}
              </Button>
            </Dropdown>
          </DataTableToolbar.Actions>
        </DataTableToolbar>

        <PageLayout.Content className="px-0">
          <DataTable
            columns={columns}
            data={students}
            loading={loading}
            rowKey="studentTermId"
            size="small"
            minWidth="800px"
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSortChange}
            rowSelection={{
              selectedRowKeys: selectedIds,
              onChange: setSelectedIds,
            }}
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
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
              className="mt-0 border-t-0 pt-0"
            />
          </PageLayout.Footer>
        )}
      </PageLayout.Card>

      <ImportModal
        visible={importVisible}
        onCancel={() => setImportVisible(false)}
        onImport={handleImportConfirm}
        onPreview={handleImportPreview}
        onDownloadTemplate={handleDownloadTemplate}
        loading={submitLoading}
      />

      <StudentFormModal
        visible={addVisible || editVisible || detailsVisible}
        viewOnly={detailsVisible}
        initialValues={selectedStudent}
        onCancel={() => {
          setAddVisible(false);
          setEditVisible(false);
          setDetailsVisible(false);
        }}
        onSave={editVisible ? handleUpdateStudent : handleAddStudent}
        loading={submitLoading}
      />
    </PageLayout>
  );
}

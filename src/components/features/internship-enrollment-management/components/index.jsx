'use client';

import {
  DownloadOutlined,
  FilterOutlined,
  PlusOutlined,
  UserDeleteOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Select, Space } from 'antd';
import React, { useEffect, useState } from 'react';

import { TermService } from '@/components/features/internship-term-management/services/term.service';
import StudentPageHeader from '@/components/layout/StudentPageHeader';
import Card from '@/components/ui/card';
import DataTableToolbar from '@/components/ui/datatabletoolbar';
import Pagination from '@/components/ui/pagination';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

import { useStudentEnrollment } from '../hooks/useStudentEnrollment';
import DataGrid from './DataGrid';
import ImportModal from './ImportModal';
import StudentFormModal from './StudentFormModal';

export default function TermStudentManagement() {
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
    setImportVisible,
    setAddVisible,
    onAdd,
    setEditVisible,
    setDetailsVisible,
    setSelectedIds,
    handleView,
    handleEdit,
    handleDelete,
    handleRestore,
    handleUpdateStudent,
    handleAddStudent,
    handleImportPreview,
    handleImportConfirm,
    handleBulkWithdraw,
    handleDownloadTemplate,
    sortBy,
    sortOrder,
    handleSortChange,
    onTableChange,
  } = useStudentEnrollment();

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
        console.error('Fetch terms failed:', error);
      } finally {
        setTermsLoading(false);
      }
    };
    fetchTerms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onTermChange]);

  const activeTerm = terms.find((t) => t.termId === termId);
  const isClosed = activeTerm?.status === 4; // TERM_STATUS.CLOSED is 4

  return (
    <section className="animate-in fade-in flex min-h-0 flex-1 flex-col space-y-6 duration-500">
      <StudentPageHeader title={ENROLLMENT_MANAGEMENT.TITLE} />

      <Card className="flex min-h-0 flex-1 flex-col overflow-hidden !rounded-3xl border-none !p-6 shadow-sm sm:!p-8">
        <DataTableToolbar className="mb-6 !border-0 !p-0">
          <DataTableToolbar.Search
            placeholder={SEARCH.PLACEHOLDER}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <DataTableToolbar.Filters className="gap-0">
            <Space.Compact className="w-full sm:w-auto shadow-sm !rounded-xl overflow-hidden border border-border">
              <Select
                loading={termsLoading}
                placeholder={SEARCH.TERM_PLACEHOLDER}
                value={termId}
                onChange={onTermChange}
                className="!h-10 min-w-[150px] !border-0 focus:!ring-0"
                variant="borderless"
                options={terms.map((t) => ({ label: t.name, value: t.termId }))}
                suffixIcon={<FilterOutlined className="text-muted/40" />}
              />
              <div className="bg-border h-6 w-[1px] self-center opacity-50" />
              <Select
                allowClear
                placeholder={ENROLLMENT_MANAGEMENT.STATUS_FILTER}
                value={statusFilter || undefined}
                onChange={onStatusChange}
                className="!h-10 min-w-[140px] !border-0 focus:!ring-0"
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
              className="!h-10 !rounded-xl shadow-md"
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
                className="!h-10 !rounded-xl shadow-md px-4 font-semibold"
              >
                {ACTIONS.ADD}
              </Button>
            </Dropdown>
          </DataTableToolbar.Actions>
        </DataTableToolbar>

        <DataGrid
          data={students}
          loading={loading}
          page={pagination.current}
          pageSize={pagination.pageSize}
          selectedRowKeys={selectedIds}
          onSelectionChange={setSelectedIds}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRestore={handleRestore}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSortChange}
          readOnly={isClosed}
        />

        {pagination.total > 0 && (
          <div className="border-border/50 mt-6 flex-shrink-0 border-t pt-6">
            <Pagination
              total={pagination.total}
              page={pagination.current}
              pageSize={pagination.pageSize}
              totalPages={Math.ceil(pagination.total / pagination.pageSize)}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </Card>

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
    </section>
  );
}

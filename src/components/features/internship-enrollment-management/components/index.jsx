'use client';

import {
  DownloadOutlined,
  FilterOutlined,
  PlusOutlined,
  UserDeleteOutlined,
} from '@ant-design/icons';
import { Select } from 'antd';
import React, { useEffect, useState } from 'react';

import { TermService } from '@/components/features/internship-term-management/services/term.service';
import StudentPageHeader from '@/components/layout/StudentPageHeader';
import Card from '@/components/ui/card';
import DataTableToolbar from '@/components/ui/datatabletoolbar';
import Pagination from '@/components/ui/pagination';

import { STUDENT_ENROLLMENT } from '../constants/enrollment';
import { useStudentEnrollment } from '../hooks/useStudentEnrollment';
import DataGrid from './DataGrid';
import ImportModal from './ImportModal';
import StudentFormModal from './StudentFormModal';

export default function TermStudentManagement() {
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
  } = useStudentEnrollment();

  useEffect(() => {
    const fetchTerms = async () => {
      setTermsLoading(true);
      try {
        const response = await TermService.getAll({ pageSize: 100 });
        if (response?.data?.items) {
          setTerms(response.data.items);
          if (!termId && response.data.items.length > 0) {
            onTermChange(response.data.items[0].termId);
          }
        }
      } catch (error) {
        console.error('Fetch terms failed:', error);
      } finally {
        setTermsLoading(false);
      }
    };
    fetchTerms();
  }, [onTermChange, termId]);

  return (
    <section className="animate-in fade-in flex min-h-0 flex-1 flex-col space-y-6 duration-500">
      <StudentPageHeader title={STUDENT_ENROLLMENT.TITLE} />

      <Card className="flex min-h-0 flex-1 flex-col overflow-hidden !p-4 sm:!p-8">
        <DataTableToolbar className="mb-5 flex-shrink-0 !border-0 !p-0">
          <DataTableToolbar.Search
            placeholder={STUDENT_ENROLLMENT.SEARCH.PLACEHOLDER}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <DataTableToolbar.Filters className="gap-3">
            <Select
              loading={termsLoading}
              placeholder={STUDENT_ENROLLMENT.SEARCH.TERM_PLACEHOLDER}
              value={termId}
              onChange={onTermChange}
              className="h-9 min-w-[200px]"
              options={terms.map((t) => ({ label: t.name, value: t.termId }))}
            />
            <Select
              allowClear
              placeholder={STUDENT_ENROLLMENT.STATUS_FILTER}
              value={statusFilter || undefined}
              onChange={onStatusChange}
              className="h-9 min-w-[150px]"
              options={STUDENT_ENROLLMENT.STATUS_OPTIONS}
              suffixIcon={<FilterOutlined className="text-muted" />}
            />
          </DataTableToolbar.Filters>
          <div className="flex shrink-0 items-center justify-end gap-2 ml-auto">
            <DataTableToolbar.Actions
              label={STUDENT_ENROLLMENT.ACTIONS.IMPORT}
              onClick={() => setImportVisible(true)}
              icon={<DownloadOutlined />}
              className="!bg-bg !text-primary border border-primary hover:!bg-primary/5 hover:!text-primary-hover !ml-0"
            />
            <DataTableToolbar.Actions
              label={STUDENT_ENROLLMENT.ACTIONS.ADD}
              onClick={onAdd}
              icon={<PlusOutlined />}
              className="!ml-0"
              menu={
                selectedIds.length > 0
                  ? {
                      items: [
                        {
                          key: 'withdraw',
                          label: `${STUDENT_ENROLLMENT.ACTIONS.DELETE} (${selectedIds.length})`,
                          icon: <UserDeleteOutlined />,
                          danger: true,
                          onClick: handleBulkWithdraw,
                        },
                      ],
                    }
                  : undefined
              }
            />
          </div>
        </DataTableToolbar>

        <DataGrid
          data={students}
          loading={loading}
          total={pagination.total || 0}
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

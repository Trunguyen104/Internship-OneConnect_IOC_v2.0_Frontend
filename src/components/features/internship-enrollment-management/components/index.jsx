'use client';

import { Card } from 'antd';
import React, { useEffect, useState } from 'react';

import { TermService } from '@/components/features/internship-term-management/services/term.service';
import StudentPageHeader from '@/components/layout/StudentPageHeader';
import DataTable from '@/components/ui/datatable';
import Pagination from '@/components/ui/pagination';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

import { useStudentColumns } from './useStudentColumns';
import { useStudentEnrollment } from '../hooks/useStudentEnrollment';
import ImportModal from './ImportModal';
import StudentFormModal from './StudentFormModal';
import { StudentToolbar } from './StudentToolbar';
import PageLayout from '@/components/ui/pagelayout';

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

  const activeTerm = terms.find((t) => t.termId === termId);
  const isClosed = activeTerm?.status === 4; // TERM_STATUS.CLOSED is 4

  const { TABLE, ACTIONS: ACTION_LABELS, STATUS_LABELS, PLACEMENT_LABELS } = ENROLLMENT_MANAGEMENT;

  const columns = useStudentColumns({
    pagination,
    isClosed,
    handleView,
    handleEdit,
    handleDelete,
    handleRestore,
    TABLE,
    ACTION_LABELS,
    STATUS_LABELS,
    PLACEMENT_LABELS,
  });

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
    <PageLayout className="animate-in fade-in flex min-h-0 flex-1 flex-col space-y-6 duration-500">
      <StudentPageHeader title={ENROLLMENT_MANAGEMENT.TITLE} />

      <PageLayout.Card className="flex min-h-0 flex-1 flex-col overflow-hidden !p-4 sm:!p-8">
        <StudentToolbar
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          terms={terms}
          termsLoading={termsLoading}
          termId={termId}
          onTermChange={onTermChange}
          statusFilter={statusFilter}
          onStatusChange={onStatusChange}
          STATUS_OPTIONS={STATUS_OPTIONS}
          STATUS_FILTER_LABEL={ENROLLMENT_MANAGEMENT.STATUS_FILTER}
          TERM_PLACEHOLDER={SEARCH.TERM_PLACEHOLDER}
          SEARCH_PLACEHOLDER={SEARCH.PLACEHOLDER}
          handleBulkWithdraw={handleBulkWithdraw}
          selectedIds={selectedIds}
          isClosed={isClosed}
          MESSAGES={MESSAGES}
          ACTIONS={ACTIONS}
          onAdd={onAdd}
          setImportVisible={setImportVisible}
        />

        <DataTable
          columns={columns}
          data={students}
          loading={loading}
          rowKey="studentTermId"
          className="mt-4"
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

        <div className="border-border/50 mt-auto flex-shrink-0 border-t pt-6">
          <Pagination
            total={pagination.total || 0}
            page={pagination.current}
            pageSize={pagination.pageSize}
            totalPages={Math.max(1, Math.ceil((pagination.total || 0) / pagination.pageSize))}
            onPageChange={onPageChange}
          />
        </div>
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

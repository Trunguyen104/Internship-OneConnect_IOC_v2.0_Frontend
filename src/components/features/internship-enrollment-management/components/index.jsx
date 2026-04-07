'use client';

import {
  DownloadOutlined,
  FilterOutlined,
  PlusOutlined,
  UserDeleteOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Select, Space } from 'antd';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { TermService } from '@/components/features/internship-term-management/services/term.service';
import DataTable from '@/components/ui/datatable';
import DataTableToolbar from '@/components/ui/datatabletoolbar';
import PageLayout from '@/components/ui/pagelayout';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { UI_TEXT } from '@/lib/UI_Text';

import { useStudentEnrollment } from '../hooks/useStudentEnrollment';
import ImportModal from './ImportModal';
import { getStudentColumns } from './student-columns';
import StudentFormModal from './StudentFormModal';

export default function TermStudentManagement() {
  const params = useParams();
  const isTermScoped = !!params?.termId;
  const { ENROLLMENT_MANAGEMENT } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN;
  const { MESSAGES, ACTIONS, SEARCH } = ENROLLMENT_MANAGEMENT;

  const [terms, setTerms] = useState([]);
  const [termsLoading, setTermsLoading] = useState(false);

  const {
    termId,
    searchTerm,
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

  const columns = React.useMemo(
    () =>
      getStudentColumns({
        pagination,
        isClosed,
        handleView,
        handleEdit,
        handleDelete,
        handleBulkWithdraw,
        TABLE,
        ACTION_LABELS,
        STATUS_LABELS,
        PLACEMENT_LABELS,
      }),
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

      <PageLayout.Card className="flex flex-1 flex-col overflow-hidden min-h-[500px]">
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

        <PageLayout.Content className="px-0 flex-1 flex flex-col min-h-0 overflow-hidden">
          <DataTable
            columns={columns}
            data={students}
            loading={loading}
            rowKey="studentTermId"
            size="small"
            minWidth="1000px"
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSortChange}
            rowSelection={{
              selectedRowKeys: selectedIds,
              onChange: setSelectedIds,
            }}
          />
        </PageLayout.Content>

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

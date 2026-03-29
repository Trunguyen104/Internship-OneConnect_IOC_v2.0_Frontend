'use client';

import { PlusOutlined } from '@ant-design/icons';
import { DatePicker } from 'antd';
import React from 'react';

import Card from '@/components/ui/card';
import DataTableToolbar from '@/components/ui/datatabletoolbar';
import PageTitle from '@/components/ui/pagetitle';
import Pagination from '@/components/ui/pagination';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

import { useViolationManagement } from '../hooks/useViolationManagement';
import ViolationDeleteModal from './ViolationDeleteModal';
import ViolationFormModal from './ViolationFormModal';
import ViolationTable from './ViolationTable';
import PageLayout from '@/components/ui/pagelayout';

const { RangePicker } = DatePicker;

export default function ViolationManagement() {
  const { VIOLATION_REPORT } = INTERNSHIP_MANAGEMENT_UI.ENTERPRISE;

  const {
    data,
    loading,
    searchTerm,
    dateRange,
    pagination,
    modalVisible,
    submitLoading,
    editingRecord,
    viewOnly,
    deleteModalState,
    students,
    groups,
    setModalVisible,
    handleSearchChange,
    handleDateRangeChange,
    handleTableChange,
    handleCreateNew,
    handleEdit,
    handleView,
    handleRequestDelete,
    handleDelete,
    handleSaveModal,
    isMentor,
  } = useViolationManagement();

  return (
    <PageLayout className="animate-in fade-in flex min-h-0 flex-1 flex-col space-y-6 duration-500">
      <PageTitle title={VIOLATION_REPORT.TITLE} />

      <PageLayout.Card className="flex min-h-0 flex-1 flex-col overflow-hidden !p-4 sm:!p-8">
        <DataTableToolbar className="mb-5 flex-shrink-0 !border-0 !p-0">
          <DataTableToolbar.Search
            placeholder={VIOLATION_REPORT.SEARCH_PLACEHOLDER}
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          <DataTableToolbar.Filters>
            <RangePicker
              className="h-9 w-60"
              value={dateRange}
              onChange={handleDateRangeChange}
              placeholder={[VIOLATION_REPORT.FILTERS.START_DATE, VIOLATION_REPORT.FILTERS.END_DATE]}
            />
          </DataTableToolbar.Filters>
          {isMentor && (
            <DataTableToolbar.Actions
              label={VIOLATION_REPORT.CREATE_BUTTON}
              onClick={handleCreateNew}
              icon={<PlusOutlined />}
              className="ml-auto"
            />
          )}
        </DataTableToolbar>

        <ViolationTable
          data={data}
          loading={loading}
          page={pagination.current}
          pageSize={pagination.pageSize}
          onEdit={handleEdit}
          onView={handleView}
          onRequestDelete={handleRequestDelete}
          isMentor={isMentor}
        />

        <div className="border-border/50 mt-auto flex-shrink-0 border-t pt-6">
          <Pagination
            total={pagination.total || 0}
            page={pagination.current}
            pageSize={pagination.pageSize}
            totalPages={Math.max(1, Math.ceil((pagination.total || 0) / pagination.pageSize))}
            onPageChange={(page) => handleTableChange({ current: page })}
            onPageSizeChange={(size) => handleTableChange({ pageSize: size, current: 1 })}
          />
        </div>
      </PageLayout.Card>

      <ViolationFormModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSave={handleSaveModal}
        loading={submitLoading}
        initialValues={editingRecord}
        viewOnly={viewOnly}
        students={students}
        groups={groups}
      />

      <ViolationDeleteModal
        open={deleteModalState.open}
        record={deleteModalState.record}
        onCancel={() => handleRequestDelete(null)}
        onConfirm={handleDelete}
        loading={submitLoading}
      />
    </PageLayout>
  );
}

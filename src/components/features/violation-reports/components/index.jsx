'use client';

import { FilterOutlined, PlusOutlined } from '@ant-design/icons';
import { DatePicker, Select } from 'antd';
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

const { RangePicker } = DatePicker;

export default function ViolationManagement() {
  const { VIOLATION_REPORT } = INTERNSHIP_MANAGEMENT_UI.ENTERPRISE;

  const {
    data,
    loading,
    searchTerm,
    groupIdFilter,
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
    handleGroupChange,
    handleDateRangeChange,
    handleTableChange,
    handleCreateNew,
    handleEdit,
    handleView,
    handleRequestDelete,
    handleDelete,
    handleSaveModal,
    resetFilters,
    termId,
    setTermId,
    termOptions,
    fetchingTerms,
    studentOptions,
    mentorOptions,
    createdByIdFilter,
    handleCreatedByChange,
  } = useViolationManagement();

  return (
    <section className="animate-in fade-in flex min-h-0 flex-1 flex-col space-y-6 duration-500">
      <PageTitle title={VIOLATION_REPORT.TITLE} />

      <Card className="flex min-h-0 flex-1 flex-col overflow-hidden !p-4 sm:!p-8">
        <DataTableToolbar className="mb-5 flex-shrink-0 !border-0 !p-0">
          <DataTableToolbar.Search
            placeholder={VIOLATION_REPORT.SEARCH_PLACEHOLDER}
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          <DataTableToolbar.Filters>
            <Select
              allowClear
              placeholder={VIOLATION_REPORT.FILTERS.CREATED_BY}
              value={createdByIdFilter}
              onChange={handleCreatedByChange}
              className="h-9 min-w-[150px]"
              options={mentorOptions}
              suffixIcon={<FilterOutlined className="text-muted" />}
            />
            <RangePicker
              className="h-9 w-60"
              value={dateRange}
              onChange={handleDateRangeChange}
              placeholder={[VIOLATION_REPORT.FILTERS.START_DATE, VIOLATION_REPORT.FILTERS.END_DATE]}
            />
          </DataTableToolbar.Filters>
          <DataTableToolbar.Actions
            label={VIOLATION_REPORT.CREATE_BUTTON}
            onClick={handleCreateNew}
            icon={<PlusOutlined />}
            className="ml-auto"
          />
        </DataTableToolbar>

        <ViolationTable
          data={data}
          loading={loading}
          page={pagination.current}
          pageSize={pagination.pageSize}
          onEdit={handleEdit}
          onView={handleView}
          onRequestDelete={handleRequestDelete}
        />

        {data.length > 0 && (
          <div className="border-border/50 mt-6 flex-shrink-0 border-t pt-6">
            <Pagination
              total={pagination.total}
              page={pagination.current}
              pageSize={pagination.pageSize}
              totalPages={Math.ceil(pagination.total / pagination.pageSize)}
              onPageChange={(page) => handleTableChange({ current: page })}
              onPageSizeChange={(size) => handleTableChange({ pageSize: size, current: 1 })}
            />
          </div>
        )}
      </Card>

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
    </section>
  );
}

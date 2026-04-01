'use client';

import { DatePicker } from 'antd';
import React from 'react';

import PageLayout from '@/components/ui/pagelayout';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { UI_TEXT } from '@/lib/UI_Text';

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
    <PageLayout>
      <PageLayout.Header title={VIOLATION_REPORT.TITLE} subtitle={VIOLATION_REPORT.SUBTITLE} />

      <PageLayout.Card className="flex flex-col overflow-hidden">
        <PageLayout.Toolbar
          searchProps={{
            placeholder: VIOLATION_REPORT.SEARCH_PLACEHOLDER,
            value: searchTerm,
            onChange: (e) => handleSearchChange(e.target.value),
            className: 'max-w-md',
          }}
          filterContent={
            <RangePicker
              className="h-11 w-full min-w-[240px] md:w-72"
              value={dateRange}
              onChange={handleDateRangeChange}
              placeholder={[VIOLATION_REPORT.FILTERS.START_DATE, VIOLATION_REPORT.FILTERS.END_DATE]}
            />
          }
          actionProps={
            isMentor
              ? {
                  label: VIOLATION_REPORT.CREATE_BUTTON,
                  onClick: handleCreateNew,
                }
              : undefined
          }
        />

        <PageLayout.Content className="px-0">
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
              onPageChange={(page) => handleTableChange({ current: page })}
              onPageSizeChange={(size) => handleTableChange({ pageSize: size, current: 1 })}
              className="mt-0 border-t-0 pt-0"
            />
          </PageLayout.Footer>
        )}
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

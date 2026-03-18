'use client';

import React from 'react';
import Card from '@/components/ui/card';
import DataTableToolbar from '@/components/ui/datatabletoolbar';
import StudentPageHeader from '@/components/layout/StudentPageHeader';
import { Select } from 'antd';
import { FilterOutlined, PlusOutlined } from '@ant-design/icons';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { useTermManagement } from './hooks/useTermManagement';
import TermTable from './components/TermTable';
import TermFormModal from './components/TermFormModal';
import TermStatusModal from './components/TermStatusModal';
import TermDeleteModal from './components/TermDeleteModal';
import Pagination from '@/components/ui/pagination';

export default function InternshipTermManagement() {
  const { TERM_MANAGEMENT } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN;

  const {
    data,
    loading,
    searchTerm,
    statusFilter,
    yearFilter,
    pagination,
    modalVisible,
    submitLoading,
    editingRecord,
    statusModalState,
    deleteModalState,
    setModalVisible,
    handleSearchChange,
    handleStatusChange,
    handleTableChange,
    handleCreateNew,
    handleEdit,
    handleRequestDelete,
    handleDelete,
    handleRequestChangeStatus,
    handleYearChange,
    handleChangeStatus,
    handleSaveModal,
  } = useTermManagement();

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => ({
    value: currentYear - i,
    label: `${currentYear - i}`,
  }));

  return (
    <section className='animate-in fade-in flex min-h-0 flex-1 flex-col space-y-6 duration-500'>
      <StudentPageHeader title={TERM_MANAGEMENT.TITLE} />

      <Card className='flex min-h-0 flex-1 flex-col overflow-hidden !p-4 sm:!p-8'>
        <DataTableToolbar
          className='mb-5 flex-shrink-0 !border-0 !p-0'
          searchProps={{
            placeholder: TERM_MANAGEMENT.SEARCH_PLACEHOLDER,
            value: searchTerm,
            onChange: (e) => handleSearchChange(e.target.value),
          }}
          filterContent={
            <>
              <Select
                allowClear
                placeholder={TERM_MANAGEMENT.STATUS_FILTER}
                value={statusFilter ?? undefined}
                onChange={handleStatusChange}
                className='h-9 min-w-[180px]'
                options={TERM_MANAGEMENT.STATUS_OPTIONS}
                suffixIcon={<FilterOutlined className='text-muted' />}
              />
              <Select
                allowClear
                placeholder={TERM_MANAGEMENT.SELECT_YEAR}
                value={yearFilter}
                onChange={handleYearChange}
                className='h-9 min-w-[120px]'
                options={yearOptions}
              />
            </>
          }
          actionProps={{
            label: TERM_MANAGEMENT.CREATE_BTN,
            onClick: handleCreateNew,
            icon: <PlusOutlined />,
          }}
        />

        <TermTable
          data={data}
          loading={loading}
          page={pagination.current}
          pageSize={pagination.pageSize}
          onEdit={handleEdit}
          onRequestDelete={handleRequestDelete}
          onRequestChangeStatus={handleRequestChangeStatus}
        />

        {data.length > 0 && (
          <div className='border-border/50 mt-6 flex-shrink-0 border-t pt-6'>
            <Pagination
              total={pagination.total}
              page={pagination.current}
              pageSize={pagination.pageSize}
              totalPages={Math.ceil(pagination.total / pagination.pageSize)}
              onPageChange={(page) => handleTableChange({ current: page })}
            />
          </div>
        )}
      </Card>

      <TermFormModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSave={handleSaveModal}
        loading={submitLoading}
        initialValues={editingRecord}
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
    </section>
  );
}

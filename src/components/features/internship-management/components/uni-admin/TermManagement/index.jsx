'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import Pagination from '@/components/ui/Pagination';
import DataTableToolbar from '@/components/ui/DataTableToolbar';
import StudentPageHeader from '@/components/layout/StudentPageHeader';
import { Select } from 'antd';
import { FilterOutlined, PlusOutlined } from '@ant-design/icons';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { useTermManagement } from './hooks/useTermManagement';
import TermTable from './components/TermTable';
import TermFormDrawer from './components/TermFormDrawer';
import TermStatusModal from './components/TermStatusModal';
import { INITIAL_TERMS } from './constants/termData';

export default function InternshipTermManagement() {
  const { TERM_MANAGEMENT } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN;

  const {
    loading,
    searchTerm,
    statusFilter,
    pagination,
    modalVisible,
    submitLoading,
    editingRecord,
    statusModalState,
    filteredData,
    paginatedData,
    setModalVisible,
    setStatusModalState,
    handleSearchChange,
    handleStatusChange,
    handleTableChange,
    handleCreateNew,
    handleEdit,
    handleRequestDelete,
    handleRequestChangeStatus,
    handleChangeStatus,
    handleSaveModal,
  } = useTermManagement(INITIAL_TERMS);

  return (
    <section className='animate-in fade-in flex min-h-0 flex-1 flex-col space-y-6 duration-500'>
      <StudentPageHeader title={TERM_MANAGEMENT.TITLE} />

      <Card className='flex min-h-0 flex-1 flex-col overflow-hidden !p-4 sm:!p-8'>
        <DataTableToolbar
          className='mb-5 !border-0 !p-0'
          searchProps={{
            placeholder: TERM_MANAGEMENT.SEARCH_PLACEHOLDER,
            value: searchTerm,
            onChange: (e) => handleSearchChange(e.target.value),
          }}
          filterContent={
            <Select
              allowClear
              placeholder={TERM_MANAGEMENT.STATUS_FILTER}
              value={statusFilter ?? undefined}
              onChange={handleStatusChange}
              className='h-9 min-w-[180px]'
              options={[
                { value: 1, label: 'Đang hoạt động' },
                { value: 0, label: 'Bản nháp' },
                { value: 2, label: 'Đã hoàn thành' },
              ]}
              suffixIcon={<FilterOutlined className='text-muted' />}
            />
          }
          actionProps={{
            label: TERM_MANAGEMENT.CREATE_BTN,
            onClick: handleCreateNew,
            icon: <PlusOutlined />,
          }}
        />

        <TermTable
          data={paginatedData}
          loading={loading}
          onTableChange={handleTableChange}
          onEdit={handleEdit}
          onRequestDelete={handleRequestDelete}
          onRequestChangeStatus={handleRequestChangeStatus}
        />

        {filteredData.length > 0 && (
          <div className='border-border/50 mt-6 border-t pt-6'>
            <Pagination
              total={filteredData.length}
              page={pagination.current}
              pageSize={pagination.pageSize}
              onPageChange={(page) => handleTableChange({ current: page })}
            />
          </div>
        )}
      </Card>

      <TermFormDrawer
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
        onCancel={() => setStatusModalState({ open: false, record: null, newStatus: null })}
        onConfirm={handleChangeStatus}
      />
    </section>
  );
}

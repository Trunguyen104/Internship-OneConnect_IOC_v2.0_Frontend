'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import DataTableToolbar from '@/components/ui/DataTableToolbar';
import StudentPageHeader from '@/components/layout/StudentPageHeader';
import { Select } from 'antd';
import { FilterOutlined, PlusOutlined } from '@ant-design/icons';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { useTermManagement } from './hooks/useTermManagement';
import TermTable from './components/TermTable';
import TermFormDrawer from './components/TermFormDrawer';
import TermStatusModal from './components/TermStatusModal';

export default function InternshipTermManagement() {
  const { TERM_MANAGEMENT } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN;

  const {
    data,
    loading,
    searchTerm,
    statusFilter,
    pagination,
    modalVisible,
    submitLoading,
    editingRecord,
    statusModalState,
    setModalVisible,
    setStatusModalState,
    handleSearchChange,
    handleStatusChange,
    handleCreateNew,
    handleEdit,
    handleRequestDelete,
    handleRequestChangeStatus,
    handleChangeStatus,
    handleSaveModal,
  } = useTermManagement();

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
                { value: 0, label: 'Upcoming' },
                { value: 1, label: 'Active' },
                { value: 2, label: 'Ended' },
                { value: 3, label: 'Closed' },
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

        {loading && data.length === 0 ? (
          <div className='flex h-full items-center justify-center py-20'>
            <div className='border-primary/30 border-t-primary h-8 w-8 animate-spin rounded-full border-4'></div>
          </div>
        ) : (
          <TermTable
            data={data}
            page={pagination.current}
            pageSize={pagination.pageSize}
            onEdit={handleEdit}
            onRequestDelete={handleRequestDelete}
            onRequestChangeStatus={handleRequestChangeStatus}
          />
        )}

        {/* {data.length > 0 && (
          <div className='border-border/50 mt-6 border-t pt-6'>
            <Pagination
              total={pagination.total}
              page={pagination.current}
              pageSize={pagination.pageSize}
              totalPages={Math.ceil(pagination.total / pagination.pageSize)}
              onPageChange={(page) => handleTableChange({ current: page })}
            />
          </div>
        )} */}
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

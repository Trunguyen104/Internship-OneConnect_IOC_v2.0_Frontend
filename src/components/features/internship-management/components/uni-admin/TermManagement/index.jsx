'use client';

import React from 'react';
import { Pagination } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import Card from '@/components/ui/Card';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management';
import { useTermManagement } from './hooks/useTermManagement';
import TermHeader from './components/TermHeader';
import TermFilterBar from './components/TermFilterBar';
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
    <>
      <TermHeader onCreateNew={handleCreateNew} />

      <div className='mx-auto flex w-full max-w-[1440px] flex-1 flex-col'>
        <Card className='bg-surface border-border overflow-hidden rounded-2xl border shadow-sm'>
          <TermFilterBar
            searchValue={searchTerm}
            onSearchChange={handleSearchChange}
            statusFilter={statusFilter}
            onStatusChange={handleStatusChange}
          />

          <TermTable
            data={paginatedData}
            loading={loading}
            pagination={false}
            onTableChange={handleTableChange}
            onEdit={handleEdit}
            onRequestDelete={handleRequestDelete}
            onRequestChangeStatus={handleRequestChangeStatus}
          />
        </Card>

        <div className='mt-6 flex items-center justify-between px-2'>
          <div className='text-muted text-xs font-bold tracking-widest uppercase'>
            {TERM_MANAGEMENT.TOTAL_LABEL}: {filteredData.length}
          </div>
          <Pagination
            {...pagination}
            total={filteredData.length}
            showSizeChanger={false}
            onChange={(page) => handleTableChange({ current: page })}
            itemRender={(page, type, originalElement) => {
              if (type === 'prev') return <LeftOutlined className='text-primary' />;
              if (type === 'next') return <RightOutlined className='text-primary' />;
              return originalElement;
            }}
          />
        </div>
      </div>

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
    </>
  );
}

'use client';
import React from 'react';
import { Pagination } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import Card from '@/components/ui/Card';
import { useTermManagement } from './hooks/useTermManagement';
import TermHeader from './components/TermHeader';
import TermFilterBar from './components/TermFilterBar';
import TermTable from './components/TermTable';
import TermFormDrawer from './components/TermFormDrawer';
import TermDeleteModal from './components/TermDeleteModal';
import TermStatusModal from './components/TermStatusModal';
import { INITIAL_TERMS } from './constants/termData';

export default function InternshipTermManagement() {
  const {
    loading,
    searchTerm,
    statusFilter,
    pagination,
    modalVisible,
    submitLoading,
    editingRecord,
    deleteModalState,
    statusModalState,
    filteredData,
    paginatedData,
    setModalVisible,
    setDeleteModalState,
    setStatusModalState,
    handleSearchChange,
    handleStatusChange,
    handleTableChange,
    handleCreateNew,
    handleEdit,
    handleRequestDelete,
    handleRequestChangeStatus,
    handleDelete,
    handleChangeStatus,
    handleSaveModal,
  } = useTermManagement(INITIAL_TERMS);

  return (
    <>
      <TermHeader onCreateNew={handleCreateNew} />
      <Card>
        <TermFilterBar
          searchValue={searchTerm}
          onSearchChange={handleSearchChange}
          statusFilter={statusFilter}
          onStatusChange={handleStatusChange}
        />

        <div className='flex-1 overflow-auto'>
          <TermTable
            data={paginatedData}
            loading={loading}
            pagination={false}
            onTableChange={handleTableChange}
            onEdit={handleEdit}
            onRequestDelete={handleRequestDelete}
            onRequestChangeStatus={handleRequestChangeStatus}
          />
        </div>
      </Card>
      <div className='mt-auto flex items-center justify-between border-t border-slate-100 px-2 pt-6'>
        <div className='text-xs font-semibold tracking-widest text-slate-400 uppercase'>
          Total: {filteredData.length}
        </div>
        <Pagination
          {...pagination}
          total={filteredData.length}
          showSizeChanger={false}
          onChange={(page) => handleTableChange({ current: page })}
          itemRender={(page, type, originalElement) => {
            if (type === 'prev') return <LeftOutlined />;
            if (type === 'next') return <RightOutlined />;
            return originalElement;
          }}
        />
      </div>
      <TermFormDrawer
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSave={handleSaveModal}
        loading={submitLoading}
        initialValues={editingRecord}
      />

      <TermDeleteModal
        open={deleteModalState.open}
        record={deleteModalState.record}
        onCancel={() => setDeleteModalState({ open: false, record: null })}
        onConfirm={handleDelete}
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

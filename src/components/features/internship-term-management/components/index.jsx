'use client';

import { FilterOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Select } from 'antd';
import React from 'react';

import StudentPageHeader from '@/components/layout/StudentPageHeader';
import Card from '@/components/ui/card';
import DataTableToolbar from '@/components/ui/datatabletoolbar';
import Pagination from '@/components/ui/pagination';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

import { useTermManagement } from '../hooks/useTermManagement';
import TermDeleteModal from './TermDeleteModal';
import TermFormModal from './TermFormModal';
import TermStatusModal from './TermStatusModal';
import TermTable from './TermTable';

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
    viewOnly,
    statusModalState,
    deleteModalState,
    setModalVisible,
    handleSearchChange,
    handleStatusChange,
    handleTableChange,
    handleCreateNew,
    handleEdit,
    handleView,
    handleRequestDelete,
    handleDelete,
    handleRequestChangeStatus,
    handleChangeStatus,
    handleSaveModal,
    universities,
    isSuperAdmin,
    userUniversity,
  } = useTermManagement();

  return (
    <section className="animate-in fade-in flex min-h-0 flex-1 flex-col space-y-6 duration-500">
      <StudentPageHeader title={TERM_MANAGEMENT.TITLE} />

      <Card className="flex min-h-0 flex-1 flex-col overflow-hidden !rounded-3xl border-none !p-6 shadow-sm sm:!p-8">
        <DataTableToolbar className="mb-6 !border-0 !p-0">
          <DataTableToolbar.Search
            placeholder={TERM_MANAGEMENT.SEARCH_PLACEHOLDER}
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          <DataTableToolbar.Filters className="gap-4">
            <Select
              allowClear
              placeholder={TERM_MANAGEMENT.STATUS_FILTER}
              value={statusFilter ?? undefined}
              onChange={handleStatusChange}
              className="!h-10 min-w-[200px]"
              options={TERM_MANAGEMENT.STATUS_OPTIONS}
              suffixIcon={<FilterOutlined className="text-muted/60" />}
            />
          </DataTableToolbar.Filters>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateNew}
            className="!h-10 !rounded-xl shadow-md ml-auto"
          >
            {TERM_MANAGEMENT.CREATE_BTN}
          </Button>
        </DataTableToolbar>

        <TermTable
          data={data}
          loading={loading}
          page={pagination.current}
          pageSize={pagination.pageSize}
          onEdit={handleEdit}
          onView={handleView}
          onRequestDelete={handleRequestDelete}
          onRequestChangeStatus={handleRequestChangeStatus}
        />

        {data.length > 0 && (
          <div className="border-border/50 mt-6 flex-shrink-0 border-t pt-6">
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
        viewOnly={viewOnly}
        universities={universities}
        isSuperAdmin={isSuperAdmin}
        userUniversity={userUniversity}
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

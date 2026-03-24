'use client';

import { FilterOutlined, PlusOutlined } from '@ant-design/icons';
import { DatePicker, Select } from 'antd';
import React from 'react';

import Card from '@/components/ui/card';
import DataTableToolbar from '@/components/ui/datatabletoolbar';
import Pagination from '@/components/ui/pagination';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

import { useGroupManagement } from '../hooks/useGroupManagement';
import { AssignMentorModal } from './AssignMentorModal';
import { CreateGroupModal } from './CreateGroupModal';
import GroupTable from './GroupTable';
import { ViewGroupModal } from './ViewGroupModal';

export default function GroupManagement() {
  const { GROUP_MANAGEMENT } = INTERNSHIP_MANAGEMENT_UI;
  const {
    activeTab,
    setActiveTab,
    search,
    setSearch,
    assignModal,
    setAssignModal,
    viewModal,
    setViewModal,
    createModal,
    setCreateModal,
    editModal,
    setEditModal,
    handleAssignSubmit,
    handleDeleteGroup,
    handleArchiveGroup,
    handleCreateGroup,
    handleUpdateGroup,
    handleViewGroup,
    handleRemoveStudentFromGroup,
    pagination,
    handleTableChange,
    handlePageSizeChange,
    filteredGroups,
    total,
    loading,
    termId,
    setTermId,
    termOptions,
    fetchingTerms,
    unassignedStudents,
    fetchingStudents,
    isTermEditable,
    filters,
    handleFilterChange,
  } = useGroupManagement();

  const onViewDetailed = (group) => {
    handleViewGroup(group);
  };

  const onEditGroup = (group) => {
    setEditModal({ open: true, group, isAddingStudents: false });
  };

  const onAddStudents = (group) => {
    setEditModal({ open: true, group, isAddingStudents: true });
  };

  return (
    <section className="animate-in fade-in flex min-h-0 flex-1 flex-col space-y-6 duration-500">
      <Card className="flex min-h-0 flex-1 flex-col overflow-hidden !rounded-3xl border-none !p-4 shadow-sm sm:!p-8">
        <DataTableToolbar className="mb-5 !border-0 !p-0">
          <DataTableToolbar.Search
            placeholder={GROUP_MANAGEMENT.SEARCH_PLACEHOLDER}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <DataTableToolbar.Filters>
            <div className="flex flex-wrap items-center gap-3">
              <Select
                placeholder={GROUP_MANAGEMENT.FILTERS.SELECT_TERM}
                value={termId}
                onChange={setTermId}
                className="h-9 min-w-[200px]"
                options={termOptions}
                loading={fetchingTerms}
              />

              <Select
                allowClear
                placeholder={GROUP_MANAGEMENT.FILTERS.SELECT_STATUS}
                value={activeTab === 'ALL' ? undefined : activeTab}
                onChange={setActiveTab}
                className="h-9 min-w-[140px]"
                options={GROUP_MANAGEMENT.FILTERS.STATUS_OPTIONS}
                suffixIcon={<FilterOutlined className="text-muted" />}
              />

              <DatePicker
                picker="month"
                placeholder="Tháng / Năm"
                className="h-9 w-32"
                value={filters.dateFilter}
                onChange={(date) => handleFilterChange('dateFilter', date)}
                allowClear
              />

              <label className="flex items-center gap-2 px-2 cursor-pointer transition-colors hover:text-primary">
                <input
                  type="checkbox"
                  checked={filters.includeArchived}
                  onChange={(e) => handleFilterChange('includeArchived', e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20"
                />
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted/80">
                  Archived
                </span>
              </label>
            </div>
          </DataTableToolbar.Filters>

          {isTermEditable && (
            <DataTableToolbar.Actions
              label={GROUP_MANAGEMENT.CREATE_BTN}
              onClick={() => setCreateModal({ open: true, group: null })}
              icon={<PlusOutlined />}
              className="ml-auto"
            />
          )}
        </DataTableToolbar>

        <GroupTable
          data={filteredGroups}
          loading={loading}
          page={pagination.current}
          pageSize={pagination.pageSize}
          isTermEditable={isTermEditable}
          onAssign={setAssignModal}
          onDelete={handleDeleteGroup}
          onArchive={handleArchiveGroup}
          onView={onViewDetailed}
          onEdit={onEditGroup}
        />

        {total > 0 && (
          <div className="border-border/50 mt-auto flex-shrink-0 border-t pt-6">
            <Pagination
              total={total}
              page={pagination.current}
              pageSize={pagination.pageSize}
              totalPages={Math.ceil(total / pagination.pageSize)}
              onPageChange={handleTableChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        )}
      </Card>

      <AssignMentorModal
        open={assignModal.open}
        group={assignModal.group}
        onCancel={() => setAssignModal({ open: false, group: null })}
        onFinish={handleAssignSubmit}
      />

      <ViewGroupModal
        open={viewModal.open}
        group={viewModal.group}
        loading={viewModal.loading}
        onCancel={() => setViewModal({ open: false, group: null, loading: false })}
        onEdit={onEditGroup}
        onAddStudents={onAddStudents}
        onArchive={handleArchiveGroup}
        onDelete={handleDeleteGroup}
        onRemoveStudent={handleRemoveStudentFromGroup}
      />

      <CreateGroupModal
        open={createModal.open}
        students={unassignedStudents}
        existingGroups={filteredGroups}
        loadingStudents={fetchingStudents}
        initialStudents={createModal.students || []}
        onCancel={() => setCreateModal({ open: false, students: [] })}
        onFinish={handleCreateGroup}
      />

      <CreateGroupModal
        open={editModal.open}
        group={editModal.group}
        students={unassignedStudents}
        existingGroups={filteredGroups}
        loadingStudents={fetchingStudents}
        isAddingStudents={editModal.isAddingStudents}
        onCancel={() => setEditModal({ open: false, group: null, isAddingStudents: false })}
        onFinish={handleUpdateGroup}
      />
    </section>
  );
}

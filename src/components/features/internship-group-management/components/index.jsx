'use client';

import { FilterOutlined, PlusOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import React from 'react';

import Card from '@/components/ui/card';
import DataTableToolbar from '@/components/ui/datatabletoolbar';
import PageTitle from '@/components/ui/pagetitle';
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
  } = useGroupManagement();

  const onViewDetailed = (group) => {
    setViewModal({ open: true, group });
  };

  const onEditGroup = (group) => {
    setEditModal({ open: true, group });
  };

  return (
    <>
      <div className="mx-auto flex min-h-[420px] w-full max-w-full flex-1 flex-col">
        <PageTitle title={GROUP_MANAGEMENT.TITLE} />
        <Card className="flex min-h-0 flex-1 flex-col overflow-hidden !p-4 sm:!p-8">
          <DataTableToolbar className="mb-6">
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
                  className="h-9 min-w-[150px]"
                  options={termOptions}
                  loading={fetchingTerms}
                />

                <Select
                  allowClear
                  placeholder={GROUP_MANAGEMENT.FILTERS.SELECT_STATUS}
                  value={activeTab === 'ALL' ? undefined : activeTab}
                  onChange={setActiveTab}
                  className="h-9 min-w-[160px]"
                  options={[
                    { label: GROUP_MANAGEMENT.ACTIVE, value: 0 },
                    { label: GROUP_MANAGEMENT.ARCHIVED, value: 2 },
                  ]}
                  suffixIcon={<FilterOutlined className="text-muted" />}
                />
              </div>
            </DataTableToolbar.Filters>

            <DataTableToolbar.Actions
              label={GROUP_MANAGEMENT.CREATE_BTN}
              onClick={() => setCreateModal(true)}
              icon={<PlusOutlined />}
            />
          </DataTableToolbar>

          <GroupTable
            data={filteredGroups}
            loading={loading}
            page={pagination.current}
            pageSize={pagination.pageSize}
            onAssign={setAssignModal}
            onDelete={handleDeleteGroup}
            onArchive={handleArchiveGroup}
            onView={onViewDetailed}
            onEdit={onEditGroup}
          />

          {total > 0 && (
            <div className="border-border/50 mt-6 flex-shrink-0 border-t pt-6">
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
      </div>

      <AssignMentorModal
        open={assignModal.open}
        group={assignModal.group}
        onCancel={() => setAssignModal({ open: false, group: null })}
        onFinish={handleAssignSubmit}
      />

      <ViewGroupModal
        open={viewModal.open}
        group={viewModal.group}
        onCancel={() => setViewModal({ open: false, group: null })}
      />

      <CreateGroupModal
        open={createModal || editModal.open}
        group={editModal.group}
        students={unassignedStudents}
        loadingStudents={fetchingStudents}
        onCancel={() => {
          setCreateModal(false);
          setEditModal({ open: false, group: null });
        }}
        onFinish={editModal.open ? handleUpdateGroup : handleCreateGroup}
      />
    </>
  );
}

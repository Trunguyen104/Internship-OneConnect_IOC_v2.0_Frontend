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
    groups,
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
    handleAssignSubmit,
    handleDeleteGroup,
    handleArchiveGroup,
    handleCreateGroup,
    pagination,
    handleTableChange,
    handlePageSizeChange,
    filteredGroups,
  } = useGroupManagement();

  const onViewDetailed = (group) => {
    setViewModal({ open: true, group });
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
                  allowClear
                  placeholder={GROUP_MANAGEMENT.FILTERS.STATUS_FILTER}
                  value={activeTab === 'ALL' ? undefined : activeTab}
                  onChange={setActiveTab}
                  className="h-9 min-w-[160px]"
                  options={[
                    {
                      label: `${GROUP_MANAGEMENT.ACTIVE} (${groups.filter((g) => g.status === 'ACTIVE').length})`,
                      value: 'ACTIVE',
                    },
                    {
                      label: `${GROUP_MANAGEMENT.ARCHIVED} (${groups.filter((g) => g.status === 'ARCHIVED').length})`,
                      value: 'ARCHIVED',
                    },
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
            loading={false}
            page={pagination.current}
            pageSize={pagination.pageSize}
            onAssign={setAssignModal}
            onDelete={handleDeleteGroup}
            onArchive={handleArchiveGroup}
            onView={onViewDetailed}
          />

          {filteredGroups.length > 0 && (
            <div className="border-border/50 mt-6 flex-shrink-0 border-t pt-6">
              <Pagination
                total={filteredGroups.length}
                page={pagination.current}
                pageSize={pagination.pageSize}
                totalPages={Math.ceil(filteredGroups.length / pagination.pageSize)}
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
        open={createModal}
        onCancel={() => setCreateModal(false)}
        onFinish={handleCreateGroup}
      />
    </>
  );
}

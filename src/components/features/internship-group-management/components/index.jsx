'use client';

import { FilterOutlined, InboxOutlined, PlusOutlined } from '@ant-design/icons';
import { Select, Tooltip } from 'antd';
import React from 'react';

import PageLayout from '@/components/ui/pagelayout';
import Pagination from '@/components/ui/pagination';
import DataTableToolbar from '@/components/ui/datatabletoolbar';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { cn } from '@/lib/cn';

import { useGroupManagement } from '../hooks/useGroupManagement';
import { CreateGroupModal } from './CreateGroupModal';
import GroupGeneralInfo from './GroupGeneralInfo';
import GroupTable from './GroupTable';

export default function GroupManagement({ onDetailMode }) {
  const { GROUP_MANAGEMENT } = INTERNSHIP_MANAGEMENT_UI;
  const {
    activeTab,
    setActiveTab,
    search,
    setSearch,
    setAssignModal,
    createModal,
    setCreateModal,
    editModal,
    setEditModal,
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
    unassignedStudents,
    fetchingStudents,
    isPhaseEditable,
    filters,
    handleFilterChange,
    selectedGroupDetail,
    setSelectedGroupDetail,
    mentors,
    loadingMentors,
  } = useGroupManagement();

  React.useEffect(() => {
    if (onDetailMode) {
      onDetailMode(!!selectedGroupDetail);
    }
  }, [selectedGroupDetail, onDetailMode]);

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
    <PageLayout
      className={cn(
        'animate-in fade-in flex flex-1 flex-col space-y-6 duration-500',
        !selectedGroupDetail ? 'min-h-0' : ''
      )}
    >
      <PageLayout.Card
        className={cn(
          'flex flex-col !p-4 sm:!p-8',
          !selectedGroupDetail ? 'min-h-0 flex-1 overflow-hidden' : 'overflow-visible'
        )}
      >
        {selectedGroupDetail ? (
          <GroupGeneralInfo
            groupId={selectedGroupDetail.id}
            onBack={() => setSelectedGroupDetail(null)}
            onRemoveStudent={handleRemoveStudentFromGroup}
            onAddStudent={() => onAddStudents(selectedGroupDetail)}
          />
        ) : (
          <>
            <DataTableToolbar className="mb-5 !border-0 !p-0">
              <DataTableToolbar.Search
                placeholder={GROUP_MANAGEMENT.SEARCH_PLACEHOLDER}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <DataTableToolbar.Filters>
                <div className="flex flex-wrap items-center gap-3">
                  <Select
                    allowClear
                    placeholder={GROUP_MANAGEMENT.FILTERS.SELECT_STATUS}
                    value={activeTab === 'ALL' ? undefined : activeTab}
                    onChange={setActiveTab}
                    className="h-9 min-w-[140px]"
                    options={GROUP_MANAGEMENT.FILTERS.STATUS_OPTIONS}
                    suffixIcon={<FilterOutlined className="text-muted" />}
                  />

                  <Tooltip title={GROUP_MANAGEMENT.FILTERS.INCLUDE_ARCHIVED}>
                    <div
                      onClick={() =>
                        handleFilterChange('includeArchived', !filters.includeArchived)
                      }
                      className={cn(
                        'flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl transition-all',
                        filters.includeArchived
                          ? 'bg-primary text-white shadow-sm'
                          : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                      )}
                    >
                      <InboxOutlined
                        className={filters.includeArchived ? 'text-lg' : 'text-base font-bold'}
                      />
                    </div>
                  </Tooltip>
                </div>
              </DataTableToolbar.Filters>

              {isPhaseEditable && (
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
              isPhaseEditable={isPhaseEditable}
              onAssign={setAssignModal}
              onDelete={handleDeleteGroup}
              onArchive={handleArchiveGroup}
              onView={onViewDetailed}
              onEdit={onEditGroup}
              onAddStudents={onAddStudents}
            />
          </>
        )}

        <div className="border-border/50 mt-auto flex-shrink-0 border-t pt-6">
          <Pagination
            total={total || 0}
            page={pagination.current}
            pageSize={pagination.pageSize}
            totalPages={Math.max(1, Math.ceil((total || 0) / pagination.pageSize))}
            onPageChange={handleTableChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      </PageLayout.Card>

      <CreateGroupModal
        open={createModal.open}
        students={unassignedStudents}
        existingGroups={filteredGroups}
        loadingStudents={fetchingStudents}
        mentors={mentors}
        loadingMentors={loadingMentors}
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
        mentors={mentors}
        loadingMentors={loadingMentors}
        isAddingStudents={editModal.isAddingStudents}
        onCancel={() => setEditModal({ open: false, group: null, isAddingStudents: false })}
        onFinish={handleUpdateGroup}
      />
    </PageLayout>
  );
}

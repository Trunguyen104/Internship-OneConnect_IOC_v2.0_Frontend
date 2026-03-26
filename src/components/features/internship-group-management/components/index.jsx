'use client';

import { FilterOutlined, InboxOutlined, PlusOutlined } from '@ant-design/icons';
import { Select, Tooltip } from 'antd';
import React from 'react';

import Card from '@/components/ui/card';
import DataTableToolbar from '@/components/ui/datatabletoolbar';
import Pagination from '@/components/ui/pagination';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

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
    <section
      className={`animate-in fade-in flex flex-1 flex-col space-y-6 duration-500 ${!selectedGroupDetail ? 'min-h-0' : ''}`}
    >
      <Card
        className={`flex flex-col !rounded-3xl border-none !p-4 shadow-sm sm:!p-8 ${!selectedGroupDetail ? 'min-h-0 flex-1 overflow-hidden' : 'overflow-visible'}`}
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
                      className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${
                        filters.includeArchived
                          ? 'bg-primary text-white shadow-sm'
                          : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
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
          </>
        )}
      </Card>

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
    </section>
  );
}

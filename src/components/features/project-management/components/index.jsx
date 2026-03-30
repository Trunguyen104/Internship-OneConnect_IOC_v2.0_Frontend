'use client';

import { CarryOutOutlined } from '@ant-design/icons';
import { App, Modal, Select } from 'antd';
import React, { useState } from 'react';

import DataTableToolbar from '@/components/ui/datatabletoolbar';
import PageLayout from '@/components/ui/pagelayout';
import PageTitle from '@/components/ui/pagetitle';
import Pagination from '@/components/ui/pagination';
import {
  OPERATIONAL_LABELS,
  OPERATIONAL_STATUS,
  PROJECT_MANAGEMENT,
  VISIBILITY_LABELS,
  VISIBILITY_STATUS,
} from '@/constants/project-management/project-management';
import { cn } from '@/lib/cn';
import { useToast } from '@/providers/ToastProvider';

import { useProjectManagement } from '../hooks/useProjectManagement';
import ProjectDetailDrawer from './ProjectDetailDrawer';
import ProjectFormModal from './ProjectFormModal';
import ProjectTable from './ProjectTable';

const { Option } = Select;

export default function ProjectManagement() {
  const toast = useToast();
  const { modal } = App.useApp();
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [assigningProject, setAssigningProject] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  const { FILTERS } = PROJECT_MANAGEMENT;

  const {
    data,
    loading,
    searchTerm,
    groupIdFilter,
    statusFilter,
    visibilityFilter,
    showArchived,
    pagination,
    handleTableChange,
    handlePageSizeChange,
    modalVisible,
    detailDrawerVisible,
    editingRecord,
    submitLoading,
    viewOnly,
    groups,
    setModalVisible,
    setDetailDrawerVisible,
    handleSearchChange,
    handleGroupFilterChange,
    handleStatusFilterChange,
    handleVisibilityFilterChange,
    handleShowArchivedChange,
    handleCreateNew,
    handleEdit,
    handleView,
    handleSaveProject,
    handlePublishProject,
    handleUnpublishProject,
    handleCompleteProject,
    handleArchiveProject,
    handleAssignGroup,
    handleDeleteProject,
    fetchData,
    isMentor,
  } = useProjectManagement();

  return (
    <PageLayout className="animate-in fade-in flex min-h-0 flex-1 flex-col space-y-6 duration-500">
      <PageTitle title={PROJECT_MANAGEMENT.TITLE} />

      <PageLayout.Card className="flex min-h-0 flex-1 flex-col overflow-hidden !p-4 sm:!p-8">
        <DataTableToolbar className="mb-5 flex-shrink-0 !border-0 !p-0">
          <DataTableToolbar.Search
            placeholder={PROJECT_MANAGEMENT.SEARCH_PLACEHOLDER}
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          <DataTableToolbar.Filters>
            <Select
              className="h-9 w-44"
              placeholder={FILTERS.GROUP_FILTER}
              allowClear
              value={groupIdFilter}
              onChange={handleGroupFilterChange}
            >
              {groups.map((g) => (
                <Option key={g.internshipId || g.id} value={g.internshipId || g.id}>
                  {g.groupName}
                </Option>
              ))}
            </Select>
            {isMentor && (
              <Select
                className="h-9 w-40"
                placeholder={FILTERS.VISIBILITY_FILTER}
                allowClear
                value={visibilityFilter}
                onChange={handleVisibilityFilterChange}
              >
                <Option value={VISIBILITY_STATUS.DRAFT}>
                  {VISIBILITY_LABELS[VISIBILITY_STATUS.DRAFT]}
                </Option>
                <Option value={VISIBILITY_STATUS.PUBLISHED}>
                  {VISIBILITY_LABELS[VISIBILITY_STATUS.PUBLISHED]}
                </Option>
              </Select>
            )}
            <Select
              className="h-9 w-40"
              placeholder={FILTERS.STATUS_FILTER}
              allowClear
              value={statusFilter}
              onChange={handleStatusFilterChange}
            >
              <Option value={OPERATIONAL_STATUS.UNSTARTED}>
                {OPERATIONAL_LABELS[OPERATIONAL_STATUS.UNSTARTED]}
              </Option>
              <Option value={OPERATIONAL_STATUS.ACTIVE}>
                {OPERATIONAL_LABELS[OPERATIONAL_STATUS.ACTIVE]}
              </Option>
              <Option value={OPERATIONAL_STATUS.COMPLETED}>
                {OPERATIONAL_LABELS[OPERATIONAL_STATUS.COMPLETED]}
              </Option>
            </Select>
            <div
              onClick={() => handleShowArchivedChange(!showArchived)}
              className={cn(
                'flex cursor-pointer select-none items-center gap-1.5 rounded-lg border px-3 py-1.5 transition-all ml-2',
                showArchived
                  ? 'border-primary/20 bg-primary/10 text-primary shadow-sm'
                  : 'border-slate-200 bg-slate-50 text-slate-400 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-500'
              )}
            >
              <CarryOutOutlined
                className={cn('text-[14px]', showArchived ? 'text-primary' : 'text-slate-400')}
              />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {FILTERS.SHOW_ARCHIVED}
              </span>
            </div>
          </DataTableToolbar.Filters>
          {isMentor && (
            <DataTableToolbar.Actions
              label={PROJECT_MANAGEMENT.CREATE_BTN}
              onClick={handleCreateNew}
              className="ml-auto"
            />
          )}
        </DataTableToolbar>

        <ProjectTable
          data={data}
          loading={loading}
          pagination={pagination}
          groups={groups}
          isMentor={isMentor}
          onChange={handleTableChange}
          onEdit={handleEdit}
          onView={handleView}
          onAssign={(record) => {
            setAssigningProject(record);
            setSelectedGroupId(
              record.internshipId || record.internshipGroupId || record.groupId || null
            );
            setAssignModalVisible(true);
          }}
          onPublish={handlePublishProject}
          onUnpublish={handleUnpublishProject}
          onComplete={handleCompleteProject}
          onArchive={handleArchiveProject}
          onDelete={handleDeleteProject}
        />

        {pagination.total > 0 && (
          <div className="border-border/50 mt-auto flex-shrink-0 border-t pt-6">
            <Pagination
              total={pagination.total}
              page={pagination.current}
              pageSize={pagination.pageSize}
              totalPages={Math.ceil(pagination.total / pagination.pageSize)}
              onPageChange={(page) => handleTableChange({ ...pagination, current: page })}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        )}
      </PageLayout.Card>

      <>
        <ProjectFormModal
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          onSave={handleSaveProject}
          editingRecord={editingRecord}
          loading={submitLoading}
          viewOnly={viewOnly}
          groups={groups}
        />

        <ProjectDetailDrawer
          visible={detailDrawerVisible}
          onClose={() => setDetailDrawerVisible(false)}
          project={editingRecord}
          groups={groups}
          onRefresh={fetchData}
          onAssign={(record) => {
            setAssigningProject(record);
            setSelectedGroupId(
              record.internshipId || record.internshipGroupId || record.groupId || null
            );
            setAssignModalVisible(true);
          }}
        />

        <Modal
          title={PROJECT_MANAGEMENT.MODALS?.ASSIGN_GROUP?.TITLE}
          open={assignModalVisible}
          onOk={() =>
            handleAssignGroup(assigningProject, selectedGroupId, setAssignLoading, () =>
              setAssignModalVisible(false)
            )
          }
          onCancel={() => setAssignModalVisible(false)}
          confirmLoading={assignLoading}
          okButtonProps={{ disabled: !selectedGroupId }}
          okText={PROJECT_MANAGEMENT.MODALS?.ASSIGN_GROUP?.CONFIRM}
        >
          <div className="py-4">
            <p
              className="mb-2 text-sm text-gray-600"
              dangerouslySetInnerHTML={{
                __html: PROJECT_MANAGEMENT.MODALS?.ASSIGN_GROUP?.DESC.replace(
                  '{name}',
                  assigningProject?.projectName || ''
                ),
              }}
            />
            <Select
              className="w-full"
              placeholder={PROJECT_MANAGEMENT.MODALS?.ASSIGN_GROUP?.PLACEHOLDER}
              value={selectedGroupId}
              onChange={setSelectedGroupId}
              allowClear
            >
              {groups.map((g) => (
                <Option key={g.internshipId || g.id} value={g.internshipId || g.id}>
                  {g.groupName}
                </Option>
              ))}
            </Select>
          </div>
        </Modal>
      </>
    </PageLayout>
  );
}

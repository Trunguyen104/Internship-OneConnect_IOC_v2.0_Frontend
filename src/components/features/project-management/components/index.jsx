'use client';

import { CarryOutOutlined } from '@ant-design/icons';
import { App, ExclamationCircleOutlined, Modal, Select, Tooltip } from 'antd';
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
    total,
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

  const sourceGroupId =
    assigningProject?.internshipId ||
    assigningProject?.internshipGroupId ||
    assigningProject?.groupId;
  const isMovingFromGroup =
    sourceGroupId && sourceGroupId !== '00000000-0000-0000-0000-000000000000';
  const sourceGroup = groups.find((g) => (g.internshipId || g.id) === sourceGroupId);

  const [replacementProjectId, setReplacementProjectId] = useState(null);

  const unstartedProjects = (data || []).filter((p) => {
    const gid = p.internshipId || p.internshipGroupId || p.groupId;
    return !gid || gid === '00000000-0000-0000-0000-000000000000';
  });

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
              className="h-9 w-36"
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
                className="h-9 w-32"
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
              className="h-9 w-32"
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
            <Tooltip title={FILTERS.SHOW_ARCHIVED}>
              <div
                onClick={() => handleShowArchivedChange(!showArchived)}
                className={cn(
                  'flex h-9 w-9 cursor-pointer select-none items-center justify-center rounded-lg border transition-all ml-2',
                  showArchived
                    ? 'border-primary/20 bg-primary/10 text-primary shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-400 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-500'
                )}
              >
                <CarryOutOutlined
                  className={cn('text-[16px]', showArchived ? 'text-primary' : 'text-slate-400')}
                />
              </div>
            </Tooltip>
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
            setReplacementProjectId(null);
            setAssignModalVisible(true);
          }}
          onPublish={handlePublishProject}
          onUnpublish={handleUnpublishProject}
          onComplete={handleCompleteProject}
          onArchive={handleArchiveProject}
          onDelete={handleDeleteProject}
        />

        <div className="border-border/50 mt-auto flex-shrink-0 border-t pt-6">
          <Pagination
            total={total}
            page={pagination.current}
            pageSize={pagination.pageSize}
            totalPages={Math.max(1, Math.ceil(total / pagination.pageSize))}
            onPageChange={(page) => handleTableChange({ ...pagination, current: page })}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
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
            setReplacementProjectId(null);
            setAssignModalVisible(true);
          }}
        />

        <Modal
          title={PROJECT_MANAGEMENT.MODALS?.ASSIGN_GROUP?.TITLE}
          open={assignModalVisible}
          onOk={() =>
            handleAssignGroup(
              assigningProject,
              selectedGroupId,
              setAssignLoading,
              () => setAssignModalVisible(false),
              replacementProjectId
            )
          }
          onCancel={() => setAssignModalVisible(false)}
          confirmLoading={assignLoading}
          zIndex={2000}
          okButtonProps={{
            disabled:
              !selectedGroupId ||
              (isMovingFromGroup &&
                selectedGroupId !== sourceGroupId &&
                (sourceGroup?.studentCount > 0 ||
                  sourceGroup?.numberOfMembers > 0 ||
                  assigningProject?.groupInfo?.studentCount > 0) &&
                !replacementProjectId),
          }}
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

            {/* AC-05: Case B - Replacement selection if it's a move */}
            {isMovingFromGroup && selectedGroupId && selectedGroupId !== sourceGroupId && (
              <div className="mt-6 border-t pt-4">
                <div className="mb-3 flex items-start gap-2 rounded-md bg-amber-50 p-3">
                  <span className="text-amber-500 mt-0.5">
                    <ExclamationCircleOutlined />
                  </span>
                  <p
                    className="text-xs text-amber-800"
                    dangerouslySetInnerHTML={{
                      __html: PROJECT_MANAGEMENT.MODALS?.ASSIGN_GROUP?.SWAP_WARNING.replace(
                        '{projectName}',
                        assigningProject?.projectName || ''
                      ).replace('{groupName}', sourceGroup?.groupName || 'current group'),
                    }}
                  />
                </div>

                <div className="font-medium text-xs text-gray-500 mb-1.5 uppercase tracking-wider">
                  {PROJECT_MANAGEMENT.MODALS?.ASSIGN_GROUP?.REPLACEMENT_LABEL.replace(
                    '{groupName}',
                    sourceGroup?.groupName || 'Current Group'
                  )}
                </div>
                <Select
                  className="w-full"
                  placeholder={PROJECT_MANAGEMENT.MODALS?.ASSIGN_GROUP?.REPLACEMENT_PLACEHOLDER}
                  value={replacementProjectId}
                  onChange={setReplacementProjectId}
                  allowClear
                >
                  {unstartedProjects.map((p) => (
                    <Option key={p.projectId} value={p.projectId}>
                      {p.projectName}
                    </Option>
                  ))}
                </Select>
                {unstartedProjects.length === 0 && (
                  <p className="mt-1 text-[10px] italic text-red-400">
                    {PROJECT_MANAGEMENT.MODALS?.ASSIGN_GROUP?.NO_UNSTARTED_PROJECTS.replace(
                      '{groupName}',
                      sourceGroup?.groupName || ''
                    )}
                  </p>
                )}
              </div>
            )}
          </div>
        </Modal>
      </>
    </PageLayout>
  );
}

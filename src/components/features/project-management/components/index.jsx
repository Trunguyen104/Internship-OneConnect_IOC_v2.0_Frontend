'use client';

import { PlusOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import React from 'react';

import Card from '@/components/ui/card';
import DataTableToolbar from '@/components/ui/datatabletoolbar';
import PageTitle from '@/components/ui/pagetitle';
import Pagination from '@/components/ui/pagination';
import { PROJECT_MANAGEMENT } from '@/constants/project-management/project-management';

import { useProjectManagement } from '../hooks/useProjectManagement';
import ProjectDetailDrawer from './ProjectDetailDrawer';
import ProjectFormModal from './ProjectFormModal';
import ProjectTable from './ProjectTable';

const { Option } = Select;

export default function ProjectManagement() {
  const { FILTERS } = PROJECT_MANAGEMENT;

  const {
    data,
    loading,
    searchTerm,
    groupIdFilter,
    statusFilter,
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
    handleCreateNew,
    handleEdit,
    handleView,
    handleAssign,
    handleSaveProject,
    handlePublishProject,
    handleCompleteProject,
    handleDeleteProject,
    fetchData,
  } = useProjectManagement();

  return (
    <section className="animate-in fade-in flex min-h-0 flex-1 flex-col space-y-6 duration-500">
      <PageTitle title={PROJECT_MANAGEMENT.TITLE} />

      <Card className="flex min-h-0 flex-1 flex-col overflow-hidden !p-4 sm:!p-8">
        <DataTableToolbar className="mb-5 flex-shrink-0 !border-0 !p-0">
          <DataTableToolbar.Search
            placeholder={PROJECT_MANAGEMENT.SEARCH_PLACEHOLDER}
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          <DataTableToolbar.Filters>
            <Select
              className="h-9 w-48"
              placeholder={FILTERS.GROUP_FILTER}
              allowClear
              value={groupIdFilter}
              onChange={handleGroupFilterChange}
            >
              {groups
                .filter((g) => g.status === 1 || g.status === 2)
                .map((g) => (
                  <Option key={g.internshipId || g.id} value={g.internshipId || g.id}>
                    {g.groupName}
                  </Option>
                ))}
            </Select>
            <Select
              className="h-9 w-40"
              placeholder={FILTERS.STATUS_FILTER}
              allowClear
              value={statusFilter}
              onChange={handleStatusFilterChange}
            >
              <Option value={0}>Draft</Option>
              <Option value={1}>Published</Option>
              <Option value={2}>Completed</Option>
            </Select>
          </DataTableToolbar.Filters>
          <DataTableToolbar.Actions
            label={PROJECT_MANAGEMENT.CREATE_BTN}
            onClick={handleCreateNew}
            icon={<PlusOutlined />}
            className="ml-auto"
          />
        </DataTableToolbar>

        <ProjectTable
          data={data}
          loading={loading}
          pagination={pagination}
          groups={groups}
          onChange={handleTableChange}
          onEdit={handleEdit}
          onView={handleView}
          onAssign={handleView}
          onPublish={handlePublishProject}
          onComplete={handleCompleteProject}
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
      </Card>

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
      />
    </section>
  );
}

'use client';

import { PlusOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import React from 'react';

import Card from '@/components/ui/card';
import DataTableToolbar from '@/components/ui/datatabletoolbar';
import PageTitle from '@/components/ui/pagetitle';
import Pagination from '@/components/ui/pagination';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

import { useProjectManagement } from '../hooks/useProjectManagement';
import AssignStudentModal from './AssignStudentModal';
import ProjectFormModal from './ProjectFormModal';
import ProjectTable from './ProjectTable';

const { Option } = Select;

export default function ProjectManagement() {
  const { PROJECT_MANAGEMENT } = INTERNSHIP_MANAGEMENT_UI.ENTERPRISE;
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
    assignmentModalVisible,
    editingRecord,
    submitLoading,
    viewOnly,
    groups,
    setModalVisible,
    setAssignmentModalVisible,
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
              placeholder={FILTERS.GROUP}
              allowClear
              value={groupIdFilter}
              onChange={handleGroupFilterChange}
            >
              {groups.map((g) => (
                <Option key={g.id || g.internshipGroupId} value={g.id || g.internshipGroupId}>
                  {g.internshipGroupName}
                </Option>
              ))}
            </Select>
            <Select
              className="h-9 w-40"
              placeholder={FILTERS.STATUS}
              allowClear
              value={statusFilter}
              onChange={handleStatusFilterChange}
            >
              <Option value={1}>Draft</Option>
              <Option value={2}>Published</Option>
              <Option value={3}>Completed</Option>
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
          onChange={handleTableChange}
          onEdit={handleEdit}
          onView={handleView}
          onAssign={handleAssign}
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

      <AssignStudentModal
        visible={assignmentModalVisible}
        onCancel={() => setAssignmentModalVisible(false)}
        project={editingRecord}
      />
    </section>
  );
}

'use client';

import { DownOutlined, EditOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import React from 'react';

import Card from '@/components/ui/card';
import DataTableToolbar from '@/components/ui/datatabletoolbar';
import Pagination from '@/components/ui/pagination';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

import CreateGroupModal from '../../internship-group-management/components/CreateGroupModal';
import { useInternshipManagement } from '../hooks/useInternshipManagement';
import AssignMentorModal from './AssignMentorModal';
import GroupActionModal from './GroupActionModal';
import RejectStudentModal from './RejectStudentModal';
import StudentDetailModal from './StudentDetailModal';
import StudentFilters from './StudentFilters';
import StudentTable from './StudentTable';

export default function InternshipManagement() {
  const { INTERNSHIP_LIST } = INTERNSHIP_MANAGEMENT_UI;

  const {
    search,
    statusFilter,
    groupFilter,
    setGroupFilter,
    assignmentFilter,
    setAssignmentFilter,
    pagination,
    filteredData,
    total,
    loading,
    rejectModal,
    groupModal,
    detailModal,
    assignModal,
    selectedRowKeys,
    setRejectModal,
    setGroupModal,
    setDetailModal,
    setAssignModal,
    setSelectedRowKeys,
    handleSearchChange,
    handleStatusChange,
    handleTableChange,
    handlePageSizeChange,
    handleAcceptStudent,
    handleRejectStudent,
    handleGroupSubmit,
    handleAssignMentor,
    termId,
    setTermId,
    termOptions,
    fetchingTerms,
    resetFilters,
    projectFilter,
    setProjectFilter,
    universityFilter,
    setUniversityFilter,
    majorFilter,
    setMajorFilter,
    universityOptions,
    setCreateModal,
    createModal,
    unassignedStudents,
    fetchingStudents,
    handleCreateGroup,
    dateFilter,
    setDateFilter,
    isTermEditable,
    hasGroups,
    existingGroups,
    sort,
    setSort,
  } = useInternshipManagement();

  const selectedStudents = filteredData.filter((s) => selectedRowKeys.includes(s.id));
  const hasGroup = selectedStudents.some((s) => !!s.groupId);

  const uniqueTerms = new Set(selectedStudents.map((s) => s.termId));
  const isSingleTerm = uniqueTerms.size === 1;

  const bulkItems = [
    {
      key: 'addToGroup',
      label: INTERNSHIP_LIST.ACTIONS.ADD_TO_GROUP,
      icon: <UsergroupAddOutlined />,
      disabled: !isTermEditable || !isSingleTerm,
      onClick: () => setGroupModal({ open: true, students: selectedStudents, type: 'ADD' }),
    },
    {
      key: 'changeGroup',
      label: INTERNSHIP_LIST.ACTIONS.CHANGE_GROUP,
      icon: <EditOutlined />,
      disabled: !isTermEditable || !isSingleTerm,
      onClick: () => setGroupModal({ open: true, students: selectedStudents, type: 'CHANGE' }),
    },
  ].filter(Boolean);

  return (
    <section className="animate-in fade-in flex min-h-0 flex-1 flex-col space-y-6 duration-500">
      <Card className="flex min-h-0 flex-1 flex-col overflow-hidden !p-4 sm:!p-8">
        <DataTableToolbar className="mb-5 !border-0 !p-0">
          <DataTableToolbar.Search
            placeholder={INTERNSHIP_LIST.FILTERS.SEARCH_PLACEHOLDER}
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />

          <DataTableToolbar.Filters>
            <div className="flex flex-wrap items-center gap-3">
              <StudentFilters
                statusFilter={statusFilter}
                setStatusFilter={handleStatusChange}
                dateFilter={dateFilter}
                setDateFilter={setDateFilter}
                groupFilter={groupFilter}
                setGroupFilter={setGroupFilter}
                assignmentFilter={assignmentFilter}
                setAssignmentFilter={setAssignmentFilter}
                projectFilter={projectFilter}
                setProjectFilter={setProjectFilter}
                universityFilter={universityFilter}
                setUniversityFilter={setUniversityFilter}
                majorFilter={majorFilter}
                setMajorFilter={setMajorFilter}
                universityOptions={universityOptions}
                resetFilters={resetFilters}
              />
            </div>
          </DataTableToolbar.Filters>

          <DataTableToolbar.Actions className="ml-auto">
            {selectedRowKeys.length > 0 && bulkItems.length > 0 && (
              <DataTableToolbar.Actions
                label={INTERNSHIP_LIST.ACTIONS.BULK_ACTIONS || 'Bulk Actions'}
                icon={<DownOutlined />}
                menu={{ items: bulkItems }}
                className="bg-slate-800 hover:bg-slate-900"
              />
            )}
          </DataTableToolbar.Actions>
        </DataTableToolbar>

        <StudentTable
          data={filteredData}
          page={pagination.current}
          pageSize={pagination.pageSize}
          loading={loading}
          isTermEditable={isTermEditable}
          hasGroups={hasGroups}
          emptyText="Currently, no students are performing the work."
          sortBy={sort.column}
          sortOrder={sort.order}
          onSort={(key, order) => setSort({ column: key, order })}
          selectedRowKeys={selectedRowKeys}
          onSelectRowChange={setSelectedRowKeys}
          onAccept={handleAcceptStudent}
          onReject={(student) => setRejectModal({ open: true, student, reason: '' })}
          onView={(student) => setDetailModal({ open: true, student })}
          onAssign={(student) => setAssignModal({ open: true, student })}
          onCreateGroup={(student) => setCreateModal({ open: true, students: [student] })}
          onAddToGroup={(student) =>
            setGroupModal({ open: true, students: [student], type: 'ADD' })
          }
          onChangeGroup={(student) =>
            setGroupModal({ open: true, students: [student], type: 'CHANGE' })
          }
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

      <RejectStudentModal
        open={rejectModal.open}
        student={rejectModal.student}
        onCancel={() => setRejectModal({ open: false, student: null, reason: '' })}
        onConfirm={handleRejectStudent}
      />

      <StudentDetailModal
        open={detailModal.open}
        student={detailModal.student}
        onCancel={() => setDetailModal({ open: false, student: null })}
      />

      <AssignMentorModal
        open={assignModal.open}
        student={assignModal.student}
        onCancel={() => setAssignModal({ open: false, student: null })}
        onConfirm={handleAssignMentor}
      />

      <GroupActionModal
        open={groupModal.open}
        students={groupModal.students}
        type={groupModal.type}
        onCancel={() => setGroupModal({ open: false, students: [], type: 'ADD' })}
        onConfirm={handleGroupSubmit}
      />

      <CreateGroupModal
        open={createModal.open}
        students={unassignedStudents}
        existingGroups={existingGroups}
        loadingStudents={fetchingStudents}
        initialStudents={createModal.students}
        onCancel={() => setCreateModal({ open: false, students: [] })}
        onFinish={handleCreateGroup}
      />
    </section>
  );
}

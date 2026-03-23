'use client';

import { EditOutlined, TeamOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import React from 'react';

import Card from '@/components/ui/card';
import DataTableToolbar from '@/components/ui/datatabletoolbar';
import PageTitle from '@/components/ui/pagetitle';
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
  } = useInternshipManagement();

  const selectedStudents = filteredData.filter((s) => selectedRowKeys.includes(s.id));
  const hasGroup = selectedStudents.some((s) => !!s.groupId);

  const bulkItems = [
    {
      key: 'createGroup',
      label: INTERNSHIP_LIST.ACTIONS.CREATE_GROUP,
      icon: <UsergroupAddOutlined />,
      disabled: hasGroup || selectedStudents.some((s) => s.status !== 2),
      onClick: () => setCreateModal({ open: true, students: selectedStudents }),
    },
    {
      key: 'addToGroup',
      label: INTERNSHIP_LIST.ACTIONS.ADD_TO_GROUP,
      icon: <UsergroupAddOutlined />,
      onClick: () => setGroupModal({ open: true, students: selectedStudents, type: 'ADD' }),
    },
    {
      key: 'changeGroup',
      label: INTERNSHIP_LIST.ACTIONS.CHANGE_GROUP,
      icon: <EditOutlined />,
      onClick: () => setGroupModal({ open: true, students: selectedStudents, type: 'CHANGE' }),
    },
  ];

  return (
    <>
      <div className="mx-auto flex w-full max-w-full flex-1 flex-col">
        <PageTitle title={INTERNSHIP_LIST.TITLE} showBack={false} />

        <Card className="flex min-h-0 flex-1 flex-col overflow-hidden !p-4 sm:!p-8 shadow-sm">
          <DataTableToolbar className="mb-6">
            <DataTableToolbar.Search
              placeholder={INTERNSHIP_LIST.FILTERS.SEARCH_PLACEHOLDER}
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="max-w-xs"
            />

            <DataTableToolbar.Filters>
              <StudentFilters
                termId={termId}
                setTermId={setTermId}
                termOptions={termOptions}
                fetchingTerms={fetchingTerms}
                statusFilter={statusFilter}
                setStatusFilter={handleStatusChange}
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
            </DataTableToolbar.Filters>

            {selectedRowKeys.length > 0 && (
              <DataTableToolbar.Actions
                label={`${INTERNSHIP_LIST.ACTIONS.BULK_ACTIONS} (${selectedRowKeys.length})`}
                icon={<TeamOutlined />}
                menu={{
                  items: bulkItems,
                }}
              />
            )}
          </DataTableToolbar>

          <StudentTable
            data={filteredData}
            page={pagination.current}
            pageSize={pagination.pageSize}
            loading={loading}
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
        students={unassignedStudents} // We can re-use fetching logic
        loadingStudents={fetchingStudents}
        initialStudents={createModal.students}
        onCancel={() => setCreateModal({ open: false, students: [] })}
        onFinish={handleCreateGroup}
      />
    </>
  );
}

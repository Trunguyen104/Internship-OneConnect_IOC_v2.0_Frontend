'use client';

import { CalendarOutlined, FilterOutlined, TeamOutlined, UserAddOutlined } from '@ant-design/icons';
import { DatePicker, Select } from 'antd';
import React from 'react';

import Card from '@/components/ui/card';
import DataTableToolbar from '@/components/ui/datatabletoolbar';
import PageTitle from '@/components/ui/pagetitle';
import Pagination from '@/components/ui/pagination';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';

import { MOCK_STUDENTS } from '../constants/internshipData';
import { useInternshipManagement } from '../hooks/useInternshipManagement';
import AddStudentModal from './AddStudentModal';
import AssignMentorModal from './AssignMentorModal';
import GroupActionModal from './GroupActionModal';
import InternshipTable from './InternshipTable';
import RejectStudentModal from './RejectStudentModal';
import StudentDetailModal from './StudentDetailModal';

export default function InternshipManagement() {
  const { INTERNSHIP_LIST } = INTERNSHIP_MANAGEMENT_UI;
  const {
    search,
    statusFilter,
    groupFilter,
    assignmentFilter,
    dateFilter,
    pagination,
    filteredData,
    paginatedData,
    rejectModal,
    assignModal,
    groupModal,
    detailModal,
    isAddModalOpen,
    selectedRowKeys,
    setRejectModal,
    setAssignModal,
    setGroupModal,
    setDetailModal,
    setIsAddModalOpen,
    setSelectedRowKeys,
    setGroupFilter,
    setAssignmentFilter,
    setDateFilter,
    handleSearchChange,
    handleStatusChange,
    handleTableChange,
    handlePageSizeChange,
    handleAcceptStudent,
    handleAddStudent,
    handleRejectStudent,
    handleAssignMentor,
    handleGroupSubmit,
  } = useInternshipManagement(MOCK_STUDENTS);

  return (
    <>
      <div className="mx-auto flex min-h-[420px] w-full flex-1 flex-col">
        <PageTitle title={INTERNSHIP_LIST.TITLE} />
        <Card className="flex min-h-0 flex-1 flex-col overflow-hidden !p-4 sm:!p-8">
          <DataTableToolbar className="mb-6">
            <DataTableToolbar.Search
              placeholder={INTERNSHIP_LIST.FILTERS.SEARCH_PLACEHOLDER}
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />

            <DataTableToolbar.Filters>
              <div className="flex flex-wrap items-center gap-3">
                <DatePicker
                  picker="month"
                  placeholder={INTERNSHIP_LIST.FILTERS.DATE_FILTER_PLACEHOLDER}
                  value={dateFilter}
                  onChange={setDateFilter}
                  className="h-9 w-40 rounded-lg"
                  suffixIcon={<CalendarOutlined className="text-muted" />}
                />

                <Select
                  allowClear
                  placeholder={INTERNSHIP_LIST.FILTERS.STATUS_FILTER || 'Status'}
                  value={statusFilter === 'ALL' ? undefined : statusFilter}
                  onChange={handleStatusChange}
                  className="h-9 min-w-[130px]"
                  options={INTERNSHIP_LIST.FILTERS.STATUS_OPTIONS.filter(
                    (opt) => opt.value !== 'ALL'
                  )}
                  suffixIcon={<FilterOutlined className="text-muted" />}
                />

                <Select
                  allowClear
                  placeholder={INTERNSHIP_LIST.FILTERS.GROUP_FILTER}
                  value={groupFilter === 'ALL' ? undefined : groupFilter}
                  onChange={setGroupFilter}
                  className="h-9 min-w-[130px]"
                  options={INTERNSHIP_LIST.FILTERS.GROUP_OPTIONS}
                  suffixIcon={<TeamOutlined className="text-muted" />}
                />

                <Select
                  allowClear
                  placeholder={INTERNSHIP_LIST.FILTERS.ASSIGNMENT_FILTER}
                  value={assignmentFilter === 'ALL' ? undefined : assignmentFilter}
                  onChange={setAssignmentFilter}
                  className="h-9 min-w-[130px]"
                  options={INTERNSHIP_LIST.FILTERS.ASSIGNMENT_OPTIONS}
                  suffixIcon={<FilterOutlined className="text-muted" />}
                />
              </div>
            </DataTableToolbar.Filters>

            <DataTableToolbar.Actions
              {...(selectedRowKeys.length > 0
                ? {
                    label: `${INTERNSHIP_LIST.ACTIONS.BULK_ACTIONS} (${selectedRowKeys.length})`,
                    icon: <TeamOutlined />,
                    menu: {
                      items: [
                        {
                          key: 'add-to-group',
                          label: INTERNSHIP_LIST.ACTIONS.ADD_TO_GROUP,
                          icon: <UserAddOutlined />,
                          onClick: () =>
                            setGroupModal({
                              open: true,
                              student: { id: selectedRowKeys[0] }, // Mock single for now
                              type: 'ADD',
                            }),
                        },
                      ],
                    },
                  }
                : {
                    label: INTERNSHIP_LIST.ADD_STUDENT_BTN,
                    onClick: () => setIsAddModalOpen(true),
                    icon: <UserAddOutlined />,
                  })}
            />
          </DataTableToolbar>

          <InternshipTable
            data={paginatedData}
            page={pagination.current}
            pageSize={pagination.pageSize}
            selectedRowKeys={selectedRowKeys}
            onSelectRowChange={setSelectedRowKeys}
            onAccept={handleAcceptStudent}
            onReject={(student) => setRejectModal({ open: true, student, reason: '' })}
            onAssign={(student) => setAssignModal({ open: true, student })}
            onView={(student) => setDetailModal({ open: true, student })}
            onGroup={(student) =>
              setGroupModal({
                open: true,
                student,
                type: student.groupId ? 'CHANGE' : 'ADD',
              })
            }
          />
          {filteredData.length > 0 && (
            <div className="border-border/50 mt-6 flex-shrink-0 border-t pt-6">
              <Pagination
                total={filteredData.length}
                page={pagination.current}
                pageSize={pagination.pageSize}
                totalPages={Math.ceil(filteredData.length / pagination.pageSize)}
                onPageChange={handleTableChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </div>
          )}
        </Card>
      </div>

      <AddStudentModal
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        onSave={handleAddStudent}
      />

      <RejectStudentModal
        open={rejectModal.open}
        student={rejectModal.student}
        onCancel={() => setRejectModal({ open: false, student: null, reason: '' })}
        onConfirm={handleRejectStudent}
      />

      <AssignMentorModal
        open={assignModal.open}
        student={assignModal.student}
        onCancel={() => setAssignModal({ open: false, student: null })}
        onConfirm={handleAssignMentor}
      />

      <GroupActionModal
        open={groupModal.open}
        student={groupModal.student}
        type={groupModal.type}
        onCancel={() => setGroupModal({ open: false, student: null, type: 'ADD' })}
        onConfirm={handleGroupSubmit}
      />

      <StudentDetailModal
        open={detailModal.open}
        student={detailModal.student}
        onCancel={() => setDetailModal({ open: false, student: null })}
      />
    </>
  );
}

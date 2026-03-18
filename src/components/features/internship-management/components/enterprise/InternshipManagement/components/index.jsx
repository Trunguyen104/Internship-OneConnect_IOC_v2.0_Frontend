'use client';

import React from 'react';
import DataTableToolbar from '@/components/ui/DataTableToolbar';
import Pagination from '@/components/ui/Pagination';
import StudentPageHeader from '@/components/layout/StudentPageHeader';
import { FilterOutlined, UserAddOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { useInternshipManagement } from '../hooks/useInternshipManagement';
import { MOCK_STUDENTS } from '../constants/internshipData';
import InternshipTable from './InternshipTable';
import AddStudentModal from './AddStudentModal';
import RejectStudentModal from './RejectStudentModal';
import AssignMentorModal from './AssignMentorModal';
import GroupActionModal from './GroupActionModal';
import Card from '@/components/ui/Card';

export default function InternshipManagement() {
  const { INTERNSHIP_LIST } = INTERNSHIP_MANAGEMENT_UI;
  const {
    search,
    statusFilter,
    pagination,
    filteredData,
    paginatedData,
    rejectModal,
    assignModal,
    groupModal,
    isAddModalOpen,
    setRejectModal,
    setAssignModal,
    setGroupModal,
    setIsAddModalOpen,
    handleSearchChange,
    handleStatusChange,
    handleTableChange,
    handleAcceptStudent,
    handleAddStudent,
    handleRejectStudent,
    handleAssignMentor,
    handleGroupSubmit,
  } = useInternshipManagement(MOCK_STUDENTS);

  return (
    <>
      <StudentPageHeader title={INTERNSHIP_LIST.TITLE} />

      <div className='mx-auto flex min-h-[420px] w-full max-w-[1440px] flex-1 flex-col'>
        <Card className='flex min-h-0 flex-1 flex-col overflow-hidden !p-4 sm:!p-8'>
          <DataTableToolbar
            className='mb-5 flex-shrink-0 !border-0 !p-0'
            searchProps={{
              placeholder: INTERNSHIP_LIST.FILTERS.SEARCH_PLACEHOLDER,
              value: search,
              onChange: (e) => handleSearchChange(e.target.value),
            }}
            filterContent={
              <div className='flex flex-wrap items-center gap-3'>
                <Select
                  allowClear
                  placeholder={INTERNSHIP_LIST.FILTERS.STATUS_FILTER || 'Status'}
                  value={statusFilter === 'ALL' ? undefined : statusFilter}
                  onChange={handleStatusChange}
                  className='h-9 min-w-[160px]'
                  options={INTERNSHIP_LIST.FILTERS.STATUS_OPTIONS.filter(
                    (opt) => opt.value !== 'ALL',
                  )}
                  suffixIcon={<FilterOutlined className='text-muted' />}
                />
              </div>
            }
            actionProps={{
              label: INTERNSHIP_LIST.ADD_STUDENT_BTN,
              onClick: () => setIsAddModalOpen(true),
              icon: <UserAddOutlined />,
            }}
          />

          <InternshipTable
            data={paginatedData}
            page={pagination.current}
            pageSize={pagination.pageSize}
            onAccept={handleAcceptStudent}
            onReject={(student) => setRejectModal({ open: true, student, reason: '' })}
            onAssign={(student) => setAssignModal({ open: true, student })}
            onGroup={(student) =>
              setGroupModal({
                open: true,
                student,
                type: student.groupId ? 'CHANGE' : 'ADD',
              })
            }
          />
          {filteredData.length > 0 && (
            <div className='border-border/50 mt-6 flex-shrink-0 border-t pt-6'>
              <Pagination
                total={filteredData.length}
                page={pagination.current}
                pageSize={pagination.pageSize}
                totalPages={Math.ceil(filteredData.length / pagination.pageSize)}
                onPageChange={handleTableChange}
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
    </>
  );
}

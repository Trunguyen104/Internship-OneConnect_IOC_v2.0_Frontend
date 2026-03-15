'use client';

import React from 'react';
import { Pagination } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import Card from '@/components/ui/Card';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management';
import { useInternshipManagement } from './hooks/useInternshipManagement';
import { MOCK_STUDENTS } from './constants/internshipData';
import InternshipHeader from './components/InternshipHeader';
import InternshipFilters from './components/InternshipFilters';
import InternshipTable from './components/InternshipTable';
import AddStudentModal from './components/AddStudentModal';
import RejectStudentModal from './components/RejectStudentModal';
import AssignMentorModal from './components/AssignMentorModal';
import GroupActionModal from './components/GroupActionModal';

export default function InternshipManagement() {
  const { INTERNSHIP_LIST } = INTERNSHIP_MANAGEMENT_UI;
  const {
    search,
    statusFilter,
    mentorFilter,
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
    handleMentorChange,
    handleTableChange,
    handleAcceptStudent,
    handleAddStudent,
    handleRejectStudent,
    handleAssignMentor,
    handleGroupSubmit,
    setStatusFilter,
  } = useInternshipManagement(MOCK_STUDENTS);

  return (
    <>
      <InternshipHeader onAddClick={() => setIsAddModalOpen(true)} />

      <div className='mx-auto flex w-full max-w-[1440px] flex-1 flex-col'>
        <Card className='bg-surface border-border overflow-hidden rounded-2xl border shadow-sm'>
          <InternshipFilters
            search={search}
            onSearchChange={handleSearchChange}
            statusFilter={statusFilter}
            onStatusChange={handleStatusChange}
            mentorFilter={mentorFilter}
            onMentorChange={handleMentorChange}
            onQuickStatusChange={setStatusFilter}
          />

          <InternshipTable
            data={paginatedData}
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
        </Card>

        <div className='mt-6 flex items-center justify-between px-2'>
          <div className='text-muted text-xs font-bold tracking-widest uppercase'>
            {INTERNSHIP_LIST.TOTAL_LABEL}: {filteredData.length}
          </div>
          <Pagination
            {...pagination}
            total={filteredData.length}
            showSizeChanger={false}
            onChange={handleTableChange}
            itemRender={(page, type, originalElement) => {
              if (type === 'prev') return <LeftOutlined className='text-primary' />;
              if (type === 'next') return <RightOutlined className='text-primary' />;
              return originalElement;
            }}
          />
        </div>
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

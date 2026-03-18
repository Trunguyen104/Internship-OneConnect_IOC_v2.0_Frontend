'use client';

import React from 'react';
import Card from '@/components/ui/card';
import Pagination from '@/components/ui/pagination';
import DataTableToolbar from '@/components/ui/datatabletoolbar';
import StudentPageHeader from '@/components/layout/StudentPageHeader';
import { Select } from 'antd';
import { FilterOutlined, UserAddOutlined, UploadOutlined } from '@ant-design/icons';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { useStudentEnrollment } from './hooks/useStudentEnrollment';
import DataGrid from './components/DataGrid';
import ImportModal from './components/ImportModal';
import AddStudentModal from './components/AddStudentModal';
import EditStudentModal from './components/EditStudentModal';
import StudentDetailsDrawer from './components/StudentDetailsDrawer';

import { MOCK_STUDENTS } from './constants/studentData';

export default function StudentEnrollment() {
  const { UNI_ADMIN } = INTERNSHIP_MANAGEMENT_UI;
  const { STUDENT_ENROLLMENT } = UNI_ADMIN;

  const {
    searchTerm,
    statusFilter,
    currentPage,
    importVisible,
    addVisible,
    editVisible,
    detailsVisible,
    selectedStudent,
    filteredStudents,
    setSearchTerm,
    setStatusFilter,
    setCurrentPage,
    setImportVisible,
    setAddVisible,
    setEditVisible,
    setDetailsVisible,
    handleView,
    handleEdit,
    handleDelete,
    handleUpdateStudent,
    handleAddStudent,
    handleImportStudents,
  } = useStudentEnrollment(MOCK_STUDENTS);

  const pageSize = 10;
  const total = filteredStudents.length;
  const totalPages = Math.ceil(total / pageSize);
  const paginatedData = filteredStudents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <section className='animate-in fade-in flex min-h-0 flex-1 flex-col space-y-6 duration-500'>
      <StudentPageHeader title={STUDENT_ENROLLMENT.TITLE} />

      <Card className='flex min-h-0 flex-1 flex-col overflow-hidden !p-4 sm:!p-8'>
        <DataTableToolbar
          className='mb-5 flex-shrink-0 !border-0 !p-0'
          searchProps={{
            placeholder: STUDENT_ENROLLMENT.SEARCH_PLACEHOLDER,
            value: searchTerm,
            onChange: (e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            },
          }}
          filterContent={
            <div className='flex flex-wrap items-center gap-3'>
              <Select
                allowClear
                placeholder={STUDENT_ENROLLMENT.STATUS_FILTER}
                value={statusFilter || undefined}
                onChange={(val) => {
                  setStatusFilter(val || '');
                  setCurrentPage(1);
                }}
                className='h-9 min-w-[160px]'
                options={[
                  { label: 'Đang thực tập', value: 'INTERNSHIP' },
                  { label: 'Hoàn thành', value: 'COMPLETED' },
                  { label: 'Đã rút lui', value: 'WITHDRAWN' },
                ]}
                suffixIcon={<FilterOutlined className='text-muted' />}
              />
            </div>
          }
          leftContent={
            <button
              onClick={() => setImportVisible(true)}
              className='border-border hover:bg-bg/50 flex h-9 flex-shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-all active:scale-95'
            >
              <UploadOutlined className='text-primary' />
              <span>{STUDENT_ENROLLMENT.IMPORT_BTN}</span>
            </button>
          }
          actionProps={{
            label: STUDENT_ENROLLMENT.ADD_BTN,
            onClick: () => setAddVisible(true),
            icon: <UserAddOutlined />,
          }}
        />

        <DataGrid
          students={paginatedData}
          loading={false} // Mock data is always fast
          page={currentPage}
          pageSize={pageSize}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {total > 0 && (
          <div className='border-border/50 mt-6 flex-shrink-0 border-t pt-6'>
            <Pagination
              total={total}
              page={currentPage}
              pageSize={pageSize}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </Card>

      <ImportModal
        visible={importVisible}
        onClose={() => setImportVisible(false)}
        onImport={handleImportStudents}
      />

      <AddStudentModal
        visible={addVisible}
        onClose={() => setAddVisible(false)}
        onSave={handleAddStudent}
      />

      <EditStudentModal
        visible={editVisible}
        onClose={() => setEditVisible(false)}
        student={selectedStudent}
        onSave={handleUpdateStudent}
      />

      <StudentDetailsDrawer
        visible={detailsVisible}
        onClose={() => setDetailsVisible(false)}
        student={selectedStudent}
        onUpdate={handleView}
      />
    </section>
  );
}

'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import Pagination from '@/components/ui/Pagination';
import DataTableToolbar from '@/components/ui/DataTableToolbar';
import StudentPageHeader from '@/components/layout/StudentPageHeader';
import { Select } from 'antd';
import { FilterOutlined, UserAddOutlined, UploadOutlined, BookOutlined } from '@ant-design/icons';
import { INTERNSHIP_MANAGEMENT_UI } from '@/constants/internship-management/internship-management';
import { useStudentEnrollment } from '../hooks/useStudentEnrollment';
import DataGrid from './DataGrid';
import ImportModal from './ImportModal';
import StudentFormModal from './StudentFormModal';

import { MOCK_STUDENTS } from '../constants/studentData';

export default function StudentEnrollment() {
  const { STUDENT_ENROLLMENT } = INTERNSHIP_MANAGEMENT_UI.UNI_ADMIN;

  const {
    searchTerm,
    statusFilter,
    majorFilter,
    pagination,
    importVisible,
    addVisible,
    editVisible,
    detailsVisible,
    submitLoading,
    selectedStudent,
    filteredStudents,
    onSearchChange,
    onStatusChange,
    onMajorChange,
    onPageChange,
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

  const total = filteredStudents.length;
  const paginatedData = filteredStudents.slice(
    (pagination.current - 1) * pagination.pageSize,
    pagination.current * pagination.pageSize,
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
            onChange: (e) => onSearchChange(e.target.value),
          }}
          filterContent={
            <div className='flex flex-wrap items-center gap-3'>
              <Select
                allowClear
                placeholder={STUDENT_ENROLLMENT.STATUS_FILTER}
                value={statusFilter || undefined}
                onChange={onStatusChange}
                className='h-9 min-w-[160px]'
                options={STUDENT_ENROLLMENT.STATUS_OPTIONS}
                suffixIcon={<FilterOutlined className='text-muted' />}
              />
              <Select
                allowClear
                placeholder={STUDENT_ENROLLMENT.MAJOR_FILTER}
                value={majorFilter || undefined}
                onChange={onMajorChange}
                className='h-9 min-w-[200px]'
                options={STUDENT_ENROLLMENT.MAJOR_OPTIONS}
                suffixIcon={<BookOutlined className='text-muted' />}
              />
            </div>
          }
          actionProps={{
            label: STUDENT_ENROLLMENT.ACTIONS.ADD,
            onClick: () => setAddVisible(true),
            icon: <UserAddOutlined />,
            menu: {
              items: [
                {
                  key: 'add',
                  label: STUDENT_ENROLLMENT.ACTIONS.ADD,
                  icon: <UserAddOutlined />,
                  onClick: () => setAddVisible(true),
                },
                {
                  key: 'import',
                  label: STUDENT_ENROLLMENT.ACTIONS.IMPORT,
                  icon: <UploadOutlined />,
                  onClick: () => setImportVisible(true),
                },
              ],
            },
          }}
        />

        <DataGrid
          students={paginatedData}
          loading={false}
          page={pagination.current}
          pageSize={pagination.pageSize}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {total > 0 && (
          <div className='border-border/50 mt-6 flex-shrink-0 border-t pt-6'>
            <Pagination
              total={total}
              page={pagination.current}
              pageSize={pagination.pageSize}
              totalPages={Math.ceil(total / pagination.pageSize)}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </Card>

      <ImportModal
        visible={importVisible}
        onClose={() => setImportVisible(false)}
        onImport={handleImportStudents}
        loading={submitLoading}
      />

      <StudentFormModal
        visible={addVisible}
        onClose={() => setAddVisible(false)}
        onSave={handleAddStudent}
        loading={submitLoading}
      />

      <StudentFormModal
        visible={editVisible}
        onClose={() => setEditVisible(false)}
        initialValues={selectedStudent}
        onSave={handleUpdateStudent}
        loading={submitLoading}
      />

      <StudentFormModal
        visible={detailsVisible}
        onClose={() => setDetailsVisible(false)}
        initialValues={selectedStudent}
        viewOnly
      />
    </section>
  );
}

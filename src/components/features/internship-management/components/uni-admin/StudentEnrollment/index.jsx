'use client';
import React from 'react';
import { Pagination } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import Card from '@/components/ui/Card';
import { useStudentEnrollment } from './hooks/useStudentEnrollment';
import HeaderActions from './components/HeaderActions';
import FiltersAndSearch from './components/FiltersAndSearch';
import DataGrid from './components/DataGrid';
import ImportModal from './components/ImportModal';
import AddStudentModal from './components/AddStudentModal';
import EditStudentModal from './components/EditStudentModal';
import StudentDetailsDrawer from './components/StudentDetailsDrawer';

import { MOCK_STUDENTS } from './constants/studentData';

export default function StudentEnrollment() {
  const {
    searchTerm,
    statusFilter,
    majorFilter,
    currentPage,
    importVisible,
    addVisible,
    editVisible,
    detailsVisible,
    selectedStudent,
    filteredStudents,
    setSearchTerm,
    setStatusFilter,
    setMajorFilter,
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

  return (
    <>
      <HeaderActions onImport={() => setImportVisible(true)} onAdd={() => setAddVisible(true)} />
      <div className='mx-auto flex w-full max-w-7xl flex-1 flex-col'>
        <Card>
          <FiltersAndSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            majorFilter={majorFilter}
            onMajorFilterChange={setMajorFilter}
          />
          <div className='flex-1 overflow-auto'>
            <DataGrid
              students={filteredStudents}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </Card>
        <div className='mt-6 flex items-center justify-between px-2'>
          <div className='text-xs font-semibold tracking-widest text-slate-400 uppercase'>
            Total Students: {filteredStudents.length}
          </div>
          <Pagination
            current={currentPage}
            total={filteredStudents.length}
            pageSize={10}
            onChange={setCurrentPage}
            showSizeChanger={false}
            itemRender={(page, type, originalElement) => {
              if (type === 'prev') return <LeftOutlined />;
              if (type === 'next') return <RightOutlined />;
              return originalElement;
            }}
          />
        </div>
      </div>

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
    </>
  );
}

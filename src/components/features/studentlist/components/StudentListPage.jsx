'use client';

import React from 'react';
import { Empty } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import { useStudentList } from '../hooks/useStudentList';
import StudentTable from './StudentTable';
import { STUDENT_LIST_UI } from '@/constants/studentList/uiText';
import Card from '@/components/ui/Card';
import Pagination from '@/components/ui/Pagination';
import DataTableToolbar from '@/components/ui/DataTableToolbar';
import StudentPageHeader from '@/components/layout/StudentPageHeader';

export default function StudentListPage() {
  const {
    groupDetail,
    loading,
    searchText,
    setSearchText,
    handleDeleteStudent,
    internshipId,
    currentId,
    page,
    setPage,
    pageSize,
    total,
    totalPages,
    paginatedMembers,
  } = useStudentList();

  if (!internshipId && !currentId && !loading && !groupDetail) {
    return (
      <section className='border-border/50 bg-bg/50 m-6 flex h-[400px] items-center justify-center rounded-3xl border'>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className='my-auto'
          description={
            <span className='text-muted font-medium'>
              {STUDENT_LIST_UI.EMPTY.NO_GROUP}
              <br />
              {STUDENT_LIST_UI.EMPTY.NOT_ASSIGNED}
            </span>
          }
        />
      </section>
    );
  }

  return (
    <section>
      <StudentPageHeader title={STUDENT_LIST_UI.PAGE_TITLE} />

      <Card>
        <DataTableToolbar
          className='mb-5 !border-0 !p-0'
          searchProps={{
            placeholder: STUDENT_LIST_UI.SEARCH.PLACEHOLDER,
            value: searchText,
            onChange: (e) => setSearchText(e.target.value),
          }}
        />

        <StudentTable data={paginatedMembers} loading={loading} onDelete={handleDeleteStudent} />
      </Card>
      <div className='mt-6 px-2'>
        <Pagination
          total={total}
          page={page}
          pageSize={pageSize}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </section>
  );
}

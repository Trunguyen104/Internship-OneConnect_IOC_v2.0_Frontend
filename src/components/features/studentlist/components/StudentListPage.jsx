'use client';

import React from 'react';
import { Input, Empty } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import { useStudentList } from '../hooks/useStudentList';
import StudentTable from './StudentTable';
import { STUDENT_LIST_UI } from '@/constants/studentList/uiText';
import Card from '@/components/ui/Card';
import Pagination from '@/components/ui/Pagination';
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
      <section className='m-6 flex h-[400px] items-center justify-center rounded-3xl border border-gray-200/50 bg-gray-50/50'>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className='my-auto'
          description={
            <span className='font-medium text-gray-500'>
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
      <StudentPageHeader title='Student List' />

      <Card>
        <div className='mb-5 flex items-center justify-between border-b border-gray-100 pb-5'>
          <div className='flex items-center gap-4'>
            <div className='flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 text-slate-500 shadow-sm'>
              <TeamOutlined className='text-xl' />
            </div>
            <div>
              <h3 className='m-0 text-lg font-bold text-slate-900'>
                {STUDENT_LIST_UI.GROUP.MEMBERS}
              </h3>
              <p className='m-0 mt-0.5 text-sm font-medium text-slate-500'>
                {groupDetail?.members?.length || 0} {STUDENT_LIST_UI.GROUP.STUDENTS_TOTAL}
              </p>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <Input.Search
              placeholder={STUDENT_LIST_UI.SEARCH.PLACEHOLDER}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className='w-full md:w-72'
              variant='filled'
              rootClassName='premium-search'
            />
          </div>
        </div>

        <div className='mb-3 flex-1 overflow-hidden rounded-xl border border-gray-50 bg-white shadow-sm'>
          <StudentTable data={paginatedMembers} loading={loading} onDelete={handleDeleteStudent} />
        </div>
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

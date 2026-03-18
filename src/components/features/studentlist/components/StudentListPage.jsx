'use client';

import React from 'react';
import { Empty } from 'antd';
import { useStudentList } from '../hooks/useStudentList';
import StudentTable from './StudentTable';
import { STUDENT_LIST_UI } from '@/constants/studentList/uiText';
import Card from '@/components/ui/card';
import Pagination from '@/components/ui/pagination';
import DataTableToolbar from '@/components/ui/datatabletoolbar';
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

  const showNoGroup = !internshipId && !currentId && !loading && !groupDetail;

  return (
    <section className='animate-in fade-in flex min-h-0 flex-1 flex-col space-y-6 duration-500'>
      <StudentPageHeader title={STUDENT_LIST_UI.PAGE_TITLE} />

      <Card className='flex min-h-0 flex-1 flex-col !p-4 sm:!p-8 2xl:h-auto'>
        {showNoGroup ? (
          <div className='flex flex-1 items-center justify-center py-12'>
            <Empty
              description={
                <span className='text-muted font-medium'>
                  {STUDENT_LIST_UI.EMPTY.NO_GROUP}
                  <br />
                  {STUDENT_LIST_UI.EMPTY.NOT_ASSIGNED}
                </span>
              }
            />
          </div>
        ) : (
          <>
            <DataTableToolbar
              className='mb-5 !border-0 !p-0'
              searchProps={{
                placeholder: STUDENT_LIST_UI.SEARCH.PLACEHOLDER,
                value: searchText,
                onChange: (e) => setSearchText(e.target.value),
              }}
            />

            <StudentTable
              data={paginatedMembers}
              loading={loading}
              onDelete={handleDeleteStudent}
            />

            {!showNoGroup && total > 0 && (
              <div className='border-border/50 mt-6 border-t pt-6'>
                <Pagination
                  total={total}
                  page={page}
                  pageSize={pageSize}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  onPageSizeChange={(size) => {
                    setPageSize(size);
                    setPage(1);
                  }}
                />
              </div>
            )}
          </>
        )}
      </Card>
    </section>
  );
}

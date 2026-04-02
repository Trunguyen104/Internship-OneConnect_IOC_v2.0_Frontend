'use client';

import { EmptyState } from '@/components/ui/atoms';
import PageLayout from '@/components/ui/pagelayout';
import { STUDENT_LIST_UI } from '@/constants/studentList/uiText';
import { UI_TEXT } from '@/lib/UI_Text';

import { useStudentList } from '../hooks/useStudentList';
import StudentTable from './StudentTable';

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
    setPageSize,
    total,
    paginatedMembers,
  } = useStudentList();

  const showNoGroup = !internshipId && !currentId && !loading && !groupDetail;

  return (
    <PageLayout>
      <PageLayout.Header
        title={STUDENT_LIST_UI.PAGE_TITLE}
        subtitle={STUDENT_LIST_UI.PAGE_SUBTITLE}
      />

      <PageLayout.Card className="flex flex-col overflow-hidden">
        {showNoGroup ? (
          <div className="flex flex-1 items-center justify-center py-16">
            <EmptyState
              description={
                <span className="font-medium text-gray-400">
                  {STUDENT_LIST_UI.EMPTY.NO_GROUP}
                  <br />
                  {STUDENT_LIST_UI.EMPTY.NOT_ASSIGNED}
                </span>
              }
            />
          </div>
        ) : (
          <>
            <PageLayout.Toolbar
              searchProps={{
                placeholder: STUDENT_LIST_UI.SEARCH.PLACEHOLDER,
                value: searchText,
                onChange: (e) => setSearchText(e.target.value),
                className: 'max-w-md',
              }}
            />

            <PageLayout.Content className="px-0">
              <StudentTable
                data={paginatedMembers}
                loading={loading}
                onDelete={handleDeleteStudent}
              />
            </PageLayout.Content>

            {total > 0 && (
              <PageLayout.Footer className="flex items-center justify-between">
                <span className="text-[12px] font-bold uppercase tracking-tight text-slate-400">
                  {UI_TEXT.COMMON.TOTAL}:{' '}
                  <span className="font-extrabold text-slate-800">{total}</span>
                </span>
                <PageLayout.Pagination
                  total={total}
                  page={page}
                  pageSize={pageSize}
                  onPageChange={setPage}
                  onPageSizeChange={setPageSize}
                  className="mt-0 border-t-0 pt-0"
                />
              </PageLayout.Footer>
            )}
          </>
        )}
      </PageLayout.Card>
    </PageLayout>
  );
}

'use client';

import { EmptyState } from '@/components/ui/atoms';
import PageLayout from '@/components/ui/pagelayout';
import { STUDENT_LIST_UI } from '@/constants/studentList/uiText';

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
    totalPages,
    paginatedMembers,
  } = useStudentList();

  const showNoGroup = !internshipId && !currentId && !loading && !groupDetail;

  return (
    <PageLayout>
      <PageLayout.Header title={STUDENT_LIST_UI.PAGE_TITLE} />

      <PageLayout.Card>
        {showNoGroup ? (
          <div className="flex flex-1 items-center justify-center">
            <EmptyState
              description={
                <span className="text-gray-400 font-medium">
                  {STUDENT_LIST_UI.EMPTY.NO_GROUP}
                  <br />
                  {STUDENT_LIST_UI.EMPTY.NOT_ASSIGNED}
                </span>
              }
            />
          </div>
        ) : (
          <div className="flex flex-1 flex-col overflow-hidden">
            <PageLayout.Toolbar
              searchProps={{
                placeholder: STUDENT_LIST_UI.SEARCH.PLACEHOLDER,
                value: searchText,
                onChange: (e) => setSearchText(e.target.value),
              }}
            />

            <PageLayout.Content>
              <StudentTable
                data={paginatedMembers}
                loading={loading}
                onDelete={handleDeleteStudent}
              />
            </PageLayout.Content>

            {!showNoGroup && total > 0 && (
              <PageLayout.Pagination
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
            )}
          </div>
        )}
      </PageLayout.Card>
    </PageLayout>
  );
}

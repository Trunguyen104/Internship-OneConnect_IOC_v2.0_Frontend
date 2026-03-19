'use client';

import Card from '@/components/ui/card';
import Pagination from '@/components/ui/pagination';
import DataTableToolbar from '@/components/ui/datatabletoolbar';
import ViolationTable from './ViolationTable';
import StudentPageHeader from '@/components/layout/StudentPageHeader';
import { useViolation } from '../hooks/useViolation';

import { VIOLATION_UI } from '@/constants/violation/uiText';

export default function ViolationPage() {
  const {
    search,
    setSearch,
    page,
    setPage,
    pageSize,
    setPageSize,
    sortOrder,
    handleSortDate,
    paginated,
    total,
    totalPages,
  } = useViolation();

  return (
    <section className='animate-in fade-in flex min-h-0 flex-1 flex-col space-y-6 duration-500'>
      <StudentPageHeader title={VIOLATION_UI.PAGE_TITLE} />

      <Card className='flex min-h-0 flex-1 flex-col overflow-hidden !p-4 sm:!p-8'>
        <DataTableToolbar
          className='mb-5 !border-0 !p-0'
          searchProps={{
            placeholder: VIOLATION_UI.SEARCH.PLACEHOLDER,
            value: search,
            onChange: (e) => {
              setSearch(e.target.value);
              setPage(1);
            },
          }}
        />

        <ViolationTable
          data={paginated}
          page={page}
          pageSize={pageSize}
          sortOrder={sortOrder}
          onSort={handleSortDate}
        />

        {total > 0 && (
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
      </Card>
    </section>
  );
}

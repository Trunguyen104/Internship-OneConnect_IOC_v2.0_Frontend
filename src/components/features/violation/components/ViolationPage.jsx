'use client';

import Card from '@/components/ui/Card';
import SearchBar from '@/components/ui/SearchBar';
import Pagination from '@/components/ui/Pagination';
import ViolationTable from './ViolationTable';
import StudentPageHeader from '@/components/layout/StudentPageHeader';
import { useViolation } from '../hooks/useViolation';

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
    <section className='animate-in fade-in flex min-h-0 flex-col space-y-6 duration-500'>
      <StudentPageHeader title='Violation' />

      <Card className='overflow-hidden rounded-2xl border-none shadow-xl shadow-slate-200/50'>
        <div className='mb-5'>
          <SearchBar
            placeholder='Search'
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            showFilter
            onActionClick={() => {}}
          />
        </div>

        <ViolationTable
          data={paginated}
          page={page}
          pageSize={pageSize}
          sortOrder={sortOrder}
          onSort={handleSortDate}
        />
      </Card>
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
    </section>
  );
}

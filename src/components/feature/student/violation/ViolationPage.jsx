'use client';

import Card from '@/components/shared/Card';
import SearchBar from '@/components/shared/SearchBar';
import Pagination from '@/components/shared/Pagination';
import ViolationTable from './components/ViolationTable';
import { useViolation } from './hooks/useViolation';

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
    <section className='animate-in fade-in flex h-full flex-col space-y-6 duration-500'>
      <h1 className='text-2xl font-bold text-slate-900'>Violation</h1>

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

'use client';

import Card from '@/components/ui/Card';
import Pagination from '@/components/ui/Pagination';
import DataTableToolbar from '@/components/ui/DataTableToolbar';
import { FilterOutlined } from '@ant-design/icons';
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
    <section className='animate-in fade-in flex min-h-0 flex-col space-y-6 duration-500'>
      <StudentPageHeader title={VIOLATION_UI.PAGE_TITLE} />

      <Card className='overflow-hidden rounded-2xl border-none shadow-xl shadow-slate-200/50'>
        <DataTableToolbar
          className='mb-5 !border-0 !p-0'
          searchProps={{
            placeholder: 'Search',
            value: search,
            onChange: (e) => {
              setSearch(e.target.value);
              setPage(1);
            },
          }}
          // filterContent={
          //   <button
          //     onClick={() => {}}
          //     className='flex cursor-pointer items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 h-[40px]'
          //   >
          //     <FilterOutlined />
          //     Filter
          //   </button>
          // }
        />

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

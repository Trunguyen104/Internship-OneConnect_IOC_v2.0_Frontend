'use client';

import { useState } from 'react';
import PageLayout from '@/components/ui/PageLayout';
import { useUniversities } from './useUniversities';
import UniversitiesTable from './UniversitiesTable';
import UniversitiesDialog from './UniversitiesDialog';

export default function UniversitiesPage() {
  const {
    universities,
    loading,
    total,
    pageNumber,
    setPageNumber,
    pageSize,
    setPageSize,
    search,
    setSearch,
    refresh,
    error,
  } = useUniversities();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <PageLayout>
      <PageLayout.Header
        title='University Management'
        description='Manage educational institutions, their codes, and headquarters information.'
      />

      <PageLayout.Card>
        <PageLayout.Toolbar
          searchProps={{
            placeholder: 'Search by university name or code...',
            value: search,
            onChange: (e) => setSearch(e.target.value),
          }}
          actionProps={{
            label: 'Add University',
            onClick: () => setIsDialogOpen(true),
          }}
        />

        <PageLayout.Content>
          {error ? (
            <div className='flex h-64 flex-col items-center justify-center rounded-3xl bg-rose-50 border border-rose-100 p-8 text-rose-600 animate-in zoom-in-95 duration-300'>
              <p className='font-bold mb-2'>Communication Error</p>
              <p className='text-sm opacity-80'>{error}</p>
              <button
                onClick={refresh}
                className='mt-4 px-6 py-2 bg-rose-600 text-white rounded-full text-sm font-semibold hover:bg-rose-700 transition-all active:scale-95'
              >
                Try Again
              </button>
            </div>
          ) : (
            <UniversitiesTable universities={universities} loading={loading} />
          )}
        </PageLayout.Content>

        {total > 0 && (
          <PageLayout.Pagination
            total={total}
            page={pageNumber}
            pageSize={pageSize}
            onPageChange={setPageNumber}
            onPageSizeChange={setPageSize}
          />
        )}
      </PageLayout.Card>

      <UniversitiesDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        controlled 
      />
    </PageLayout>
  );
}

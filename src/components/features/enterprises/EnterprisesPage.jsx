'use client';

import { useState } from 'react';
import PageLayout from '@/components/ui/pagelayout';
import { useEnterprises } from './useEnterprises';
import EnterprisesTable from './EnterprisesTable';
import EnterprisesDialog from './EnterprisesDialog';

export default function EnterprisesPage() {
  const {
    enterprises,
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
  } = useEnterprises();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <PageLayout>
      <PageLayout.Header
        title='Strategic Corporate Partners'
        description='Oversee corporate registration, tax compliance, and commercial sector alignment within the ecosystem.'
      />

      <PageLayout.Card>
        <PageLayout.Toolbar
          searchProps={{
            placeholder: 'Search by enterprise name, code, or tax ID...',
            value: search,
            onChange: (e) => setSearch(e.target.value),
          }}
          actionProps={{
            label: 'Add Enterprise',
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
            <EnterprisesTable enterprises={enterprises} loading={loading} />
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

      <EnterprisesDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        controlled 
      />
    </PageLayout>
  );
}

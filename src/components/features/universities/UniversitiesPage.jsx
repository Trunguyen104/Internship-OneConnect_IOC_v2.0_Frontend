'use client';

import { useState } from 'react';

import PageLayout from '@/components/ui/pagelayout';

import UniversitiesDialog from './UniversitiesDialog';
import UniversitiesTable from './UniversitiesTable';
import { useUniversities } from './useUniversities';

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
        title="University Management"
        description="Manage educational institutions, their codes, and headquarters information."
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
            <div className="animate-in zoom-in-95 flex h-64 flex-col items-center justify-center rounded-3xl border border-rose-100 bg-rose-50 p-8 text-rose-600 duration-300">
              <p className="mb-2 font-bold">Communication Error</p>
              <p className="text-sm opacity-80">{error}</p>
              <button
                onClick={refresh}
                className="mt-4 rounded-full bg-rose-600 px-6 py-2 text-sm font-semibold text-white transition-all hover:bg-rose-700 active:scale-95"
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

      <UniversitiesDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} controlled />
    </PageLayout>
  );
}

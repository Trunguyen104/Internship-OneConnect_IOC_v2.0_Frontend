'use client';

import { useState } from 'react';

import { ErrorState } from '@/components/ui/errorstate';
import PageLayout from '@/components/ui/pagelayout';
import { UI_TEXT } from '@/lib/UI_Text';

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
        title={UI_TEXT.UNIVERSITIES.TITLE || 'University Management'}
        subtitle={
          UI_TEXT.UNIVERSITIES.DESCRIPTION ||
          'Manage educational institutions, their codes, and headquarters information.'
        }
      />

      <PageLayout.Card className="flex flex-col overflow-hidden">
        <PageLayout.Toolbar
          searchProps={{
            placeholder:
              UI_TEXT.UNIVERSITIES.SEARCH_PLACEHOLDER || 'Search by university name or code...',
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: 'max-w-md',
          }}
          actionProps={{
            label: UI_TEXT.UNIVERSITIES.CREATE,
            onClick: () => setIsDialogOpen(true),
          }}
        />

        <PageLayout.Content className="px-0">
          {error ? (
            <div className="py-20 flex items-center justify-center">
              <ErrorState error={error} onRetry={refresh} className="mx-auto" />
            </div>
          ) : (
            <UniversitiesTable universities={universities} loading={loading} />
          )}
        </PageLayout.Content>

        {total > 0 && (
          <div className="mt-4 border-t border-gray-100 pt-8 flex items-center justify-between">
            <span className="text-[13px] font-bold text-muted/40 tracking-tight uppercase">
              {UI_TEXT.COMMON.TOTAL || 'Total records'}:{' '}
              <span className="text-text font-black">{total}</span>
            </span>
            <PageLayout.Pagination
              total={total}
              page={pageNumber}
              pageSize={pageSize}
              onPageChange={setPageNumber}
              onPageSizeChange={setPageSize}
              className="mt-0 border-t-0 pt-0"
            />
          </div>
        )}
      </PageLayout.Card>

      <UniversitiesDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} controlled />
    </PageLayout>
  );
}

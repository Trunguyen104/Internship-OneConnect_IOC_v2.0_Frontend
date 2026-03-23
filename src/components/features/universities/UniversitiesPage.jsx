'use client';

import { useState } from 'react';

import { ErrorState } from '@/components/ui/errorstate';
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
            <div className="py-20">
              <ErrorState error={error} onRetry={refresh} className="mx-auto" />
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

'use client';

import { useState } from 'react';

import { ErrorState } from '@/components/ui/errorstate';
import PageLayout from '@/components/ui/pagelayout';

import EnterprisesDialog from './EnterprisesDialog';
import EnterprisesTable from './EnterprisesTable';
import { useEnterprises } from './useEnterprises';

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
        title="Enterprise Ecosystem"
        description="Strategically manage corporate partners, tax identities, and industrial classifications to maintain a robust organizational network."
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
            <div className="py-20">
              <ErrorState error={error} onRetry={refresh} className="mx-auto" />
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

      <EnterprisesDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} controlled />
    </PageLayout>
  );
}

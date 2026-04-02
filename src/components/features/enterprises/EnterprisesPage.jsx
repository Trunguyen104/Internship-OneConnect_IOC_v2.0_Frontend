'use client';

import { useState } from 'react';

import { ErrorState } from '@/components/ui/errorstate';
import PageLayout from '@/components/ui/pagelayout';
import { UI_TEXT } from '@/lib/UI_Text';

import EnterprisesDialog from './EnterprisesDialog';
import EnterprisesTable from './EnterprisesTable';
import { useEnterprises } from './useEnterprises';

const E = UI_TEXT.ENTERPRISES;

/**
 * EnterprisesPage - Main organizational hub for managing enterprise partners.
 */
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
      <PageLayout.Header title={E.TITLE} subtitle={E.SUBTITLE} />

      <PageLayout.Card className="flex flex-col overflow-hidden">
        <PageLayout.Toolbar
          searchProps={{
            placeholder: E.SEARCH_PLACEHOLDER,
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: 'max-w-md',
          }}
          actionProps={{
            label: E.ADD,
            onClick: () => setIsDialogOpen(true),
          }}
        />

        <PageLayout.Content className="px-0">
          {error ? (
            <div className="flex items-center justify-center py-20">
              <ErrorState error={error} onRetry={refresh} className="mx-auto" />
            </div>
          ) : (
            <EnterprisesTable enterprises={enterprises} loading={loading} />
          )}
        </PageLayout.Content>

        {total > 0 && (
          <PageLayout.Footer className="flex items-center justify-between">
            <span className="text-[12px] font-bold uppercase tracking-tight text-slate-400">
              {UI_TEXT.COMMON.TOTAL}: <span className="font-extrabold text-slate-800">{total}</span>
            </span>
            <PageLayout.Pagination
              total={total}
              page={pageNumber}
              pageSize={pageSize}
              onPageChange={setPageNumber}
              onPageSizeChange={setPageSize}
              className="mt-0 border-t-0 pt-0"
            />
          </PageLayout.Footer>
        )}
      </PageLayout.Card>

      <EnterprisesDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} controlled />
    </PageLayout>
  );
}

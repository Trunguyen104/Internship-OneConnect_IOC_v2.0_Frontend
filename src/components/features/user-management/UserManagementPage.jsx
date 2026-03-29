'use client';

import { useState } from 'react';

import UserManagementDialog from '@/components/features/user-management/UserManagementDialog';
import UserManagementFilter from '@/components/features/user-management/UserManagementFilter';
import UserManagementTable from '@/components/features/user-management/UserManagementTable';
import PageLayout from '@/components/ui/pagelayout';
import { UI_TEXT } from '@/lib/UI_Text';

import { useUserManagement } from './useUserManagement';

export default function UserManagementPage({
  title = UI_TEXT.USER_MANAGEMENT.TITLE,
  subtitle = UI_TEXT.USER_MANAGEMENT.SUBTITLE,
}) {
  const {
    users,
    loading,
    error,
    total,
    pageNumber,
    setPageNumber,
    pageSize,
    setPageSize,
    search,
    setSearch,
    refresh,
  } = useUserManagement();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <PageLayout>
      <PageLayout.Header title={title}className="pb-10" />

      <PageLayout.Card className="flex flex-col overflow-hidden">
        <PageLayout.Toolbar
          searchProps={{
            placeholder: UI_TEXT.USER_MANAGEMENT.SEARCH_PLACEHOLDER || 'Search name/email/code...',
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: 'max-w-md',
          }}
          actionProps={{
            label: UI_TEXT.USER_MANAGEMENT.ADD,
            onClick: () => setIsDialogOpen(true),
          }}
          filterContent={<UserManagementFilter />}
        />

        <PageLayout.Content className="px-0">
          <UserManagementTable users={users} loading={loading} />
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

      <UserManagementDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} controlled />
    </PageLayout>
  );
}

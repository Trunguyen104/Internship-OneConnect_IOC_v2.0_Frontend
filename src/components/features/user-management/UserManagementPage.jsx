'use client';

import { useState } from 'react';

import UserManagementDialog from '@/components/features/user-management/UserManagementDialog';
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
      <PageLayout.Header title={title} subtitle={subtitle} />

      <PageLayout.Card>
        <PageLayout.Toolbar
          searchProps={{
            placeholder: UI_TEXT.USER_MANAGEMENT.SEARCH_PLACEHOLDER || 'Search users...',
            value: search,
            onChange: (e) => setSearch(e.target.value),
          }}
          actionProps={{
            label: UI_TEXT.USER_MANAGEMENT.ADD,
            onClick: () => setIsDialogOpen(true),
          }}
        />

        <PageLayout.Content>
          <UserManagementTable users={users} loading={loading} error={error} refresh={refresh} />
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

      <UserManagementDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} controlled />
    </PageLayout>
  );
}

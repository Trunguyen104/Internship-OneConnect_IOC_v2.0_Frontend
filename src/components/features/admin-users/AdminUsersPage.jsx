'use client';

import { useState } from 'react';
import PageLayout from '@/components/ui/pagelayout';
import AdminUsersDialog from '@/components/features/admin-users/AdminUsersDialog';
import AdminUsersTable from '@/components/features/admin-users/AdminUsersTable';
import { UI_TEXT } from '@/lib/UI_Text';
import { useAdminUsers } from './useAdminUsers';

export default function AdminUsersPage() {
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
  } = useAdminUsers();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <PageLayout>
      <PageLayout.Header title={UI_TEXT.ADMIN_USERS.TITLE} />

      <PageLayout.Card>
        <PageLayout.Toolbar
          searchProps={{
            placeholder: UI_TEXT.ADMIN_USERS.SEARCH_PLACEHOLDER || 'Search users...',
            value: search,
            onChange: (e) => setSearch(e.target.value),
          }}
          actionProps={{
            label: UI_TEXT.ADMIN_USERS.ADD,
            onClick: () => setIsDialogOpen(true),
          }}
        />

        <PageLayout.Content>
          <AdminUsersTable users={users} loading={loading} error={error} refresh={refresh} />
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

      <AdminUsersDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        controlled
      />
    </PageLayout>
  );
}

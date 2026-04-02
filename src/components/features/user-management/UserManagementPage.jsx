'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { userService } from '@/components/features/user/services/user.service';
import UserManagementDialog from '@/components/features/user-management/UserManagementDialog';
import UserManagementFilter from '@/components/features/user-management/UserManagementFilter';
import UserManagementTable from '@/components/features/user-management/UserManagementTable';
import PageLayout from '@/components/ui/pagelayout';
import { UI_TEXT } from '@/lib/UI_Text';

import { useUserManagement } from './useUserManagement';

/**
 * UserManagementPage - Top-level page component for the User Management feature.
 *
 * @param {Object} props - Component properties.
 * @param {string} [props.title=UI_TEXT.USER_MANAGEMENT.TITLE] - Page title.
 * @param {string} [props.subtitle=UI_TEXT.USER_MANAGEMENT.SUBTITLE] - Page subtitle/description.
 * @returns {JSX.Element}
 */
export default function UserManagementPage({
  title = UI_TEXT.USER_MANAGEMENT.TITLE,
  subtitle = UI_TEXT.USER_MANAGEMENT.SUBTITLE,
}) {
  const {
    users,
    loading,
    total,
    pageNumber,
    setPageNumber,
    pageSize,
    setPageSize,
    search,
    setSearch,
  } = useUserManagement();

  const { data: meRes } = useQuery({
    queryKey: ['auth-me'],
    queryFn: async () => userService.getMe(),
    staleTime: 0,
  });

  const meData = meRes?.data ?? meRes?.Data ?? meRes;
  const currentUserId = meData?.userId ?? meData?.UserId ?? null;

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <PageLayout>
      <PageLayout.Header title={title} subtitle={subtitle} />

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
          <UserManagementTable users={users} loading={loading} currentUserId={currentUserId} />
        </PageLayout.Content>

        {total > 0 && (
          <PageLayout.Footer className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-slate-400 uppercase tracking-tight">
              {UI_TEXT.COMMON.TOTAL || 'Total records'}:{' '}
              <span className="text-slate-800 font-extrabold">{total}</span>
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

      <UserManagementDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} controlled />
    </PageLayout>
  );
}

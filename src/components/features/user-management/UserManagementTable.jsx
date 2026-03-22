import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/emptystate';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { USER_ROLE_LABEL, USER_STATUS, USER_STATUS_LABEL } from '@/constants/user-management/enums';
import { UI_TEXT } from '@/lib/UI_Text';

import UserManagementAction from './UserManagementAction';

export default function UserManagementTable({ users = [], loading = false, error = '', refresh }) {
  const getRoleLabel = (role) => {
    return USER_ROLE_LABEL[role] || role || UI_TEXT.COMMON.NULL;
  };

  const isRoleActive = () => true;

  const getStatusLabel = (status) => {
    return USER_STATUS_LABEL[status] || status || UI_TEXT.COMMON.NULL;
  };

  const isStatusActive = (status) => {
    return status === USER_STATUS.ACTIVE;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="pl-8">{UI_TEXT.USER_MANAGEMENT.CODE}</TableHead>
          <TableHead>{UI_TEXT.USER_MANAGEMENT.USER}</TableHead>
          <TableHead className="hidden lg:table-cell">{UI_TEXT.USER_MANAGEMENT.UNIT}</TableHead>
          <TableHead>{UI_TEXT.USER_MANAGEMENT.ROLE}</TableHead>
          <TableHead>{UI_TEXT.USER_MANAGEMENT.STATUS}</TableHead>
          <TableHead className="pr-8 text-right">{UI_TEXT.COMMON.ACTION}</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i} className="h-[72px] border-slate-50">
              <TableCell className="w-24 pl-8">
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-20 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell className="pr-8 text-right">
                <Skeleton className="ml-auto h-8 w-8 rounded-lg" />
              </TableCell>
            </TableRow>
          ))
        ) : error ? (
          <TableRow>
            <TableCell colSpan={6} className="py-20 text-center">
              <div className="flex flex-col items-center gap-2 text-rose-600">
                <span className="font-semibold">{error}</span>
                <Button
                  onClick={refresh}
                  className="text-xs underline opacity-70 hover:opacity-100"
                >
                  {UI_TEXT.USER_MANAGEMENT.RETRY}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ) : users.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="p-0">
              <EmptyState
                title={UI_TEXT.USER_MANAGEMENT.NOT_FOUND}
                description={UI_TEXT.USER_MANAGEMENT.NOT_MATCHING_CRITERIA}
              />
            </TableCell>
          </TableRow>
        ) : (
          users.map((u) => (
            <TableRow
              key={u.userId}
              className="group h-[72px] border-slate-50 transition-all duration-200 hover:bg-slate-50/80"
            >
              <TableCell className="pl-8 text-[13px] font-medium text-slate-400">
                {u.userCode || UI_TEXT.COMMON.MINUS}
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-[15px] leading-tight font-bold text-slate-800">
                    {u.fullName || UI_TEXT.COMMON.MINUS}
                  </span>
                  <span className="text-[13px] font-medium text-slate-400">
                    {u.email || UI_TEXT.COMMON.MINUS}
                  </span>
                </div>
              </TableCell>
              <TableCell className="hidden text-[14px] font-medium text-slate-600 lg:table-cell">
                {u.unitName || UI_TEXT.COMMON.MINUS}
              </TableCell>

              <TableCell>
                <span
                  className={[
                    'inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold tracking-wider uppercase',
                    isRoleActive(u.role)
                      ? 'border-[var(--primary-600)]/10 bg-[var(--primary-600)]/10 text-[var(--primary-600)]'
                      : 'border-slate-200/50 bg-slate-100 text-slate-500',
                  ].join(' ')}
                >
                  {getRoleLabel(u.role)}
                </span>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2.5">
                  <div
                    className={[
                      'size-2 rounded-full',
                      isStatusActive(u.status)
                        ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                        : 'bg-slate-300',
                    ].join(' ')}
                  />
                  <span
                    className={[
                      'text-[13px] font-medium tracking-tight',
                      isStatusActive(u.status) ? 'text-emerald-600' : 'text-slate-500',
                    ].join(' ')}
                  >
                    {getStatusLabel(u.status)}
                  </span>
                </div>
              </TableCell>

              <TableCell className="pr-8 text-right">
                <div className="flex justify-end transition-opacity duration-200 group-hover:opacity-100 sm:opacity-0">
                  <UserManagementAction user={u} />
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

'use client';

import React, { useMemo } from 'react';

import DataTable from '@/components/ui/datatable';
import { USER_ROLE_LABEL, USER_STATUS, USER_STATUS_LABEL } from '@/constants/user-management/enums';
import { UI_TEXT } from '@/lib/UI_Text';

import UserManagementAction from './UserManagementAction';

export default function UserManagementTable({ users = [], loading = false }) {
  const getRoleLabel = (role) => {
    return USER_ROLE_LABEL[role] || role || UI_TEXT.COMMON.NULL;
  };

  const isStatusActive = (status) => {
    return status === USER_STATUS.ACTIVE;
  };

  const getStatusLabel = (status) => {
    return USER_STATUS_LABEL[status] || status || UI_TEXT.COMMON.NULL;
  };

  const columns = useMemo(
    () => [
      {
        title: UI_TEXT.USER_MANAGEMENT.CODE,
        key: 'userCode',
        width: '140px',
        render: (code, record) => (
          <span className="text-xs font-black uppercase tracking-widest text-muted/60">
            {code || record.UserCode || UI_TEXT.COMMON.MINUS}
          </span>
        ),
      },
      {
        title: UI_TEXT.USER_MANAGEMENT.USER,
        key: 'fullName',
        width: '320px',
        render: (name, record) => (
          <div className="flex items-center gap-5">
            <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:shadow-md group-hover:rotate-3">
              {record.avatarUrl || record.AvatarUrl ? (
                <img
                  src={record.avatarUrl || record.AvatarUrl}
                  alt={name || record.FullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-[13px] font-black tracking-tighter text-primary/40">
                  {(name || record.FullName || '')
                    ?.split(' ')
                    .filter(Boolean)
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[15px] leading-tight font-black tracking-tight text-text transition-colors group-hover:text-primary">
                {name || record.FullName || UI_TEXT.COMMON.MINUS}
              </span>
              <span className="text-muted/50 text-xs font-bold tracking-tight">
                {record.email || record.Email || UI_TEXT.COMMON.MINUS}
              </span>
            </div>
          </div>
        ),
      },
      {
        title: UI_TEXT.USER_MANAGEMENT.UNIT,
        key: 'unitName',
        width: '150px',
        className: 'hidden lg:table-cell',
        render: (unit) => (
          <div className="flex items-center gap-2">
            <div className="bg-primary/20 size-1.5 rounded-full transition-colors group-hover:bg-primary" />
            <span className="text-text/60 text-[13px] font-bold transition-colors group-hover:text-text">
              {unit || UI_TEXT.COMMON.MINUS}
            </span>
          </div>
        ),
      },
      {
        title: UI_TEXT.USER_MANAGEMENT.ROLE,
        key: 'role',
        width: '120px',
        render: (role) => (
          <span
            className={
              'inline-flex items-center rounded-2xl border px-3.5 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-sm ring-1 ring-primary/5 transition-all duration-300 border-primary/10 bg-primary/5 text-primary group-hover:bg-primary/10'
            }
          >
            {getRoleLabel(role)}
          </span>
        ),
      },
      {
        title: UI_TEXT.USER_MANAGEMENT.STATUS,
        key: 'status',
        width: '120px',
        render: (status) => {
          const active = isStatusActive(status);
          return (
            <div className="flex items-center gap-4">
              <div
                className={[
                  'size-2.5 flex-shrink-0 rounded-full ring-4 transition-all duration-500',
                  active
                    ? 'bg-emerald-500 ring-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.5)] group-hover:scale-110'
                    : 'bg-gray-300 ring-gray-300/5',
                ].join(' ')}
              />
              <span
                className={[
                  'text-xs font-black uppercase tracking-widest transition-colors',
                  active ? 'text-emerald-600 group-hover:text-emerald-500' : 'text-muted/60',
                ].join(' ')}
              >
                {getStatusLabel(status)}
              </span>
            </div>
          );
        },
      },
      {
        title: UI_TEXT.COMMON.ACTION,
        key: 'action',
        align: 'right',
        render: (_, record) => (
          <div className="flex translate-x-4 justify-end opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
            <UserManagementAction user={record} />
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="flex flex-1 flex-col min-h-0">
      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        rowKey={(record) => record.userId || record.UserId}
        emptyText={UI_TEXT.USER_MANAGEMENT.NOT_FOUND}
        minWidth="auto"
        className="premium-table mt-0"
      />
    </div>
  );
}

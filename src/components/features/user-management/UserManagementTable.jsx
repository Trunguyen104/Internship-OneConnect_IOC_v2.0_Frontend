'use client';

import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

import Badge from '@/components/ui/badge';
import DataTable from '@/components/ui/datatable';
import {
  USER_ROLE,
  USER_ROLE_LABEL,
  USER_STATUS,
  USER_STATUS_LABEL,
} from '@/constants/user-management/enums';
import { UI_TEXT } from '@/lib/UI_Text';

import UserManagementAction from './UserManagementAction';

export default function UserManagementTable({ users = [], loading = false, currentUserId = null }) {
  const getRoleLabel = (role) => USER_ROLE_LABEL[role] || role || UI_TEXT.COMMON.NULL;
  const isActive = (status) => status === USER_STATUS.ACTIVE;
  const getStatusLabel = (status) => USER_STATUS_LABEL[status] || status || UI_TEXT.COMMON.NULL;

  const columns = useMemo(
    () => [
      {
        title: UI_TEXT.USER_MANAGEMENT.CODE,
        key: 'userCode',
        width: '130px',
        render: (code, record) => (
          <span className="font-mono text-[12px] text-slate-400">
            {code || record.UserCode || UI_TEXT.COMMON.MINUS}
          </span>
        ),
      },
      {
        title: UI_TEXT.USER_MANAGEMENT.USER,
        key: 'fullName',
        render: (name, record) => (
          <span className="text-[13px] font-semibold text-slate-800">
            {name || record.FullName || UI_TEXT.COMMON.MINUS}
            {currentUserId &&
              (record?.userId || record?.UserId) &&
              String(record.userId || record.UserId) === String(currentUserId) && (
                <span className="ml-2 text-[12px] font-bold text-sky-600">
                  {UI_TEXT.USER_MANAGEMENT.YOU_BADGE}
                </span>
              )}
          </span>
        ),
      },
      {
        title: UI_TEXT.USER_MANAGEMENT.EMAIL_ADDRESS,
        key: 'email',
        render: (email, record) => (
          <span className="text-[12px] text-slate-500 font-medium">
            {email || record.Email || record.email || UI_TEXT.COMMON.MINUS}
          </span>
        ),
      },
      {
        title: UI_TEXT.USER_MANAGEMENT.UNIT,
        key: 'unitName',
        className: 'hidden lg:table-cell',
        render: (unit) => (
          <span className="text-[13px] text-slate-500">{unit || UI_TEXT.COMMON.MINUS}</span>
        ),
      },
      {
        title: UI_TEXT.USER_MANAGEMENT.ROLE,
        key: 'role',
        width: '140px',
        render: (role) => {
          let variant = 'default';
          if (role === USER_ROLE.SUPER_ADMIN) {
            variant = 'primary-soft';
          } else if (role === USER_ROLE.SCHOOL_ADMIN || role === USER_ROLE.STUDENT) {
            variant = 'success-soft';
          } else if (
            role === USER_ROLE.ENTERPRISE_ADMIN ||
            role === USER_ROLE.HR ||
            role === USER_ROLE.MENTOR
          ) {
            variant = 'warning-soft';
          }

          return (
            <Badge variant={variant} size="sm" className="min-w-[80px] justify-center">
              {getRoleLabel(role)}
            </Badge>
          );
        },
      },
      {
        title: UI_TEXT.USER_MANAGEMENT.STATUS,
        key: 'status',
        width: '120px',
        render: (status) => {
          const active = isActive(status);
          return (
            <span
              className={`text-[12px] font-semibold ${active ? 'text-emerald-600' : 'text-red-500'}`}
            >
              {getStatusLabel(status)}
            </span>
          );
        },
      },
      {
        title: '',
        key: 'action',
        align: 'right',
        width: '48px',
        render: (_, record) => <UserManagementAction user={record} currentUserId={currentUserId} />,
      },
    ],
    [currentUserId]
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
      />
    </div>
  );
}

UserManagementTable.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  currentUserId: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};
